import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject, switchMap} from 'rxjs';
import {catchError, debounceTime, map} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Issue} from './issue.model';
import {SelectItem} from '../common/select/select-item.model';


@Injectable({
    providedIn: 'root'
})
export class IssueService {

    private _issues$ = new BehaviorSubject<Issue[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allIssueList: Issue[] = [];
    filteredIssueList: Issue[] = [];
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
            switchMap(() => search<Issue>(this.filteredIssueList, this.state, this.matches))
        ).subscribe(result => {
            this._issues$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getIssueList(): Observable<Issue[]> {
        return this.http.get<Issue[]>(environment.apiUrl + '/api/issue/list')
            .pipe(
                catchError(handleError),
                map((issues: Issue[]) => issues.map(
                    (issue: Issue) => {
                        this.convertResponse(issue);
                        return issue;
                    })
                ));
    }

    getEpicListByProjectId(projectId: number): Observable<Issue[]> {
        return this.http.get<Issue[]>(environment.apiUrl + `/api/issue/project/${projectId}`)
            .pipe(
                catchError(handleError),
                map((issues: Issue[]) => issues.map(
                    (issue: Issue) => {
                        this.convertResponse(issue);
                        return issue;
                    })
                ));
    }

    getStoryListByTeamName(teamName: string): Observable<Issue[]> {
        return this.http.get<Issue[]>(environment.apiUrl + `/api/issue/team/${teamName}`)
            .pipe(
                catchError(handleError),
                map((issues: Issue[]) => issues.map(
                    (issue: Issue) => {
                        this.convertResponse(issue);
                        return issue;
                    })
                ));
    }

    getTaskListByEmployeeLogin(login: string): Observable<Issue[]> {
        return this.http.get<Issue[]>(environment.apiUrl + `/api/issue/user/${login}`)
            .pipe(
                catchError(handleError),
                map((issues: Issue[]) => issues.map(
                    (issue: Issue) => {
                        this.convertResponse(issue);
                        return issue;
                    })
                ));
    }

    getIssue(issueId: number): Observable<Issue> {
        return this.http.get<Issue>(environment.apiUrl + `/api/issue/${issueId}`)
            .pipe(
                catchError(handleError),
                map((issue) => {
                    this.convertResponse(issue);
                    return issue;
                })
            );
    }

    createIssue(issue: Issue): Observable<Issue> {
        return this.http.post<Issue>(
            environment.apiUrl + '/api/issue/create',
            issue)
            .pipe(
                catchError(handleError)
            );
    }

    modifyIssue(issue: Issue): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/issue/${issue.id}`,
            issue)
            .pipe(
                catchError(handleError)
            );
    }

    deleteIssue(issue: Issue): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/issue/${issue.id}`)
            .pipe(
                catchError(handleError)
            );
    }

    filterIssueList(issueType: SelectItem = undefined): void {
        this.filteredIssueList = this.allIssueList;
        if (!!issueType) {
            this.filteredIssueList = this.filteredIssueList.filter(issue => issue.type === issueType.id);
        }
    }

    matches(issue: Issue, term: string): boolean {
        return issue.name.toLowerCase().includes(term.toLowerCase());
    }

    convertResponse(issue: Issue) {
        if (!!issue.realTime) {
            issue.realTime = (new Date(issue.realTime).getTime() + 3599000) / 60000;
        } else {
            issue.realTime = -1;
        }
        if (!!issue.estimatedTime) {
            issue.estimatedTime = (new Date(issue.estimatedTime).getTime() + 3599000) / 60000;
        } else {
            issue.estimatedTime = -1;
        }
        switch (issue.type) {
            case 'epic':
                issue.typeName = 'Epic';
                break;
            case 'story':
                issue.typeName = 'Story';
                break;
            case 'task':
                issue.typeName = 'Task';
                break;
        }
        return issue;
    }

    resetState() {
        this.allIssueList = [];
        this.filteredIssueList= [];
        this.state = {
            page: 1,
            searchTerm: '',
            sortColumn: '',
            sortDirection: ''
        };
    }
}
