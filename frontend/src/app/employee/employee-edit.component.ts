import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Employee} from './employee.model';
import {EmployeeService} from './employee.service';
import {SelectItem} from '../common/select/select-item.model';
import {PositionService} from '../position/position.service';
import {TeamService} from '../team/team.service';
import {Position} from '../position/position.model';
import {TechnologyService} from '../technology/technology.service';


@Component({
    selector: 'app-employee-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'employee.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #employeeForm="ngForm" (ngSubmit)="onSubmit(employeeForm)">
                <div>
                    <label for="login">{{'employee.edit.login' | translate}}</label>
                    <input type="text"
                           id="login"
                           name="login"
                           class="form-control"
                           [ngModel]
                           #login="ngModel"
                           required
                    />
                    <app-input-error [control]="login.control"></app-input-error>
                </div>
                <div>
                    <label for="firstName">{{'employee.details.first-name' | translate}} </label>
                    <input type="text"
                           id="firstName"
                           name="firstName"
                           class="form-control"
                           [ngModel]
                           #firstName="ngModel"
                           required
                    />
                    <app-input-error [control]="firstName.control"></app-input-error>
                </div>
                <div>
                    <label for="lastName">{{'employee.details.last-name' | translate}} </label>
                    <input type="text"
                           id="lastName"
                           name="lastName"
                           class="form-control"
                           [ngModel]
                           #lastName="ngModel"
                           required>
                    <app-input-error [control]="lastName.control"></app-input-error>
                </div>
                <div>
                    <app-select [label]="'employee.list.team' | translate"
                                [options]="teamList" (value)="onTeamChanged($event)">
                    </app-select>
                </div>
                <div>
                    <app-select [label]="'employee.list.position' | translate"
                                [options]="positionListDropdown" (value)="onPositionChanged($event)">
                    </app-select>
                </div>
                <div>
                    <label for="salary">{{'employee.details.salary' | translate}} </label>
                    <input
                            type="number"
                            id="salary"
                            name="salary"
                            class="form-control"
                            [ngModel]
                            #salary="ngModel"
                            required
                            negativeValueValidator
                            salaryValidator
                            [position]="positionDetails"
                            min="0"/>
                    <app-input-error [control]="salary.control"></app-input-error>
                </div>
                <div>
                    <label for="salary">{{'employee.details.technologies' | translate}} </label>
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
                    <button type="submit" [disabled]="!employeeForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'employee.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class EmployeeEditComponent implements OnInit {
    @Input() employee: Employee;
    employeeCopy: Employee;
    positionListDropdown: SelectItem[] = [];
    positionList: Position[] = [];
    positionDetails: Position;
    teamList: SelectItem[] = [];
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

    @ViewChild('employeeForm') form: NgForm;
    position: SelectItem;
    private team: SelectItem;

    constructor(public activeModal: NgbActiveModal,
                private employeeService: EmployeeService,
                private positionService: PositionService,
                private teamService: TeamService,
                private technologyService: TechnologyService) {
    }

    ngOnInit(): void {
        this.employeeCopy = Object.assign({}, this.employee);
        setTimeout(() => {
            this.form.setValue({
                login: this.employeeCopy.login,
                firstName: this.employeeCopy.firstName,
                lastName: this.employeeCopy.lastName,
                //position: {id: this.employeeCopy.position, name: this.employeeCopy.positionDisplay},
                //team: {id: this.employeeCopy.team, name: this.employeeCopy.team},
                salary: this.employeeCopy.salary,
                technologies: Object.assign([], this.employeeCopy.technologies)
            });
        });

        this.positionService.getPositionList().subscribe(result => {
            result.forEach(position => {
                const item = {
                    id: position.name,
                    name: position.nameDisplay
                };
                this.positionListDropdown.push(item);
                this.positionList.push(position);
            });
        });

        this.teamService.getTeamList().subscribe(result => {
            result.forEach(team => {
                const item = {
                    id: team.name,
                    name: team.name
                };
                this.teamList.push(item);
            });
        });

        this.technologyService.getTechnologyList().subscribe(result => {
            this.dropdownList = result;
        });

        this.dropdownSettings = {
            singleSelection: false,
            searchPlaceholderText: 'employee.edit.search',
            selectAllText: 'employee.edit.select-all',
            unSelectAllText: 'employee.edit.unselect-all',
            allowSearchFilter: true
        };

    }

    onPositionChanged($event: SelectItem) {
        this.position = $event;
        this.positionDetails = this.positionList.filter(position => position.name === $event.id)[0];
    }

    onTeamChanged($event: SelectItem) {
        this.team = $event;
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        // todo naprawic przesylanie i wymaganie zespołu oraz stanowiska
        this.employeeCopy.firstName = form.value.firstName;
        this.employeeCopy.lastName = form.value.lastName;
        this.employeeCopy.salary = form.value.salary;
        this.employeeCopy.technologies = this.selectedItems;

        const editObservable = this.employeeService.modifyEmployee(this.employeeCopy);
        editObservable.subscribe(
            _ => {
                this.employee = Object.assign({}, this.employeeCopy);
                this.activeModal.close('employee.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
