import BufferedWriter from '../../lib/utils/buffered-writer';

describe('buffered-writer', function () {
  let bufferedWriter: BufferedWriter;

  beforeEach(function () {
    bufferedWriter = new BufferedWriter();
  });

  it('should append to outputString if the file option is set', function () {
    bufferedWriter.log('whatever');

    expect(bufferedWriter.escapedBuffer).toMatch('whatever');
  });

  it('should write a blankLine()', function () {
    bufferedWriter.blankLine();
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
        "
        "
      `);
  });

  it('should write a clearLine()', function () {
    bufferedWriter.clearLine();
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`""`);
  });

  it('should write a clearScreen()', function () {
    bufferedWriter.clearScreen();
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`""`);
  });

  it('should write a categoryHeader()', function () {
    bufferedWriter.categoryHeader('hi there!');
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "=== hi there!

      "
    `);
  });

  it('should write a sectionHeader()', function () {
    bufferedWriter.sectionHeader('helloooo sir!');
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "Helloooo Sir

      "
    `);
  });

  it('should write a subHeader()', function () {
    bufferedWriter.subHeader('meow!');
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "Meow

      "
    `);
  });

  it('should write a subSection()', function () {
    bufferedWriter.subHeader('meow!');
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "Meow

      "
    `);
  });

  it('should write a log()', function () {
    bufferedWriter.log('tree');
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
        "tree
        "
      `);
  });

  it('should write a bar()', function () {
    bufferedWriter.bar('tequila', 9, 4, 'shots', 10);
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "tequila
      ■■■■■■■■■■ 9shots

      "
    `);
  });

  it('should write a table()', function () {
    bufferedWriter.table(
      [
        ['apples', 'peas', 'bread'],
        ['grapes', 'carrots', 'rice'],
      ],
      ['fruits', 'veggies', 'carbs']
    );
    expect(bufferedWriter.escapedBuffer.trim()).toMatchInlineSnapshot(`
      "fruits veggies carbs
      apples peas    bread
      grapes carrots rice"
    `);
  });

  it('should write a sectionedBar()', function () {
    bufferedWriter.sectionedBar(
      [
        { title: 'books', count: 36 },
        { title: 'tables', count: 39 },
      ],
      50
    );
    debugger;
    expect(bufferedWriter.escapedBuffer.trim()).toMatchInlineSnapshot(`
      "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 50 
      ■ tables (39)
      ■ books (36)"
    `);
  });

  it('should write a valuesList()', function () {
    bufferedWriter.valuesList(
      [
        { title: 'books', count: 36 },
        { title: 'tables', count: 39 },
      ],
      'stuff'
    );
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
      "■ books (36 stuff)
      ■ tables (39 stuff)
      "
    `);
  });

  it('should write a styledJSON()', function () {
    bufferedWriter.styledJSON({ cars: 5, trucks: 9 });
    expect(bufferedWriter.escapedBuffer).toMatchInlineSnapshot(`
        "{
          \\"cars\\": 5,
          \\"trucks\\": 9
        }
        "
      `);
  });
});
