export type SortBy = 'key' | 'value';
export type SortDirection = 'asc' | 'desc';

export function getSorter(sortBy: SortBy = 'key') {
  if (sortBy === 'key') {
    // sorts aphabetically by key, ascending by default (normal alphabtical order)
    return (subject: Map<string, number>, sortDirection: SortDirection = 'asc') => {
      let sorted = [...subject.keys()].sort();

      if (sortDirection === 'desc') {
        sorted.reverse();
      }

      return new Map<string, number>(sorted.map((key) => [key, subject.get(key)!]));
    };
  }

  // Sorts by the numerical value, descending by default
  return (subject: Map<string, number>, sortDirection: SortDirection = 'desc') => {
    let sorted = [...subject.entries()].sort((a, b) => a[1] - b[1]);

    if (sortDirection === 'desc') {
      sorted.reverse();
    }

    return new Map<string, number>(sorted);
  };
}
