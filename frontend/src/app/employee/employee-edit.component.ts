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
import {Technology} from '../technology/technology.model';


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
                <div class="required">
                    <label for="login" class="control-label">{{'employee.edit.login' | translate}}</label>
                    <input type="text"
                           id="login"
                           name="login"
                           class="form-control"
                           [ngModel]
                           #login="ngModel"
                           required
                           disabled
                    />
                    <app-input-error [control]="login.control"></app-input-error>
                </div>
                <div class="required">
                    <label for="firstName" class="control-label">{{'employee.details.first-name' | translate}} </label>
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
                <div class="required">
                    <label for="lastName" class="control-label">{{'employee.details.last-name' | translate}} </label>
                    <input type="text"
                           id="lastName"
                           name="lastName"
                           class="form-control"
                           [ngModel]
                           #lastName="ngModel"
                           required>
                    <app-input-error [control]="lastName.control"></app-input-error>
                </div>
                <div class="required">
                    <app-select [label]="'employee.list.team' | translate"
                                [name]="'team'"
                                [options]="teamList"
                                [required]="true">
                    </app-select>
                </div>
                <div class="required">
                    <app-select [label]="'employee.list.position' | translate"
                                [options]="positionListDropdown"
                                [name]="'position'"
                                [required]="true"
                                (value)="onPositionChanged($event)">
                    </app-select>
                </div>
                <div class="required">
                    <label for="salary" class="control-label">{{'employee.details.salary' | translate}} </label>
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

    constructor(public activeModal: NgbActiveModal,
                private employeeService: EmployeeService,
                private positionService: PositionService,
                private teamService: TeamService,
                private technologyService: TechnologyService) {
    }

    ngOnInit(): void {
        this.employeeCopy = Object.assign({}, this.employee);
        setTimeout(() => {
            this.form.controls['login'].setValue(this.employeeCopy.login);
            this.form.controls['firstName'].setValue(this.employeeCopy.firstName);
            this.form.controls['lastName'].setValue(this.employeeCopy.lastName);
            this.form.controls['salary'].setValue(this.employeeCopy.salary);
            this.form.controls['technologies'].setValue(Object.assign([], this.employeeCopy.technologies));
        });

        this.positionService.getPositionList().subscribe(result => {
            result.forEach(position => {
                const item = {
                    id: position.name,
                    name: position.nameDisplay
                };
                this.positionListDropdown.push(item);
                this.positionList.push(position);
                if (item.id == this.employeeCopy.position) {
                    this.form.controls['position'].setValue(item);
                }
            });
        });

        this.teamService.getTeamList().subscribe(result => {
            let emptyTeam = true;
            result.forEach(team => {
                const item = {
                    id: team.name,
                    name: team.name
                };
                this.teamList.push(item);
                if (item.name == this.employeeCopy.team) {
                    this.form.controls['team'].setValue(item);
                    emptyTeam = false;
                }
            });
            const item = {
                id: "",
                name: "Brak zespołu"
            };
            this.teamList.push(item);

            if (emptyTeam) {
                this.form.controls['team'].setValue(item);
            }
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
        if (!!$event) {
            this.positionDetails = this.positionList.filter(position => position.name === $event.id)[0];
            setTimeout(() => {
                this.form.controls['salary'].markAllAsTouched();
                this.form.controls['salary'].updateValueAndValidity();
            })
        }
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.employeeCopy.firstName = form.value.firstName;
        this.employeeCopy.lastName = form.value.lastName;
        this.employeeCopy.salary = form.value.salary;
        this.employeeCopy.position = form.value.position.id as string;
        this.employeeCopy.team = form.value.team.id as string;

        this.employeeCopy.technologies = this.selectedItems;

        const editObservable = this.employeeService.modifyEmployee(this.employeeCopy);
        editObservable.subscribe(
            _ => {
                this.changeTechnologyList(this.employeeCopy.technologies, this.employee.technologies)
                this.employee = Object.assign({}, this.employeeCopy);
                this.activeModal.close('employee.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );

        form.reset();
    }

    private changeTechnologyList(newTechnologyList: Technology[], oldTechnologyList: Technology[]): void {
        newTechnologyList.forEach(newTechnology =>{
            if (!oldTechnologyList.some(oldTechnology => oldTechnology.id === newTechnology.id)){
                this.employeeService.addEmployeeTechnology(this.employeeCopy, newTechnology).subscribe(
                    _ => {},
                    error => {
                        this.activeModal.close(error);
                    }
                );
            }
        });
        oldTechnologyList.forEach(oldTechnology =>{
            if (!newTechnologyList.some(newTechnology => newTechnology.id === oldTechnology.id)){
                this.employeeService.deleteEmployeeTechnology(this.employeeCopy, oldTechnology).subscribe(
                    _ => {},
                    error => {
                        this.activeModal.close(error);
                    }
                );
            }
        });
    }

}
