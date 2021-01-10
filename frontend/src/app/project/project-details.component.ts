import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {Project} from './project.model';
import {Contract} from '../contract/contract.model';
import {ProjectService} from './project.service';
import {ContractService} from '../contract/contract.service';
import {ProjectEditComponent} from './project-edit.component';
import {SortEvent} from '../common/list-components/sort/sort.model';


@Component({
    selector: 'app-project-details',
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
                    <h2>{{'project.details.header' | translate }}{{project.name}}</h2>
                    <a class="btn btn-primary btn-lg" (click)="openEdit()">{{'project.details.edit' | translate}}</a>
                </div>
                <div class="d-flex flex-column align-items-center ">
                    <div class="form-group">
                        <label for="companyName">{{'project.details.version' | translate}} </label>
                        <input class="form-control" value="{{project.version}}" name="companyName" disabled>
                    </div>
                    <div class="form-group">
                        <label for="companyName">{{'project.details.description' | translate}} </label>
                        <textarea class="form-control" value="{{project.description}}" name="companyName" disabled style="resize: none"></textarea>
                    </div>
                    <div class="form-group" style="width: 227px">
                        <label for="salary">{{'project.details.technologies' | translate}}</label>
                        <div>
                            <app-technology-tag *ngFor="let technology of project.technologies" [name]="technology.name"></app-technology-tag>
                        </div>
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
export class ProjectDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    project: Project = {name: '', version: '', technologies: []};
    contractList: Contract[] = [];
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(private projectService: ProjectService,
                private contractService:ContractService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        const projectId = +this.route.snapshot.paramMap.get('id');
        this.projectService.getProject(projectId).subscribe(
            (project) => {
                this.project = project;
                for (let contractNumber of project.contracts) {
                    this.contractService.getContract(contractNumber).subscribe(
                        (contract) => {
                            this.contractList.push(contract);
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
        const modalRef = this.modalService.open(ProjectEditComponent);
        modalRef.componentInstance.project = this.project;
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
