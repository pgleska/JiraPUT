import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {TechnologyService} from './technology.service';
import {TechnologyAddComponent} from './technology-add.component';
import {Technology} from './technology.model';
import {TechnologyDeleteComponent} from './technology-delete.component';
import {TechnologyEditComponent} from './technology-edit.component';


@Component({
    selector: 'app-technology-list',
    template: `
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
        <form>
            <div class="form-group d-flex flex-row justify-content-between border rounded mt-3 px-2">
                <div class="p-2">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2 mt-3">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'technology.list.button' | translate}}</a>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'technology.list.name' | translate}}</th>
                    <th>{{'technology.list.details' | translate}}</th>
                    <th>{{'common.edit' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let technology of service.technologies$ | async">
                    <th>{{technology.name}}</th>
                    <td><a routerLink="/technology/{{technology.id}}">{{'technology.list.details' | translate}}</a></td>
                    <td><a (click)="openEdit(technology)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(technology)"><i class="fa fa-trash fa-2x btn"></i></a></td>
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
export class TechnologyListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public service: TechnologyService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.service.getTechnologyList().subscribe(result => {
                this.service.allTechnologyList = result;
                this.service.search$.next();
            }
        );

        this.errorSubject.pipe(debounceTime(10000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(10000)).subscribe(() => {
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
        const modalRef = this.modalService.open(TechnologyAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(technology: Technology) {
        const modalRef = this.modalService.open(TechnologyDeleteComponent);
        modalRef.componentInstance.technology = technology;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openEdit(technology: Technology) {
        const modalRef = this.modalService.open(TechnologyEditComponent);
        modalRef.componentInstance.technology = technology;
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
        }
    }

}
