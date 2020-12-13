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


const routes: Routes = [

    {path: 'login', component: AuthenticationComponent},
    {path: 'error', component: ErrorPageComponent, data: {message: 'Page not found!'}},
    {path: 'positions', component: PositionListComponent, canActivate:[AuthenticationGuard]},
    {path: 'employee', component: EmployeeListComponent, canActivate:[AuthenticationGuard]},
    {path: 'employee/:login', component: EmployeeDetailsComponent, canActivate:[AuthenticationGuard]},
    {path: 'team', component: TeamListComponent, canActivate:[AuthenticationGuard]},
    {path: 'team/:name', component: TeamDetailsComponent, canActivate:[AuthenticationGuard]},
    {path: '**', redirectTo: '/error'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
