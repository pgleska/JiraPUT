import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Technology} from './technology.model';
import {TechnologyService} from './technology.service';


@Component({
    selector: 'app-technology-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'technology.edit.title' | translate}} </h4>
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
                            value="{{technologyCopy.nameDisplay}}"
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
                            class="btn btn-outline-dark">{{'technology.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class TechnologyEditComponent implements OnInit {
    @Input() technology: Technology;
    technologyCopy: Technology;

    constructor(public activeModal: NgbActiveModal,
                private service: TechnologyService) {
    }

    ngOnInit(): void {
        this.technologyCopy = Object.assign({}, this.technology);
        console.log(this.technologyCopy);
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.technologyCopy.nameDisplay = form.value.name;
        this.technologyCopy.name = form.value.name.replace(/ /g, '_');

        const editObservable = this.service.modifyTechnology(this.technologyCopy);
        editObservable.subscribe(
            _ => {
                this.technology = Object.assign({}, this.technologyCopy);
                this.activeModal.close('technology.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
