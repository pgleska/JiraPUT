import {FormControl} from '@angular/forms';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-input-error',
    template: `
        <div class="app-input-error">
            <div class="text-danger" *ngIf="control && control.errors && (control.dirty || control.touched)">
                <div *ngIf="control.errors.required"><small>{{'error.required' | translate}}</small></div>
                <div *ngIf="control.errors.negative"><small>{{'error.negative' | translate}}</small></div>
                <div *ngIf="control.errors.minlength"><small>{{'error.minimum-length' | translate}}</small></div>
                <div *ngIf="control.errors.maxlength"><small>{{'error.maximum-length' | translate}}</small></div>
                <div *ngIf="control.errors.notInteger"><small>{{'error.not-integer' | translate}}</small></div>
                <div *ngIf="control.errors.password"><small>{{'error.password' | translate}}</small></div>
                <div *ngIf="control.errors.salary"><small>{{'error.salary' | translate}}</small></div>
                <div *ngIf="control.errors.minimumSalary"><small>{{'error.minimum-salary' | translate}} {{control.errors.minimumSalary}}</small></div>
                <div *ngIf="control.errors.maximumSalary"><small>{{'error.maximum-salary' | translate}} {{control.errors.maximumSalary}}</small></div>
                <div *ngIf="control.errors.onlyLetters"><small>{{'error.only-letters' | translate}}</small></div>
                <div *ngIf="control.errors.urlEncoding"><small>{{'error.url-encoding' | translate}}</small></div>
                <div *ngIf="control.errors.taxNumberLength"><small>{{'error.tax-number-length' | translate}}</small></div>
                <div *ngIf="control.errors.taxNumberChecksum"><small>{{'error.tax-number-checksum' | translate}}</small></div>
                <div *ngIf="control.errors.timeInput"><small>{{'error.time-input' | translate}}</small></div>
                <div *ngIf="control.errors.maxValue"><small>{{'error.max-value' | translate}} {{control.errors.maxValue}}</small></div>

            </div>
            <div class="text-danger" *ngIf="maxLength !== -1 && control.value?.length === maxLength"><small>{{'error.maximum-length' | translate}}</small></div>
        </div>
    `,
    styleUrls:['./input-error.component.scss']
})
export class InputErrorComponent {
    @Input('control') control: FormControl;
    @Input() maxLength: number = -1;
}
