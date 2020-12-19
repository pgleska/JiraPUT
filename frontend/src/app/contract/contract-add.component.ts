import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Contract} from './contract.model';
import {ContractService} from './contract.service';


@Component({
    selector: 'app-contract-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'contract.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'contract.list.name' | translate}}</label>
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
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!authForm.valid">{{'contract.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class ContractAddComponent {

    private contract: Contract =  {
        contractNumber: '',
        companyName: '',
        projectName: '',
        amount: 0,
        conditions: null
    };

    constructor(public activeModal: NgbActiveModal,
                private service: ContractService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        this.contract.contractNumber = form.value.name

        const addObservable = this.service.createContract(this.contract);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('contract.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
