import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {Issue} from './issue.model';

@Component({
    selector: 'app-issue-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'issue.delete.title' | translate}} {{issue.name}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'issue.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'issue.delete.delete' | translate}} </button>
        </div>
    `
})
export class IssueDeleteComponent {
    @Input() issue: Issue;

    constructor(public activeModal: NgbActiveModal,
                private service: IssueService) {
    }

    onDelete(): void {
        const addObservable = this.service.deleteIssue(this.issue);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('issue.delete.deleted');
            },
            error => {
                if (error === 'error.issue-duplicated') {
                    error.replace('duplicated', 'not-empty');
                }
                this.activeModal.close(error);
            }
        );
    }

}
