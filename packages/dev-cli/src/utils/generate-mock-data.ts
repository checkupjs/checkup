import { CardData, Category, Priority, TaskMetaData } from '@checkup/core';

export function generateMockPDFData() {
  const faker = require('faker');

  const taskMetaFactory = (priority: Priority, category: Category): TaskMetaData => ({
    taskName: faker.lorem.slug(),
    friendlyTaskName: faker.lorem.word(),
    taskClassification: { priority: priority, category: category },
  });

  const cardFactory = (priority: Priority, category: Category): CardData => ({
    filePath: '/some/path',
    meta: taskMetaFactory(priority, category),
    result: faker.random.number(),
  });

  const mergedResults: any = {
    [Category.Core]: {
      [Priority.High]: Array.from({ length: 3 }, () => cardFactory(Priority.High, Category.Core)),
      [Priority.Medium]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.Medium, Category.Core)
      ),
      [Priority.Low]: Array.from({ length: 3 }, () => cardFactory(Priority.Low, Category.Core)),
    },
    [Category.Insights]: {
      [Priority.High]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.High, Category.Insights)
      ),
      [Priority.Medium]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.Medium, Category.Insights)
      ),
      [Priority.Low]: Array.from({ length: 3 }, () => cardFactory(Priority.Low, Category.Insights)),
    },
    [Category.Migration]: {
      [Priority.High]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.High, Category.Migration)
      ),
      [Priority.Medium]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.Medium, Category.Migration)
      ),
      [Priority.Low]: Array.from({ length: 3 }, () =>
        cardFactory(Priority.Low, Category.Migration)
      ),
    },
  };
  return mergedResults;
}
