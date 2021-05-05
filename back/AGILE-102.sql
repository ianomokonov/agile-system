DROP TABLE IF EXISTS `retroCardPoint`;

CREATE TABLE `retroCardPoint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `cardId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT uniqCardIdUser UNIQUE (userId, cardId)
) COMMENT 'голоса карточки ретро';

ALTER TABLE
  `retroCardPoint`
ADD
  FOREIGN KEY (userId) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `retroCardPoint`
ADD
  FOREIGN KEY (cardId) REFERENCES `projectRetroCard` (`id`) ON DELETE CASCADE;