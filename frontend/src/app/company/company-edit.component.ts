import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Company} from './company.model';
import {CompanyService} from './company.service';


@Component({
    selector: 'app-company-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'company.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'company.list.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            value="{{companyCopy.nameDisplay}}"
                            [ngModel]
                            #name="ngModel"
                            required
                    />
                    <app-input-error [control]="name.control"></app-input-error>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!authForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'company.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class CompanyEditComponent implements OnInit {
    @Input() company: Company;
    companyCopy: Company;

    constructor(public activeModal: NgbActiveModal,
                private service: CompanyService) {
    }

    ngOnInit(): void {
        this.companyCopy = Object.assign({}, this.company);
        console.log(this.companyCopy);
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.companyCopy.nameDisplay = form.value.name;
        this.companyCopy.name = form.value.name.replace(/ /g, '_');

        const editObservable = this.service.modifyCompany(this.companyCopy);
        editObservable.subscribe(
            _ => {
                this.company = Object.assign({}, this.companyCopy);
                this.activeModal.close('company.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
