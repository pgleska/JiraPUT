import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationComponent} from './authentication/authentication.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {PositionListComponent} from './position/position-list.component';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {EmployeeListComponent} from './employee/employee-list.component';
import {EmployeeDetailsComponent} from './employee/employee-details.component';
import {TeamListComponent} from './team/team-list.component';
import {TeamDetailsComponent} from './team/team-details.component';
import {TechnologyListComponent} from './technology/technology-list.component';
import {CompanyListComponent} from './company/company-list.component';
import {CompanyDetailsComponent} from './company/company-details.component';
import {ProjectListComponent} from './project/project-list.component';
import {ContractListComponent} from './contract/contract-list.component';
import {ProjectDetailsComponent} from './project/project-details.component';
import {ContractDetailsComponent} from './contract/contract-details.component';
import {IssueListComponent} from './issue/issue-list.component';
import {IssueDetailsComponent} from './issue/issue-details.component';
import {TechnologyDetailsComponent} from './technology/technology-details.component';
import {MainPageComponent} from './main-page/main-page.component';


const routes: Routes = [
    {path: '', component: MainPageComponent, canActivate: [AuthenticationGuard]},
    {path: 'login', component: AuthenticationComponent},
    {path: 'error', component: ErrorPageComponent, data: {message: 'Page not found!'}},
    {path: 'position', component: PositionListComponent, canActivate: [AuthenticationGuard]},
    {path: 'employee', component: EmployeeListComponent, canActivate: [AuthenticationGuard]},
    {path: 'employee/:login', component: EmployeeDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'team', component: TeamListComponent, canActivate: [AuthenticationGuard]},
    {path: 'team/:name', component: TeamDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'technology', component: TechnologyListComponent, canActivate: [AuthenticationGuard]},
    {path: 'technology/:id', component: TechnologyDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'company', component: CompanyListComponent, canActivate: [AuthenticationGuard]},
    {path: 'company/:taxNumber', component: CompanyDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'project', component: ProjectListComponent, canActivate: [AuthenticationGuard]},
    {path: 'project/:id', component: ProjectDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'contract', component: ContractListComponent, canActivate: [AuthenticationGuard]},
    {path: 'contract/:id', component: ContractDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: 'issue', component: IssueListComponent, canActivate: [AuthenticationGuard]},
    {path: 'issue/:issueId', component: IssueDetailsComponent, canActivate: [AuthenticationGuard]},
    {path: '**', redirectTo: '/error'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
