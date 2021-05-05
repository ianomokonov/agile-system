/* eslint-disable no-param-reassign */
import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import projectRouter from './controllers/project';
import userRouter from './controllers/user';
import logger from './logger';
import handleError from './middleware/handleError';
import authSocketJWT from './middleware/authSocketJWT';
import dailyRepository from './repositories/daily.repository';
import { Time } from './models/time';
import retroHandler from './handlers/retro.handler';
import demoHandler from './handlers/demo.handler';
import planningHandler from './handlers/planning.handler';
import tasksHandler from './handlers/task/tasks.handler';
import projectSprintHandler from './handlers/project/project-sprint.handler';
import checkSocketProjectPermissions from './middleware/check-socket-project-permissions';
import { RetroCardCategory } from './models/retro-card-category';
import { Permissions } from './models/permissions';
import retroRepository from './repositories/retro.repository';

const DEFAULT_PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());
server
  .listen(DEFAULT_PORT, () => {
    logger.success(`Приложение запущено на http://localhost:${DEFAULT_PORT}`);
  })
  .on(`error`, (err: any) => {
    logger.error(`Не удалось запустить приложение. Ошибка: ${err}`);
  });

app.use(express.json());
app.use(handleError);
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'files')));
app.use('/user', userRouter);
app.use('/project', projectRouter);

// rooms which are currently available in chat
const activeDailyTimers = [];

