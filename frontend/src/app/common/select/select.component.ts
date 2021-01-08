import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectItem} from './select-item.model';

@Component({
    selector: 'app-select',
    template: `
        <div class="form-group app-select">
            <label for="dropdown">{{label}}</label>
            <select class="form-control" name="dropdown" [ngModel]="undefined"
                    (ngModelChange)="onChange($event)">
                <option [ngValue]="undefined" selected>{{"common.choose" | translate}}</option>
                <option *ngFor="let option of options" [ngValue]="option">{{option.name}}</option>
            </select>

        </div>
    `,
    styleUrls:['./select.component.scss']
})
export class SelectComponent {
    @Input() label: string;
    @Input() options: SelectItem[];
    @Output() value: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    onChange($event: SelectItem) {
        this.value.next($event);
    }
}
