import {Component} from '@angular/core';
import {Team} from './team.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from './team.service';
import {NgForm} from '@angular/forms';


@Component({
    selector: 'app-team-add',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'team.add.title' | translate}} </h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
                <div>
                    <label for="name">{{'team.add.name' | translate}}</label>
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
                            [disabled]="!authForm.valid">{{'team.add.add' | translate}} </button>
                </div>
            </form>
        </div>
    `
})
export class TeamAddComponent {

    private team: Team = {
        name: '',
        numberOfMembers: 0,
        members: [],
    };

    constructor(public activeModal: NgbActiveModal,
                private service: TeamService) {
    }


    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.team.name = form.value.name;

        const addObservable = this.service.createTeam(this.team);
        addObservable.subscribe(
            _ => {
                this.activeModal.close('team.add.added');
            },
            error => {
                this.activeModal.close(error);
            }
        );
        form.reset();
    }

}
