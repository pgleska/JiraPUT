import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Employee} from './employee.model';
import {EmployeeService} from './employee.service';


@Component({
    selector: 'app-employee-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'project.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #employeeForm="ngForm" (ngSubmit)="onSubmit(employeeForm)">
                <div>
                    <label for="name">{{'employee.list.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            [ngModel]
                            #name="ngModel"
                            required
                    />
                    <app-input-error [control]="name.control"></app-input-error>
                </div>
                

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!employeeForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'employee.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class EmployeeEditComponent implements OnInit {
    @Input() employee: Employee;
    employeeCopy: Employee;
    @ViewChild('employeeForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private employeeService: EmployeeService) {
    }

    ngOnInit(): void {
        this.employeeCopy = Object.assign({}, this.employee);
        setTimeout(() => {
            this.form.setValue(this.employeeCopy);
        });
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.employeeCopy.firstName = form.value.name;

        const editObservable = this.employeeService.modifyEmployee(this.employeeCopy);
        editObservable.subscribe(
            _ => {
                this.employee = Object.assign({}, this.employeeCopy);
                this.activeModal.close('employee.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
