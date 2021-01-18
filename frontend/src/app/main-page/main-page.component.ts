import {Component} from '@angular/core';

@Component({
    selector: 'app-main-page',
    template: `
        <div>
            <div>
                <h1 class="text-center">
                    Witamy w JiraPUT!
                </h1>
            </div>
            <div>
                <h1 class="text-center">
                    Wybierz gdzie chciałbyś przejść:
                </h1>
            </div>
            <div class="container mx-auto w-50">
                <div class="row justify-content-around">
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/employee">{{'navbar.employees' | translate}}</a>
                    </div>
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block" routerLink="/team">{{'navbar.team' | translate}}</a>
                    </div>
                </div>
                <div class="row justify-content-around">
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/project">{{'navbar.project' | translate}}</a>
                    </div>
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block" routerLink="/issue">{{'navbar.issue' | translate}}</a>
                    </div>
                </div>
                <div class="row justify-content-around">
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/company">{{'navbar.company' | translate}}</a>
                    </div>
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/contract">{{'navbar.contract' | translate}}</a>
                    </div>
                </div>
                <div class="row justify-content-around">
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/position">{{'navbar.positions' | translate}}</a>
                    </div>
                    <div class="col-sm my-3">
                        <a class="my-2 my-sm-0 mr-1 btn btn-lg btn-primary d-block"
                           routerLink="/technology">{{'navbar.technology' | translate}}</a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MainPageComponent {
}
