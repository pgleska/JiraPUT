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
            catchError(AuthenticationService.handleLoginError),
            tap(responseData => this.saveInSessionStorage(responseData))
        );
    }

    logout(): void {
        this.user.next(false);
    }

    getToken(): string {
        console.log(this.token);
        return this.token;
    }

    private saveInSessionStorage(responseData: LoginResponseData): void {
        this.user.next(true);
        this.token = responseData.JWT;
        sessionStorage.setItem('user_', JSON.stringify(responseData));
    }

    private static handleLoginError(errorResponse: HttpErrorResponse): Observable<never> {
        if (errorResponse.error.message === 'Unauthorized') {
            return throwError('error.login-error');
        } else {
            return throwError('error.unknown');
        }
    }
}
