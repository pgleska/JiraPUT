import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Contract} from './contract.model';
import {ContractService} from './contract.service';
import {SelectItem} from '../common/select/select-item.model';
import {CompanyService} from '../company/company.service';
import {ProjectService} from '../project/project.service';


@Component({
    selector: 'app-contract-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'contract.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #contractForm="ngForm" (ngSubmit)="onSubmit(contractForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'contract.add.contract-number' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            [ngModel]
                            #name="ngModel"
                            required
                            [maxlength]="31"
                    />
                    <app-input-error [control]="name.control" [maxLength]="31"></app-input-error>
                </div>
                <div class="required">
                    <app-select [label]="'contract.list.company-name' | translate"
                                [options]="companyList"
                                [name]="'company'"
                                [required]="true">
                    </app-select>
                </div>
                <div class="required">
                    <app-select [label]="'contract.list.project-name' | translate"
                                [options]="projectList"
                                [name]="'project'"
                                [required]="true">
                    </app-select>
                </div>
                <div class="required">
                    <label for="amount" class="control-label">{{'contract.add.amount' | translate}}</label>
                    <input
                            type="number"
                            id="amount"
                            name="amount"
                            class="form-control"
                            [ngModel]
                            #amount="ngModel"
                            required
                            negativeValueValidator
                            maxValueValidator
                            maxValue="999999999999.99"
                            min="0"
                            max="999999999999.99"
                    />
                    <app-input-error [control]="amount.control"></app-input-error>
                </div>
                <div>
                    <label for="conditions">{{'contract.add.conditions' | translate}}</label>
                    <textarea
                            type="text"
                            id="conditions"
                            name="conditions"
                            class="form-control"
                            [ngModel]
                            #conditions="ngModel"
                            [maxlength]="65535"
                    ></textarea>
                    <app-input-error [control]="conditions.control" [maxLength]="65535"></app-input-error>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!contractForm.valid">{{'contract.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class ContractAddComponent implements OnInit {

    companyList: SelectItem[] = [];
    projectList: SelectItem[] = [];
    private company: SelectItem;
    private project: SelectItem;
    private contract: Contract = {
        taxNumber: 0,
        projectId: 0,
        contractNumber: '',
        companyName: '',
        projectName: '',
        amount: 0,
        conditions: null
    };

    constructor(public activeModal: NgbActiveModal,
                private contractService: ContractService,
                private companyService: CompanyService,
                private projectService: ProjectService) {
    }

    ngOnInit(): void {
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
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }
        this.contract.contractNumber = form.value.name;
        this.contract.projectId = form.value.project.id as number;
        this.contract.projectName = form.value.project.name;
        this.contract.taxNumber = form.value.company.id as number;
        this.contract.companyName = form.value.company.name;
        this.contract.amount = form.value.amount;
        if (!!form.value.conditions) {
            this.contract.conditions = form.value.conditions;
        } else {
            this.contract.conditions = undefined;
        }

        const addObservable = this.contractService.createContract(this.contract);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('contract.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
