'use strict';

import { calculateSectionBar } from '../../src/utils/ui';

describe('ui', function () {
  describe('sectionedBar', function () {
    it('should calculateSectionBar segments correctly', function () {
      expect(
        calculateSectionBar(
          [
            {
              title: 'foo',
              count: 5,
              color: 'blue',
            },
            {
              title: 'bar',
              count: 495,
              color: 'green',
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
              color: 'blue',
            },
            {
              title: 'bar',
              count: 10,
              color: 'green',
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
              "color": "blue",
              "completed": 13,
              "count": 5,
              "title": "foo",
            },
            Object {
              "color": "green",
              "completed": 25,
              "count": 10,
              "title": "bar",
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
              color: 'blue',
            },
            {
              title: 'bar',
              count: 10,
              color: 'green',
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
              color: 'blue',
            },
            {
              title: 'moo',
              count: 10,
              color: 'orange',
            },
            {
              title: 'bar',
              count: 10,
              color: 'green',
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
              color: 'blue',
            },
            {
              title: 'foo',
              count: 50,
              color: 'orange',
            },
            {
              title: 'bar',
              count: 50,
              color: 'green',
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
              color: 'blue',
            },
            {
              title: 'foo',
              count: 50,
              color: 'orange',
            },
            {
              title: 'bar',
              count: 20,
              color: 'green',
            },
          ],
          150,
          50
        )
      ).toMatchSnapshot();
    });
  });
});
