import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectItem} from './select-item.model';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'app-select',
    template: `
        <div class="form-group app-select">
            <label for="name">{{label}}</label>
            <select class="form-control" [name]="name" #dropdown="ngModel"[ngModel]="defaultValue" [required]=""
                    (ngModelChange)="onChange($event)">
                <option [ngValue]="undefined" selected>{{"common.choose" | translate}}</option>
                <option *ngFor="let option of options" [ngValue]="option">{{option.name}}</option>
            </select>
            <app-input-error [control]="dropdown.control"></app-input-error>
        </div>
    `,
    styleUrls:['./select.component.scss'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class SelectComponent {
    @Input() label: string;
    @Input() name: string = '';
    @Input() options: SelectItem[];
    @Input() defaultValue: SelectItem = undefined
    @Input() required: boolean = true;
    @Output() value: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    onChange($event: SelectItem) {
        this.value.next($event);
    }
}
