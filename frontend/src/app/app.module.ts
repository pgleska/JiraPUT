import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './navbar/navbar.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {FormsModule} from '@angular/forms';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {AuthenticationSignUpComponent} from './authentication/authentication-signup.component';
import {AuthenticationLoginComponent} from './authentication/authentication-login.component';
import {InputErrorComponent} from './common/input-error/input-error.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EqualsValidatorDirective} from './common/validators/equals-validator.directive';
import {EmployeeDetailsComponent} from './employee/employee-details.component';
import {EmployeeListComponent} from './employee/employee-list.component';
import {PositionDeleteComponent} from './position/position-delete.component';
import {PositionListComponent} from './position/position-list.component';
import {SalaryValidatorDirective} from './common/validators/salary-validator.directive';
import {TokenInterceptor} from './authentication/token.interceptor';
import {UrlValidatorDirective} from './common/validators/url-validator.directive';
import {OnlyLettersValidatorDirective} from './common/validators/only-letters-validator.directive';
import {TeamDetailsComponent} from './team/team-details.component';
import {TeamListComponent} from './team/team-list.component';
import {SortableDirective} from './common/list-components/sort/sortable.directive';
import {PaginationComponent} from './common/list-components/pagination/pagination.component';
import {CommonModule} from '@angular/common';
import {PositionAddComponent} from './position/position-add.component';
import {PositionEditComponent} from './position/position-edit.component';
import {TeamAddComponent} from './team/team-add.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        AuthenticationComponent,
        ErrorPageComponent,
        AuthenticationSignUpComponent,
        AuthenticationLoginComponent,
        InputErrorComponent,
        EqualsValidatorDirective,
        EmployeeDetailsComponent,
        EmployeeListComponent,
        PositionDeleteComponent,
        PositionAddComponent,
        PositionEditComponent,
        PositionListComponent,
        SalaryValidatorDirective,
        UrlValidatorDirective,
        OnlyLettersValidatorDirective,
        TeamDetailsComponent,
        TeamListComponent,
        SortableDirective,
        PaginationComponent,
        TeamAddComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AuthenticationGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
