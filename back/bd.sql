-- ---
-- Globals
-- ---
-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;
-- ---
-- Table 'user'
-- Таблица пользователей
-- ---
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `vkId` int(11),
  `gitHubId` int(11),
  `vk` varchar(255),
  `gitHub` varchar(255),
  `image` varchar(255),
  PRIMARY KEY (`id`),
   CONSTRAINT uniqEMAIL UNIQUE (email)
) COMMENT 'Таблица пользователей';

-- ---
-- Table 'project'
-- Проекты пользователей
-- ---
DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `ownerId` int(11) NOT NULL,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT 'Проекты пользователей';

-- ---
-- Table 'projectUser'
-- Пользователи в команде проекта
-- ---
DROP TABLE IF EXISTS `projectUser`;

CREATE TABLE `projectUser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqPU UNIQUE (projectId, userId)
) COMMENT 'Пользователи в команде проекта';

-- ---
-- Table 'projectRoles'
-- Роли участников проекта, открывающие им функционал в сисетме
-- ---
DROP TABLE IF EXISTS `projectRoles`;

CREATE TABLE `projectRoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `projectId` int(11) NOT NULL,
  CONSTRAINT uniqPR UNIQUE (projectId, name),
  PRIMARY KEY (`id`)
) COMMENT 'Роли участников проекта, открывающие им функционал в сисетме';

-- ---
-- Table 'projectUserRole'
-- Роли пользователя проетка
-- ---
DROP TABLE IF EXISTS `projectUserRole`;

CREATE TABLE `projectUserRole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectRoleId` int(11) NOT NULL,
  `projectUserId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqPUR UNIQUE (projectRoleId, projectUserId)
) COMMENT 'Роли пользователя проетка';

-- ---
-- Table 'projectRolePermission'
-- Разрешения для ролей проекта
-- ---
DROP TABLE IF EXISTS `permission`;

CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqPERN UNIQUE (name)
) COMMENT 'Разрешения';

-- ---
-- Table 'projectRolePermission'
-- Разрешения для ролей проекта
-- ---
DROP TABLE IF EXISTS `projectRolePermission`;

CREATE TABLE `projectRolePermission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectRoleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
   CONSTRAINT uniqRP UNIQUE (projectRoleId, permissionId)
) COMMENT 'Разрешения для ролей проекта';

-- ---
-- Table 'projectLinks'
-- Важные ссылки проекта
-- ---
DROP TABLE IF EXISTS `projectLinks`;

CREATE TABLE `projectLinks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `projectId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Важные ссылки проекта';

-- ---
-- Table 'projectTask'
-- Задачи
-- ---
DROP TABLE IF EXISTS `projectTask`;

CREATE TABLE `projectTask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` MEDIUMTEXT,
  `statusId` int(11),
  `typeId` int(11) NOT NULL DEFAULT 1,
  `priorityId` int(11) NOT NULL DEFAULT 1,
  `epicId` int(11),
  `parentId` int(11),
  `projectUserId` int(11),
  `creatorId` int(11) NOT NULL,
  `points` int(11),
  `projectId` int(11) NOT NULL,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectSprintId` int(11) NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Задачи';

DROP TABLE IF EXISTS `projectTaskFiles`;

CREATE TABLE `projectTaskFiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Файлы задач';

-- ---
-- Table 'projectTaskStatus'
-- возможные статусы задач проекта
-- ---
DROP TABLE IF EXISTS `projectTaskStatus`;

CREATE TABLE `projectTaskStatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
   CONSTRAINT uniqSTATUS UNIQUE (name)
) COMMENT 'возможные статусы задач проекта';

-- ---
-- Table 'taskHistoryOperations'
-- история изменений задачи
-- ---
DROP TABLE IF EXISTS `taskHistoryOperations`;

CREATE TABLE `taskHistoryOperations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldName` varchar(255) NOT NULL,
  `newValue` MEDIUMTEXT NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectUserId` int(11) NOT NULL,
  `projectTaskId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'история изменений задачи';

-- ---
-- Table 'refreshTokens'
-- токены для обновления доступа
-- ---
DROP TABLE IF EXISTS `refreshTokens`;

CREATE TABLE `refreshTokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT 'токены для обновления доступа';

