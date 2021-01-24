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
    private userLogin: string = undefined;

    constructor(private http: HttpClient) {
        this.token = JSON.parse(localStorage.getItem('token'));
        this.userLogin = JSON.parse(localStorage.getItem('login'));
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
            tap(responseData => this.saveToken(responseData, login))
        );
    }

    logout(): void {
        this.user.next(false);
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        window.location.reload();
    }

    getToken(): string {
        return this.token;
    }

    getUserLogin(): string {
        return this.userLogin;
    }

    private saveToken(responseData: LoginResponseData, login: string ): void {
        this.user.next(true);
        localStorage.setItem('token', JSON.stringify(responseData.JWT));
        localStorage.setItem('login', JSON.stringify(login));
        this.token = responseData.JWT;
        this.userLogin = login;
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
