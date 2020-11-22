import {SortDirection} from '../sort/sort.model';

export interface SearchResult<T> {
    itemsList: T[];
    total: number;
}

export interface ListState {
    page: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}






