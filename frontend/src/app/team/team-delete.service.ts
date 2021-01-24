import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Team} from './team.model';
import {TeamService} from './team.service';


@Component({
    selector: 'app-team-delete',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{'team.delete.title' | translate}} {{team.name}}.</h4>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{'team.delete.body' | translate}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark"
                    (click)="activeModal.dismiss()">{{'common.close' | translate}} </button>
            <button type="button" ngbAutofocus class="btn btn-danger btn-outline-danger"
                    (click)="onDelete()">{{'team.delete.delete' | translate}} </button>
        </div>
    `
})
export class TeamDeleteComponent {
    @Input() team: Team;

    constructor(public activeModal: NgbActiveModal,
                private teamService: TeamService) {
    }

    onDelete(): void {
        const addObservable = this.teamService.deleteTeam(this.team);
        addObservable.subscribe(
            _ => {
                this.activeModal.close({result: 'team.edit.edited'});
            },
            error => {
                this.activeModal.close({result: error});
            }
        );
    }

}
