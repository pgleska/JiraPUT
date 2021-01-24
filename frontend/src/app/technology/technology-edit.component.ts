import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
            <form #technologyForm="ngForm" (ngSubmit)="onSubmit(technologyForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'technology.list.name' | translate}}</label>
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
                    <button type="submit" [disabled]="!technologyForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'technology.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class TechnologyEditComponent implements OnInit {
    @Input() technology: Technology;
    technologyCopy: Technology;
    @ViewChild('technologyForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private service: TechnologyService) {
    }

    ngOnInit(): void {
        this.technologyCopy = Object.assign({}, this.technology);
        setTimeout(() => {
            this.form.setValue({name: this.technologyCopy.name});
        });
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.technologyCopy.name = form.value.name;

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
