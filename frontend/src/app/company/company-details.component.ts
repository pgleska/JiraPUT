import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {Company} from './company.model';
import {CompanyService} from './company.service';
import {CompanyEditComponent} from './company-edit.component';
import {ContractService} from '../contract/contract.service';
import {Contract} from '../contract/contract.model';
import {SortEvent} from '../common/list-components/sort/sort.model';

@Component({
    selector: 'app-company-details',
    template: `
        <div>
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
            <div class="d-flex flex-column border rounded p-2 mt-3 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'company.details.header' | translate }}{{company.name}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'company.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="taxNumber">{{'company.details.tax-number' | translate}} </label>
                        <input class="form-control" value="{{company.taxNumber}}" name="taxNumber" disabled>
                    </div>
                    <div class="form-group">
                        <label for="address">{{'company.details.address' | translate}} </label>
                        <textarea class="form-control" value="{{company.address}}" name="address" disabled style="resize: none"></textarea>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="contractNumber"
                            (sort)="onSort($event)">{{'contract.list.contract-number' | translate}}</th>
                        <th scope="col" sortable="companyName" (sort)="onSort($event)">{{'contract.list.company-name' | translate}}</th>
                        <th scope="col" sortable="projectName" (sort)="onSort($event)">{{'contract.list.project-name' | translate}}</th>
                        <th scope="col" sortable="amount" (sort)="onSort($event)">{{'contract.list.amount' | translate}}</th>
                        <th>{{'contract.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let contract of contractList">
                        <th>{{contract.contractNumber}}</th>
                        <th>{{contract.companyName}}</th>
                        <th>{{contract.projectName}}</th>
                        <th>{{contract.amount}}</th>
                    </tr>
                    </tbody>
                </table>

                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="contractList.length"
                            (page)="onPage($event)">
                    </app-pagination>
                </div>
            </div>
        </div>
    `
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    company: Company = {
        name: '',
        taxNumber: 0,
        address: ''
    };
    contractList: Contract[] = [];
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(private companyService: CompanyService,
                private contractService: ContractService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.contractService.resetState();
        const companyTaxNumber = +this.route.snapshot.paramMap.get('taxNumber');
        this.companyService.getCompany(companyTaxNumber).subscribe(
            (company) => {
                this.company = company;
                for (let contractNumber of company.contracts) {
                    this.contractService.getContract(contractNumber).subscribe(
                        (contract) => {
                            this.contractList.push(contract);
                            this.contractService.allContractList = this.contractList;
                        }
                    );
                }
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

        this.contractService.state.sortColumn = $event.column;
        this.contractService.state.sortDirection = $event.direction;
        this.contractService.search$.next();
    }

    onPage($event: number) {
        this.contractService.state.page = $event;
        this.contractService.search$.next();
    }

    openEdit() {
        const modalRef = this.modalService.open(CompanyEditComponent);
        modalRef.componentInstance.company = this.company;
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
