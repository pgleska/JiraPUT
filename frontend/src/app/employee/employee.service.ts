import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, debounceTime, map, switchMap} from 'rxjs/internal/operators';
import {Employee} from './employee.model';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private _employees$ = new BehaviorSubject<Employee[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allEmployeeList: Employee[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get employees$() {
        return this._employees$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Employee>(this.allEmployeeList, this.state, this.matches))
        ).subscribe(result => {
            this._employees$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getEmployeeList(): Observable<Employee[]> {
        return this.http.get<Employee[]>(environment.apiUrl + '/api/employee/list')
            .pipe(map((employees: Employee[]) => employees.map(
                (employee: Employee) => {
                    employee.positionDisplay = employee.position.replace(/_/g, ' ');
                    return employee;
                })
            ));
    }

    getEmployee(login: string): Observable<Employee> {
        return this.http.get<Employee>(environment.apiUrl + `/api/employee/${login}`)
            .pipe(
                catchError(handleError('employee')),
                map((employee: Employee) => {
                    employee.positionDisplay = employee.position.replace(/_/g, ' ');
                    return employee;
                })
            );
    }

    modifyEmployee(employee: Employee): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/employee/${employee.login}`,
            employee).pipe(
            catchError(handleError('employee'))
        );
    }

    deleteEmployee(employee: Employee): Observable<any> {
        return this.http.delete(environment.apiUrl + `/api/employee/${employee.login}`)
            .pipe(
                catchError(handleError('employee'))
            );
    }

    matches(employee: Employee, term: string): boolean {
        return employee.login.toLowerCase().includes(term.toLowerCase())
            || employee.firstName.toLowerCase().includes(term.toLowerCase())
            || employee.lastName.toLowerCase().includes(term.toLowerCase());
    }
}
