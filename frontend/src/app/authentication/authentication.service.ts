import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {LoginResponseData, SignUpResponseData} from './authentication.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    user = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
    }

    signUp(login: string, firstName: string, lastName: string, password: string): Observable<any> {
        return this.http
            .post<SignUpResponseData>(
                environment.apiUrl + '/api/employee/sign-up',
                {
                    login,
                    password,
                    firstName,
                    lastName
                }
            );
    }

    login(login: string, password: string): Observable<any> {
        return this.http.post<LoginResponseData>(
            environment.apiUrl + '/login',
            {
                login,
                password,
            }
        ).pipe(
            catchError(AuthenticationService.handleLoginError),
            tap(responseData => this.saveInSessionStorage(responseData))
        );
    }

    logout(): void {
        this.user.next(false);
    }

    private saveInSessionStorage(responseData: LoginResponseData): void {
        this.user.next(true);
        sessionStorage.setItem('user_data', JSON.stringify(responseData));
    }

    private static handleLoginError(errorResponse: HttpErrorResponse): Observable<any> {
        if (errorResponse.error === 'Unauthorized') {
            return throwError('Błędny login lub hasło');
        } else {
            return throwError('Nieznany błąd');
        }
    }
}
