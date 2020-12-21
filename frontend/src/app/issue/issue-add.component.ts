import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IssueService} from './issue.service';
import {NgForm} from '@angular/forms';
import {Issue} from './issue.model';


@Component({
    selector: 'app-issue-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'issue.add.title' | translate}} </h4>
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
                    <button type="submit" ngbAutofocus class="btn btn-outline-dark"
                            [disabled]="!issueForm.valid">{{'issue.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class IssueAddComponent {

    private issue: Issue = {
        id: 0,
        name: '',
    };

    constructor(public activeModal: NgbActiveModal,
                private service: IssueService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.issue.name = form.value.name;

        const addObservable = this.service.createIssue(this.issue);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('issue.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