io.use(authSocketJWT).on('connection', (socket) => {
  // --------------------------- DAILY ------------------------------------

  socket.on('enterDaily', async ({ projectId, dailyId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanReadProject))
    ) {
      return;
    }
    const [id, participants] = await dailyRepository.enter(socket.userId, dailyId);
    const roomName = `daily${dailyId}`;
    socket.dailyParticipantId = id;
    socket.join(roomName);
    socket.dailyRoom = roomName;
    io.sockets.in(socket.dailyRoom).emit('participantEntered', participants);
  });

  socket.on('startDaily', async ({ projectId, dailyId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDaily))
    ) {
      return;
    }
    if (!activeDailyTimers.find((t) => t.id === dailyId)) {
      const participants = await dailyRepository.start(dailyId);
      const timer = {
        id: dailyId,
        room: socket.dailyRoom,
        time: new Time(0, 0, 0),
        activeTime: new Time(0, 0, 0),
        interval: null,
        participantsCount: 1,
      };
      timer.interval = setInterval(() => {
        timer.time.updateSecond(timer.time.second + 1);
        timer.activeTime.updateSecond(timer.activeTime.second + 1);
        io.sockets
          .in(socket.dailyRoom)
          .emit('dailyTime', [timer.time.toString(), timer.activeTime.toString()]);
      }, 1000);
      activeDailyTimers.push(timer);
      io.sockets.in(socket.dailyRoom).emit('nextDailyParticipant', participants);
    }
  });

  socket.on('stopDaily', async ({ projectId, dailyId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDaily))
    ) {
      return;
    }
    dailyRepository.stop(dailyId);
    const timerIndex = activeDailyTimers.findIndex((t) => t.id === dailyId);
    io.sockets
      .in(socket.dailyRoom)
      .emit('stopDaily', activeDailyTimers[timerIndex].participantsCount);
    if (timerIndex < 0) {
      return;
    }
    clearInterval(activeDailyTimers[timerIndex].interval);
    activeDailyTimers.splice(timerIndex, 1);
  });

  socket.on('pauseDaily', async (dailyId) => {
    const timerIndex = activeDailyTimers.findIndex((t) => t.id === dailyId);
    clearInterval(activeDailyTimers[timerIndex].interval);
    io.sockets.in(socket.dailyRoom).emit('pauseDaily');
  });

  socket.on('resumeDaily', async (dailyId) => {
    const timer = activeDailyTimers.find((t) => t.id === dailyId);
    io.sockets.in(socket.dailyRoom).emit('resumeDaily');
    timer.interval = setInterval(() => {
      timer.time.updateSecond(timer.time.second + 1);
      timer.activeTime.updateSecond(timer.activeTime.second + 1);
      io.sockets
        .in(socket.dailyRoom)
        .emit('dailyTime', [timer.time.toString(), timer.activeTime.toString()]);
    }, 1000);
  });

  socket.on('dailyNext', async ({ projectId, dailyId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDaily))
    ) {
      return;
    }
    const participants = await dailyRepository.next(dailyId);
    const timer = activeDailyTimers.find((t) => t.id === dailyId);
    timer.activeTime.updateSecond(0);
    timer.activeTime.updateMinute(0);
    timer.activeTime.updateHour(0);
    timer.participantsCount += 1;

    io.sockets.in(socket.dailyRoom).emit('nextDailyParticipant', participants);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', async () => {
    // if (socket.dailyParticipantId) {
    //   await dailyRepository.exit(socket.dailyParticipantId);
    //   socket.broadcast.to(socket.dailyRoom).emit('participantExit', socket.dailyParticipantId);
    //   socket.leave(socket.dailyRoom);
    // }
  });

  // when the user disconnects.. perform this
  socket.on('leaveDaily', async () => {
    if (socket.dailyParticipantId) {
      await dailyRepository.exit(socket.dailyParticipantId);
      socket.broadcast.to(socket.dailyRoom).emit('participantExit', socket.dailyParticipantId);
      socket.leave(socket.dailyRoom);
    }
  });

  // --------------------------- DAILY ------------------------------------

  // --------------------------- RETRO ------------------------------------

  socket.on('enterRetro', async ({ projectId, retroId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanReadProject))
    ) {
      return;
    }

    socket.retroRoom = `retro${retroId}`;
    socket.retroId = retroId;
    socket.join(socket.retroRoom);
  });

  socket.on('setCardPoint', async (cardId) => {
    if (!socket.retroId) {
      return;
    }
    await retroRepository.addCardPoint(cardId, socket.userId);
    io.sockets.in(socket.retroRoom).emit('setCardPoint');
  });

  socket.on('addRetroCard', async ({ projectId, category }) => {
    if (
      category === RetroCardCategory.Actions &&
      !(await checkSocketProjectPermissions(
        projectId,
        socket.userId,
        Permissions.CanCreateRetroActions,
      ))
    ) {
      return;
    }
    if (!socket.retroId) {
      return;
    }

    const card = await retroHandler.createCard({
      retroId: socket.retroId,
      category,
      userId: socket.userId,
    });
    socket.broadcast.to(socket.retroRoom).emit('addRetroCard', card);
    card.isMy = true;
    socket.emit('addRetroCard', card);
  });

  socket.on('removeRetroCard', async (cardId) => {
    await retroHandler.removeCard(cardId);
    io.sockets.in(socket.retroRoom).emit('removeRetroCard', cardId);
  });

  socket.on('updateRetroCard', async (request) => {
    retroHandler.updateCard(request.cardId, request.request);
    socket.broadcast.to(socket.retroRoom).emit('updateRetroCard', request);
  });

  socket.on('finishRetro', async ({ projectId, retroId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartRetro))
    ) {
      return;
    }
    await retroHandler.finish(retroId);
    io.sockets.in(socket.retroRoom).emit('finishRetro');
  });

  // --------------------------- RETRO ------------------------------------

  // --------------------------- DEMO ------------------------------------

  socket.on('enterDemo', async ({ projectId, demoId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanReadProject))
    ) {
      return;
    }
    socket.demoRoom = `demo${demoId}`;
    socket.demoId = demoId;
    socket.join(socket.demoRoom);
  });

  socket.on('activeDemoTask', async (taskId) => {
    if (!socket.demoId) {
      return;
    }
    demoHandler.setActiveTask(socket.demoId, taskId);
    io.sockets.in(socket.demoRoom).emit('activeDemoTask', taskId);
  });

  socket.on('acceptDemoTask', async ({ projectId, taskId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDemo))
    ) {
      return;
    }
    demoHandler.finishTask(taskId);
    io.sockets.in(socket.demoRoom).emit('acceptDemoTask', taskId);
  });

  socket.on('reopenDemoTask', async ({ projectId, taskId }) => {
    if (
      !(await checkSocketProjectPermissions(
        projectId,
        socket.userId,
        Permissions.CanEditTaskStatus,
      ))
    ) {
      return;
    }
    demoHandler.reopenTask(taskId, socket.userId);
    io.sockets.in(socket.demoRoom).emit('reopenDemoTask', taskId);
  });

  socket.on('acceptDemoTaskCriteria', async ({ projectId, criteriaId, request }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDemo))
    ) {
      return;
    }
    if (!socket.demoId) {
      return;
    }
    await tasksHandler.updateTaskAcceptanceCriteria(criteriaId, request);
    io.sockets
      .in(socket.demoRoom)
      .emit('acceptDemoTaskCriteria', { criteriaId, isDone: request.isDone });
  });

  socket.on('finishDemo', async (projectId) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartDemo))
    ) {
      return;
    }
    if (!socket.demoId) {
      return;
    }
    demoHandler.finishDemo(socket.demoId);
    io.sockets.in(socket.demoRoom).emit('finishDemo');
  });

  // --------------------------- DEMO ------------------------------------

  // --------------------------- PLANNING ------------------------------------

  socket.on('enterPlanning', async ({ projectId, planningId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanReadProject))
    ) {
      return;
    }
    if (socket.planningRoom) {
      return;
    }
    socket.planningRoom = `planning${planningId}`;
    socket.planningId = planningId;
    socket.join(socket.planningRoom);
  });

  socket.on('leavePlanning', async () => {
    socket.leave(socket.planningRoom);
    socket.planningRoom = undefined;
    socket.planningId = undefined;
  });

  socket.on('takePlanningTask', async ({ projectId, taskId, sprintId }) => {
    if (!(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanEditTask))) {
      return;
    }
    if (!sprintId) {
      return;
    }
    tasksHandler.update({ id: taskId, projectSprintId: sprintId }, socket.userId);
    io.sockets.in(socket.planningRoom).emit('updatePlanning');
  });

  socket.on('removePlanningTask', async ({ projectId, taskId }) => {
    if (!(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanEditTask))) {
      return;
    }
    if (!socket.planningId) {
      return;
    }
    tasksHandler.update({ id: taskId, projectSprintId: null }, socket.userId);
    io.sockets.in(socket.planningRoom).emit('updatePlanning');
  });

  socket.on('startPocker', async ({ projectId, taskId }) => {
    if (
      !(await checkSocketProjectPermissions(
        projectId,
        socket.userId,
        Permissions.CanStartScrumPocker,
      ))
    ) {
      return;
    }
    if (!socket.planningId) {
      return;
    }

    const sessionId = await planningHandler.update(socket.planningId, { activeTaskId: taskId });

    io.sockets.in(socket.planningRoom).emit('startPocker', { taskId, sessionId });
  });

  socket.on('planningVote', async ({ sessionId, points }) => {
    if (!socket.planningId) {
      return;
    }
    await planningHandler.setCard(sessionId, socket.userId, points);
    io.sockets.in(socket.planningRoom).emit('updatePlanningSession');
  });

  socket.on('setPlanningPoints', async ({ projectId, sessionId, taskId, points }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanSetTaskPoints))
    ) {
      return;
    }
    if (!socket.planningId) {
      return;
    }
    await planningHandler.closeSession(sessionId, points, taskId, socket.userId);
    io.sockets.in(socket.planningRoom).emit('updatePlanningSession');
  });

  socket.on('showPlanningCards', async ({ projectId, sessionId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanSetTaskPoints))
    ) {
      return;
    }
    if (!socket.planningId) {
      return;
    }
    await planningHandler.setShowCards(sessionId, true);
    io.sockets.in(socket.planningRoom).emit('updatePlanningSession');
  });

  socket.on('resetPlanningCards', async ({ projectId, sessionId, taskId }) => {
    if (
      !(await checkSocketProjectPermissions(
        projectId,
        socket.userId,
        Permissions.CanStartScrumPocker,
      ))
    ) {
      return;
    }
    if (!sessionId) {
      return;
    }
    await planningHandler.reset(sessionId, taskId, socket.userId);
    io.sockets.in(socket.planningRoom).emit('updatePlanningSession');
    io.sockets.in(socket.planningRoom).emit('updatePlanning');
  });

  socket.on('startPlanningSprint', async ({ sprintId, projectId }) => {
    if (
      !(await checkSocketProjectPermissions(projectId, socket.userId, Permissions.CanStartSprint))
    ) {
      return;
    }
    if (!sprintId) {
      return;
    }
    await projectSprintHandler.start(sprintId, projectId, socket.userId);
    io.sockets.in(socket.planningRoom).emit('startPlanningSprint');
  });

  // --------------------------- PLANNING ------------------------------------
});
