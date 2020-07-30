import {
  buildSummaryResult,
  buildMultiValueResult,
  buildDerivedValueResult,
  buildLookupValueResult,
} from '../src/builders';

describe('builders', () => {
  describe('buildSummaryResult', () => {
    it('correctly builds SummaryResult with data as array of strings', () => {
      let summaryResult = buildSummaryResult('foo', ['bar', 'baz']);

      expect(summaryResult).toMatchInlineSnapshot(`
        Object {
          "count": 2,
          "data": Array [
            "bar",
            "baz",
          ],
          "key": "foo",
          "type": "summary",
        }
      `);
    });

    it('correctly builds SummaryResult with data as array of objects', () => {
      let summaryResult = buildSummaryResult('foo', [
        {
          foo: true,
        },
        {
          foo: true,
        },
      ]);

      expect(summaryResult).toMatchInlineSnapshot(`
        Object {
          "count": 2,
          "data": Array [
            Object {
              "foo": true,
            },
            Object {
              "foo": true,
            },
          ],
          "key": "foo",
          "type": "summary",
        }
      `);
    });
  });

  describe('buildMultiValueResult', () => {
    it('correctly builds MultiValueResult with data', () => {
      let multiValueResult = buildMultiValueResult(
        'foo',
        [
          {
            foo: true,
            baz: 'bar',
          },
          {
            foo: true,
            baz: 'bar',
          },
        ],
        'baz',
        ['bar']
      );

      expect(multiValueResult).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "baz": "bar",
              "foo": true,
            },
            Object {
              "baz": "bar",
              "foo": true,
            },
          ],
          "dataSummary": Object {
            "dataKey": "baz",
            "total": 2,
            "values": Object {
              "bar": 2,
            },
          },
          "key": "foo",
          "type": "multi-value",
        }
      `);
    });

    it('correctly builds MultiValueResult with data if data contains no found values from the dataKey', () => {
      let multiValueResult = buildMultiValueResult(
        'foo',
        [
          {
            foo: true,
            baz: 'derf',
          },
          {
            foo: true,
            baz: 'dork',
          },
        ],
        'baz',
        ['bar']
      );

      expect(multiValueResult).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "baz": "derf",
              "foo": true,
            },
            Object {
              "baz": "dork",
              "foo": true,
            },
          ],
          "dataSummary": Object {
            "dataKey": "baz",
            "total": 2,
            "values": Object {
              "bar": 0,
            },
          },
          "key": "foo",
          "type": "multi-value",
        }
      `);
    });
  });

  describe('buildDerivedValueResult', () => {
    it('correctly builds DerivedValueResult with data', () => {
      let derivedValueResult = buildDerivedValueResult(
        'foo',
        [
          {
            foo: true,
            baz: 'bar',
          },
          {
            foo: true,
            baz: 'blech',
          },
          {
            foo: true,
            baz: 'bar',
          },
        ],
        'baz'
      );

      expect(derivedValueResult).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "baz": "bar",
              "foo": true,
            },
            Object {
              "baz": "blech",
              "foo": true,
            },
            Object {
              "baz": "bar",
              "foo": true,
            },
          ],
          "dataSummary": Object {
            "dataKey": "baz",
            "total": 3,
            "values": Object {
              "bar": 2,
              "blech": 1,
            },
          },
          "key": "foo",
          "type": "derived-value",
        }
      `);
    });
  });

  describe('buildLookupValueResult', () => {
    it('correctly builds LookupValueResult with data', () => {
      let lookupValueResult = buildLookupValueResult(
        'foo',
        [
          {
            foo: true,
            baz: 'bar',
            total: 0,
          },
          {
            foo: true,
            baz: 'blech',
            total: 2,
          },
          {
            foo: true,
            baz: 'bar',
            total: 42,
          },
        ],
        'baz',
        'total'
      );

      expect(lookupValueResult).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "baz": "bar",
              "foo": true,
              "total": 0,
            },
            Object {
              "baz": "blech",
              "foo": true,
              "total": 2,
            },
            Object {
              "baz": "bar",
              "foo": true,
              "total": 42,
            },
          ],
          "dataSummary": Object {
            "dataKey": "baz",
            "total": 3,
            "valueKey": "total",
            "values": Object {
              "bar": 42,
              "blech": 2,
            },
          },
          "key": "foo",
          "type": "lookup-value",
        }
      `);
    });
  });
});
