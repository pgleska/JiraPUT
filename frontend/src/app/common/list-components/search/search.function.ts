import {Observable, of} from 'rxjs';
import {ListState, SearchResult} from './search.model';
import {PAGE_SIZE} from '../pagination/pagination.component';
import {sort} from '../sort/sort.function';

export function search<T>(listItems: T[],
                          state: ListState,
                          matchFunction: (item: T, term: string) => boolean): Observable<SearchResult<T>> {
    const {sortColumn, sortDirection, page, searchTerm} = state;
    const sortedItems = sort<T>(listItems, sortColumn, sortDirection);
    const filteredItems = sortedItems.filter(item => matchFunction(item, searchTerm));
    const total = filteredItems.length;
    const displayItems = filteredItems.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);
    return of({
        itemsList: displayItems,
        total: total
    } as SearchResult<T>);
}
