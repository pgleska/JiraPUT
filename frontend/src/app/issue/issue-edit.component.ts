import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue, ISSUE_TYPES, IssueTypes, TASK_TYPES} from './issue.model';
import {SelectItem} from '../common/select/select-item.model';
import {ProjectService} from '../project/project.service';
import {EmployeeService} from '../employee/employee.service';
import {TeamService} from '../team/team.service';


@Component({
    selector: 'app-issue-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'issue.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #issueForm="ngForm" (ngSubmit)="onSubmit(issueForm)">
                <div>
                    <label for="name">{{'issue.edit.name' | translate}}</label>
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
                    <label for="name">{{'issue.edit.description' | translate}}</label>
                    <textarea
                            type="text"
                            id="description"
                            name="description"
                            class="form-control"
                            [ngModel]
                            #description="ngModel"
                            required
                    ></textarea>
                    <app-input-error [control]="description.control"></app-input-error>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-select [label]="'issue.edit.project' | translate"
                                [options]="projects"
                                [required]="type === 'epic'"
                                [name]="'project'">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-datepicker [label]="'issue.add.realisation-date' | translate"
                                    [required]="type === 'epic'"
                                    [name]="'realisationDate'">
                    </app-datepicker>
                </div>
                <div *ngIf="type === 'story'">
                    <app-select [label]="'issue.edit.epic' | translate"
                                [options]="epics"
                                [required]="type === 'story'"
                                [name]="'epic'">
                    </app-select>
                </div>
                <div *ngIf="type === 'story'">
                    <app-select [label]="'issue.edit.team' | translate"
                                [options]="teams"
                                [required]="type === 'story'"
                                [name]="'team'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.edit.task-type' | translate"
                                [options]="taskTypes"
                                [required]="type === 'task'"
                                [name]="'taskType'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.edit.story' | translate"
                                [options]="stories"
                                [required]="type === 'task'"
                                [name]="'story'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.edit.login' | translate"
                                [options]="employees"
                                [required]="type === 'task'"
                                [name]="'employee'">
                    </app-select>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!issueForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'issue.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class IssueEditComponent implements OnInit {
    @Input() issue: Issue;
    issueCopy: Issue;
    types = ISSUE_TYPES;
    type: IssueTypes;
    taskTypes = TASK_TYPES;
    projects: SelectItem[] = [];
    epics: SelectItem[] = [];
    teams: SelectItem[] = [];
    stories: SelectItem[] = [];
    employees: SelectItem[] = [];
    @ViewChild('issueForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private issueService: IssueService,
                private projectService: ProjectService,
                private employeeService: EmployeeService,
                private teamService: TeamService) {
    }

    ngOnInit(): void {
        this.issueCopy = Object.assign({}, this.issue);
        setTimeout(() => {
            this.form.setValue({
                name: this.issueCopy.name,
                description: this.issueCopy.description
            });
        });
        this.type = this.issueCopy.type;

        this.projectService.getProjectList().subscribe(result => {
            result.forEach(project => {
                const item = {
                    id: project.id,
                    name: project.name
                };
                this.projects.push(item);
            });
        });

        this.employeeService.getEmployeeList().subscribe(result => {
            result.forEach(employee => {
                const item = {
                    id: employee.login,
                    name: `${employee.login} - ${employee.firstName} ${employee.lastName}`
                };
                this.employees.push(item);
            });
        });

        this.teamService.getTeamList().subscribe(result => {
            result.forEach(team => {
                const item = {
                    id: team.name,
                    name: team.name
                };
                this.teams.push(item);
            });
        });

    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.issue.name = form.value.name;
        this.issue.description = form.value.description;
        this.issue.type = this.type;
        switch (this.type) {
            case 'epic':
                this.issue.projectId = form.value.project.id as number;
                this.issue.realizationDate = form.value.realizationDate;
                break;
            case 'story':
                this.issue.epicId = form.value.epic.id as number;
                this.issue.teamName = form.value.team.id as string;
                break;
            case 'task':
                this.issue.taskType = form.value.taskType.id as number;
                this.issue.storyId = form.value.story.id as number;
                this.issue.userLogin = form.value.employee.id as string;
                break;
        }

        const editObservable = this.issueService.modifyIssue(this.issueCopy);
        editObservable.subscribe(
            _ => {
                this.issue = Object.assign({}, this.issueCopy);
                this.activeModal.close('issue.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }
}
