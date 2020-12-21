import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue} from './issue.model';


@Component({
    selector: 'app-issue-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'issue.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #issueForm="ngForm" (ngSubmit)="onSubmit(issueForm)">
                <div>
                    <label for="name">{{'issue.list.name' | translate}}</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            [ngModel]
                            #name="ngModel"
                            required
                    />
                    <app-input-error [control]="name.control"></app-input-error>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark"
                            (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
                    <button type="submit" [disabled]="!issueForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'Issue.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class IssueEditComponent implements OnInit {
    @Input() issue: Issue;
    issueCopy: Issue;
    @ViewChild('issueForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private service: IssueService) {
    }

    ngOnInit(): void {
        this.issueCopy = Object.assign({}, this.issue);
        setTimeout(() => {
            this.form.setValue({
                name: this.issueCopy.name
            });
        });
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.issueCopy.name = form.value.name;


        const editObservable = this.service.modifyIssue(this.issueCopy);
        editObservable.subscribe(
            _ => {
                this.issue = Object.assign({}, this.issueCopy);
                this.activeModal.close('issue.edit.edited');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
