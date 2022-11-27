import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject, switchMap} from 'rxjs';
import {catchError, debounceTime, map} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Project} from './project.model';
import {Technology} from '../technology/technology.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private _projects$ = new BehaviorSubject<Project[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allProjectList: Project[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get projects$() {
        return this._projects$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Project>(this.allProjectList, this.state, this.matches))
        ).subscribe(result => {
            this._projects$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getProjectList(): Observable<Project[]> {
        return this.http.get<Project[]>(environment.apiUrl + '/api/project/list');
    }

    getProject(projectId: number): Observable<Project> {
        return this.http.get<Project[]>(environment.apiUrl + '/api/project/list').pipe(
            map(projects => projects.find(proj => proj.id === projectId)),
        );
    }

    createProject(project: Project): Observable<Project> {
        return this.http.post<Project>(
            environment.apiUrl + '/api/project/create',
            project)
            .pipe(
                catchError(handleError)
            );
    }

    modifyProject(project: Project): Observable<any> {
        project.technologies = undefined;
        project.contracts = undefined;
        return this.http.patch(
            environment.apiUrl + `/api/project/${project.id}`,
            project)
            .pipe(
                catchError(handleError)
            );
    }

    deleteProject(project: Project): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/project/${project.id}`)
            .pipe(
                catchError(handleError)
            );
    }

    addProjectTechnology(project: Project, technology: Technology): Observable<any> {
        return this.http.put(environment.apiUrl + `/api/project/${project.id}/technology`,
            {name: technology.name})
            .pipe(
                catchError(handleError)
            );
    }

    deleteProjectTechnology(project: Project, technology: Technology): Observable<any> {
        return this.http.delete(environment.apiUrl + `/api/project/${project.id}/technology/${technology.id}`)
            .pipe(
                catchError(handleError)
            );
    }

    matches(project: Project, term: string): boolean {
        return project.name.toLowerCase().includes(term.toLowerCase());
    }

    resetState() {
        this.allProjectList = [];
        this.state = {
            page: 1,
            searchTerm: '',
            sortColumn: '',
            sortDirection: ''
        };
    }

}
