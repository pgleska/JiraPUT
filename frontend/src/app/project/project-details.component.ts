import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {debounceTime} from 'rxjs/internal/operators';
import {Project} from './project.model';
import {ProjectService} from './project.service';
import {ContractService} from '../contract/contract.service';
import {ProjectEditComponent} from './project-edit.component';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {convertTimeDifferenceToString, convertTimeToString} from '../common/date-transformation/convert-time.functions';
import {IssueService} from '../issue/issue.service';
import {map} from 'rxjs/operators';


@Component({
    selector: 'app-project-details',
    template: `
        <div>
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
                        <label for="description">{{'project.details.description' | translate}} </label>
                        <textarea class="form-control" value="{{project.description}}" name="description" disabled
                                  style="resize: none"></textarea>
                    </div>
                    <div class="form-group overflow-auto" style="width: 227px">
                        <label for="salary">{{'project.details.technologies' | translate}}</label>
                        <div>
                            <app-technology-tag *ngFor="let technology of project.technologies"
                                                [name]="technology.name"></app-technology-tag>
                        </div>
                    </div>
                </div>
                <h4>{{'project.details.contracts' | translate}}</h4>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="contractNumber"
                            (sort)="onSortContract($event)">{{'contract.list.contract-number' | translate}}</th>
                        <th scope="col" sortable="companyName"
                            (sort)="onSortContract($event)">{{'contract.list.company-name' | translate}}</th>
                        <th scope="col" sortable="projectName"
                            (sort)="onSortContract($event)">{{'contract.list.project-name' | translate}}</th>
                        <th scope="col" sortable="amount" (sort)="onSortContract($event)">{{'contract.list.amount' | translate}}</th>
                        <th>{{'contract.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let contract of contractService.contracts$ | async">
                        <th>{{contract.contractNumber}}</th>
                        <td>{{contract.companyName}}</td>
                        <td>{{contract.projectName}}</td>
                        <td>{{contract.amount}}</td>
                        <td><a routerLink="/contract/{{contract.id}}">{{'contract.list.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="contractService.total$ | async"
                            (page)="onPageContract($event)">
                    </app-pagination>
                </div>
                <h4>{{'project.details.epics' | translate}}</h4>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col" sortable="id" (sort)="onSortIssue($event)">{{'issue.list.id' | translate}}</th>
                        <th scope="col" sortable="name" (sort)="onSortIssue($event)">{{'issue.list.name' | translate}}</th>
                        <th scope="col" sortable="estimatedTime"
                            (sort)="onSortIssue($event)">{{'issue.list.estimated-time' | translate}}</th>
                        <th scope="col" sortable="realTime" (sort)="onSortIssue($event)">{{'issue.list.real-time' | translate}}</th>
                        <th scope="col" sortable="differenceTime"
                            (sort)="onSortIssue($event)">{{'issue.list.difference-time' | translate}}</th>
                        <th>{{'issue.list.details' | translate}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let issue of issueService.issues$ | async">
                        <th>{{issue.id}}</th>
                        <th>{{issue.name}}</th>
                        <td>{{convertTimeToString(issue.estimatedTime)}}</td>
                        <td>{{convertTimeToString(issue.realTime)}}</td>
                        <td>{{convertTimeDifferenceToString(issue.timeDifference)}}</td>
                        <td><a routerLink="/issue/{{issue.id}}">{{'issue.list.details' | translate}}</a></td>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="issueService.total$ | async"
                            (page)="onPageIssue($event)">
                    </app-pagination>
                </div>
            </div>

        </div>
    `
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    project: Project = {name: '', version: '', technologies: []};
    convertTimeToString = convertTimeToString;
    convertTimeDifferenceToString = convertTimeDifferenceToString;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(private projectService: ProjectService,
                public contractService: ContractService,
                public issueService: IssueService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.contractService.resetState();
        const projectId = +this.route.snapshot.paramMap.get('id');
        this.projectService.getProject(projectId).subscribe(
            (project) => {
                this.project = project;
                this.contractService.getContractList().pipe(
                    map(contracts => contracts.filter(contract => this.project.id === contract.projectId))
                ).subscribe((contract) => {
                        this.contractService.allContractList = contract;
                        this.contractService.filterContractList();
                        this.contractService.search$.next();
                    }
                );
                this.issueService.getEpicListByProjectId(this.project.id).subscribe(
                    (result) => {
                        this.issueService.allIssueList = result;
                        this.issueService.filterIssueList();
                        this.issueService.search$.next();
                    }
                );
            }
        );

        this.errorSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.errorAlert) {
                this.errorAlert.close();
            }
        });

        this.successSubject.pipe(debounceTime(15000)).subscribe(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        });

        const success = JSON.parse(localStorage.getItem('success'));
        if (!!success) {
            this.successMessage = success;
            this.successSubject.next(success);
            localStorage.removeItem('success');
        }

        this.contractService.search$.next();
        this.issueService.search$.next();
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSortContract($event: SortEvent) {
        const contractHeaders = ['contractNumber', 'companyName', 'projectName', 'amount'];
        this.headers
            .filter(header => contractHeaders.includes(header.sortable))
            .forEach(header => {
                    if (header.sortable !== $event.column) {
                        header.direction = '';
                    }
                }
            );

        this.contractService.state.sortColumn = $event.column;
        this.contractService.state.sortDirection = $event.direction;
        this.contractService.search$.next();
    }

    onPageContract($event: number) {
        this.contractService.state.page = $event;
        this.contractService.search$.next();
    }

    onSortIssue($event: SortEvent) {
        const issueHeaders = ['id', 'name', 'estimatedTime', 'realTime', 'differenceTime'];
        this.headers
            .filter(header => issueHeaders.includes(header.sortable))
            .forEach(header => {
                    if (header.sortable !== $event.column) {
                        header.direction = '';
                    }
                }
            );

        this.issueService.state.sortColumn = $event.column;
        this.issueService.state.sortDirection = $event.direction;
        this.issueService.search$.next();
    }

    onPageIssue($event: number) {
        this.issueService.state.page = $event;
        this.issueService.search$.next();
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
            this.errorMessage = result;
            this.errorSubject.next(result);
        } else {
            localStorage.setItem('success', JSON.stringify(result));
            window.location.reload();
        }
    }
}
