import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Technology} from './technology.model';
import {TechnologyService} from './technology.service';


@Component({
    selector: 'app-technology-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'technology.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'technology.list.name' | translate}}</label>
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
                <div>
                    <label for="minimumSalary">{{'technology.list.minimum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="minimumSalary"
                            name="minimumSalary"
                            class="form-control"
                            [ngModel]
                            #minimumSalary="ngModel"
                            required
                    />
                    <app-input-error [control]="minimumSalary.control"></app-input-error>
                </div>
                <div>
                    <label for="maximumSalary">{{'technology.list.maximum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="maximumSalary"
                            name="maximumSalary"
                            class="form-control"
                            [ngModel]
                            #maximumSalary="ngModel"
                            required
                    />
                    <app-input-error [control]="maximumSalary.control"></app-input-error>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!authForm.valid">{{'technology.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class TechnologyAddComponent {

    private technology: Technology =  {
        name: '',
        nameDisplay: ''
    };

    constructor(public activeModal: NgbActiveModal,
                private service: TechnologyService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        this.technology.nameDisplay = form.value.name;
        this.technology.name = form.value.name.replace(/ /g, '_');

        const addObservable = this.service.createTechnology(this.technology);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('technology.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
