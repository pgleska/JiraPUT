import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Project} from './project.model';
import {ProjectService} from './project.service';


@Component({
    selector: 'app-project-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'project.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'project.list.name' | translate}}</label>
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
                    <label for="version">{{'project.list.version' | translate}}</label>
                    <input
                            type="text"
                            id="version"
                            name="version"
                            class="form-control"
                            [ngModel]
                            #version="ngModel"
                            required
                    />
                    <app-input-error [control]="version.control"></app-input-error>
                </div>
                <div>
                    <label for="description">{{'project.list.description' | translate}}</label>
                    <input
                            type="text"
                            id="description"
                            name="description"
                            class="form-control"
                            [ngModel]
                            #description="ngModel"
                    />
                    <app-input-error [control]="description.control"></app-input-error>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!authForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'project.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class ProjectEditComponent implements OnInit {
    @Input() project: Project;
    projectCopy: Project;

    constructor(public activeModal: NgbActiveModal,
                private service: ProjectService) {
    }

    ngOnInit(): void {
        this.projectCopy = Object.assign({}, this.project);
        console.log(this.projectCopy);
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.projectCopy.name = form.value.name;

        const editObservable = this.service.modifyProject(this.projectCopy);
        editObservable.subscribe(
            _ => {
                this.project = Object.assign({}, this.projectCopy);
                this.activeModal.close('project.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
