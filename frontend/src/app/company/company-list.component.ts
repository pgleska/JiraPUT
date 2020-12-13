import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CompanyEditComponent} from './company-edit.component';
import {CompanyDeleteComponent} from './company-delete.component';
import {CompanyAddComponent} from './company-add.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CompanyService} from './company.service';
import {Company} from './company.model';


@Component({
    selector: 'app-company-list',
    template: `
        <ngb-alert #errorAlert
                   *ngIf="error_message"
                   [type]="'danger'"
                   [dismissible]="false"
                   (closed)=" error_message = ''"
                   class="text-center">
            {{error_message | translate}}
        </ngb-alert>
        <ngb-alert #successAlert
                   *ngIf="success_message"
                   [type]="'success'"
                   [dismissible]="false"
                   (closed)=" success_message = ''"
                   class="text-center">
            {{success_message | translate}}
        </ngb-alert>
        <form>
            <div class="form-group form-inline">
                Full text search: <input class="form-control ml-2" type="text" name="searchTerm" [ngModel]
                                         (ngModelChange)="onSearch($event)"/>
                <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openAdd()">{{'company.list.button' | translate}}</a>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="nameDisplay" (sort)="onSort($event)">{{'company.list.name' | translate}}</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let company of service.companies$ | async">
                    <th>{{company.nameDisplay}}</th>
                    <td><a (click)="openEdit(company)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(company)"><i class="fa fa-trash fa-2x btn"></i></a></td>
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
export class CompanyListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public service: CompanyService,
                private modalService: NgbModal) {
        this.service.getCompanyList().subscribe(result => {
                this.service.allCompanyList = result;
                this.service.search$.next();
            }
        );
    }

    ngOnInit(): void {
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
        const modalRef = this.modalService.open(CompanyAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(company: Company) {
        const modalRef = this.modalService.open(CompanyDeleteComponent);
        modalRef.componentInstance.company = company;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openEdit(company: Company) {
        const modalRef = this.modalService.open(CompanyEditComponent);
        modalRef.componentInstance.company = company;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    private showInfo(result) {
        if (result.includes('error')) {
            this.error_message = result;
            this.errorSubject.next(result);
        } else {
            this.success_message = result;
            this.successSubject.next(result);
        }
    }

}
