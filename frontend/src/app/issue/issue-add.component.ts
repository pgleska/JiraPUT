import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue, ISSUE_TYPES, IssueTypes, TASK_TYPES} from './issue.model';
import {SelectItem} from '../common/select/select-item.model';
import {ProjectService} from '../project/project.service';
import {EmployeeService} from '../employee/employee.service';
import {TeamService} from '../team/team.service';
import {convertStringToTime} from '../common/date-transformation/convert-time.functions';


@Component({
    selector: 'app-issue-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'issue.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #issueForm="ngForm" (ngSubmit)="onSubmit(issueForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'issue.add.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            [ngModel]
                            #name="ngModel"
                            required
                            [maxlength]="63"
                    />
                    <app-input-error [control]="name.control" [maxLength]="63"></app-input-error>
                </div>
                <div>
                    <label for="description">{{'issue.add.description' | translate}}</label>
                    <textarea
                            type="text"
                            id="description"
                            name="description"
                            class="form-control"
                            [ngModel]
                            #description="ngModel"
                            [maxlength]="65535"
                    ></textarea>
                    <app-input-error [control]="description.control" [maxLength]="65535"></app-input-error>
                </div>
                <div>
                    <label for="estimatedTime">{{'issue.add.estimated-time' | translate}}</label>
                    <input
                            type="text"
                            id="estimatedTime"
                            name="estimatedTime"
                            class="form-control"
                            [ngModel]
                            #estimatedTime="ngModel"
                            timeValidator
                    />
                    <app-input-error [control]="estimatedTime.control"></app-input-error>
                </div>
                <div>
                    <label for="realTime">{{'issue.add.real-time' | translate}}</label>
                    <input
                            type="text"
                            id="realTime"
                            name="realTime"
                            class="form-control"
                            [ngModel]
                            #realTime="ngModel"
                            timeValidator
                    />
                    <app-input-error [control]="realTime.control"></app-input-error>
                </div>
                <div class="required">
                    <app-select [label]="'issue.list.type' | translate"
                                [options]="types"
                                [name]="'type'"
                                [required]="true"
                                (value)="onIssueTypeChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'" class="required">
                    <app-select [label]="'issue.add.project' | translate"
                                [name]="'project'"
                                [required]="type === 'epic'"
                                [options]="projects">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-datepicker [label]="'issue.add.realisation-date' | translate"
                                    [name]="'realizationDate'">
                    </app-datepicker>
                </div>
                <div *ngIf="type === 'story'" class="required">
                    <app-select [label]="'issue.add.epic' | translate"
                                [options]="epics"
                                [name]="'epic'"
                                [required]="type === 'story'">
                    </app-select>
                </div>
                <div *ngIf="type === 'story'" class="required">
                    <app-select [label]="'issue.add.team' | translate"
                                [options]="teams"
                                [name]="'team'"
                                [required]="type === 'story'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.add.task-type' | translate"
                                [options]="taskTypes"
                                [name]="'taskType'"
                                [required]="type === 'task'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.add.story' | translate"
                                [options]="stories"
                                [name]="'story'"
                                [required]="type === 'task'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.add.employees' | translate"
                                [options]="employees"
                                [name]="'employee'"
                                [required]="type === 'task'">
                    </app-select>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!issueForm.valid">{{'issue.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class IssueAddComponent implements OnInit {

    private issue: Issue = {
        timeDifference: undefined,
        id: 0,
        name: '',
        description: '',
        estimatedTime: 0,
        realTime: 0,
        type: undefined,
        typeName: undefined
    };
    types = ISSUE_TYPES;
    taskTypes = TASK_TYPES;
    type: IssueTypes;
    projects: SelectItem[] = [];
    epics: SelectItem[] = [];
    teams: SelectItem[] = [];
    stories: SelectItem[] = [];
    employees: SelectItem[] = [];

    constructor(public activeModal: NgbActiveModal,
                private issueService: IssueService,
                private projectService: ProjectService,
                private employeeService: EmployeeService,
                private teamService: TeamService) {
    }

    ngOnInit(): void {

        this.issueService.getIssueList().subscribe(result => {
            result.forEach(issue => {
                const item = {
                    id: issue.id,
                    name: `${issue.id} - ${issue.name}`
                };
                if (issue.type === 'epic') {
                    this.epics.push(item);
                }
                if (issue.type === 'story') {
                    this.stories.push(item);
                }
            });
        });

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
        if (!!form.value.description) {
            this.issue.description = form.value.description;
        } else {
            this.issue.description = undefined;
        }
        this.issue.type = this.type;
        this.issue.realTime = convertStringToTime(form.value.realTime);
        this.issue.estimatedTime = convertStringToTime(form.value.estimatedTime);
        switch (this.type) {
            case 'epic':
                this.issue.projectId = form.value.project.id as number;
                const realizationDate = form.value.realizationDate;
                if (!!realizationDate) {
                    this.issue.realizationDate = new Date(realizationDate.year, realizationDate.month - 1, realizationDate.day, 12, 0, 0, 0).toISOString();
                }
                break;
            case 'story':
                this.issue.epicId = form.value.epic.id as number;
                this.issue.teamName = form.value.team.id;
                break;
            case 'task':
                this.issue.taskType = form.value.taskType.id as number;
                this.issue.storyId = form.value.story.id as number;
                this.issue.userLogin = form.value.employee.id as string;
                break;
        }

        const addObservable = this.issueService.createIssue(this.issue);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('issue.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

    onIssueTypeChanged($event: SelectItem) {
        if (!!$event) {
            switch ($event.id) {
                case 'epic':
                    this.type = 'epic';
                    break;
                case 'story':
                    this.type = 'story';
                    break;
                case 'task':
                    this.type = 'task';
                    break;
            }
        } else {
            this.type = undefined;
        }
        this.issue.type = this.type;
        this.issue.taskType = undefined;
        this.issue.storyId = undefined;
        this.issue.userLogin = undefined;
        this.issue.epicId = undefined;
        this.issue.teamName = undefined;
        this.issue.realizationDate = undefined;
        this.issue.projectId = undefined;
    }
}
