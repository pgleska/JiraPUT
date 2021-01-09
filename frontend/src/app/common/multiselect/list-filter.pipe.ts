import {Pipe, PipeTransform} from '@angular/core';
import {SelectItem} from '../select/select-item.model';


@Pipe({
    name: 'multiSelectFilter',
    pure: false
})
export class ListFilterPipe implements PipeTransform {
    transform(items: SelectItem[], filter: SelectItem): SelectItem[] {
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: SelectItem) => this.applyFilter(item, filter));
    }

    applyFilter(item: SelectItem, filter: SelectItem): boolean {
        if (typeof item.name === 'string' && typeof filter.name === 'string') {
            return !(filter.name && item.name && item.name.toLowerCase().indexOf(filter.name.toLowerCase()) === -1);
        } else {
            return !(filter.name && item.name && item.name.toString().toLowerCase().indexOf(filter.name.toString().toLowerCase()) === -1);
        }
    }
}
