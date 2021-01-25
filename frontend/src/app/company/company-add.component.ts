import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Company} from './company.model';
import {CompanyService} from './company.service';


@Component({
    selector: 'app-company-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'company.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #companyForm="ngForm" (ngSubmit)="onSubmit(companyForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'company.list.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            [ngModel]
                            #name="ngModel"
                            required
                            [maxlength]="255"
                    />
                    <app-input-error [control]="name.control" [maxLength]="255"></app-input-error>
                </div>
                <div class="required">
                    <label for="taxNumber" class="control-label">{{'company.list.tax-number' | translate}}</label>
                    <input
                            type="number"
                            id="taxNumber"
                            name="taxNumber"
                            class="form-control"
                            [ngModel]
                            #taxNumber="ngModel"
                            required
                            negativeValueValidator
                            taxNumberValidator
                    />
                    <app-input-error [control]="taxNumber.control"></app-input-error>
                </div>
                <div class="required">
                    <label for="address" class="control-label">{{'company.list.address' | translate}}</label>
                    <input
                            type="text"
                            id="address"
                            name="address"
                            class="form-control"
                            [ngModel]
                            #address="ngModel"
                            required
                            [maxlength]="255"
                    />
                    <app-input-error [control]="address.control" [maxLength]="255"></app-input-error>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!companyForm.valid">{{'company.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class CompanyAddComponent {

    private company: Company =  {
        name: '',
        taxNumber: 0,
        address: ''
    };

    constructor(public activeModal: NgbActiveModal,
                private service: CompanyService) {
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.company.name = form.value.name;
        this.company.taxNumber = form.value.taxNumber;
        this.company.address = form.value.address;

        const addObservable = this.service.createCompany(this.company);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('company.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
