import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'app-datepicker',
    template: `
        <div class="form-group">
            <label [for]="name">{{label}}</label>
            <div class="input-group">
                <input class="form-control" placeholder="yyyy-mm-dd" [readonly]="true" [required]="required"
                       [name]="name" [ngModel]="splitString(initialDate)" (ngModelChange)="onDateChange($event)" ngbDatepicker
                       #d="ngbDatepicker">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary calendar" (click)="d.toggle()" type="button"></button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./datepicker.component.scss'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class DatepickerComponent {
    @Input() label: string;
    @Input() initialDate: string;
    @Input() name: string = '';
    @Input() required: boolean = false;
    @Output() date: EventEmitter<string> = new EventEmitter<string>();

    onDateChange($event: NgbDateStruct): void {
        this.date.emit(`${$event.year}-${$event.month}-${$event.day}`);
    }

    splitString(date: string): NgbDateStruct {
        if (!!date) {
            const splitString = date.split('-', 2);
            return {
                year: parseInt(splitString[0]),
                month: parseInt(splitString[1]),
                day: parseInt(splitString[2])
            };
        } else {
            return undefined;
        }

    }
}
