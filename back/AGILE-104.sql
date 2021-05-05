DROP TABLE IF EXISTS `epics`;

CREATE TABLE `epics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `color` varchar(255),
  `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `lastEditDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `projectId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'Таблица для эпиков';


ALTER TABLE
  `epics`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projectTask`
ADD
  FOREIGN KEY (epicId) REFERENCES `epics` (`id`) ON DELETE SET NULL;