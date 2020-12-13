import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Company} from './company.model';
import {CompanyService} from './company.service';

@Component({
    selector: 'app-company-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'company.delete.title' | translate}} {{company.nameDisplay}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'company.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'company.delete.delete' | translate}} </button>
        </div>
    `
})
export class CompanyDeleteComponent {
    @Input() company: Company;

    constructor(public activeModal: NgbActiveModal,
                private service: CompanyService) {
    }

    onDelete(): void {
        const addObservable = this.service.deleteCompany(this.company);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('company.delete.deleted');
            },
            error => {
                if (error === 'error.company-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
