import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/internal/operators';
import {Team} from './team.model';
import {handleError} from '../common/handle-error/handle-error.function';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    constructor(private http: HttpClient) {
    }

    getTeamList(): Observable<Team[]> {
        return this.http.get<Team[]>(environment.apiUrl + '/api/team/list');
    }

    getTeam(name: string): Observable<Team> {
        return this.http.get<Team>(environment.apiUrl + `/api/team/${name}`)
            .pipe(
                catchError(handleError('team'))
            );
    }

    modifyTeam(team: Team): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/Team/${team.name}`,
            team).pipe(
            catchError(handleError('team'))
        );
    }

    deleteTeam(team: Team): Observable<any> {
        return this.http.delete(environment.apiUrl + `/api/Team/${team.name}`)
            .pipe(
                catchError(handleError('team'))
            );
    }
}
