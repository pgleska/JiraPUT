import {FormControl} from '@angular/forms';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-input-error',
    template: `
        <div class="app-input-error">
            <div class="text-danger" *ngIf="control && control.errors && (control.dirty || control.touched)">
                <div *ngIf="control.errors.required"><small>{{'error.required' | translate}}</small></div>
                <div *ngIf="control.errors.minlength"><small>{{'error.minimum-length' | translate}}</small></div>
                <div *ngIf="control.errors.password"><small>{{'error.password' | translate}}</small></div>
                <div *ngIf="control.errors.salary"><small>{{'error.salary' | translate}}</small></div>
                <div *ngIf="control.errors.minimumSalary"><small>{{'error.minimum-salary' | translate}}</small></div>
                <div *ngIf="control.errors.maximumSalary"><small>{{'error.maximum-salary' | translate}}</small></div>
                <div *ngIf="control.errors.onlyLetters"><small>{{'error.only-letters' | translate}}</small></div>
                <div *ngIf="control.errors.urlEncoding"><small>{{'error.url-encoding' | translate}}</small></div>
            </div>
        </div>
    `,
    styleUrls:['./input-error.component.scss']
})
export class InputErrorComponent {
    @Input('control') control: FormControl;
}
