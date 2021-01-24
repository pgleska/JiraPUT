import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-authentication',
    template: `
        <div class="row justify-content-md-center mt-4">
            <div class="col-xs-12 col-md-6 col-md-offset-3">
                <ngb-alert #errorAlert
                           *ngIf="error_message"
                           [type]="'danger'"
                           [dismissible]="false"
                           (closed)=" error_message = ''"
                           class="text-center">
                    {{error_message | translate}}
                </ngb-alert>
                <ngb-alert #successAlert
                           *ngIf="success_message"
                           [type]="'success'"
                           [dismissible]="false"
                           (closed)=" success_message = ''"
                           class="text-center">
                    {{success_message | translate}}
                </ngb-alert>
                <div *ngIf="isLoginMode">
                    <app-authentication-login (error)="onError($event)"></app-authentication-login>
                </div>
                <div *ngIf="!isLoginMode">
                    <app-authentication-sign-up (success)="onSuccess($event)" (error)="onError($event)"></app-authentication-sign-up>
                </div>
                <div class="font-italic small" *ngIf="!isLoginMode">
                    {{'authentication.account' | translate}}
                    <a (click)="switchMode()" class="font-weight-bold" style="cursor: pointer">{{'authentication.log-in' | translate}}</a>
                </div>
                <div class="font-italic small" *ngIf="isLoginMode">
                    {{'authentication.no-account' | translate}}&nbsp;
                    <a (click)="switchMode()" class="font-weight-bold" style="cursor: pointer">{{'authentication.sign-up' | translate}}</a>
                </div>
            </div>
        </div>
    `
})
export class AuthenticationComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    error_message: string;
    success_message: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user) {
            this.router.navigateByUrl('/');
        }

        this.errorSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        });

    }

    switchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onError($event: string) {
        this.error_message = $event
        this.errorSubject.next($event);
    }

    onSuccess($event: string) {
        this.success_message = $event;
        this.successSubject.next($event);
        this.isLoginMode = true;
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }
}
