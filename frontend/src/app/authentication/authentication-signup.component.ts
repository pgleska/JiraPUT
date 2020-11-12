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
                <label for="email">{{'authentication.login' | translate}}</label>
                <input
                        type="text"
                        id="login"
                        name="login"
                        class="form-control"
                        [ngModel]
                        #login="ngModel"
                        required
                />
                <app-input-error [control]="login.control"></app-input-error>
            </div>
            <div class="form-group">
                <label for="first_name">{{'authentication.first-name' | translate}}</label>
                <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        class="form-control"
                        [ngModel]
                        #first_name="ngModel"
                        required
                />
                <app-input-error [control]="first_name.control"></app-input-error>
            </div>
            <div class="form-group">
                <label for="last_name">{{'authentication.last-name' | translate}}</label>
                <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        class="form-control"
                        [ngModel]
                        #last_name="ngModel"
                        required
                />
                <app-input-error [control]="last_name.control"></app-input-error>
            </div>
            <div class="form-group">
                <label for="password">{{'authentication.password' | translate}}</label>
                <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-control"
                        [(ngModel)]="passwordCopy"
                        #password="ngModel"
                        required
                        equalsValidator
                        [validateEqualsTo]="'repeat_password'"
                        [minLength]="6"
                />
                <app-input-error [control]="password.control"></app-input-error>
            </div>
            <div class="form-group">
                <label for="repeat_password">{{'authentication.repeat-password' | translate}}</label>
                <input
                        type="password"
                        id="repeat_password"
                        name="repeat_password"
                        class="form-control"
                        [ngModel]
                        #repeat_password="ngModel"
                        required
                        equalsValidator
                        [validateEqualsTo]="'password'"
                        [showErrorMessage]="true"
                        [minLength]="6"
                />
                <app-input-error [control]="repeat_password.control"></app-input-error>
            </div>
            <div>
                <button
                        class="btn btn-primary"
                        type="submit"
                        [disabled]="!authForm.valid"
                >{{'authentication.sign-up' | translate}}</button>
            </div>
        </form>
    `
})

export class AuthenticationSignUpComponent {

    @Output() loadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    error: string;
    passwordCopy: string;

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
}
