import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Contract} from './contract.model';
import {Company} from '../company/company.model';
import {ContractService} from './contract.service';
import {CompanyService} from '../company/company.service';

@Component({
    selector: 'app-contract-details',
    template: `
        <div>
            <div class="d-flex flex-column border rounded p-2 mt-3 w-50 mx-auto">
                <div class="d-flex justify-content-between">
                    <h2>{{'contract.details.header' | translate }}{{contract.contractNumber}}</h2>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="companyName">{{'contract.details.company-name' | translate}} </label>
                        <input class="form-control" value="{{contract.companyName}}" name="companyName" disabled>
                    </div>
                    <div class="form-group">
                        <label for="taxNumber">{{'contract.details.tax-number' | translate}} </label>
                        <input class="form-control" value="{{contract.taxNumber}}" name="taxNumber" disabled>
                    </div>
                    <div class="form-group">
                        <label for="address">{{'contract.details.address' | translate}} </label>
                        <textarea class="form-control" value="{{company.address}}" name="address" disabled>
                        </textarea>
                    </div>
                    <div class="form-group">
                        <label for="project">{{'contract.details.project-name' | translate}} </label>
                        <input class="form-control" value="{{contract.projectName}}" name="project" disabled>
                    </div>
                    <div class="form-group">
                        <label for="amount">{{'contract.details.amount' | translate}} </label>
                        <input class="form-control" value="{{contract.amount}}" name="amount" disabled>
                    </div>
                    <div class="form-group">
                        <label for="conditions">{{'contract.details.conditions' | translate}} </label>
                        <textarea class="form-control" value="{{contract.conditions}}" name="conditions" disabled
                                  style="resize: none"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ContractDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    contract: Contract = {
        amount: 0,
        companyName: '',
        taxNumber: 0,
        contractNumber: '',
        projectId: 0,
        projectName: ''
    };
    company: Company = {
        address: '',
        name: '',
        taxNumber: 0
    };
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(private contractService: ContractService,
                private companyService: CompanyService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const contractId = +this.route.snapshot.paramMap.get('id');
        this.contractService.getContract(contractId).subscribe(
            (contract) => {
                this.contract = contract;
                this.companyService.getCompany(contract.taxNumber).subscribe(
                    (company) => {
                        this.company = company;
                    }
                );
            }
        );
    }
}
