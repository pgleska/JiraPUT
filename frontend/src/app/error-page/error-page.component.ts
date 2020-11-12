import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-error-page',
    template: `
        <h1 class="text-center">{{errorMessage}}</h1>
    `
})
export class ErrorPageComponent implements OnInit {
    errorMessage: string;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => this.errorMessage = data.message);
    }

}
