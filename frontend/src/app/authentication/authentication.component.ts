import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-authentication',
    template: `
        <div class="row justify-content-md-center mt-4">
            <div class="col-xs-12 col-md-6 col-md-offset-3">
                <div *ngIf="isLoading" style="text-align: center;">
                    <app-loading-spinner></app-loading-spinner>
                </div>
                <div *ngIf="isLoginMode">
                    <app-authentication-login></app-authentication-login>
                </div>
                <div *ngIf="!isLoginMode">
                    <app-authentication-sign-up></app-authentication-sign-up>
                </div>
                <div class="font-italic small" *ngIf="!isLoginMode">
                    {{'authentication.account' | translate}}
                    <a (click)="switchMode()" class="font-weight-bold">{{'authentication.log-in' | translate}}</a>
                </div>
                <div class="font-italic small" *ngIf="isLoginMode">
                    {{'authentication.no-account' | translate}}&nbsp; 
                    <a (click)="switchMode()" class="font-weight-bold">{{'authentication.sign-up' | translate}}</a>
                </div>
            </div>
        </div>
    `
})
export class AuthenticationComponent implements OnInit {
    isLoginMode = true;
    isLoading = false;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user) {
            this.router.navigateByUrl('/');
        }
    }

    switchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }
}
