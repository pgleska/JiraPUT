import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/internal/operators';
import {Employee} from './employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) {
    }

    getEmployee(login: string): Observable<Employee> {
        return this.http.get<Employee>(environment.apiUrl + `/api/employee/${login}`)
            .pipe(map((employee: Employee) => {
                    employee.positionDisplay = employee.position.replace('_', ' ');
                    return employee;
                })
            );
    }


    private static handleEmployeeError(errorResponse: HttpErrorResponse): Observable<never> {
        if (errorResponse.error.message === 'Unauthorized') {
            return throwError('error.login-error');
        } else {
            return throwError('error.unknown');
        }
    }
}
