import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionService} from './position.service';

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

        </div>
        <div class="modal-footer">
            <button type="button" ngbAutofocus class="btn btn-outline-dark" (click)="activeModal.close()">{{'position.add.add' | translate}} </button>
        </div>
    `
})
export class PositionAddComponent {
    constructor(public activeModal: NgbActiveModal,
                private service: PositionService) {
    }

}
