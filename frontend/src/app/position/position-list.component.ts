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
                <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openAdd()">Dodaj pozycje</a>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'position.name' | translate}}</th>
                    <th scope="col" sortable="minimumSalary" (sort)="onSort($event)">{{'position.minimum-salary' | translate}}</th>
                    <th scope="col" sortable="maximumSalary" (sort)="onSort($event)">{{'position.maximum-salary' | translate}}</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let position of service.positions$ | async">
                    <th>{{position.nameDisplay}}</th>
                    <td>{{position.minimumSalary}}</td>
                    <td>{{position.maximumSalary}}</td>
                    <td><a (click)="openEdit(position)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(position)"><i class="fa fa-trash fa-2x btn"></i></a></td>
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
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    error_message: string;
    success_message: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;

    constructor(public service: PositionService,
                private modalService: NgbModal) {
        this.service.getPositionList().subscribe(result => {
                this.service.allPositionList = result;
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

    openAdd() {
        const modalRef = this.modalService.open(PositionAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {});
    }

    openDelete(position: Position) {
        const modalRef = this.modalService.open(PositionDeleteComponent);
        modalRef.componentInstance.position = position;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {});
    }

    openEdit(position: Position) {
        const modalRef = this.modalService.open(PositionEditComponent);
        modalRef.componentInstance.position = position;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {});
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.error_message = result;
            this.errorSubject.next(result);
        } else {
            this.success_message = result;
            this.successSubject.next(result);
        }
    }

}
