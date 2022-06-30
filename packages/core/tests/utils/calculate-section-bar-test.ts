import { calculateSectionBar } from '../../src/utils/base-output-writer';

describe('calculate-sectioned-bar', () => {
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
        {
          "completedSegments": [
            {
              "completed": 25,
              "count": 10,
              "title": "bar",
            },
            {
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
