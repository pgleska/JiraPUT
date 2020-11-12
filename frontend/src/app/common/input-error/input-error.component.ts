import {FormControl} from '@angular/forms';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-input-error',
    template: `
        <div class="text-danger" *ngIf="control && control.errors && (control.dirty || control.touched)">
            <div *ngIf="control.errors.required"><small>{{'error.required' | translate}}</small></div>
            <div *ngIf="control.errors.minlength"><small>{{'error.min-length' | translate}}</small></div>
            <div *ngIf="control.errors.password"><small>{{'error.password' | translate}}</small></div>
        </div>
    `
})
export class InputErrorComponent {
    @Input('control') control: FormControl;
}
