import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Subject} from 'rxjs';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from 'rxjs/operators';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {EmployeeService} from './employee.service';

@Component({
    selector: 'app-employee-list',
    template: `
        <ngb-alert #errorAlert
                   *ngIf="error_message"
                   [type]="'danger'"
                   [dismissible]="false"
                   (closed)=" error_message = ''"
                   class="text-center">
            {{error_message | translate}}
        </ngb-alert>
        <ngb-alert #successAlert
                   *ngIf="success_message"
                   [type]="'success'"
                   [dismissible]="false"
                   (closed)=" success_message = ''"
                   class="text-center">
            {{success_message | translate}}
        </ngb-alert>
        <form>
            <div class="form-group form-inline">
                Full text search: <input class="form-control ml-2" type="text" name="searchTerm" [ngModel]
                                         (ngModelChange)="onSearch($event)"/>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="firstName" (sort)="onSort($event)">{{'employee.list.first-name' | translate}}</th>
                    <th scope="col" sortable="lastName" (sort)="onSort($event)">{{'employee.list.last-name' | translate}}</th>
                    <th scope="col" sortable="positionDisplay" (sort)="onSort($event)">{{'employee.list.position' | translate}}</th>
                    <th scope="col" sortable="team" (sort)="onSort($event)">{{'employee.list.team' | translate}}</th>
                    <th>{{'employee.list.details' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let employee of service.employees$ | async">
                    <th>{{employee.firstName}}</th>
                    <td>{{employee.lastName}}</td>
                    <td>{{employee.positionDisplay}}</td>
                    <td>{{employee.team}}</td>
                    <td><a routerLink="/employee/{{employee.login}}">{{'employee.list.details' | translate}}</a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="service.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>`
})
export class EmployeeListComponent implements OnInit, OnDestroy {
    pageSize = PAGE_SIZE;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    error_message: string;
    success_message: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;

    constructor(public service: EmployeeService) {
        this.service.getEmployeeList().subscribe(result => {
                this.service.allEmployeeList = result;
                this.service.search$.next();
            }
        );
    }

    ngOnInit(): void {
        this.errorSubject.pipe(debounceTime(10000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(10000)).subscribe(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        });
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSort($event: SortEvent) {
        this.headers.forEach(header => {
                if (header.sortable !== $event.column) {
                    header.direction = '';
                }
            }
        );

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