-- ---
-- Table 'projectSprint'
-- спринты проекта
-- ---
DROP TABLE IF EXISTS `projectSprint`;

CREATE TABLE `projectSprint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  `name` varchar(255) NOT NULL,
  `goal` varchar(255),
  `isActive` bit DEFAULT 0,
  `isFinished` bit DEFAULT 0,
  `projectId` int(11) NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT uniqPU UNIQUE (projectId, name),
  PRIMARY KEY (`id`)
) COMMENT 'спринты проекта';

-- ---
-- Table 'projectRetro'
-- ретро проекта
-- ---
DROP TABLE IF EXISTS `projectRetro`;

CREATE TABLE `projectRetro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `sprintId` int(11) NOT NULL,
  `isFinished` bit NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqSprintRetro UNIQUE (sprintId)
) COMMENT 'ретро проекта';

-- ---
-- Table 'projectRetroCard'
-- карты ретро проекта
-- ---
DROP TABLE IF EXISTS `projectRetroCard`;

CREATE TABLE `projectRetroCard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `retroId` int(11) NOT NULL,
  `category` int(1) NOT NULL,
  `text` text NULL,
  `userId` int(11) NOT NULL,
  `fontSize` DECIMAL(10, 2) NULL,
  `completeRetroId` int(11) NULL,
  `isCompleted` bit NOT NULL DEFAULT 0,
  `taskId` int(11) NULL,
  PRIMARY KEY (`id`)
) COMMENT 'карты ретро проекта';

-- ---
-- Table 'projectDaily'
-- дейли проекта
-- ---
DROP TABLE IF EXISTS `projectDaily`;

CREATE TABLE `projectDaily` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectId` int(11) NOT NULL,
  `isActive` bit NOT NULL DEFAULT 0,
  `minutes` int(3) NOT NULL DEFAULT 0,
  `seconds` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqProjectDaily UNIQUE (projectId)
) COMMENT 'дейли проекта';

DROP TABLE IF EXISTS `projectDailyParticipant`;

CREATE TABLE `projectDailyParticipant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dailyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `minutes` int(3) NOT NULL DEFAULT 0,
  `seconds` int(3) NOT NULL DEFAULT 0,
  `isDone` bit NOT NULL DEFAULT 0,
  `isActive` bit NOT NULL DEFAULT 0,
  CONSTRAINT uniqDailyParticipant UNIQUE (userId, dailyId),
  PRIMARY KEY (`id`)
) COMMENT 'участники дейли проекта';

-- ---
-- Table 'projectDemo'
-- демо проекта
-- ---
DROP TABLE IF EXISTS `projectDemo`;

CREATE TABLE `projectDemo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `sprintId` int(11) NOT NULL,
  `isFinished` bit DEFAULT 0,
  `projectId` int(11) NOT NULL,
  `activeTaskId` int(11) NULL,
  CONSTRAINT uniqPR UNIQUE (sprintId),
  PRIMARY KEY (`id`)
) COMMENT 'демо проекта';

-- ---
-- Table 'projectDemoTask'
-- задачи демо проекта
-- ---
DROP TABLE IF EXISTS `projectDemoTask`;

CREATE TABLE `projectDemoTask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demoId` int(11) NOT NULL,
  `isFinished` bit DEFAULT 0,
  `taskId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqPDT UNIQUE (demoId, taskId)
) COMMENT 'задачи демо проекта';

-- ---
-- Table 'projectPlanning'
-- спринты проекта
-- ---
DROP TABLE IF EXISTS `projectPlanning`;

CREATE TABLE `projectPlanning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `sprintId` int(11) NULL,
  `activeSprintId` int(11) NULL,
  `projectId` int(11) NOT NULL,
  `activeTaskId` int(11) NULL,
  PRIMARY KEY (`id`)
) COMMENT 'планирования проекта';

