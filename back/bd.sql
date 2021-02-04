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
  PRIMARY KEY (`id`)
) COMMENT 'Таблица пользователей';

-- ---
-- Table 'project'
-- Проекты пользователей
-- ---

DROP TABLE IF EXISTS `project`;
		
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `repository` varchar(255) NOT NULL,
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
  PRIMARY KEY (`id`)
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
  PRIMARY KEY (`id`)
) COMMENT 'Роли пользователя проетка';

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
  `typeId` int(11) NOT NULL,
  `epicId` int(11),
  `parentId` int(11),
  `projectUserId` int(11),
  `points` int(11),
  `projectId` int(11) NOT NULL,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectSprintId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Задачи';

-- ---
-- Table 'epics'
-- Таблица для эпиков
-- ---

DROP TABLE IF EXISTS `epics`;
		
CREATE TABLE `epics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `color` varchar(255),
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT 'Таблица для эпиков';

-- ---
-- Table 'projectTaskStatus'
-- возможные статусы задач проекта
-- ---

DROP TABLE IF EXISTS `projectTaskStatus`;
		
CREATE TABLE `projectTaskStatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'возможные статусы задач проекта';

-- ---
-- Table 'projectTaskLink'
-- Связи между задачами проекта
-- ---

DROP TABLE IF EXISTS `projectTaskLink`;
		
CREATE TABLE `projectTaskLink` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linkTypeId` int(11) NOT NULL,
  `fromTaskId` int(11) NOT NULL,
  `toTaskId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Связи между задачами проекта';

-- ---
-- Table 'linkType'
-- типы связей между задачами
-- ---

DROP TABLE IF EXISTS `linkType`;
		
CREATE TABLE `linkType` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'типы связей между задачами';

-- ---
-- Table 'comment'
-- комментарии к задаче
-- ---

DROP TABLE IF EXISTS `comment`;
		
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `text` MEDIUMTEXT NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectTaskId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'комментарии к задаче';

-- ---
-- Table 'taskHistoryOperations'
-- история изменений задачи
-- ---

DROP TABLE IF EXISTS `taskHistoryOperations`;
		
CREATE TABLE `taskHistoryOperations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operationName` varchar(255) NOT NULL,
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
  `startDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `endDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255),
  `projectId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'спринты проекта';

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `project` ADD FOREIGN KEY (ownerId) REFERENCES `user` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectUser` ADD FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectRoles` ADD FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectUser` ADD FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectUserRole` ADD FOREIGN KEY (projectRoleId) REFERENCES `projectRoles` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectUserRole` ADD FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectLinks` ADD FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTask` ADD FOREIGN KEY (statusId) REFERENCES `projectTaskStatus` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTask` ADD FOREIGN KEY (epicId) REFERENCES `epics` (`id`) ON DELETE NO ACTION;
ALTER TABLE `projectTask` ADD FOREIGN KEY (parentId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTask` ADD FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTask` ADD FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTask` ADD FOREIGN KEY (projectSprintId) REFERENCES `projectSprint` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTaskLink` ADD FOREIGN KEY (linkTypeId) REFERENCES `linkType` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTaskLink` ADD FOREIGN KEY (fromTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectTaskLink` ADD FOREIGN KEY (toTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;
ALTER TABLE `comment` ADD FOREIGN KEY (userId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;
ALTER TABLE `comment` ADD FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;
ALTER TABLE `taskHistoryOperations` ADD FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE CASCADE;
ALTER TABLE `taskHistoryOperations` ADD FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;
ALTER TABLE `projectSprint` ADD FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `project` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectUser` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectRoles` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectUserRole` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectLinks` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectTask` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `epics` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectTaskStatus` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectTaskLink` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `linkType` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `comment` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `taskHistoryOperations` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `projectSprint` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `user` (`id`,`name`,`surname`,`vkId`,`gitHubId`,`vk`,`gitHub`,`image`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `project` (`id`,`name`,`repository`,`description`,`ownerId`,`lastEditDate`) VALUES
-- ('','','','','','');
-- INSERT INTO `projectUser` (`id`,`projectId`,`userId`) VALUES
-- ('','','');
-- INSERT INTO `projectRoles` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `projectUserRole` (`id`,`projectRoleId`,`projectUserId`) VALUES
-- ('','','');
-- INSERT INTO `projectLinks` (`id`,`name`,`url`,`projectId`) VALUES
-- ('','','','');
-- INSERT INTO `projectTask` (`id`,`name`,`description`,`statusId`,`typeId`,`epicId`,`parentId`,`projectUserId`,`points`,`projectId`,`lastEditDate`,`createDate`,`projectSprintId`) VALUES
-- ('','','','','','','','','','','','','');
-- INSERT INTO `epics` (`id`,`name`,`description`,`color`,`createDate`,`lastEditDate`) VALUES
-- ('','','','','','');
-- INSERT INTO `projectTaskStatus` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `projectTaskLink` (`id`,`linkTypeId`,`fromTaskId`,`toTaskId`) VALUES
-- ('','','','');
-- INSERT INTO `linkType` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `comment` (`id`,`userId`,`text`,`createDate`,`lastEditDate`,`projectTaskId`) VALUES
-- ('','','','','','');
-- INSERT INTO `taskHistoryOperations` (`id`,`operationName`,`createDate`,`projectUserId`,`projectTaskId`) VALUES
-- ('','','','','');
-- INSERT INTO `projectSprint` (`id`,`startDate`,`endDate`,`name`,`projectId`) VALUES
-- ('','','','','');