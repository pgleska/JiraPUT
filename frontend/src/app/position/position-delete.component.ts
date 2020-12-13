import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PositionService} from './position.service';
import {Position} from './position.model';

@Component({
    selector: 'app-position-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'position.delete.title' | translate}} {{position.nameDisplay}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'position.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'position.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'position.delete.add' | translate}} </button>
        </div>
    `
})
export class PositionDeleteComponent {
    @Input() position: Position;

    constructor(public activeModal: NgbActiveModal,
                private service: PositionService) {
    }

    onDelete(): void {
        const addObservable = this.service.deletePosition(this.position);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('position.deleted');
            },
            error => {
                if (error === 'error.position-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
