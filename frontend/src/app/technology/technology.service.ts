import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Technology} from './technology.model';


@Injectable({
    providedIn: 'root'
})
export class TechnologyService {

    private _technologies$ = new BehaviorSubject<Technology[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allTechnologyList: Technology[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get technologies$() {
        return this._technologies$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Technology>(this.allTechnologyList, this.state, this.matches))
        ).subscribe(result => {
            this._technologies$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getTechnologyList(): Observable<Technology[]> {
        return this.http.get<Technology[]>(environment.apiUrl + '/api/position/list')
            .pipe(map((technologies: Technology[]) => technologies.map(
                (technology: Technology) => {
                    technology.nameDisplay = technology.name.replace(/_/g, ' ');
                    return technology;
                })
            ));
    }

    createTechnology(technology: Technology): Observable<Technology> {
        return this.http.post<Technology>(
            environment.apiUrl + '/api/technology/create',
            technology)
            .pipe(
                catchError(handleError('technology'))
            );
    }

    modifyTechnology(technology: Technology): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/technology/${technology.name}`,
            technology)
            .pipe(
                catchError(handleError('technology'))
            );
    }

    deleteTechnology(technology: Technology): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/technology/${technology.name}`)
            .pipe(
                catchError(handleError('technology'))
            );
    }

    matches(technology: Technology, term: string): boolean {
        return technology.name.toLowerCase().includes(term.toLowerCase());
    }
}
