import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './employee.service';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Employee} from './employee.model';
import {EmployeeEditComponent} from './employee-edit.component';
import {TechnologyService} from '../technology/technology.service';

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
                    <div class="form-group">
                        <label for="technology">{{'employee.details.technology' | translate}} </label>
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
        team: ''
    };
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;

    constructor(private employeeService: EmployeeService,
                private technologyService: TechnologyService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        const login = this.route.snapshot.paramMap.get('login');
        this.employeeService.getEmployee(login).subscribe(
            (employee) => {
                this.employee = employee;
            }
        );
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
