import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Project} from './project.model';
import {ProjectService} from './project.service';


@Component({
    selector: 'app-project-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'project.delete.title' | translate}} {{project.name}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'project.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'project.delete.delete' | translate}} </button>
        </div>
    `
})
export class ProjectDeleteComponent {
    @Input() project: Project;

    constructor(public activeModal: NgbActiveModal,
                private service: ProjectService) {
    }

    onDelete(): void {
        const addObservable = this.service.deleteProject(this.project);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('project.delete.deleted');
            },
            error => {
                if (error === 'error.project-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
