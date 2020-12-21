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
            <h2>{{project.name}}</h2>
            <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openEdit()">{{'project.details.edit' | translate}}</a>
        </div>
    `
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    project: Project;
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
        const projectId = +this.route.snapshot.paramMap.get('projectId');
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
