import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {EmployeeService} from './employee.service';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Employee} from './employee.model';
import {EmployeeEditComponent} from './employee-edit.component';

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
            <h2>{{employee.firstName}} {{employee.lastName}}</h2>
            <h2>{{employee.team}}</h2>
            <h2>{{employee.positionDisplay}}</h2>
            <h2>{{employee.salary}}</h2>
            <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openEdit()">{{'project.details.edit' | translate}}</a>
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

    constructor(private service: EmployeeService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        const login = this.route.snapshot.paramMap.get('login');
        this.service.getEmployee(login).subscribe(
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
