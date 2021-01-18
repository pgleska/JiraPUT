import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Issue} from './issue.model';
import {IssueService} from './issue.service';
import {IssueEditComponent} from './issue-edit.component';
import { convertTimeToString } from '../common/date-transformation/convert-time.functions';
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
            <div class="d-flex flex-column border rounded p-2 mt-3 w-50 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'issue.details.header' | translate }}{{issue.id}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'issue.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="name">{{'issue.details.name' | translate}}</label>
                        <input class="form-control" value="{{issue.name}}" name="firstName" disabled>
                    </div>
                    <div class="form-group">
                        <label for="subtype">{{'issue.details.subtype' | translate}} </label>
                        <input class="form-control" value="{{issue.subtype}}" name="subtype" disabled/>
                    </div>
                    <div class="form-group">
                        <label for="description">{{'issue.details.description' | translate}} </label>
                        <textarea class="form-control" value="{{issue.description}}" name="description" disabled
                                  style="resize: none"></textarea>
                    </div>
                    <div *ngIf="issue.subtype === 'epic'" class="form-group">
                        <label for="projectName">{{'issue.details.description' | translate}} </label>
                        <input class="form-control" value="{{issue.projectName}}" name="projectName" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'epic'" class="form-group">
                        <label for="realizationDate">{{'issue.details.realization-date' | translate}} </label>
                        <input class="form-control" value="{{issue.realizationDate}}" name="realizationDate" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'story'" class="form-group">
                        <label for="epic">{{'issue.details.epic' | translate}} </label>
                        <input class="form-control" value="{{issue.epicName}}" name="epic" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'story'" class="form-group">
                        <label for="team">{{'issue.details.team' | translate}} </label>
                        <input class="form-control" value="{{issue.teamName}}" name="team" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'task'" class="form-group">
                        <label for="taskType">{{'issue.details.task-type' | translate}} </label>
                        <input class="form-control" value="{{issue.taskType}}" name="taskType" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'task'" class="form-group">
                        <label for="story">{{'issue.details.story' | translate}} </label>
                        <input class="form-control" value="{{issue.storyName}}" name="story" disabled/>
                    </div>
                    <div *ngIf="issue.subtype === 'task'" class="form-group">
                        <label for="employee">{{'issue.details.employee' | translate}} </label>
                        <input class="form-control" value="{{issue.userLogin}}" name="employee" disabled/>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="id" (sort)="onSort($event)">{{'issue.list.id' | translate}}</th>
                        <th scope="col" sortable="name" (sort)="onSort($event)">{{'issue.list.name' | translate}}</th>
                        <th scope="col" sortable="subtype" (sort)="onSort($event)">{{'issue.list.subtype' | translate}}</th>
                        <th scope="col" sortable="estimatedTime" (sort)="onSort($event)">{{'issue.list.estimated-time' | translate}}</th>
                        <th scope="col" sortable="realTime" (sort)="onSort($event)">{{'issue.list.real-time' | translate}}</th>
                        <th scope="col" sortable="differenceTime" (sort)="onSort($event)">{{'issue.list.difference-time' | translate}}</th>
                        <th>{{'issue.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let issue of issueList">
                        <th>{{issue.id}}</th>
                        <th>{{issue.name}}</th>
                        <td>{{issue.subtypeName}}</td>
                        <td>{{convertTimeToString(issue.estimatedTime)}}</td>
                        <td>{{convertTimeToString(issue.realTime)}}</td>
                        <td>{{convertTimeToString(issue.differenceTime)}}</td>
                        <td><a routerLink="/issue/{{issue.id}}">{{'issue.list.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="issueList.length"
                            (page)="onPage($event)">
                    </app-pagination>
                </div>
            </div>
        </div>
    `
})
export class IssueDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    issue: Issue;
    issueList: Issue[];
    convertTimeToString = convertTimeToString;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(private issueService: IssueService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.issueService.resetState();
        const issueId = +this.route.snapshot.paramMap.get('issueId');
        this.issueService.getIssue(issueId).subscribe(
            (mainIssue) => {
                this.issue = mainIssue;
                this.issueService.getIssueList().subscribe(
                    (issues) => {
                        this.issueList = issues.filter(issue =>
                            this.issue?.stories.includes(issue.id) || this.issue?.tasks.includes(issue.id));
                        this.issueService.allIssueList = this.issueList;
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
        }
    }

}
