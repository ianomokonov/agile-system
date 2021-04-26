ALTER TABLE projectPlanningTaskSession ADD CONSTRAINT uniqTaskSeccion UNIQUE (taskId);

DROP TABLE IF EXISTS `taskHistoryOperations`;

CREATE TABLE `taskHistoryOperations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldName` varchar(255) NOT NULL,
  `newValue` MEDIUMTEXT NOT NULL,
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `projectUserId` int(11) NULL,
  `projectTaskId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'история изменений задачи';

ALTER TABLE
  `taskHistoryOperations`
ADD
  FOREIGN KEY (projectUserId) REFERENCES `projectUser` (`id`) ON DELETE SET NULL;

ALTER TABLE
  `taskHistoryOperations`
ADD
  FOREIGN KEY (projectTaskId) REFERENCES `projectTask` (`id`) ON DELETE CASCADE;

ALTER TABLE
 `projectTask`
ADD
  `lastEditUserId` int(11) NOT NULL; 

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (lastEditUserId) REFERENCES `user` (`id`);