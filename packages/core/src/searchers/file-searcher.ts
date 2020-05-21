import { SearchPattern, StringsFound, SearchItem } from '../types/util';
import { toTaskItemData } from '../utils/data-transformers';

const fs = require('fs');

export async function findStrings(
  files: string[],
  searchPatterns: SearchPattern[]
): Promise<StringsFound> {
  let errors: string[] = [];
  let searchItems: SearchItem[] = [];

  await Promise.all(
    files.map((file) => {
      return fs.promises
        .readFile(file, 'utf8')
        .then((fileString: string) => {
          return searchPatterns.forEach((searchPattern) => {
            let numMatches = 0;
            searchPattern.patterns.forEach((pattern) => {
              numMatches += (fileString.match(new RegExp(pattern, 'gi')) || []).length;
            });
            if (numMatches) {
              searchItems.push(
                ...new Array(numMatches).fill({
                  patternName: searchPattern.patternName,
                  fileName: file,
                })
              );
            }
          });
        })
        .catch((error: string) => {
          errors.push(error);
        });
    })
  );

  let patternNames: string[] = searchPatterns.map((pattern) => pattern.patternName);
  let patternResults: Record<string, string[]> = patternNames.reduce((acc, item) => {
    return { ...acc, ...{ [item]: [] } };
  }, {});

  searchItems.forEach((item: SearchItem) => {
    patternResults[item.patternName].push(item.fileName);
  });

  return {
    results: patternNames.map((patternName: string) => {
      return toTaskItemData(patternName, patternResults[patternName]);
    }),
    errors,
  };
}
