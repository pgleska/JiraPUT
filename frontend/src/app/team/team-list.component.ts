import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PAGE_SIZE} from '../common/list-components/pagination/pagination.component';
import {SortableDirective} from '../common/list-components/sort/sortable.directive';
import {Subject} from 'rxjs';
import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SortEvent} from '../common/list-components/sort/sort.model';
import {TeamService} from './team.service';
import {TeamAddComponent} from './team-add.component';
import {TeamEditComponent} from './team-edit.component';
import {Team} from './team.model';
import {TeamDeleteComponent} from './team-delete.service';
import {debounceTime} from "rxjs/operators";

@Component({
    selector: 'app-team-list',
    template: `
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
        <form>
            <div class="form-group d-flex flex-row justify-content-between border rounded mt-3 px-2">
                <div class="p-2">
                    <label for="searchTerm">{{'common.search' | translate}}</label>
                    <input class="form-control" type="text" name="searchTerm" [ngModel]
                           (ngModelChange)="onSearch($event)"/>
                </div>
                <div class="p-2">
                    <label for="membersNumber">{{'team.list.minimum-members-number' | translate}}</label>
                    <input class="form-control" type="number" name="membersNumber" [ngModel]
                           (ngModelChange)="onMinimumMembersNumber($event)"/>
                </div>
                <div class="p-2">
                    <label for="membersNumber">{{'team.list.maximum-members-number' | translate}}</label>
                    <input class="form-control" type="number" name="membersNumber" [ngModel]
                           (ngModelChange)="onMaximumMembersNumber($event)"/>
                </div>
                <div class="p-2 mt-3">
                    <a class="btn btn-primary btn-lg" (click)="openAdd()">{{'team.list.button' | translate}}</a>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col" sortable="name" (sort)="onSort($event)">{{'team.list.name' | translate}}</th>
                    <th scope="col" sortable="numberOfMembers" (sort)="onSort($event)">{{'team.list.members-number' | translate}}</th>
                    <th>{{'team.list.details' | translate}}</th>
                    <th>{{'common.edit' | translate}}</th>
                    <th>{{'common.delete' | translate}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let team of service.teams$ | async">
                    <th>{{team.name}}</th>
                    <td>{{team.numberOfMembers}}</td>
                    <td><a routerLink="/team/{{team.name}}">{{'team.list.details' | translate}}</a></td>
                    <td><a (click)="openEdit(team)"><i class="fa fa-edit fa-2x btn"></i></a></td>
                    <td><a (click)="openDelete(team)"><i class="fa fa-trash fa-2x btn"></i></a></td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-between p-2">
                <app-pagination
                        [totalElements]="service.total$ | async"
                        (page)="onPage($event)">
                </app-pagination>
            </div>
        </form>`
})
export class TeamListComponent implements OnInit, OnDestroy {

    pageSize = PAGE_SIZE;
    errorMessage: string;
    successMessage: string;
    private errorSubject: Subject<string> = new Subject<string>();
    private successSubject: Subject<string> = new Subject<string>();
    private minimumMembersNumber: number;
    private maximumMembersNumber: number;
    @ViewChild('errorAlert', {static: false}) errorAlert: NgbAlert;
    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


    constructor(public service: TeamService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.service.getTeamList().subscribe(result => {
                this.service.allTeamList = result;
                this.service.filterTeamList(this.minimumMembersNumber, this.maximumMembersNumber);
                this.service.search$.next();
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
    }

    ngOnDestroy(): void {
        this.successSubject.unsubscribe();
        this.errorSubject.unsubscribe();
    }

    onSort($event: SortEvent) {
        this.headers.forEach(header => {
                if (header.sortable !== $event.column) {
                    header.direction = '';
                }
            }
        );

        this.service.state.sortColumn = $event.column;
        this.service.state.sortDirection = $event.direction;
        this.service.search$.next();
    }

    onSearch($event: string) {
        this.service.state.searchTerm = $event;
        this.service.search$.next();
    }

    onPage($event: number) {
        this.service.state.page = $event;
        this.service.search$.next();
    }

    onMinimumMembersNumber($event: any) {
        this.minimumMembersNumber = $event;
        this.service.filterTeamList(this.minimumMembersNumber, this.maximumMembersNumber);
        this.service.search$.next();
    }

    onMaximumMembersNumber($event: any) {
        this.maximumMembersNumber = $event;
        this.service.filterTeamList(this.minimumMembersNumber, this.maximumMembersNumber);
        this.service.search$.next();
    }

    openAdd() {
        const modalRef = this.modalService.open(TeamAddComponent);
        modalRef.result.then((result) => {
            this.showInfo(result.result);
        }, _ => {
        });
    }

    openDelete(team: Team) {
        const modalRef = this.modalService.open(TeamDeleteComponent);
        modalRef.componentInstance.team = team;
        modalRef.result.then((result) => {
            this.showInfo(result.result);
        }, _ => {
        });
    }

    openEdit(team: Team) {
        const modalRef = this.modalService.open(TeamEditComponent);
        modalRef.componentInstance.team = team;
        modalRef.result.then((result) => {
            this.showInfo(result.result);
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
