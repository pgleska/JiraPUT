import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue, ISSUE_TYPES, IssueTypes, TASK_TYPES} from './issue.model';
import {SelectItem} from '../common/select/select-item.model';
import {ProjectService} from '../project/project.service';
import {EmployeeService} from '../employee/employee.service';
import {TeamService} from '../team/team.service';
import {convertStringToTime, convertTimeToString} from '../common/date-transformation/convert-time.functions';


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
                <div class="required">
                    <label for="name" class="control-label">{{'issue.edit.name' | translate}}</label>
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
                    <label for="name">{{'issue.edit.description' | translate}}</label>
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
                    <label for="estimatedTime">{{'issue.edit.estimated-time' | translate}}</label>
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
                    <label for="realTime">{{'issue.edit.real-time' | translate}}</label>
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
                <div *ngIf="type === 'epic'" class="required">
                    <app-select [label]="'issue.edit.project' | translate"
                                [options]="projects"
                                [required]="type === 'epic'"
                                [name]="'project'">
                    </app-select>
                </div>
                <div *ngIf="type === 'epic'">
                    <app-datepicker [label]="'issue.add.realisation-date' | translate"
                                    [name]="'realizationDate'">
                    </app-datepicker>
                </div>
                <div *ngIf="type === 'story'" class="required">
                    <app-select [label]="'issue.edit.epic' | translate"
                                [options]="epics"
                                [required]="type === 'story'"
                                [name]="'epic'">
                    </app-select>
                </div>
                <div *ngIf="type === 'story'" class="required">
                    <app-select [label]="'issue.edit.team' | translate"
                                [options]="teams"
                                [required]="type === 'story'"
                                [name]="'team'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.edit.task-type' | translate"
                                [options]="taskTypes"
                                [required]="type === 'task'"
                                [name]="'taskType'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.edit.story' | translate"
                                [options]="stories"
                                [required]="type === 'task'"
                                [name]="'story'">
                    </app-select>
                </div>
                <div *ngIf="type === 'task'" class="required">
                    <app-select [label]="'issue.edit.employee' | translate"
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
            this.form.controls['name'].setValue(this.issueCopy.name);
            this.form.controls['description'].setValue(this.issueCopy.description);
            this.form.controls['realTime'].setValue(convertTimeToString(this.issueCopy.realTime as number));
            this.form.controls['estimatedTime'].setValue(convertTimeToString(this.issueCopy.estimatedTime as number));
            if (this.type === 'epic') {
                const splitDate = this.issue.realizationDate.slice(0, 10).split(/-/g);
                this.form.controls['realizationDate'].setValue({
                    year: parseInt(splitDate[0]),
                    month: parseInt(splitDate[1]),
                    day: parseInt(splitDate[2])
                });
            }
            if (this.type === 'task') {
                const taskType = this.taskTypes.find(type => type.id === this.issueCopy.taskType);
                this.form.controls['taskType'].setValue(taskType);
            }

        });
        this.type = this.issueCopy.type;

        this.issueService.getIssueList().subscribe(result => {
            result.forEach(issue => {
                const item = {
                    id: issue.id,
                    name: `${issue.id} - ${issue.name}`
                };
                if (issue.type === 'epic') {
                    this.epics.push(item);
                    if (item.id === this.issueCopy.epicId) {
                        this.form.controls['epic'].setValue(item);
                    }
                }
                if (issue.type === 'story') {
                    this.stories.push(item);
                    if (item.id === this.issueCopy.storyId) {
                        this.form.controls['story'].setValue(item);
                    }
                }
            });
        });

        if (this.type === 'epic') {
            this.projectService.getProjectList().subscribe(result => {
                result.forEach(project => {
                    const item = {
                        id: project.id,
                        name: project.name
                    };
                    this.projects.push(item);
                    if (item.id === this.issueCopy.projectId) {
                        this.form.controls['project'].setValue(item);
                    }
                });
            });
        }

        if (this.type === 'story') {
            this.teamService.getTeamList().subscribe(result => {
                result.forEach(team => {
                    const item = {
                        id: team.name,
                        name: team.name
                    };
                    this.teams.push(item);
                    if (item.id === this.issueCopy.teamName) {
                        this.form.controls['team'].setValue(item);
                    }
                });
            });
        }

        if (this.type === 'task') {
            this.employeeService.getEmployeeList().subscribe(result => {
                result.forEach(employee => {
                    const item = {
                        id: employee.login,
                        name: `${employee.login} - ${employee.firstName} ${employee.lastName}`
                    };
                    this.employees.push(item);
                    if (item.id === this.issueCopy.userLogin) {
                        this.form.controls['employee'].setValue(item);
                    }
                });
            });
        }
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.issueCopy.name = form.value.name;
        this.issueCopy.description = form.value.description;
        this.issueCopy.type = this.type;
        this.issueCopy.realTime = convertStringToTime(form.value.realTime);
        this.issueCopy.estimatedTime = convertStringToTime(form.value.estimatedTime);
        switch (this.type) {
            case 'epic':
                this.issueCopy.projectId = form.value.project.id as number;
                const realizationDate = form.value.realizationDate;
                this.issueCopy.realizationDate = new Date(realizationDate.year, realizationDate.month - 1, realizationDate.day, 12, 0, 0, 0).toISOString();
                break;
            case 'story':
                this.issueCopy.epicId = form.value.epic.id as number;
                this.issueCopy.teamName = form.value.team.id as string;
                break;
            case 'task':
                this.issueCopy.taskType = form.value.taskType.id as number;
                this.issueCopy.storyId = form.value.story.id as number;
                this.issueCopy.userLogin = form.value.employee.id as string;
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
