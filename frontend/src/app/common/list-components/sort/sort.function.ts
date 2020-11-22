const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort<T>(listItems: T[], column: string, direction: string): T[] {
    if (direction === '' || column === '') {
        return listItems;
    } else {
        return [...listItems].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}
