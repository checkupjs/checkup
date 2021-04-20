'use strict';

import { stdout as mockStdout } from 'stdout-stderr';
import { ConsoleWriter, calculateSectionBar } from '../../src/utils/console-writer';

describe('consoleWriter', function () {
  let consoleWriter = new ConsoleWriter();

  describe('consoleWriter', function () {
    beforeEach(function () {
      mockStdout.start();
    });

    afterEach(function () {
      mockStdout.stop();
    });

    it('should append to outputString if the file option is set', function () {
      let consoleWriterToFile = new ConsoleWriter('file');

      consoleWriterToFile.log('whatever');

      expect(mockStdout.output).toEqual('');
      expect(consoleWriterToFile.outputString.trim()).toEqual('whatever');
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

  describe('calculateSectionBar', function () {
    it('should calculateSectionBar segments correctly', function () {
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 5,
            },
            {
              title: 'bar',
              count: 495,
            },
          ],
          500,
          50
        )
      ).toMatchSnapshot();
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 5,
            },
            {
              title: 'bar',
              count: 10,
            },
          ],
          20,
          50
        )
      ).toMatchInlineSnapshot(
        {},
        `
        Object {
          "completedSegments": Array [
            Object {
              "completed": 25,
              "count": 10,
              "title": "bar",
            },
            Object {
              "completed": 13,
              "count": 5,
              "title": "foo",
            },
          ],
          "incompleteSegments": 13,
        }
      `
      );
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 10,
            },
            {
              title: 'bar',
              count: 10,
            },
          ],
          20,
          50
        )
      ).toMatchSnapshot();
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 10,
            },
            {
              title: 'moo',
              count: 10,
            },
            {
              title: 'bar',
              count: 10,
            },
          ],
          30,
          50
        )
      ).toMatchSnapshot();
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 50,
            },
            {
              title: 'foo',
              count: 50,
            },
            {
              title: 'bar',
              count: 50,
            },
          ],
          150,
          50
        )
      ).toMatchSnapshot();
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 50,
            },
            {
              title: 'foo',
              count: 50,
            },
            {
              title: 'bar',
              count: 20,
            },
          ],
          150,
          50
        )
      ).toMatchSnapshot();
    });
  });
});
