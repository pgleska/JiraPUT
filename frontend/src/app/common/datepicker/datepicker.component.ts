import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-datepicker',
    template: `
        <div class="form-group">
            <label for="dp">{{label}}</label>
            <div class="input-group">
                <input class="form-control" placeholder="yyyy-mm-dd" [readonly]="true"
                       name="dp" [ngModel]="splitString(initialDate)" (ngModelChange)="onDateChange($event)" ngbDatepicker
                       #d="ngbDatepicker">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary calendar" (click)="d.toggle()" type="button"></button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {
    @Input() label: string;
    @Input() initialDate: string;
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
