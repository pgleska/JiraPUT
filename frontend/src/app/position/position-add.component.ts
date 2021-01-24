import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionService} from './position.service';
import {NgForm} from '@angular/forms';
import {Position} from './position.model';


@Component({
    selector: 'app-position-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'position.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #positionForm="ngForm" (ngSubmit)="onSubmit(positionForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'position.list.name' | translate}}</label>
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
                <div class="required">
                    <label for="minimumSalary" class="control-label">{{'position.list.minimum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="minimumSalary"
                            name="minimumSalary"
                            class="form-control"
                            [ngModel]
                            #minimumSalary="ngModel"
                            required
                            greaterThanValidator
                            negativeValueValidator
                            [greaterThan]="'maximumSalary'"
                            min="0"
                    />
                    <app-input-error [control]="minimumSalary.control"></app-input-error>
                </div>
                <div class="required">
                    <label for="maximumSalary" class="control-label">{{'position.list.maximum-salary' | translate}}</label>
                    <input
                            type="number"
                            id="maximumSalary"
                            name="maximumSalary"
                            class="form-control"
                            [ngModel]
                            #maximumSalary="ngModel"
                            required
                            greaterThanValidator
                            negativeValueValidator
                            [greaterThan]="'minimumSalary'"
                            [showErrorMessage]="true"
                            min="0"
                    />
                    <app-input-error [control]="maximumSalary.control"></app-input-error>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!positionForm.valid">{{'position.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class PositionAddComponent {

    private position: Position =  {
        maximumSalary: 0,
        minimumSalary: 0,
        name: '',
        nameDisplay: ''
    };

    constructor(public activeModal: NgbActiveModal,
                private service: PositionService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        this.position.nameDisplay = form.value.name;
        this.position.name = form.value.name.replace(/ /g, '_');
        this.position.minimumSalary = form.value.minimumSalary;
        this.position.maximumSalary = form.value.maximumSalary;

        const addObservable = this.service.createPosition(this.position);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('position.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
