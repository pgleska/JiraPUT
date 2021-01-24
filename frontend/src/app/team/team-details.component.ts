import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {EmployeeService} from '../employee/employee.service';
import {TeamService} from './team.service';
import {Team} from './team.model';
import {TeamEditComponent} from './team-edit.component';
import {convertTimeDifferenceToString, convertTimeToString} from '../common/date-transformation/convert-time.functions';
import {IssueService} from '../issue/issue.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-team-details',
    template: `
        <div>
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
            <div class="d-flex flex-column border rounded p-2 mt-3 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'team.details.header' | translate }}{{team.name}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'team.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="membersNumber">{{'team.details.members-number' | translate}} </label>
                        <input class="form-control" value="{{team.numberOfMembers}}" name="membersNumber" disabled>
                    </div>
                </div>
                <h4>{{'team.details.employees' | translate}}</h4>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="login" (sort)="onSortEmployee($event)">{{'team.details.login' | translate}}</th>
                        <th scope="col" sortable="firstName" (sort)="onSortEmployee($event)">{{'team.details.first-name' | translate}}</th>
                        <th scope="col" sortable="lastName" (sort)="onSortEmployee($event)">{{'team.details.last-name' | translate}}</th>
                        <th scope="col" sortable="positionDisplay"
                            (sort)="onSortEmployee($event)">{{'team.details.position' | translate}}</th>
                        <th>{{'team.details.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let employee of employeeService.employees$ | async">
                        <th>{{employee.login}}</th>
                        <td>{{employee.firstName}}</td>
                        <td>{{employee.lastName}}</td>
                        <td>{{employee.positionDisplay}}</td>
                        <td><a routerLink="/employee/{{employee.login}}">{{'team.details.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="employeeService.total$ | async"
                            (page)="onPageEmployee($event)">
                    </app-pagination>
                </div>
                <h4>{{'team.details.stories' | translate}}</h4>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="id" (sort)="onSortIssue($event)">{{'issue.list.id' | translate}}</th>
                        <th scope="col" sortable="name" (sort)="onSortIssue($event)">{{'issue.list.name' | translate}}</th>
                        <th scope="col" sortable="estimatedTime"
                            (sort)="onSortIssue($event)">{{'issue.list.estimated-time' | translate}}</th>
                        <th scope="col" sortable="realTime" (sort)="onSortIssue($event)">{{'issue.list.real-time' | translate}}</th>
                        <th scope="col" sortable="differenceTime"
                            (sort)="onSortIssue($event)">{{'issue.list.difference-time' | translate}}</th>
                        <th>{{'issue.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let issue of issueService.issues$ | async">
                        <th>{{issue.id}}</th>
                        <th>{{issue.name}}</th>
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
                            (page)="onPageIssue($event)">
                    </app-pagination>
                </div>
            </div>
        </div>
    `
})
export class TeamDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    team: Team = {
        members: [],
        name: '',
        numberOfMembers: 0
    };
    convertTimeToString = convertTimeToString;
    convertTimeDifferenceToString = convertTimeDifferenceToString;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public teamService: TeamService,
                public employeeService: EmployeeService,
                public issueService: IssueService,
                private route: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.employeeService.resetState();
        this.issueService.resetState();
        const teamName = this.route.snapshot.paramMap.get('name');
        this.teamService.getTeam(teamName).subscribe(
            (team) => {
                this.team = team;
                this.employeeService.getEmployeeList().pipe(
                    map(employees => employees.filter(employee => this.team.members.includes(employee.login)))
                ).subscribe(members => {
                        this.employeeService.allEmployeeList = members;
                        this.employeeService.filterEmployeeList();
                        this.employeeService.search$.next();
                    }
                );
                this.issueService.getStoryListByTeamName(this.team.name).subscribe(
                    (result) => {
                        this.issueService.allIssueList = result;
                        this.issueService.filterIssueList();
                        this.employeeService.search$.next();
                    }
                );
            }
        );

        this.errorSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        });

        const success = JSON.parse(localStorage.getItem('success'));
        if (!!success) {
            this.successMessage = success;
            this.successSubject.next(success);
            localStorage.removeItem('success');
        }

        this.employeeService.search$.next();
        this.issueService.search$.next();
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSortIssue($event: SortEvent) {
        const issueHeaders = ['id', 'name', 'estimatedTime', 'realTime', 'differenceTime'];
        this.headers
            .filter(header => issueHeaders.includes(header.sortable))
            .forEach(header => {
                    if (header.sortable !== $event.column) {
                        header.direction = '';
                    }
                }
            );

        this.issueService.state.sortColumn = $event.column;
        this.issueService.state.sortDirection = $event.direction;
        this.issueService.search$.next();
    }

    onPageIssue($event: number) {
        this.issueService.state.page = $event;
        this.issueService.search$.next();
    }

    onSortEmployee($event: SortEvent) {
        const employeeHeaders = ['login', 'firstName', 'lastName', 'position'];
        this.headers
            .filter(header => employeeHeaders.includes(header.sortable))
            .forEach(header => {
                    if (header.sortable !== $event.column) {
                        header.direction = '';
                    }
                }
            );

        this.employeeService.state.sortColumn = $event.column;
        this.employeeService.state.sortDirection = $event.direction;
        this.employeeService.search$.next();
    }

    onPageEmployee($event: number) {
        this.employeeService.state.page = $event;
        this.employeeService.search$.next();
    }

    openEdit() {
        const modalRef = this.modalService.open(TeamEditComponent);
        modalRef.componentInstance.team = this.team;
        modalRef.result.then((result) => {
            this.showInfo(result.result);
            this.team = result.team;
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
            setTimeout(this.navigateToNewPage.bind(this));
        }
    }

    private navigateToNewPage() {
        this.router.navigate([`/team/${this.team.name}`])
    }
}
