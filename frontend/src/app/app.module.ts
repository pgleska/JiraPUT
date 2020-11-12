import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './navbar/navbar.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {FormsModule} from '@angular/forms';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HttpClientModule} from '@angular/common/http';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {AuthenticationSignUpComponent} from './authentication/authentication-signup.component';
import {AuthenticationLoginComponent} from './authentication/authentication-login.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        AuthenticationComponent,
        ErrorPageComponent,
        LoadingSpinnerComponent,
        AuthenticationSignUpComponent,
        AuthenticationLoginComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule
    ],
    providers: [AuthenticationGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
