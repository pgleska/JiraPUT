import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PositionService} from './position.service';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionEditComponent} from './position-edit.component';
import {PositionDeleteComponent} from './position-delete.component';
import {PositionAddComponent} from './position-add.component';
import {Position} from './position.model';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';


@Component({
    selector: 'app-position-list',
    template: `
        <div class="my-2">
            <ngb-alert #errorAlert
                       *ngIf="errorMessage"
                       [type]="'danger'"
                       [dismissible]="false"
                       (closed)=" errorMessage = ''"
                       class="text-center" xmlns="http://www.w3.org/1999/html">
                {{errorMessage | translate}}
            </ngb-alert>
            <ngb-alert #successAlert
                       *ngIf="successMessage"
                       [type]="'success'"
                       [dismissible]="false"
                       (closed)=" successMessage = ''"
                       class="text-center">
                {{successMessage | translate}}
            </ngb-alert>
        </div>
        <form>
            <div class="form-group d-flex flex-row justify-content-between border rounded mt-3 px-2">
                <div class="p-2">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2">
                    <label for="minimumSalary">{{'position.list.minimum-salary' | translate}}</label>
                    <input class="form-control" type="number" name="minimumSalary" [ngModel]
                           (ngModelChange)="onMinimumSalary($event)"/>
                </div>
                <div class="p-2">
                    <label for="maximumSalary">{{'position.list.maximum-salary' | translate}}</label>
                    <input class="form-control" type="number" name="maximumSalary" [ngModel]
                           (ngModelChange)="onMaximumSalary($event)"/>
                </div>
                <div class="p-2 mt-3">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'position.list.button' | translate}}</a>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'position.list.name' | translate}}</th>
                    <th scope="col" sortable="minimumSalary" (sort)="onSort($event)">{{'position.list.minimum-salary' | translate}}</th>
                    <th scope="col" sortable="maximumSalary" (sort)="onSort($event)">{{'position.list.maximum-salary' | translate}}</th>
                    <th>{{'common.edit' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let position of service.positions$ | async">
                    <th>{{position.nameDisplay}}</th>
                    <td>{{position.minimumSalary}}</td>
                    <td>{{position.maximumSalary}}</td>
                    <td><a (click)="openEdit(position)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td>
                        <a *ngIf="position.nameDisplay !== 'None'" (click)="openDelete(position)">
                            <i *ngIf="position.nameDisplay !== 'None'" class="fa fa-trash fa-2x btn"></i>
                        </a>
                    </td>
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
export class PositionListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    private minimumSalary: number;
    private maximumSalary: number;
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(public service: PositionService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.service.getPositionList().subscribe(result => {
                this.service.allPositionList = result;
                this.service.filterPositionList(this.minimumSalary, this.maximumSalary);
                this.service.search$.next();
            }
        );

        this.errorSubject.pipe(debounceTime(2000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(2000)).subscribe(() => {
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

    onMinimumSalary($event: number) {
        this.minimumSalary = $event;
        this.service.filterPositionList(this.minimumSalary, this.maximumSalary);
        this.service.search$.next();
    }

    onMaximumSalary($event: number) {
        this.maximumSalary = $event;
        this.service.filterPositionList(this.minimumSalary, this.maximumSalary);
        this.service.search$.next();
    }

    onPage($event: number) {
        this.service.state.page = $event;
        this.service.search$.next();
    }

    openAdd() {
        const modalRef = this.modalService.open(PositionAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(position: Position) {
        const modalRef = this.modalService.open(PositionDeleteComponent);
        modalRef.componentInstance.position = position;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openEdit(position: Position) {
        const modalRef = this.modalService.open(PositionEditComponent);
        modalRef.componentInstance.position = position;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            this.successMessage = result;
            this.successSubject.next(result);
            setTimeout(window.location.reload.bind(window.location), 2000);
        }
    }

}
