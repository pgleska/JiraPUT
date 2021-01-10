import {Technology} from '../technology/technology.model';

export interface Project {
    id?: number;
    name: string;
    description?: string;
    version: string;
    technologies: Technology[];
    contracts?: string[];
}
