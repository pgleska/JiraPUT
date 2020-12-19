import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Technology} from './technology.model';
import {TechnologyService} from './technology.service';


@Component({
    selector: 'app-technology-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'technology.delete.title' | translate}} {{technology.nameDisplay}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'technology.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'technology.delete.delete' | translate}} </button>
        </div>
    `
})
export class TechnologyDeleteComponent {
    @Input() technology: Technology;

    constructor(public activeModal: NgbActiveModal,
                private service: TechnologyService) {
    }

    onDelete(): void {
        const addObservable = this.service.deleteTechnology(this.technology);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('technology.delete.deleted');
            },
            error => {
                if (error === 'error.technology-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
