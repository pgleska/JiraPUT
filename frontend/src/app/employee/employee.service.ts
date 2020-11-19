import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/internal/operators';
import {Employee} from './employee.model';
import {handleError} from '../common/handle-error/handle-error.function';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) {
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
                    employee.positionDisplay = employee.position.replace('_', ' ');
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
}
