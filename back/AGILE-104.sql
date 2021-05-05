ALTER TABLE
  `epics`
ADD
  FOREIGN KEY (projectId) REFERENCES `project` (`id`) ON DELETE CASCADE;

ALTER TABLE
  `projecttask`
ADD
  FOREIGN KEY (epicId) REFERENCES `epics` (`id`) ON DELETE SET NULL;