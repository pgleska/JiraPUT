import {Component, EventEmitter, forwardRef, HostListener, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IDropdownSettings} from './multiselect.model';
import {ListFilterPipe} from './list-filter.pipe';
import {SelectItem} from '../select/select-item.model';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
};
const noop = () => {
};

// Multiselect base on https://github.com/NileshPatel17/ng-multiselect-dropdown

@Component({
    selector: 'app-multiselect',
    template: `
    <div tabindex="0" (blur)="onTouched()" class="multiselect-dropdown" (clickOutside)="closeDropdown()">
      <div>
        <span tabindex="-1" class="dropdown-btn" (click)="toggleDropdown($event)">
          <span *ngIf="selectedItems.length == 0">{{_placeholder}}</span>
          <span class="selected-item" *ngFor="let item of selectedItems;trackBy: trackByFn;let k = index" [hidden]="k > _settings.itemsShowLimit-1">
            {{item.name}}
            <a style="padding-top:2px;padding-left:2px;color:white" (click)="onItemClick($event,item)">x</a>
          </span>
          <span [ngClass]="{ 'dropdown-multiselect--active': _settings.defaultOpen }" style="float:right !important;padding-right:4px">
            <span style="padding-right: 15px;" *ngIf="itemShowRemaining()>0">+{{itemShowRemaining()}}</span>
            <span class="dropdown-multiselect__caret"></span>
          </span>
        </span>
      </div>
      <div class="dropdown-list" [hidden]="!_settings.defaultOpen">
        <ul class="item1">
          <li (click)="toggleSelectAll()" *ngIf="(_data.length > 0 || _settings.allowRemoteDataSearch) && _settings.enableCheckAll" class="multiselect-item-checkbox" style="border-bottom: 1px solid #ccc;padding:10px">
            <input type="checkbox" aria-label="multiselect-select-all" [checked]="isAllItemsSelected()"/>
            <div>{{!isAllItemsSelected() ? _settings.selectAllText : _settings.unSelectAllText}}</div>
          </li>
          <li class="filter-textbox" *ngIf="(_data.length>0 || _settings.allowRemoteDataSearch) && _settings.allowSearchFilter">
            <input type="text" aria-label="multiselect-search" [placeholder]="_settings.searchPlaceholderText" [(ngModel)]="filter.name" (ngModelChange)="onFilterTextChange($event)">
          </li>
        </ul>
        <ul class="item2" [style.maxHeight]="_settings.maxHeight+'px'">
          <li *ngFor="let item of _data | multiSelectFilter:filter; let i = index;" (click)="onItemClick($event,item)" class="multiselect-item-checkbox">
            <input type="checkbox" [attr.aria-label]="item.name" [checked]="isSelected(item)" />
            <div>{{item.name}}</div>
          </li>
          <li class='no-data' *ngIf="_data.length == 0 && !_settings.allowRemoteDataSearch">
            <h5>{{_settings.noDataAvailablePlaceholderText}}</h5>
          </li>
        </ul>
      </div>
    </div>
    `,
    styleUrls: ['./multiselect.component.scss'],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
})
export class MultiSelectComponent implements ControlValueAccessor {
    public _settings: IDropdownSettings;
    public _data: SelectItem[] = [];
    public selectedItems: SelectItem[] = [];
    _placeholder = 'Select';
    filter: SelectItem = {id: undefined, name: undefined};
    defaultSettings: IDropdownSettings = {
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: false,
        clearSearchFilter: true,
        maxHeight: 197,
        itemsShowLimit: 999999999999,
        searchPlaceholderText: 'Search',
        noDataAvailablePlaceholderText: 'No data available',
        showSelectedItemsAtTop: false,
        defaultOpen: false,
        allowRemoteDataSearch: false
    };

    @Input()
    public set placeholder(value: string) {
        if (value) {
            this._placeholder = value;
        } else {
            this._placeholder = 'Select';
        }
    }

