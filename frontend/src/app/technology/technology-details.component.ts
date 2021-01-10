import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {EmployeeService} from '../employee/employee.service';
import {TechnologyService} from './technology.service';
import {Technology} from './technology.model';
import {ProjectService} from '../project/project.service';
import {Employee} from '../employee/employee.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {map} from 'rxjs/internal/operators';
import {Project} from '../project/project.model';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TechnologyEditComponent} from './technology-edit.component';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-technology-details',
    template: `
        <div>
            <ngb-alert #errorAlert
                       *ngIf="errorMessage"
                       [type]="'danger'"
                       [dismissible]="false"
                       (closed)=" errorMessage = ''"
                       class="text-center">
                {{errorMessage | translate}}
            </ngb-alert>
            <ngb-alert #successAlert
                       *ngIf="successMessage"
                       [type]="'success'"
                       [dismissible]="false"
                       (closed)=" successMessage = ''"
                       class="text-center">
                {{successMessage | translate}}
            </ngb-alert>
            <div class="d-flex flex-column border rounded p-2 mt-3 w-50 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'technology.details.header' | translate }}{{technology.name}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'team.details.edit' | translate}}</a>
                </div>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="firstName" (sort)="onSortEmployee($event)">{{'team.details.first-name' | translate}}</th>
                        <th scope="col" sortable="lastName" (sort)="onSortEmployee($event)">{{'team.details.last-name' | translate}}</th>
                        <th scope="col" sortable="positionDisplay"
                            (sort)="onSortEmployee($event)">{{'team.details.position' | translate}}</th>
                        <th>{{'team.details.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let employee of employeeList">
                        <th>{{employee.firstName}}</th>
                        <td>{{employee.lastName}}</td>
                        <td>{{employee.positionDisplay}}</td>
                        <td><a routerLink="/employee/{{employee.login}}">{{'team.details.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="employeeList.length"
                            (page)="onPageEmployee($event)">
                    </app-pagination>
                </div>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="nameDisplay" (sort)="onSortProject($event)">{{'project.list.name' | translate}}</th>
                        <th scope="col" sortable="nameDisplay" (sort)="onSortProject($event)">{{'project.list.version' | translate}}</th>
                        <th>{{'project.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let project of projectList">
                        <th>{{project.name}}</th>
                        <th>{{project.version}}</th>
                        <td><a routerLink="/project/{{project.id}}">{{'project.list.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>

                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="projectList.length"
                            (page)="onPageProject($event)">
                    </app-pagination>
                </div>
            </div>
        </div>
    `
})
export class TechnologyDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    technology: Technology = {id: 0, name: ''};
    employeeList: Employee[] = [];
    projectList: Project[] = [];
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(private employeeService: EmployeeService,
                private technologyService: TechnologyService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.employeeService.resetState();
        this.projectService.resetState();
        const id = +this.route.snapshot.paramMap.get('id');
        this.technologyService.getTechnology(id).subscribe(
            (technology) => {
                this.technology = technology;
                console.log(technology);
            }
        );

        this.employeeService.getEmployeeList().pipe(
            map(employees => employees.filter(employee => employee.technologies?.some(tech => tech.id === id)))
        ).subscribe(result => {
            console.log(result);
            this.employeeList = result;
        });

        this.projectService.getProjectList().pipe(
            map(projects => projects.filter(project => project.technologies?.some(tech => tech.id === id)))
        ).subscribe(result => {
            this.projectList = result;
        });

    }

    openEdit() {
        const modalRef = this.modalService.open(TechnologyEditComponent);
        modalRef.componentInstance.technology = this.technology;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    onSortEmployee($event: SortEvent) {
        this.headers.forEach(header => {
                if (header.sortable !== $event.column) {
                    header.direction = '';
                }
            }
        );

        this.employeeService.state.sortColumn = $event.column;
        this.employeeService.state.sortDirection = $event.direction;
        this.employeeService.search$.next();
    }

    onPageEmployee($event: number) {
        this.employeeService.state.page = $event;
        this.employeeService.search$.next();
    }

    onSortProject($event: SortEvent) {
        this.headers.forEach(header => {
                if (header.sortable !== $event.column) {
                    header.direction = '';
                }
            }
        );

        this.projectService.state.sortColumn = $event.column;
        this.projectService.state.sortDirection = $event.direction;
        this.projectService.search$.next();
    }

    onPageProject($event: number) {
        this.projectService.state.page = $event;
        this.projectService.search$.next();
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            this.successMessage = result;
            this.successSubject.next(result);
        }
    }
}