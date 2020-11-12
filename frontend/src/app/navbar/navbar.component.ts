import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a routerLink="/" class="navbar-brand">JiraPUT</a>
                </div>
                <div class="navbar">
                    <ul class="nav">
                        <li *ngIf="!isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/login">Zaloguj się</a>
                        </li>
                        <li *ngIf="isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/" (click)="onLogout()">Wyloguj się</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `
})

export class NavbarComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub: Subscription;

    constructor(private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.userSub = this.authenticationService.user.subscribe(user =>
            this.isAuthenticated = !!sessionStorage.getItem('userData') || user
        );
    }

    onLogout(): void {
        this.authenticationService.logout();
        this.isAuthenticated = false;
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

}
