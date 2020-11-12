import {Component, EventEmitter, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from './authentication.service';

@Component({
    selector: 'app-authentication-sign-up',
    template: `
        <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
            <div *ngIf="error" class="alert-danger">
                <h4>{{ error }}</h4>
            </div>
            <div class="form-group">
                <label for="email">Login</label>
                <input
                        type="text"
                        id="login"
                        class="form-control"
                        [ngModel]
                        name="login"
                        required
                />
            </div>
            <div class="form-group">
                <label for="first_name">Imię</label>
                <input
                        type="text"
                        id="first_name"
                        class="form-control"
                        [ngModel]
                        name="first_name"
                        required
                />
            </div>
            <div class="form-group">
                <label for="last_name">Nazwisko</label>
                <input
                        type="text"
                        id="last_name"
                        class="form-control"
                        [ngModel]
                        name="last_name"
                        required
                />
            </div>
            <div class="form-group">
                <label for="password">Hasło</label>
                <input
                        type="password"
                        id="password"
                        class="form-control"
                        [(ngModel)]="password"
                        name="password"
                        required
                        minlength="6"
                />
            </div>
            <div class="form-group">
                <label for="repeat_password">Powtórz hasło</label>
                <input
                        type="password"
                        id="repeat_password"
                        class="form-control"
                        [ngModel]
                        (ngModelChange)="checkPassword($event)"
                        name="repeat_password"
                        required
                        minlength="6"
                />
            </div>
            <div>
                <button
                        class="btn btn-primary"
                        type="submit"
                        [disabled]="!authForm.valid"
                >{{'Zarejestruj się'}}</button>
            </div>
        </form>
    `
})

export class AuthenticationSignUpComponent {

    @Output() loadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    error: string;
    password: string;

    constructor(private authenticationService: AuthenticationService) {
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        const login = form.value.login;
        const firstName = form.value.first_name;
        const lastName = form.value.last_name;
        const password = form.value.password;

        this.loadingChanged.emit(true);
        const authObservable = this.authenticationService.signUp(login, firstName, lastName, password);

        authObservable.subscribe(
            responseData => {
                console.log(responseData);
                this.loadingChanged.emit(false);
            },
            error => {
                this.error = error;
                this.loadingChanged.emit(false);
            }
        );
        form.reset();
    }

    checkPassword($event: string) {
        if (this.password !== $event) {
            this.error = 'Hasła nie są identyczne';
        } else {
            this.error = undefined;
        }
    }
}
