import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './employee.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-employee-details',
    template: ``
})
export class EmployeeDetailsComponent implements OnInit{

    constructor(private service: EmployeeService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const login = this.route.snapshot.paramMap.get('login')
        this.service.getEmployee(login)
    }

}
