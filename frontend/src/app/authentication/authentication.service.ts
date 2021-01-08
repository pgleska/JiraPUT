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
    private token: string = undefined;

    constructor(private http: HttpClient) {
        this.token = JSON.parse(localStorage.getItem('token'));
        if (!!this.token) {
            this.user.next(true);
        }
    }

    signUp(login: string, firstName: string, lastName: string, password: string): Observable<SignUpResponseData> {
        return this.http
            .post<SignUpResponseData>(
                environment.apiUrl + '/api/employee/sign-up',
                {
                    login,
                    password,
                    firstName,
                    lastName
                }
            ).pipe(
                catchError(AuthenticationService.handleAuthenticationError),
            );
    }

    login(login: string, password: string): Observable<LoginResponseData> {
        return this.http.post<LoginResponseData>(
            environment.apiUrl + '/login',
            {
                login,
                password,
            },
        ).pipe(
            catchError(AuthenticationService.handleAuthenticationError),
            tap(responseData => this.saveToken(responseData))
        );
    }

    logout(): void {
        this.user.next(false);
        localStorage.removeItem('token');
    }

    getToken(): string {
        return this.token;
    }

    private saveToken(responseData: LoginResponseData): void {
        this.user.next(true);
        localStorage.setItem('token', JSON.stringify(responseData.JWT));
        this.token = responseData.JWT;
    }

    private static handleAuthenticationError(errorResponse: HttpErrorResponse): Observable<never> {
        switch (errorResponse.status) {
            case 401:
                return throwError('error.login-error');
            case 409:
                return throwError('error.user-duplicated');
            default:
                return throwError('error.unknown');
        }
    }
}
