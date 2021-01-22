import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContractDeleteComponent} from './contract-delete.component';
import {ContractAddComponent} from './contract-add.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ContractService} from './contract.service';
import {Contract} from './contract.model';
import {SelectItem} from '../common/select/select-item.model';
import {CompanyService} from '../company/company.service';
import {ProjectService} from '../project/project.service';


@Component({
    selector: 'app-contract-list',
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
            <div class="form-group d-flex flex-row border rounded mt-3 px-2">
                <div class="p-2">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2">
                    <app-select [label]="'contract.list.company-name' | translate"
                                [name]="'company'"
                                [options]="companyList"
                                [required]="false"
                                (value)="onCompanyChanged($event)">
                    </app-select>
                </div>
                <div class="p-2">
                    <app-select [label]="'contract.list.project-name' | translate"
                                [name]="'project'"
                                [options]="projectList"
                                [required]="false"
                                (value)="onProjectChanged($event)">
                    </app-select>
                </div>
                <div class="p-2">
                    <label for="minimumSalary">{{'contract.list.minimum-amount' | translate}}</label>
                    <input class="form-control" type="number" name="minimumSalary" [ngModel]
                           (ngModelChange)="onMinimumAmount($event)"/>
                </div>
                <div class="p-2">
                    <label for="maximumSalary">{{'contract.list.maximum-amount' | translate}}</label>
                    <input class="form-control" type="number" name="maximumSalary" [ngModel]
                           (ngModelChange)="onMaximumAmount($event)"/>
                </div>
                <div class="p-2 mt-1">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'contract.list.button' | translate}}</a>
                </div>
            </div>


            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="contractNumber" (sort)="onSort($event)">{{'contract.list.contract-number' | translate}}</th>
                    <th scope="col" sortable="companyName" (sort)="onSort($event)">{{'contract.list.company-name' | translate}}</th>
                    <th scope="col" sortable="projectName" (sort)="onSort($event)">{{'contract.list.project-name' | translate}}</th>
                    <th scope="col" sortable="amount" (sort)="onSort($event)">{{'contract.list.amount' | translate}}</th>
                    <th>{{'contract.list.details' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let contract of contractService.contracts$ | async">
                    <th>{{contract.contractNumber}}</th>
                    <td>{{contract.companyName}}</td>
                    <td>{{contract.projectName}}</td>
                    <td>{{contract.amount}}</td>
                    <td><a routerLink="/contract/{{contract.id}}">{{'contract.list.details' | translate}}</a></td>
                    <td><a (click)="openDelete(contract)"><i class="fa fa-trash fa-2x btn"></i></a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="contractService.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>
    `
})
export class ContractListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    companyList: SelectItem[] = [];
    projectList: SelectItem[] = [];
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    private company: SelectItem;
    private project: SelectItem;
    private minimumAmount: number;
    private maximumAmount: number;
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public contractService: ContractService,
                private companyService: CompanyService,
                private projectService: ProjectService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.contractService.getContractList().subscribe(result => {
                this.contractService.allContractList = result;
                this.contractService.filterContractList(this.company, this.project, this.minimumAmount, this.maximumAmount);
                this.contractService.search$.next();
            }
        );

        this.companyService.getCompanyList().subscribe(result => {
            result.forEach(company => {
                const item = {
                    id: company.taxNumber,
                    name: company.name
                };
                this.companyList.push(item);
            });
        });

        this.projectService.getProjectList().subscribe(result => {
            result.forEach(project => {
                const item = {
                    id: project.id,
                    name: project.name
                };
                this.projectList.push(item);
            });
        });

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

        this.contractService.state.sortColumn = $event.column;
        this.contractService.state.sortDirection = $event.direction;
        this.contractService.search$.next();
    }

    onSearch($event: string) {
        this.contractService.state.searchTerm = $event;
        this.contractService.search$.next();
    }

    onCompanyChanged($event: SelectItem) {
        this.company = $event;
        this.contractService.filterContractList(this.company, this.project, this.minimumAmount, this.maximumAmount);
        this.contractService.search$.next();
    }

    onProjectChanged($event: SelectItem) {
        this.project = $event;
        this.contractService.filterContractList(this.company, this.project, this.minimumAmount, this.maximumAmount);
        this.contractService.search$.next();
    }

    onMinimumAmount($event: number) {
        this.minimumAmount = $event;
        this.contractService.filterContractList(this.company, this.project, this.minimumAmount, this.maximumAmount);
        this.contractService.search$.next();
    }

    onMaximumAmount($event: number) {
        this.maximumAmount = $event;
        this.contractService.filterContractList(this.company, this.project, this.minimumAmount, this.maximumAmount);
        this.contractService.search$.next();
    }

    onPage($event: number) {
        this.contractService.state.page = $event;
        this.contractService.search$.next();
    }

    openAdd() {
        const modalRef = this.modalService.open(ContractAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    openDelete(contract: Contract) {
        const modalRef = this.modalService.open(ContractDeleteComponent);
        modalRef.componentInstance.contract = contract;
        modalRef.result.then((result) => {
            this.showInfo(result);
        }, _ => {
        });
    }

    // openEdit(contract: contract) {
    //     const modalRef = this.modalService.open(ContractEditComponent);
    //     modalRef.componentInstance.contract = contract;
    //     modalRef.result.then((result) => {
    //         this.showInfo(result);
    //     }, _ => {
    //     });
    // }

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
