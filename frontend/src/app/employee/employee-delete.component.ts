import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Employee} from './employee.model';
import {EmployeeService} from './employee.service';


@Component({
    selector: 'app-employee-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'employee.delete.title' | translate}} {{employee.login}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'employee.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'employee.delete.delete' | translate}} </button>
        </div>
    `
})
export class EmployeeDeleteComponent {
    @Input() employee: Employee;

    constructor(public activeModal: NgbActiveModal,
                private employeeService: EmployeeService) {
    }

    onDelete(): void {
        const addObservable = this.employeeService.deleteEmployee(this.employee);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('employee.delete.deleted');
            },
            error => {
                this.activeModal.close(error);
            }
        );
    }

}
