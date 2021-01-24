import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Project} from './project.model';
import {ProjectService} from './project.service';
import {TechnologyService} from '../technology/technology.service';
import {Technology} from '../technology/technology.model';


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
            <form #projectForm="ngForm" (ngSubmit)="onSubmit(projectForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'project.list.name' | translate}}</label>
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
                    <label for="version" class="control-label">{{'project.list.version' | translate}}</label>
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
                    <label for="description">{{'project.edit.description' | translate}}</label>
                    <textarea
                            type="text"
                            id="description"
                            name="description"
                            class="form-control"
                            [ngModel]
                            #description="ngModel"
                    ></textarea>
                    <app-input-error [control]="description.control"></app-input-error>
                </div>
                <div>
                    <label for="technologies">{{'project.details.technologies' | translate}} </label>
                    <app-multiselect
                            [placeholder]="'project.details.placeholder' | translate"
                            [data]="dropdownList"
                            [(ngModel)]="selectedItems"
                            name="technologies"
                            [settings]="dropdownSettings"
                    >
                    </app-multiselect>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!projectForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'project.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class ProjectEditComponent implements OnInit {
    @Input() project: Project;
    projectCopy: Project;
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    @ViewChild('projectForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private projectService: ProjectService,
                private technologyService: TechnologyService) {
    }

    ngOnInit(): void {
        this.projectCopy = Object.assign({}, this.project);
        setTimeout(() => {
            this.form.setValue({
                name: this.projectCopy.name,
                description: this.projectCopy.description,
                version: this.projectCopy.version,
                technologies: Object.assign([], this.projectCopy.technologies)
            });
        });

        this.technologyService.getTechnologyList().subscribe(result => {
            this.dropdownList = result;
        });

        this.dropdownSettings = {
            singleSelection: false,
            searchPlaceholderText: 'project.edit.search',
            selectAllText: 'project.edit.select-all',
            unSelectAllText: 'project.edit.unselect-all',
            allowSearchFilter: true
        };
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.projectCopy.name = form.value.name;
        this.projectCopy.version = form.value.version;
        if (!!form.value.description) {
            this.projectCopy.description = form.value.description;
        }
        const technologiesCopy = JSON.parse(JSON.stringify(this.selectedItems))
        const editObservable = this.projectService.modifyProject(this.projectCopy);
        editObservable.subscribe(
            _ => {
                this.changeTechnologyList(technologiesCopy, this.project.technologies);
                this.activeModal.close('project.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

    private changeTechnologyList(newTechnologyList: Technology[], oldTechnologyList: Technology[]): void {
        newTechnologyList.forEach(newTechnology => {
            if (!oldTechnologyList.some(oldTechnology => oldTechnology.id === newTechnology.id)) {
                this.projectService.addProjectTechnology(this.projectCopy, newTechnology).subscribe(
                    _ => {
                    },
                    error => {
                        this.activeModal.close(error);
                    }
                );
            }
        });
        oldTechnologyList.forEach(oldTechnology => {
            if (!newTechnologyList.some(newTechnology => newTechnology.id === oldTechnology.id)) {
                this.projectService.deleteProjectTechnology(this.projectCopy, oldTechnology).subscribe(
                    _ => {
                    },
                    error => {
                        this.activeModal.close(error);
                    }
                );
            }
        });
    }

}
