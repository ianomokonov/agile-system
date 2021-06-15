import { TaskType } from 'back/src/models/task-type';
import { Priority } from 'back/src/models/priority';
import { UploadFile } from '../shared/multiple-file-uploader/multiple-file-uploader.component';

export const authTokenKey = 'agileAuthToken';
export const refreshTokenKey = 'agileRefreshToken';

export const priorities = [
  {
    id: Priority.Low,
    name: 'Низкий',
  },
  {
    id: Priority.Medium,
    name: 'Средний',
  },
  {
    id: Priority.Hight,
    name: 'Высокий',
  },
  {
    id: Priority.Critical,
    name: 'Критический',
  },
];

export const taskTypes = [
  {
    id: TaskType.Feature,
    name: 'Feature',
  },
  {
    id: TaskType.Task,
    name: 'Task',
  },
  {
    id: TaskType.Bug,
    name: 'Bug',
  },
];

export const taskFields = {
  description: 'Описание',
  projectUserId: 'Исполнитель',
  statusId: 'Статус',
  sprintId: 'Спринт',
  typeId: 'Тип задачи',
  priorityId: 'Приоритет',
  projectSprintId: 'Спринт',
  points: 'Оценка',
  name: 'Название',
  epicId: 'Эпик',
};

export const extensions = {
  word: ['.doc', '.docx'],
  excel: ['.xls', '.xlsx'],
  image: ['.bmp', '.gif', '.tif'],
  pdf: ['.pdf'],
  archive: ['.zip', '.rar', '.7z', '.gzip'],
  video: ['.mp4', '.avi', '.mkv', '.wmv', '.flv', '.mpeg'],
  audio: ['.mp3', '.wav', '.midi', '.aac'],
  powerpoint: ['.ppt', '.pptx'],
};

export const userSearchFn = (event, user) => {
  const term = event.toUpperCase();
  return (
    user.name.toUpperCase().indexOf(term) > -1 ||
    user.surname.toUpperCase().indexOf(term) > -1 ||
    user.email.toUpperCase().indexOf(term) > -1
  );
};

export const getTaskFiles = (task) => {
  return task.files?.map((file) => ({
    id: file.id,
    name: file.name,
    url: file.url,
  })) as UploadFile[];
};

export const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'numberedList',
    'bulletedList',
    'insertTable',
    'tableColumn',
    'tableRow',
    'mergeTableCells',
    'undo',
    'redo',
  ],
};
