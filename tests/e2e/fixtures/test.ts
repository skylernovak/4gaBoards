import { expect, Page, test as base } from '@playwright/test';
import { createBoardFixtureOnAuthenticatedPage } from '../helpers/boardFixture';
import { loginAsAdmin } from '../helpers/auth';
import { uniqueName } from '../helpers/testData';

export type BoardData = {
  projectName: string;
  boardName: string;
  listTodo: string;
  listInProgress: string;
  listDone: string;
  cardTitle: string;
};

type Fixtures = {
  adminPage: Page;
  boardData: BoardData;
  boardWithCard: BoardData;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    await loginAsAdmin(page);
    await use(page);
  },

  boardData: async ({}, use) => {
    await use({
      projectName: uniqueName('QE E2E Project'),
      boardName: uniqueName('QE Automation Board'),
      listTodo: uniqueName('To Do'),
      listInProgress: uniqueName('In Progress'),
      listDone: uniqueName('Done'),
      cardTitle: uniqueName('Validate login behavior'),
    });
  },

  boardWithCard: async ({ adminPage }, use) => {
    const board = {
      projectName: uniqueName('QE Lifecycle Project'),
      boardName: uniqueName('QE Lifecycle Board'),
      listTodo: uniqueName('To Do'),
      listInProgress: uniqueName('In Progress'),
      listDone: uniqueName('Done'),
      cardTitle: uniqueName('Validate login behavior'),
    };

    await createBoardFixtureOnAuthenticatedPage(
      adminPage,
      board.projectName,
      board.boardName,
      board.listTodo,
      board.listInProgress,
      board.listDone,
      board.cardTitle,
    );

    await use(board);
  },
});

export { expect };
