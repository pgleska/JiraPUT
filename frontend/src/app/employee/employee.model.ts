import {Technology} from '../technology/technology.model';

export interface Employee {
    login: string;
    firstName: string;
    lastName: string;
    position: string;
    positionDisplay: string;
    salary: number;
    team: string;
    technologies: Technology[];
}
