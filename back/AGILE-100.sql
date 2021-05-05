DROP TABLE IF EXISTS `taskComments`;

CREATE TABLE `taskComments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` MEDIUMTEXT NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NULL,
  `projectTaskId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'комментарии к задаче';

DROP TABLE IF EXISTS `taskAcceptanceCriteria`;

CREATE TABLE `taskAcceptanceCriteria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectTaskId` int(11) NOT NULL,
  `isDone` bit DEFAULT 0,
  PRIMARY KEY (`id`)
) COMMENT 'критерии приемки задачи';

ALTER TABLE
  `taskComments`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`);

ALTER TABLE
  `taskComments`
ADD
  FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`);

ALTER TABLE
  `taskAcceptanceCriteria`
ADD
  FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`);

