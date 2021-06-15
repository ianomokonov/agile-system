DROP TRIGGER IF EXISTS `update_task`;

DELIMITER $$ CREATE TRIGGER update_task
AFTER
UPDATE
  ON projectTask FOR EACH ROW BEGIN
    IF OLD.name != NEW.name THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('name', NEW.name, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.description != NEW.description THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('description', NEW.description, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.statusId != NEW.statusId THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('statusId', NEW.statusId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.priorityId != NEW.priorityId THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('priorityId', NEW.priorityId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.typeId != NEW.typeId THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('typeId', NEW.typeId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.projectUserId != NEW.projectUserId 
    OR OLD.projectUserId IS NULL AND NEW.projectUserId IS NOT NULL
    OR NEW.projectUserId IS NULL AND OLD.projectUserId IS NOT NULL THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('projectUserId', NEW.projectUserId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.projectSprintId != NEW.projectSprintId 
    OR OLD.projectSprintId IS NULL AND NEW.projectSprintId IS NOT NULL
    OR NEW.projectSprintId IS NULL AND OLD.projectSprintId IS NOT NULL THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('projectSprintId', NEW.projectSprintId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.epicId != NEW.epicId 
    OR OLD.epicId IS NULL AND NEW.epicId IS NOT NULL
    OR NEW.epicId IS NULL AND OLD.epicId IS NOT NULL THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('epicId', NEW.epicId, NEW.lastEditUserId, NEW.id);
    END IF;
    IF OLD.points != NEW.points THEN
        INSERT INTO taskHistoryOperations (fieldName, newValue, userId, projectTaskId)
            VALUES
                ('points', NEW.points, NEW.lastEditUserId, NEW.id);
    END IF;

END $$ DELIMITER ;