import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Issue} from './issue.model';


@Injectable({
    providedIn: 'root'
})
export class IssueService {

    private _issues$ = new BehaviorSubject<Issue[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allIssueList: Issue[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get issues$() {
        return this._issues$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Issue>(this.allIssueList, this.state, this.matches))
        ).subscribe(result => {
            this._issues$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getIssueList(): Observable<Issue[]> {
        return this.http.get<Issue[]>(environment.apiUrl + '/api/issue/list')
            .pipe(
                catchError(handleError('issue'))
            );
    }

    getIssue(issueId: number): Observable<Issue> {
        return this.http.get<Issue>(environment.apiUrl + `/api/issue/${issueId}`)
            .pipe(
                catchError(handleError('issue'))
            );
    }

    createIssue(issue: Issue): Observable<Issue> {
        return this.http.post<Issue>(
            environment.apiUrl + '/api/issue/create',
            issue)
            .pipe(
                catchError(handleError('issue'))
            );
    }

    modifyIssue(issue: Issue): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/issue/${issue.id}`,
            issue)
            .pipe(
                catchError(handleError('issue'))
            );
    }

    deleteIssue(issue: Issue): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/issue/${issue.name}`)
            .pipe(
                catchError(handleError('issue'))
            );
    }

    matches(issue: Issue, term: string): boolean {
        return issue.name.toLowerCase().includes(term.toLowerCase());
    }
}
