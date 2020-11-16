export interface Employee {
    login: string;
    firstName: string;
    lastName: string;
    position: string;
    positionDisplay: string;
    salary: number;
}

export interface Team {
    name: string;
    numberOfMembers: number;
    members: string[];
}