    @Input()
    public set settings(value: IDropdownSettings) {
        if (value) {
            this._settings = Object.assign(this.defaultSettings, value);
        } else {
            this._settings = Object.assign(this.defaultSettings);
        }
    }

    @Input()
    public set data(value: SelectItem[]) {
        if (!value) {
            this._data = [];
        } else {
            this._data = value
        }
    }

    @Output('onFilterChange')
    onFilterChange: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();
    @Output('onDropDownClose')
    onDropDownClose: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    @Output('onSelect')
    onSelect: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    @Output('onDeSelect')
    onDeSelect: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    @Output('onSelectAll')
    onSelectAll: EventEmitter<SelectItem[]> = new EventEmitter<SelectItem[]>();

    @Output('onDeSelectAll')
    onDeSelectAll: EventEmitter<SelectItem[]> = new EventEmitter<SelectItem[]>();

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    onFilterTextChange($event) {
        this.onFilterChange.emit($event);
    }

    constructor(private listFilterPipe: ListFilterPipe) {
    }

    onItemClick($event: any, item: SelectItem) {
        const found = this.isSelected(item);
        if (!found) {
            this.addSelected(item);
        } else {
            this.removeSelected(item);
        }
    }

    writeValue(value: SelectItem[]) {
        if (value !== undefined && value !== null && value.length > 0) {
            this.selectedItems = value;
        } else {
            this.selectedItems = [];
        }
        this.onChangeCallback(value);
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // Set touched on blur
    @HostListener('blur')
    public onTouched() {
        this.closeDropdown();
        this.onTouchedCallback();
    }

    trackByFn(index, item) {
        return item.id;
    }

    isSelected(clickedItem: SelectItem) {
        let found = false;
        this.selectedItems.forEach(item => {
            if (clickedItem.id === item.id) {
                found = true;
            }
        });
        return found;
    }

    isAllItemsSelected(): boolean {
        let filteredItems = this.listFilterPipe.transform(this._data, this.filter);
        if ((!this.data || this.data.length === 0) && this._settings.allowRemoteDataSearch) {
            return false;
        }
        return filteredItems.length === this.selectedItems.length;
    }

    itemShowRemaining(): number {
        return this.selectedItems.length - this._settings.itemsShowLimit;
    }

    addSelected(item: SelectItem) {
        this.selectedItems.push(item);
        this.onChangeCallback(this.emittedValue(this.selectedItems));
        this.onSelect.emit(this.emittedValue(item));
    }

    removeSelected(itemSel: SelectItem) {
        this.selectedItems.forEach(item => {
            if (itemSel.id === item.id) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        });
        this.onChangeCallback(this.emittedValue(this.selectedItems));
        this.onDeSelect.emit(this.emittedValue(itemSel));
    }

    emittedValue(val: any): any {
        const selected = [];
        if (Array.isArray(val)) {
            val.forEach(item => {
                selected.push(item);
            });
        } else {
            if (val) {
                return val;
            }
        }
        return selected;
    }

    toggleDropdown(evt) {
        evt.preventDefault();
        this._settings.defaultOpen = !this._settings.defaultOpen;
        if (!this._settings.defaultOpen) {
            this.onDropDownClose.emit();
        }
    }

    closeDropdown() {
        this._settings.defaultOpen = false;
        // clear search text
        if (this._settings.clearSearchFilter) {
            this.filter.name = '';
        }
        this.onDropDownClose.emit();
    }

    toggleSelectAll() {
        if (!this.isAllItemsSelected()) {
            // filter out disabled item first before slicing
            this.selectedItems = this.listFilterPipe.transform(this._data, this.filter).slice();
            this.onSelectAll.emit(this.emittedValue(this.selectedItems));
        } else {
            this.selectedItems = [];
            this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
        }
        this.onChangeCallback(this.emittedValue(this.selectedItems));
    }

    getFields(inputData) {
        const fields = [];
        if (typeof inputData !== 'object') {
            return fields;
        }
        for (const prop in inputData) {
            fields.push(prop);
        }
        return fields;
    }
}
