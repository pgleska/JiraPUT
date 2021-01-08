import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, debounceTime, switchMap} from 'rxjs/internal/operators';
import {Team} from './team.model';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    private _teams$ = new BehaviorSubject<Team[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allTeamList: Team[] = [];
    filteredTeamList: Team[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get teams$() {
        return this._teams$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Team>(this.filteredTeamList, this.state, this.matches))
        ).subscribe(result => {
            this._teams$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getTeamList(): Observable<Team[]> {
        return this.http.get<Team[]>(environment.apiUrl + '/api/team/list');
    }

    getTeam(name: string): Observable<Team> {
        return this.http.get<Team>(environment.apiUrl + `/api/team/${name}`)
            .pipe(
                catchError(handleError('team'))
            );
    }

    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(
            environment.apiUrl + '/api/team/create',
            team)
            .pipe(
                catchError(handleError('team'))
            );
    }

    modifyTeam(team: Team): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/team/${team.name}`,
            team).pipe(
            catchError(handleError('team'))
        );
    }

    deleteTeam(team: Team): Observable<any> {
        return this.http.delete(environment.apiUrl + `/api/team/${team.name}`)
            .pipe(
                catchError(handleError('team'))
            );
    }

    filterTeamList(minimumMembersNumber: number, maximumMembersNumber: number): void {
        this.filteredTeamList = this.allTeamList;
        if (!!minimumMembersNumber) {
            this.filteredTeamList = this.filteredTeamList.filter(team => team.numberOfMembers >= minimumMembersNumber);
        }
        if (!!maximumMembersNumber) {
            this.filteredTeamList = this.filteredTeamList.filter(team => team.numberOfMembers <= maximumMembersNumber);
        }
    }

    matches(team: Team, term: string): boolean {
        return team.name.toLowerCase().includes(term.toLowerCase());
    }
}