-- ---
-- Table 'projectPlanningTaskSession'
-- сессии оценки задач
-- ---
DROP TABLE IF EXISTS `projectPlanningTaskSession`;

CREATE TABLE `projectPlanningTaskSession` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `taskId` int(11) NOT NULL,
  `planningId` int(11) NOT NULL,
  `showCards` bit DEFAULT 0,
  `isCanceled` bit DEFAULT 0,
  `resultValue` int(11) NULL,
  PRIMARY KEY (`id`)
) COMMENT 'оценка задач';

-- ---
-- Table 'planningTaskSessionCard'
-- оценки задачи
-- ---
DROP TABLE IF EXISTS `planningTaskSessionCard`;

CREATE TABLE `planningTaskSessionCard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sessionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  CONSTRAINT uniqSessionUserCard UNIQUE (userId, sessionId),
  PRIMARY KEY (`id`)
) COMMENT 'оценки задачи';

-- ---
-- Foreign Keys 
-- ---
ALTER TABLE
  `project`
ADD
  FOREIGN KEY (ownerId) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectUser`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRoles`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectUser`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectUserRole`
ADD
  FOREIGN KEY (projectRoleId) REFERENCES `projectRoles` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectUserRole`
ADD
  FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRolePermission`
ADD
  FOREIGN KEY (projectRoleId) REFERENCES `projectRoles` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRolePermission`
ADD
  FOREIGN KEY (permissionId) REFERENCES `permission` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectLinks`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (statusId) REFERENCES `projectTaskStatus` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectTaskFiles`
ADD
  FOREIGN KEY (taskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (parentId) REFERENCES `projectTask` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (creatorId) REFERENCES `projectUser` (`id`) ON DELETE NO ACTION;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (projectSprintId) REFERENCES `projectSprint` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `taskHistoryOperations`
ADD
  FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `taskHistoryOperations`
ADD
  FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectSprint`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectPlanning`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectPlanning`
ADD
  FOREIGN KEY (sprintId) REFERENCES `projectSprint` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectPlanningTaskSession`
ADD
  FOREIGN KEY (taskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectPlanningTaskSession`
ADD
  FOREIGN KEY (planningId) REFERENCES `projectPlanning` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `planningTaskSessionCard`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `planningTaskSessionCard`
ADD
  FOREIGN KEY (sessionId) REFERENCES `projectPlanningTaskSession` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectDemo`
ADD
  FOREIGN KEY (activeTaskId) REFERENCES `projectDemoTask` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectPlanning`
ADD
  FOREIGN KEY (activeTaskId) REFERENCES `projectTask` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectDemoTask`
ADD
  FOREIGN KEY (demoId) REFERENCES `projectDemo` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectDemoTask`
ADD
  FOREIGN KEY (taskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRetro`
ADD
  FOREIGN KEY (sprintId) REFERENCES `projectSprint` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRetroCard`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRetroCard`
ADD
  FOREIGN KEY (taskId) REFERENCES `projectTask` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectRetroCard`
ADD
  FOREIGN KEY (retroId) REFERENCES `projectRetro` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectRetroCard`
ADD
  FOREIGN KEY (completeRetroId) REFERENCES `projectRetro` (`id`) ON DELETE
SET
  NULL;

ALTER TABLE
  `projectDaily`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectDailyParticipant`
ADD
  FOREIGN KEY (dailyId) REFERENCES `projectDaily` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectDailyParticipant`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;

INSERT INTO
  `projectTaskStatus` (`name`, `id`)
VALUES
  ('нужно сделать', 1),
  ('в работе', 2),
  ('на проверке', 3),
  ('сделано', 4);

DELIMITER $$ CREATE TRIGGER create_project_user
AFTER
INSERT
  ON project FOR EACH ROW BEGIN
INSERT INTO
  projectUser(projectId, userId)
VALUES
  (new.id, new.ownerId);

END $$ DELIMITER ;

ALTER TABLE
  `projectplanning`
ADD
  FOREIGN KEY (activeTaskId) REFERENCES `projectTask` (`id`) ON DELETE SET NULL;