import {Component, EventEmitter, Input, Output} from '@angular/core';

export const PAGE_SIZE: number = 10;

@Component({
    selector: 'app-pagination',
    template: `
        <div class="d-flex justify-content-between p-2">
            <ngb-pagination
                    [collectionSize]="totalElements"
                    [pageSize]="pageSize"
                    (pageChange)="page.emit($event)"
            >
            </ngb-pagination>
        </div>
    `
})
export class PaginationComponent {
    @Input() totalElements: number;
    @Output() page: EventEmitter<number> = new EventEmitter<number>();
    pageSize: number = PAGE_SIZE;
}
