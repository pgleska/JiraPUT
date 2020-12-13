import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionService} from './position.service';
import {Position} from './position.model';
import {NgForm} from '@angular/forms';


@Component({
    selector: 'app-position-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'position.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'position.list.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            value="{{positionCopy.nameDisplay}}"
                            [ngModel]
                            #name="ngModel"
                            required
                    />
                    <app-input-error [control]="name.control"></app-input-error>
                </div>
                <div>
                    <label for="minimumSalary">{{'position.list.minimum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="minimumSalary"
                            name="minimumSalary"
                            class="form-control"
                            value="{{positionCopy.minimumSalary}}"
                            [ngModel]
                            #minimumSalary="ngModel"
                            required
                            greaterThanValidator
                            [greaterThan]="'maximumSalary'"
                    />
                    <app-input-error [control]="minimumSalary.control"></app-input-error>
                </div>
                <div>
                    <label for="maximumSalary">{{'position.list.maximum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="maximumSalary"
                            name="maximumSalary"
                            class="form-control"
                            [value]="positionCopy.maximumSalary"
                            [ngModel]
                            #maximumSalary="ngModel"
                            required
                            greaterThanValidator
                            [greaterThan]="'minimumSalary'"
                            [showErrorMessage]="true"
                    />
                    <app-input-error [control]="maximumSalary.control"></app-input-error>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!authForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'position.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class PositionEditComponent implements OnInit {
    @Input() position: Position;
    positionCopy: Position;

    constructor(public activeModal: NgbActiveModal,
                private service: PositionService) {
    }

    ngOnInit(): void {
        this.positionCopy = Object.assign({}, this.position);
        console.log(this.positionCopy);
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.positionCopy.nameDisplay = form.value.name;
        this.positionCopy.name = form.value.name.replace(/ /g, '_');
        this.positionCopy.minimumSalary = form.value.minimumSalary;
        this.positionCopy.maximumSalary = form.value.maximumSalary;

        const editObservable = this.service.modifyPosition(this.positionCopy);
        editObservable.subscribe(
            _ => {
                this.position = Object.assign({}, this.positionCopy);
                this.activeModal.close('position.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
