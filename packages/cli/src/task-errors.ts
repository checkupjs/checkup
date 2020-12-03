export const TASK_ERRORS = new Map<
  string,
  { message: (notFound: string[]) => string; callToAction: string }
>([
  [
    'task',
    {
      message: (notFound: string[]) =>
        `Cannot find the ${notFound.join(',')} task${notFound.length > 1 ? 's' : ''}.`,
      callToAction: 'Run `checkup --listTasks` to see available tasks',
    },
  ],
  [
    'category',
    {
      message: (notFound: string[]) =>
        `Cannot find any tasks with the following ${
          notFound.length > 1 ? 'category' : 'categories'
        } ${notFound.join(',')}.`,
      callToAction: '',
    },
  ],
  [
    'group',
    {
      message: (notFound: string[]) =>
        `Cannot find any tasks with the following ${
          notFound.length > 1 ? 'group' : 'groups'
        } ${notFound.join(',')}.`,
      callToAction: '',
    },
  ],
]);
