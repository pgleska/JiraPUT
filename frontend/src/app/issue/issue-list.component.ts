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
import {Issue, ISSUE_TYPES} from './issue.model';
import {IssueEditComponent} from './issue-edit.component';
import {SelectItem} from '../common/select/select-item.model';
import {convertTimeDifferenceToString, convertTimeToString} from '../common/date-transformation/convert-time.functions';


@Component({
    selector: 'app-issue-list',
    template: `
        <div class="my-2">
            <ngb-alert #errorAlert
                       *ngIf="errorMessage"
                       [type]="'danger'"
                       [dismissible]="false"
                       (closed)=" errorMessage = ''"
                       class="text-center">
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
                <div class="d-flex flex-row">
                    <div class="p-2 mx-4">
                        <label for="searchTerm">{{'common.search' | translate}}</label>
                        <input class="form-control" type="text" name="searchTerm" [ngModel]
                               (ngModelChange)="onSearch($event)"/>
                    </div>
                    <div class="p-2  mx-4">
                        <app-select [label]="'issue.list.type' | translate"
                                    [name]="'type'"
                                    [options]="types"
                                    (value)="onIssueTypeChanged($event)">
                        </app-select>
                    </div>
                </div>
                <div class="p-2 mt-3">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'issue.list.button' | translate}}</a>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="id" (sort)="onSort($event)">{{'issue.list.id' | translate}}</th>
                    <th scope="col" sortable="name" (sort)="onSort($event)">{{'issue.list.name' | translate}}</th>
                    <th scope="col" sortable="type" (sort)="onSort($event)">{{'issue.list.type' | translate}}</th>
                    <th scope="col" sortable="estimatedTime" (sort)="onSort($event)">{{'issue.list.estimated-time' | translate}}</th>
                    <th scope="col" sortable="realTime" (sort)="onSort($event)">{{'issue.list.real-time' | translate}}</th>
                    <th scope="col" sortable="differenceTime" (sort)="onSort($event)">{{'issue.list.difference-time' | translate}}</th>
                    <th>{{'issue.list.details' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let issue of issueService.issues$ | async">
                    <th>{{issue.id}}</th>
                    <th>{{issue.name}}</th>
                    <td>{{issue.typeName}}</td>
                    <td>{{convertTimeToString(issue.estimatedTime)}}</td>
                    <td>{{convertTimeToString(issue.realTime)}}</td>
                    <td>{{convertTimeDifferenceToString(issue.timeDifference)}}</td>
                    <td><a routerLink="/issue/{{issue.id}}">{{'issue.list.details' | translate}}</a></td>
                    <td><a (click)="openDelete(issue)"><i class="fa fa-trash fa-2x btn"></i></a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="issueService.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>
    `
})
export class IssueListComponent implements OnInit, OnDestroy {
    types = ISSUE_TYPES;
    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    private issueType: SelectItem;
    convertTimeToString = convertTimeToString;
    convertTimeDifferenceToString = convertTimeDifferenceToString;
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public issueService: IssueService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.issueService.getIssueList().subscribe(result => {
                this.issueService.allIssueList = result;
                this.issueService.filterIssueList(this.issueType);
                this.issueService.search$.next();
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

        this.issueService.state.sortColumn = $event.column;
        this.issueService.state.sortDirection = $event.direction;
        this.issueService.search$.next();
    }

    onSearch($event: string) {
        this.issueService.state.searchTerm = $event;
        this.issueService.search$.next();
    }

    onPage($event: number) {
        this.issueService.state.page = $event;
        this.issueService.search$.next();
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
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            this.successMessage = result;
            this.successSubject.next(result);
            setTimeout(window.location.reload.bind(window.location), 2000);
        }
    }

    onIssueTypeChanged($event: SelectItem) {
        this.issueService.filterIssueList($event);
        this.issueService.search$.next();
    }
}
