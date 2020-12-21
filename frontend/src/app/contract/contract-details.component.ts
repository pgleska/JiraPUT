import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {Contract} from './contract.model';
import {Company} from '../company/company.model';
import {Project} from '../project/project.model';
import {ProjectService} from '../project/project.service';
import {ContractService} from './contract.service';
import {CompanyService} from '../company/company.service';

@Component({
    selector: 'app-contract-details',
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
            <h2>{{contract.contractNumber}}</h2>
            <h2>{{contract.companyName}}</h2>
            <h2>{{company.taxNumber}}</h2>
            <h2>{{company.address}}</h2>
            <h2>{{project.name}}</h2>
            <h2>{{contract.amount}}</h2>
            <h2>{{contract.conditions}}</h2>
        </div>
    `
})
export class ContractDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    contract: Contract;
    company: Company;
    project: Project;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(private contractService: ContractService,
                private projectService: ProjectService,
                private companyService: CompanyService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        const contractId = this.route.snapshot.paramMap.get('contractId');
        this.contractService.getContract(contractId).subscribe(
            (contract) => {
                this.contract = contract;
                this.projectService.getProject(contract.projectId).subscribe(
                    (project) => {
                        this.project = project
                    }
                );
                this.companyService.getCompany(contract.companyTaxNumber).subscribe(
                    (company) => {
                        this.company = company
                    }
                );
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
