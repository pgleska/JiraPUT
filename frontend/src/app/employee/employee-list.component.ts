import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from 'rxjs/operators';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {EmployeeService} from './employee.service';
import {PositionService} from '../position/position.service';
import {TeamService} from '../team/team.service';
import {SelectItem} from '../common/select/select-item.model';
import {Contract} from '../contract/contract.model';
import {ContractDeleteComponent} from '../contract/contract-delete.component';
import {EmployeeDeleteComponent} from './employee-delete.component';
import {Employee} from './employee.model';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
    selector: 'app-employee-list',
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
            <div class="form-group d-flex flex-row border rounded mt-3 px-2">
                <div class="p-2 mx-4">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2  mx-4">
                    <app-select [label]="'employee.list.position' | translate"
                                [options]="positionList"
                                [name]="'position'"
                                (value)="onPositionChanged($event)">
                    </app-select>
                </div>
                <div class="p-2  mx-4">
                    <app-select [label]="'employee.list.team' | translate"
                                [options]="teamList"
                                [name]="'team'"
                                (value)="onTeamChanged($event)">
                    </app-select>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="firstName" (sort)="onSort($event)">{{'employee.list.first-name' | translate}}</th>
                    <th scope="col" sortable="lastName" (sort)="onSort($event)">{{'employee.list.last-name' | translate}}</th>
                    <th scope="col" sortable="positionDisplay" (sort)="onSort($event)">{{'employee.list.position' | translate}}</th>
                    <th scope="col" sortable="team" (sort)="onSort($event)">{{'employee.list.team' | translate}}</th>
                    <th>{{'employee.list.details' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let employee of employeeService.employees$ | async">
                    <th>{{employee.firstName}}</th>
                    <td>{{employee.lastName}}</td>
                    <td>{{employee.positionDisplay}}</td>
                    <td *ngIf="employee.team">{{employee.team}}</td>
                    <td *ngIf="!employee.team">{{"employee.list.empty-team" | translate}}</td>
                    <td><a routerLink="/employee/{{employee.login}}">{{'employee.list.details' | translate}}</a></td>
                    <td><a (click)="openDelete(employee)"><i class="fa fa-trash fa-2x btn"></i></a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="employeeService.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>`
})
export class EmployeeListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    positionList: SelectItem[] = [];
    teamList: SelectItem[] = [];
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    private position: SelectItem;
    private team: SelectItem;
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public employeeService: EmployeeService,
                private authenticationService: AuthenticationService,
                private positionService: PositionService,
                private teamService: TeamService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.employeeService.getEmployeeList().subscribe(result => {
                this.employeeService.allEmployeeList = result;
                this.employeeService.filterEmployeeList(this.position, this.team);
                this.employeeService.search$.next();
            }
        );

        this.positionService.getPositionList().subscribe(result => {
            result.forEach(position => {
                const item = {
                    id: position.name,
                    name: position.nameDisplay
                };
                this.positionList.push(item);
            });
        });

        this.teamService.getTeamList().subscribe(result => {
            result.forEach(position => {
                const item = {
                    id: position.name,
                    name: position.name
                };
                this.teamList.push(item);
            });
        });

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

    onSearch($event: string) {
        this.employeeService.state.searchTerm = $event;
        this.employeeService.search$.next();
    }

    onPage($event: number) {
        this.employeeService.state.page = $event;
        this.employeeService.search$.next();
    }

    onPositionChanged($event: SelectItem) {
        this.position = $event;
        this.employeeService.filterEmployeeList(this.position, this.team);
        this.employeeService.search$.next();
    }

    onTeamChanged($event: SelectItem) {
        this.team = $event;
        this.employeeService.filterEmployeeList(this.position, this.team);
        this.employeeService.search$.next();
    }

    openDelete(employee: Employee) {
        const modalRef = this.modalService.open(EmployeeDeleteComponent);
        modalRef.componentInstance.employee = employee;
        modalRef.result.then((result) => {
            this.showInfo(result);
            if (!result.includes('error') && this.authenticationService.getUserLogin() === employee.login) {
                this.authenticationService.logout();
            }
        }, _ => {
        });
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            localStorage.setItem('success', JSON.stringify(result));
            window.location.reload();
        }
    }
}
