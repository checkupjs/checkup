'use strict';

import { stdout as mockStdout } from 'stdout-stderr';
import ConsoleWriter from '../../src/utils/console-writer';

describe('console-writer', function () {
  let consoleWriter: ConsoleWriter;

  beforeEach(function () {
    mockStdout.start();

    consoleWriter = new ConsoleWriter();
  });

  afterEach(function () {
    mockStdout.stop();
  });

  it('should write a blankLine()', function () {
    consoleWriter.blankLine();
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "
        "
      `);
  });

  it('should write a clearLine()', function () {
    consoleWriter.clearLine();
    expect(mockStdout.output).toMatchInlineSnapshot(`""`);
  });

  it('should write a clearScreen()', function () {
    consoleWriter.clearScreen();
    expect(mockStdout.output).toMatchInlineSnapshot(`""`);
  });

  it('should write a categoryHeader()', function () {
    consoleWriter.categoryHeader('hi there!');
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "=== hi there!

        "
      `);
  });

  it('should write a sectionHeader()', function () {
    consoleWriter.sectionHeader('helloooo sir!');
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "Helloooo Sir

        "
      `);
  });

  it('should write a subHeader()', function () {
    consoleWriter.subHeader('meow!');
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "Meow

        "
      `);
  });

  it('should write a subSection()', function () {
    consoleWriter.subHeader('meow!');
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "Meow

        "
      `);
  });

  it('should write a log()', function () {
    consoleWriter.log('tree');
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "tree
        "
      `);
  });

  it('should write a bar()', function () {
    consoleWriter.bar('tequila', 9, 4, 'shots', 10);
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "tequila
        ■■■■■■■■■■ 9shots

        "
      `);
  });

  it('should write a table()', function () {
    consoleWriter.table(
      [
        ['apples', 'peas', 'bread'],
        ['grapes', 'carrots', 'rice'],
      ],
      ['fruits', 'veggies', 'carbs']
    );
    expect(mockStdout.output.trim()).toMatchInlineSnapshot(`
        "fruits veggies carbs
        apples peas    bread
        grapes carrots rice"
      `);
  });

  it('should write a sectionedBar()', function () {
    consoleWriter.sectionedBar(
      [
        { title: 'books', count: 36 },
        { title: 'tables', count: 39 },
      ],
      50
    );
    expect(mockStdout.output.trim()).toMatchInlineSnapshot(`
      "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 50
      ■ tables (39)
      ■ books (36)"
    `);
  });

  it('should write a valuesList()', function () {
    consoleWriter.valuesList(
      [
        { title: 'books', count: 36 },
        { title: 'tables', count: 39 },
      ],
      'stuff'
    );
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "■ books (36 stuff)
        ■ tables (39 stuff)
        "
      `);
  });

  it('should write a styledJSON()', function () {
    consoleWriter.styledJSON({ cars: 5, trucks: 9 });
    expect(mockStdout.output).toMatchInlineSnapshot(`
        "{
          \\"cars\\": 5,
          \\"trucks\\": 9
        }
        "
      `);
  });
});
