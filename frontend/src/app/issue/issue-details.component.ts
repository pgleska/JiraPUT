import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {getIssueTypeNameById, getTaskTypeNameById, Issue} from './issue.model';
import {IssueService} from './issue.service';
import {IssueEditComponent} from './issue-edit.component';
import {convertTimeDifferenceToString, convertTimeToString} from '../common/date-transformation/convert-time.functions';
import {SortEvent} from '../common/list-components/sort/sort.model';


@Component({
    selector: 'app-issue-details',
    template: `
        <div>
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
            <div class="d-flex flex-column border rounded p-2 mt-3 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'issue.details.header' | translate }}{{issue.id}} - {{issue.name}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'issue.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="type">{{'issue.details.type' | translate}} </label>
                        <input class="form-control" value="{{issueType}}" name="type" disabled/>
                    </div>
                    <div class="form-group">
                        <label for="description">{{'issue.details.description' | translate}} </label>
                        <textarea class="form-control" value="{{issue.description}}" name="description" disabled
                                  style="resize: none"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="estimatedTime">{{'issue.details.estimated-time' | translate}} </label>
                        <input type="text" class="form-control" [value]="estimatedTime" name="estimatedTime" disabled/>
                    </div>
                    <div class="form-group">
                        <label for="realTime">{{'issue.details.real-time' | translate}} </label>
                        <input type="text" class="form-control" [value]="realTime" name="realTime" disabled/>
                    </div>
                    <div class="form-group">
                        <label for="timeDifference">{{'issue.details.difference-time' | translate}} </label>
                        <input type="text" class="form-control" [value]="timeDifference" name="timeDifference"
                               disabled/>
                    </div>
                    <div *ngIf="issue.type === 'epic'" class="form-group">
                        <label for="projectName">{{'issue.details.project' | translate}} </label>
                        <input class="form-control" value="{{issue.projectName}}" name="projectName" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'epic'" class="form-group">
                        <label for="realizationDate">{{'issue.details.realisation-date' | translate}} </label>
                        <input class="form-control" value="{{realizationDate}}" name="realizationDate" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'story'" class="form-group">
                        <label for="epic">{{'issue.details.epic' | translate}} </label>
                        <input class="form-control" value="{{issue.epicName}}" name="epic" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'story'" class="form-group">
                        <label for="team">{{'issue.details.team' | translate}} </label>
                        <input class="form-control" value="{{issue.teamName}}" name="team" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'task'" class="form-group">
                        <label for="taskType">{{'issue.details.task-type' | translate}} </label>
                        <input class="form-control" value="{{taskType}}" name="taskType" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'task'" class="form-group">
                        <label for="story">{{'issue.details.story' | translate}} </label>
                        <input class="form-control" value="{{issue.storyName}}" name="story" disabled/>
                    </div>
                    <div *ngIf="issue.type === 'task'" class="form-group" style="white-space: pre-wrap">
                        <label for="employee">{{'issue.details.employee' | translate}} </label>
                        <input class="form-control" value="{{issue.userLogin}}" name="employee" disabled/>
                    </div>
                </div>
                <div *ngIf="issue.type === 'epic' || issue.type === 'story'">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col" sortable="id" (sort)="onSort($event)">{{'issue.list.id' | translate}}</th>
                            <th scope="col" sortable="name" (sort)="onSort($event)">{{'issue.list.name' | translate}}</th>
                            <th scope="col" sortable="type" (sort)="onSort($event)">{{'issue.list.type' | translate}}</th>
                            <th scope="col" sortable="estimatedTime"
                                (sort)="onSort($event)">{{'issue.list.estimated-time' | translate}}</th>
                            <th scope="col" sortable="realTime" (sort)="onSort($event)">{{'issue.list.real-time' | translate}}</th>
                            <th scope="col" sortable="differenceTime"
                                (sort)="onSort($event)">{{'issue.list.difference-time' | translate}}</th>
                            <th>{{'issue.list.details' | translate}}</th>
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
                        </tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-between p-2">
                        <app-pagination
                                [totalElements]="issueService.total$ | async"
                                (page)="onPage($event)">
                        </app-pagination>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class IssueDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    issue: Issue = {
        description: '',
        estimatedTime: undefined,
        id: 0,
        name: '',
        realTime: undefined,
        typeName: undefined,
        timeDifference: undefined,
        type: undefined
    };
    estimatedTime: string = '';
    realTime: string = '';
    timeDifference: string = '';
    realizationDate: string = '';
    taskType: string = '';
    issueType: string = '';
    convertTimeToString = convertTimeToString;
    convertTimeDifferenceToString = convertTimeDifferenceToString;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public issueService: IssueService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.issueService.resetState();
        const issueId = +this.route.snapshot.paramMap.get('issueId');
        this.issueService.getIssue(issueId).subscribe(
            (mainIssue) => {
                this.issue = mainIssue;
                this.estimatedTime = convertTimeToString(this.issue.estimatedTime as number);
                this.realTime = convertTimeToString(this.issue.realTime as number);
                this.timeDifference = convertTimeDifferenceToString(this.issue.timeDifference as number);
                this.issueType = getIssueTypeNameById(this.issue.type);
                this.taskType = getTaskTypeNameById(this.issue.taskType);
                if (this.issue.type === 'epic' && !!this.issue.realizationDate) {
                    this.realizationDate = this.issue.realizationDate.slice(0, 10);
                }
                this.issueService.getIssueList().subscribe(
                    (issues) => {
                        this.issueService.allIssueList = issues.filter(issue =>
                            this.issue.stories?.includes(issue.id) || this.issue.tasks?.includes(issue.id));
                        this.issueService.filterIssueList();
                        this.issueService.search$.next();
                    }
                );
            }
        );
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

    onPage($event: number) {
        this.issueService.state.page = $event;
        this.issueService.search$.next();
    }

    openEdit() {
        const modalRef = this.modalService.open(IssueEditComponent);
        modalRef.componentInstance.issue = this.issue;
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
