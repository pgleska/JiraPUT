import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Issue} from './issue.model';
import {IssueService} from './issue.service';
import {IssueEditComponent} from './issue-edit.component';


@Component({
    selector: 'app-issue-details',
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
            <a class="btn btn-dark btn-lg btn-outline-primary" (click)="openEdit()">{{'project.details.edit' | translate}}</a>
        </div>
    `
})
export class IssueDetailsComponent implements OnInit {

    pageSize = PAGE_SIZE;
    error_message: string;
    success_message: string;
    issue: Issue;
    private errorSubject = new Subject<string>();
    private successSubject = new Subject<string>();
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(private issueService: IssueService,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        const issueId = +this.route.snapshot.paramMap.get('issueId');
        this.issueService.getIssue(issueId).subscribe(
            (issue) => {
                this.issue = issue;
            }
        );
    }

    openEdit() {
        const modalRef = this.modalService.open(IssueEditComponent);
        modalRef.componentInstance.issue = this.issue;
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
