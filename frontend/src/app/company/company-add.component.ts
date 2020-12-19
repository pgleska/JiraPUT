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
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'company.list.name' | translate}}</label>
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
                            [disabled]="!authForm.valid">{{'company.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class CompanyAddComponent {

    private company: Company =  {
        name: '',
        nameDisplay: ''
    };

    constructor(public activeModal: NgbActiveModal,
                private service: CompanyService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        this.company.nameDisplay = form.value.name;
        this.company.name = form.value.name.replace(/ /g, '_');

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
