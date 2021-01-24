import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Project} from './project.model';
import {ProjectAddComponent} from './project-add.component';
import {ProjectService} from './project.service';
import {ProjectEditComponent} from './project-edit.component';
import {ProjectDeleteComponent} from './project-delete.component';


@Component({
    selector: 'app-project-list',
    template: `
        <div class="my-2">
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
        </div>
        <form>
            <div class="form-group d-flex flex-row justify-content-between border rounded mt-3 px-2">
                <div class="p-2">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2 mt-3">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'project.list.button' | translate}}</a>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="name" (sort)="onSort($event)">{{'project.list.name' | translate}}</th>
                    <th scope="col" sortable="version" (sort)="onSort($event)">{{'project.list.version' | translate}}</th>
                    <th>{{'project.list.details' | translate}}</th>
                    <th>{{'common.edit' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let project of service.projects$ | async">
                    <th>{{project.name}}</th>
                    <th>{{project.version}}</th>
                    <td><a routerLink="/project/{{project.id}}">{{'project.list.details' | translate}}</a></td>
                    <td><a (click)="openEdit(project)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(project)"><i class="fa fa-trash fa-2x btn"></i></a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="service.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>
    `
})
export class ProjectListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public service: ProjectService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.service.getProjectList().subscribe(result => {
                this.service.allProjectList = result;
                this.service.search$.next();
            }
        );

        this.errorSubject.pipe(debounceTime(2000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(2000)).subscribe(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        });
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSort($event: SortEvent) {
        this.headers.forEach(header => {
                if (header.sortable !== $event.column) {
                    header.direction = '';
                }
            }
        );

        this.service.state.sortColumn = $event.column;
        this.service.state.sortDirection = $event.direction;
        this.service.search$.next();
    }

    onSearch($event: string) {
        this.service.state.searchTerm = $event;
        this.service.search$.next();
    }

    onPage($event: number) {
        this.service.state.page = $event;
        this.service.search$.next();
    }

    openAdd() {
        const modalRef = this.modalService.open(ProjectAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(project: Project) {
        const modalRef = this.modalService.open(ProjectDeleteComponent);
        modalRef.componentInstance.project = project;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openEdit(project: Project) {
        const modalRef = this.modalService.open(ProjectEditComponent);
        modalRef.componentInstance.project = project;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            this.successMessage = result;
            this.successSubject.next(result);
            setTimeout(window.location.reload.bind(window.location), 2000);
        }
    }

}
