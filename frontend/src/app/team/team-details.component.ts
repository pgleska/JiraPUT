import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {EmployeeService} from '../employee/employee.service';
import {Employee} from '../employee/employee.model';
import {TeamService} from './team.service';
import {Team} from './team.model';
import {TeamEditComponent} from './team-edit.component';

@Component({
    selector: 'app-team-details',
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
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="firstName" (sort)="onSort($event)">{{'team.details.first-name' | translate}}</th>
                        <th scope="col" sortable="lastName" (sort)="onSort($event)">{{'team.details.last-name' | translate}}</th>
                        <th scope="col" sortable="positionDisplay" (sort)="onSort($event)">{{'team.details.position' | translate}}</th>
                        <th>{{'team.details.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let employee of employeeList">
                        <th>{{employee.firstName}}</th>
                        <td>{{employee.lastName}}</td>
                        <td>{{employee.positionDisplay}}</td>
                        <td><a routerLink="/employee/{{employee.login}}">{{'team.details.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="employeeList.length"
                            (page)="onPage($event)">
                    </app-pagination>
                </div>
            </div>
        </div>
    `
})
export class TeamDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    team: Team = {
        members: [],
        name: '',
        numberOfMembers: 0
    };
    employeeList: Employee[] = [];
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(public teamService: TeamService,
                private employeeService: EmployeeService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.employeeService.resetState();
        const teamName = this.route.snapshot.paramMap.get('name');
        this.teamService.getTeam(teamName).subscribe(
            (team) => {
                this.team = team;
                for (let memberName of team.members) {
                    this.employeeService.getEmployee(memberName).subscribe(
                        (member) => {
                            this.employeeList.push(member);
                            this.employeeService.allEmployeeList = this.employeeList;
                        }
                    );
                }
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
        this.employeeService.search$.next();
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

        this.employeeService.state.sortColumn = $event.column;
        this.employeeService.state.sortDirection = $event.direction;
        this.employeeService.search$.next();
    }

    onPage($event: number) {
        this.employeeService.state.page = $event;
        this.employeeService.search$.next();
    }

    openEdit() {
        const modalRef = this.modalService.open(TeamEditComponent);
        modalRef.componentInstance.team = this.team;
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
