import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {Team} from './team.model';
import {TeamService} from './team.service';


@Component({
    selector: 'app-team-edit',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'team.edit.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #teamForm="ngForm" (ngSubmit)="onSubmit(teamForm)">
                <div class="required">
                    <label for="name" class="control-label">{{'team.list.name' | translate}}</label>
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
                    <button type="submit" [disabled]="!teamForm.valid" ngbAutofocus
                            class="btn btn-outline-dark">{{'team.edit.edit' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class TeamEditComponent implements OnInit {
    @Input() team: Team;
    teamCopy: Team;
    @ViewChild('teamForm') form: NgForm;

    constructor(public activeModal: NgbActiveModal,
                private service: TeamService) {
    }

    ngOnInit(): void {
        this.teamCopy = Object.assign({}, this.team);
        setTimeout(() => {
            this.form.controls['name'].setValue(this.teamCopy.name);
        });
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.teamCopy.name = form.value.name;

        const editObservable = this.service.modifyTeam(this.team.name, this.teamCopy.name);
        editObservable.subscribe(
            _ => {
                this.team = Object.assign({}, this.teamCopy);
                console.log(this.team);
                this.activeModal.close({team:this.team, result:'team.edit.edited'});
            },
            error => {
                this.activeModal.close({team:this.team, result:error});
            }
        );
        form.reset();
    }

}
