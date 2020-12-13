import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a routerLink="/" class="navbar-brand">{{'navbar.title' | translate}}</a>
                </div>
                <div class="navbar">
                    <ul class="nav">
                        <li *ngIf="isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/team">{{'navbar.team' | translate}}</a>
                        </li>
                        <li *ngIf="isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/employee">{{'navbar.employees' | translate}}</a>
                        </li>
                        <li *ngIf="isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/positions">{{'navbar.positions' | translate}}</a>
                        </li>
                        <li *ngIf="!isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/login">{{'navbar.log-in' | translate}}</a>
                        </li>
                        <li *ngIf="isAuthenticated" class="nav-item mr-2 ml-2">
                            <a class="my-2 my-sm-0 mr-1 btn btn-outline-light" routerLink="/"
                               (click)="onLogout()">{{'navbar.log-out' | translate}}</a>
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
        this.userSub = this.authenticationService.user.subscribe(user => {
            this.isAuthenticated = user;
        });
    }

    onLogout(): void {
        this.authenticationService.logout();
        this.isAuthenticated = false;
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

}
