import {Component} from '@angular/core';
import {PositionService} from './position.service';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';

@Component({
    selector: 'app-position-list',
    template: `
        <form>
            <div class="form-group form-inline">
                Full text search: <input class="form-control ml-2" type="text" name="searchTerm" [ngModel]
                                         (ngModelChange)="onSearch($event)"/>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'position.name' | translate}}</th>
                    <th scope="col" sortable="minimumSalary" (sort)="onSort($event)">{{'position.minimum-salary' | translate}}</th>
                    <th scope="col" sortable="maximumSalary" (sort)="onSort($event)">{{'position.maximum-salary' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let position of service.positions$ | async">
                    <td>{{position.nameDisplay}}</td>
                    <td>{{position.minimumSalary}}</td>
                    <td>{{position.maximumSalary}}</td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="service.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>

        </form>
    `
})
export class PositionListComponent {

    pageSize = PAGE_SIZE;

    constructor(public service: PositionService) {
        this.service.getPositionList().subscribe(result => {
                this.service.allPositionList = result;
            }
        );
    }

    onSort($event: SortEvent) {
        this.service.state.sortColumn = $event.column;
        this.service.state.sortDirection = $event.direction;
        this.service.search$.next();
    }

    onSearch($event: string) {
        this.service.state.searchTerm = $event;
        this.service.search$.next();
    }

    onPage($event: number) {
        this.service.state.page = $event;
        this.service.search$.next();
    }
}
