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

    private _positions$ = new BehaviorSubject<Position[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allPositionList: Position[] = [];
    filteredPositionList: Position[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get positions$() {
        return this._positions$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Position>(this.filteredPositionList, this.state, this.matches))
        ).subscribe(result => {
            this._positions$.next(result.itemsList);
            this._total$.next(result.total);
        });
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

    createPosition(position: Position): Observable<Position> {
        return this.http.post<Position>(
            environment.apiUrl + '/api/position/create',
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

    modifyPosition(position: Position): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/position/${position.name}`,
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

    deletePosition(position: Position): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/position/${position.name}`)
            .pipe(
                catchError(handleError('position'))
            );
    }

    filterPositionList(minimumSalary: number, maximumSalary: number): void {
        this.filteredPositionList = this.allPositionList;
        if (!!minimumSalary) {
            this.filteredPositionList = this.filteredPositionList.filter(position => position.minimumSalary >= minimumSalary);
        }
        if (!!maximumSalary) {
            this.filteredPositionList = this.filteredPositionList.filter(position => position.maximumSalary <= maximumSalary);
        }
    }

    matches(position: Position, term: string): boolean {
        return position.nameDisplay.toLowerCase().includes(term.toLowerCase());
    }
}
