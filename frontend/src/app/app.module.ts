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
import {SalaryRangeValidatorDirective} from './common/validators/salary-range-validator.directive';
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
import {TechnologyAddComponent} from './technology/technology-add.component';
import {TechnologyDeleteComponent} from './technology/technology-delete.component';
import {TechnologyEditComponent} from './technology/technology-edit.component';
import {TechnologyListComponent} from './technology/technology-list.component';
import {CompanyAddComponent} from './company/company-add.component';
import {CompanyDeleteComponent} from './company/company-delete.component';
import {CompanyEditComponent} from './company/company-edit.component';
import {CompanyListComponent} from './company/company-list.component';
import {GreaterThanValidatorDirective} from './common/validators/greater-than-validator.directive';
import {NegativeValueValidatorDirective} from './common/validators/negative-value-validator.directive';
import {TeamEditComponent} from './team/team-edit.component';
import {CompanyDetailsComponent} from './company/company-details.component';
import {ProjectListComponent} from './project/project-list.component';
import {ProjectAddComponent} from './project/project-add.component';
import {ProjectEditComponent} from './project/project-edit.component';
import {ProjectDeleteComponent} from './project/project-delete.component';
import {ContractAddComponent} from './contract/contract-add.component';
import {ContractDeleteComponent} from './contract/contract-delete.component';
import {ContractListComponent} from './contract/contract-list.component';
import {TaxNumberDirective} from './common/validators/tax-number.directive';
import {ContractDetailsComponent} from './contract/contract-details.component';
import {ProjectDetailsComponent} from './project/project-details.component';
import {EmployeeEditComponent} from './employee/employee-edit.component';
import {TeamDeleteComponent} from './team/team-delete.service';
import {EmployeeDeleteComponent} from './employee/employee-delete.component';
import {IssueAddComponent} from './issue/issue-add.component';
import {IssueDeleteComponent} from './issue/issue-delete.component';
import {IssueEditComponent} from './issue/issue-edit.component';
import {IssueListComponent} from './issue/issue-list.component';
import {IssueDetailsComponent} from './issue/issue-details.component';
import {DatepickerComponent} from './common/datepicker/datepicker.component';
import {SelectComponent} from './common/select/select.component';
import {ClickOutsideDirective} from './common/multiselect/click-outside.directive';
import {ListFilterPipe} from './common/multiselect/list-filter.pipe';
import {MultiSelectComponent} from './common/multiselect/multiselect.component';
import {TechnologyDetailsComponent} from './technology/technology-details.component';
import {TechnologyTagComponent} from './technology/technology-tag/technology-tag.component';
import {MainPageComponent} from './main-page/main-page.component';

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
        EmployeeDeleteComponent,
        EmployeeEditComponent,
        PositionDeleteComponent,
        PositionAddComponent,
        PositionEditComponent,
        PositionListComponent,
        SalaryRangeValidatorDirective,
        UrlValidatorDirective,
        OnlyLettersValidatorDirective,
        TeamDetailsComponent,
        TeamListComponent,
        TeamEditComponent,
        TeamDeleteComponent,
        SortableDirective,
        PaginationComponent,
        TeamAddComponent,
        TechnologyAddComponent,
        TechnologyDeleteComponent,
        TechnologyEditComponent,
        TechnologyListComponent,
        TechnologyDetailsComponent,
        TechnologyTagComponent,
        CompanyAddComponent,
        CompanyDeleteComponent,
        CompanyEditComponent,
        CompanyListComponent,
        CompanyDetailsComponent,
        GreaterThanValidatorDirective,
        NegativeValueValidatorDirective,
        ProjectListComponent,
        ProjectAddComponent,
        ProjectEditComponent,
        ProjectDeleteComponent,
        ProjectDetailsComponent,
        ContractAddComponent,
        ContractDeleteComponent,
        ContractListComponent,
        ContractDetailsComponent,
        TaxNumberDirective,
        IssueAddComponent,
        IssueDeleteComponent,
        IssueEditComponent,
        IssueListComponent,
        IssueDetailsComponent,
        DatepickerComponent,
        SelectComponent,
        ClickOutsideDirective,
        ListFilterPipe,
        MultiSelectComponent,
        MainPageComponent
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
        ListFilterPipe,
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
