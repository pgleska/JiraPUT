import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    template: `
        <app-navbar></app-navbar>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `
})
export class AppComponent {
    title = 'JiraPUT';
    constructor(public translate: TranslateService) {
        translate.addLangs(['pl']);
        translate.setDefaultLang('pl');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/pl/) ? browserLang : 'pl');
    }
}
