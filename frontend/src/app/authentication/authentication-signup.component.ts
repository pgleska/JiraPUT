import {Component, EventEmitter, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-authentication-sign-up',
    template: `
        <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
            <div class="required">
                <label for="login" class="control-label">{{'authentication.login' | translate}}</label>
                <input
                        type="text"
                        id="login"
                        name="login"
                        class="form-control"
                        [ngModel]
                        #login="ngModel"
                        urlValidator
                        required
                />
                <app-input-error [control]="login.control"></app-input-error>
            </div>
            <div class="required">
                <label for="first_name" class="control-label">{{'authentication.first-name' | translate}}</label>
                <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        class="form-control"
                        [ngModel]
                        #first_name="ngModel"
                        onlyLettersValidator
                        required
                />
                <app-input-error [control]="first_name.control"></app-input-error>
            </div>
            <div class="required">
                <label for="last_name" class="control-label">{{'authentication.last-name' | translate}}</label>
                <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        class="form-control"
                        [ngModel]
                        #last_name="ngModel"
                        onlyLettersValidator
                        required
                />
                <app-input-error [control]="last_name.control"></app-input-error>
            </div>
            <div class="required">
                <label for="password" class="control-label">{{'authentication.password' | translate}}</label>
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
                        [minlength]="6"
                />
                <app-input-error [control]="password.control"></app-input-error>
            </div>
            <div class="required">
                <label for="repeat_password" class="control-label">{{'authentication.repeat-password' | translate}}</label>
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
                        [minlength]="6"
                />
                <app-input-error [control]="repeat_password.control"></app-input-error>
            </div>
            <div>
                <button
                        class="btn btn-primary mt-2"
                        type="submit"
                        [disabled]="!authForm.valid"
                >{{'authentication.sign-up' | translate}}</button>
            </div>
        </form>
    `
})

export class AuthenticationSignUpComponent {

    @Output() error: EventEmitter<string> = new EventEmitter<string>();
    @Output() success: EventEmitter<string> = new EventEmitter<string>();
    passwordCopy: string;

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        const login = form.value.login;
        const firstName = form.value.first_name;
        const lastName = form.value.last_name;
        const password = form.value.password;

        const authObservable = this.authenticationService.signUp(login, firstName, lastName, password);
        authObservable.subscribe(
            _ => {
                this.authenticationService.login(login, password).subscribe(
                    _ => {
                        this.router.navigateByUrl('/');
                    },
                    error => {
                        this.error.emit(error);
                    }
                );
            },
            error => {
                this.error.emit(error);
            }
        );
        form.reset();
    }
}
