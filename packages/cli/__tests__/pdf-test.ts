import { NumericalCardData, Category, Priority, TaskMetaData } from '@checkup/core';
import { generateHTML } from '../src/helpers/pdf';

const meta: TaskMetaData = {
  taskName: 'mock-task',
  friendlyTaskName: 'Mock Task',
  taskClassification: {
    category: Category.Migration,
    priority: Priority.Medium,
  },
};

const mergedResults: any = {
  [Category.Migration]: {
    [Priority.High]: [],
    [Priority.Medium]: [new NumericalCardData(meta, 100, 'bad patterns in your app')],
    [Priority.Low]: [],
  },
};

describe('generateHTML', () => {
  it('returns correct HTML string', async () => {
    const htmlString = await generateHTML(mergedResults);

    expect(htmlString).toMatchSnapshot();
  });
  it('includes tailwind UI lib and stylesheet', async () => {
    const htmlString = await generateHTML(mergedResults);

    expect(htmlString).toContain('tailwind.min.css');
    expect(htmlString).toContain('tailwind-ui.min.css');
  });
});
