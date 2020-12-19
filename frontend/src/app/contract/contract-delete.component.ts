import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Contract} from './contract.model';
import {ContractService} from './contract.service';


@Component({
    selector: 'app-contract-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'contract.delete.title' | translate}} {{contract.contractNumber}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'contract.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'contract.delete.delete' | translate}} </button>
        </div>
    `
})
export class ContractDeleteComponent {
    @Input() contract: Contract;

    constructor(public activeModal: NgbActiveModal,
                private service: ContractService) {
    }

    onDelete(): void {
        const addObservable = this.service.deleteContract(this.contract);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('contract.delete.deleted');
            },
            error => {
                if (error === 'error.contract-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
