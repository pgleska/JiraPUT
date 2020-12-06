import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Position} from './position.model';
import {debounceTime, map, switchMap} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';


@Injectable({
    providedIn: 'root'
})
export class PositionService {

    search$ = new Subject<void>();
    private _positions$ = new BehaviorSubject<Position[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    allPositionList: Position[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Position>(this.allPositionList, this.state, this.matches))
        ).subscribe(result => {
            this._positions$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    get positions$() {
        return this._positions$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    getPositionList(): Observable<Position[]> {
        return this.http.get<Position[]>(environment.apiUrl + '/api/position/list')
            .pipe(map((positions: Position[]) => positions.map(
                (position: Position) => {
                    position.nameDisplay = position.name.replace(/_/g, ' ');
                    return position;
                })
            ));
    }

    createPosition(position: Position): Observable<any> {
        return this.http.post<Position>(
            environment.apiUrl + '/api/position/create',
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

    modifyPosition(position: Position): Observable<any> {
        return this.http.patch<Position>(
            environment.apiUrl + `/api/position/${position.name}`,
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

    matches(position: Position, term: string): boolean {
        return position.nameDisplay.toLowerCase().includes(term.toLowerCase());
    }
}
