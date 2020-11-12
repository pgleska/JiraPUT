import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationComponent} from './authentication/authentication.component';
import {ErrorPageComponent} from './error-page/error-page.component';


const routes: Routes = [

    {path: 'login', component: AuthenticationComponent},
    {path: 'error', component: ErrorPageComponent, data: {message: 'Page not found!'}},
    {path: '**', redirectTo: '/error'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}