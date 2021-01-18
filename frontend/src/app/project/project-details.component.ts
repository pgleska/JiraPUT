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
import {convertTimeToString} from '../common/date-transformation/convert-time.functions';
import {IssueService} from '../issue/issue.service';
import {map} from 'rxjs/operators';


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
                        <th>{{contract.companyName}}</th>
                        <th>{{contract.projectName}}</th>
                        <th>{{contract.amount}}</th>
                    </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between p-2">
                    <app-pagination
                            [totalElements]="contractService.total$ | async"
                            (page)="onPageContract($event)">
                    </app-pagination>
                </div>

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
                        <td>{{issue.subtypeName}}</td>
                        <td>{{convertTimeToString(issue.estimatedTime)}}</td>
                        <td>{{convertTimeToString(issue.realTime)}}</td>
                        <td>{{convertTimeToString(issue.differenceTime)}}</td>
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
    error_message: string;
    success_message: string;
    project: Project = {name: '', version: '', technologies: []};
    convertTimeToString = convertTimeToString;
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
                    }
                );
                this.issueService.getEpicListByProjectId(this.project.id).subscribe(
                    (result) => {
                        this.issueService.allIssueList = result;
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
        this.contractService.search$.next();
        this.issueService.search$.next();
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSortContract($event: SortEvent) { //todo naprawa headers dla dwoch tabel
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

    onPageContract($event: number) {
        this.contractService.state.page = $event;
        this.contractService.search$.next();
    }

    onSortIssue($event: SortEvent) { //todo naprawa headers dla dwoch tabel
        this.headers.forEach(header => {
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
            this.error_message = result;
            this.errorSubject.next(result);
        } else {
            this.success_message = result;
            this.successSubject.next(result);
        }
    }
}
