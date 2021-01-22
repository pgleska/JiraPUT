import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue, ISSUE_TYPES, IssueTypes, TASK_TYPES} from './issue.model';
import {parseToInt, SelectItem} from '../common/select/select-item.model';
import {ProjectService} from '../project/project.service';
import {EmployeeService} from '../employee/employee.service';
import {TeamService} from '../team/team.service';
import {$e} from 'codelyzer/angular/styles/chars';


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
                <div>
                    <label for="name">{{'issue.add.name' | translate}}</label>
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
                    <label for="name">{{'issue.add.description' | translate}}</label>
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
                <div>

                </div>
                <div>
                    <app-select [label]="'issue.list.subtype' | translate"
                                [options]="types" (value)="onIssueTypeChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-select [label]="'issue.add.project' | translate"
                                [options]="projects" (value)="onProjectChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-datepicker [label]="'issue.add.realisation-date' | translate" (date)="onDateChange($event)">
                    </app-datepicker>
                </div>
                <div *ngIf="type === 'story'">
                    <app-select [label]="'issue.add.epic' | translate"
                                [options]="epics" (value)="onEpicChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'story'">
                    <app-select [label]="'issue.add.team' | translate"
                                [options]="teams" (value)="onTeamChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.add.task-type' | translate"
                                [options]="taskTypes" (value)="onTaskTypeChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.add.story' | translate"
                                [options]="stories" (value)="onStoryChanged($event)">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'">
                    <app-select [label]="'issue.add.employees' | translate"
                                [options]="employees" (value)="onEmployeeChanged($event)">
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
        subtype: undefined,
        subtypeName: undefined
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
        if (!form.valid
            || !this.issue.subtype) {
            return;
        }

        this.issue.name = form.value.name;
        this.issue.description = form.value.description;

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
        this.issue.subtype = this.type;
        this.issue.taskType = undefined;
        this.issue.storyId = undefined;
        this.issue.userLogin = undefined;
        this.issue.epicId = undefined;
        this.issue.teamName = undefined;
        this.issue.realizationDate = undefined;
        this.issue.projectId = undefined;
    }


    onProjectChanged($event: SelectItem) {
        this.issue.projectId = parseToInt($event);
    }

    onDateChange($event: string) {
        this.issue.realizationDate = $event;
    }

    onEpicChanged($event: SelectItem) {
        this.issue.epicId = parseToInt($event);
    }

    onTeamChanged($event: SelectItem) {
        this.issue.teamName = $event.id.toString();
    }

    onTaskTypeChanged($event: SelectItem) {
        this.issue.taskType = parseToInt($event);
    }

    onEmployeeChanged($event: SelectItem) {
        this.issue.userLogin = $event.id.toString();
    }

    onStoryChanged($event: SelectItem) {
        this.issue.storyId = parseToInt($event);
    }
}
