import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {EmployeeService} from './employee.service';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Employee} from './employee.model';
import {EmployeeEditComponent} from './employee-edit.component';
import {convertTimeToString} from '../common/date-transformation/convert-time.functions';
import {IssueService} from '../issue/issue.service';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {SortEvent} from '../common/list-components/sort/sort.model';

@Component({
    selector: 'app-employee-details',
    template: `
        <div>
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
            <div class="d-flex flex-column border rounded p-2 mt-3 w-50 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'employee.details.header' | translate }}{{employee.login}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'employee.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="firstName">{{'employee.details.first-name' | translate}} </label>
                        <input class="form-control" value="{{employee.firstName}}" name="firstName" disabled>
                    </div>
                    <div class="form-group">
                        <label for="lastName">{{'employee.details.last-name' | translate}} </label>
                        <input class="form-control" value="{{employee.lastName}}" name="lastName" disabled>
                    </div>
                    <div class="form-group">
                        <label for="team">{{'employee.details.team' | translate}} </label>
                        <input class="form-control" value="{{employee.team}}" name="team" disabled>
                    </div>
                    <div class="form-group">
                        <label for="positionDisplay">{{'employee.details.position' | translate}} </label>
                        <input class="form-control" value="{{employee.positionDisplay}}" name="positionDisplay" disabled>
                    </div>
                    <div class="form-group">
                        <label for="salary">{{'employee.details.salary' | translate}} </label>
                        <input class="form-control" value="{{employee.salary}}" name="salary" disabled>
                    </div>
                    <div class="form-group" style="width: 227px">
                        <label for="salary">{{'employee.details.technologies' | translate}}</label>
                        <div>
                            <app-technology-tag *ngFor="let technology of employee.technologies"
                                                [name]="technology.name"></app-technology-tag>
                        </div>
                    </div>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col" sortable="id" (sort)="onSort($event)">{{'issue.list.id' | translate}}</th>
                            <th scope="col" sortable="name" (sort)="onSort($event)">{{'issue.list.name' | translate}}</th>
                            <th scope="col" sortable="subtype" (sort)="onSort($event)">{{'issue.list.subtype' | translate}}</th>
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
                                [totalElements]="issueService.total$ | async"
                                (page)="onPage($event)">
                        </app-pagination>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EmployeeDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    employee: Employee = {
        firstName: '',
        lastName: '',
        login: '',
        position: '',
        positionDisplay: '',
        salary: 0,
        team: '',
        technologies: []
    };
    convertTimeToString = convertTimeToString;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(private employeeService: EmployeeService,
                public issueService: IssueService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.issueService.resetState();
        const login = this.route.snapshot.paramMap.get('login');
        this.employeeService.getEmployee(login).subscribe(
            (employee) => {
                this.employee = employee;
            }
        );

        this.issueService.getTaskListByEmployeeLogin(login).subscribe(
            (result) => {
                this.issueService.allIssueList = result;
            }
        );
        this.issueService.search$.next();
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
        const modalRef = this.modalService.open(EmployeeEditComponent);
        modalRef.componentInstance.employee = this.employee;
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
