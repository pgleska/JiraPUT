import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionService} from './position.service';

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

        </div>
        <div class="modal-footer">
            <button type="button" ngbAutofocus class="btn btn-outline-dark"
                    (click)="activeModal.close()">{{'position.edit.edit' | translate}} </button>
        </div>
    `
})
export class PositionEditComponent {
    @Input() position: Position;

    constructor(public activeModal: NgbActiveModal,
                private service: PositionService) {
    }

}
