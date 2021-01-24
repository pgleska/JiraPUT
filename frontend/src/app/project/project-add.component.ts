import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Project} from './project.model';
import {ProjectService} from './project.service';
import {TechnologyService} from '../technology/technology.service';


@Component({
    selector: 'app-project-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'project.add.title' | translate}} </h4>
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
                    <label for="description">{{'project.add.description' | translate}}</label>
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
                    <label for="technologies">{{'employee.details.technologies' | translate}} </label>
                    <app-multiselect
                            [placeholder]="'employee.details.placeholder' | translate"
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
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!projectForm.valid">{{'project.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class ProjectAddComponent implements OnInit {

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    private project: Project = {
        name: '',
        description: null,
        version: '',
        technologies: []
    };

    constructor(public activeModal: NgbActiveModal,
                private projectService: ProjectService,
                private technologyService: TechnologyService) {
    }

    ngOnInit(): void {
        this.technologyService.getTechnologyList().subscribe(result => {
            this.dropdownList = result;
        });

        this.dropdownSettings = {
            singleSelection: false,
            searchPlaceholderText: 'project.add.search',
            selectAllText: 'project.add.select-all',
            unSelectAllText: 'project.add.unselect-all',
            allowSearchFilter: true
        };
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.project.name = form.value.name;
        this.project.version = form.value.version;
        this.project.technologies = this.selectedItems;
        if (!!form.value.description) {
            this.project.description = form.value.description;
        }

        const addObservable = this.projectService.createProject(this.project);
        addObservable.subscribe(
            _ => {
                this.project.technologies.forEach(newTechnology => {
                    this.projectService.addProjectTechnology(this.project, newTechnology).subscribe(
                        __ => {
                        },
                        error => {
                            this.activeModal.close(error);
                        }
                    );
                });
                this.activeModal.close('project.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }
}
