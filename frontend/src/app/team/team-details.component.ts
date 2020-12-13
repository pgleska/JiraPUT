import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployeeService} from '../employee/employee.service';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from './team.service';

@Component({
    selector: 'app-team-details',
    template: ``
})
export class TeamDetailsComponent implements OnInit {
    constructor(private service: TeamService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const team = this.route.snapshot.paramMap.get('name')
        this.service.getTeam(team)
    }
}
