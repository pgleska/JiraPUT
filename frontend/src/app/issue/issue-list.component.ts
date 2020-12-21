import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IssueService} from './issue.service';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {IssueAddComponent} from './issue-add.component';
import {IssueDeleteComponent} from './issue-delete.component';
import {Issue} from './issue.model';
import {IssueEditComponent} from './issue-edit.component';


@Component({
    selector: 'app-issue-list',
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
                <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openAdd()">{{'issue.list.button' | translate}}</a>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'issue.list.name' | translate}}</th>
                    <th>{{'common.edit' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let issue of service.issues$ | async">
                    <th>{{issue.name}}</th>
                    <td><a (click)="openEdit(issue)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(issue)"><i class="fa fa-trash fa-2x btn"></i></a></td>
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
export class IssueListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public service: IssueService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.service.getIssueList().subscribe(result => {
                this.service.allIssueList = result;
                this.service.search$.next();
            }
        );

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
        const modalRef = this.modalService.open(IssueAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(issue: Issue) {
        const modalRef = this.modalService.open(IssueDeleteComponent);
        modalRef.componentInstance.issue = issue;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openEdit(issue: Issue) {
        const modalRef = this.modalService.open(IssueEditComponent);
        modalRef.componentInstance.issue = issue;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
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
