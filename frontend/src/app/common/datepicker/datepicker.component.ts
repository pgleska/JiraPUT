import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-datepicker',
    template: `
        <div class="input-group">
            <input class="form-control" placeholder="yyyy-mm-dd"
                   name="dp" [ngModel] (ngModelChange)="date.emit($event)" ngbDatepicker #d="ngbDatepicker">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary calendar" (click)="d.toggle()" type="button"></button>
            </div>
        </div>
    `,
    styleUrls:['./datepicker.component.scss']
})
export class DatepickerComponent {
    @Output() date: EventEmitter<Date> = new EventEmitter<Date>();
}
