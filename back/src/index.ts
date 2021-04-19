/* eslint-disable no-param-reassign */
import express from 'express';
import cors from 'cors';
import http from 'http';
import projectRouter from './controllers/project';
import userRouter from './controllers/user';
import taskRouter from './controllers/task';
import logger from './logger';
import handleError from './middleware/handleError';
import authSocketJWT from './middleware/authSocketJWT';
import dailyRepository from './repositories/daily.repository';
import { Time } from './models/time';

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
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);

// rooms which are currently available in chat
const activeDailyTimers = [];

io.use(authSocketJWT).on('connection', (socket) => {
  socket.on('enterDaily', async (dailyId) => {
    const [id, participants] = await dailyRepository.enter(socket.userId, dailyId);
    const roomName = `daily${dailyId}`;
    socket.dailyParticipantId = id;
    socket.join(roomName);
    socket.dailyRoom = roomName;
    io.sockets.in(socket.dailyRoom).emit('participantEntered', participants);
  });

  socket.on('startDaily', async (dailyId) => {
    if (!activeDailyTimers.find((t) => t.id === dailyId)) {
      const participants = await dailyRepository.start(dailyId);
      const timer = {
        id: dailyId,
        room: socket.dailyRoom,
        time: new Time(0, 0, 0),
        activeTime: new Time(0, 0, 0),
        interval: null,
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

  socket.on('stopDaily', async (dailyId) => {
    dailyRepository.stop(dailyId);
    const timerIndex = activeDailyTimers.findIndex((t) => t.id === dailyId);
    io.sockets.in(socket.dailyRoom).emit('stopDaily');
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

  socket.on('dailyNext', async (dailyId) => {
    const participants = await dailyRepository.next(dailyId);
    const timer = activeDailyTimers.find((t) => t.id === dailyId);
    timer.activeTime.updateSecond(0);
    timer.activeTime.updateMinute(0);
    timer.activeTime.updateHour(0);
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
});
