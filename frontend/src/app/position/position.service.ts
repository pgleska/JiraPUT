import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Position} from './position.model';
import {map} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';


@Injectable({
    providedIn: 'root'
})
export class PositionService {

    constructor(private http: HttpClient) {
    }

    getPositionList(): Observable<Position[]> {
        return this.http.get<Position[]>(environment.apiUrl + '/api/position/list')
            .pipe(map((positions: Position[]) => positions.map(
                (position: Position) => {
                    position.nameDisplay = position.name.replace(/_/g, ' ');
                    return position;
                })
            ));
    }

    createPosition(position: Position): Observable<any> {
        return this.http.post<Position>(
            environment.apiUrl + '/api/position/create',
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

    modifyPosition(position: Position): Observable<any> {
        return this.http.patch<Position>(
            environment.apiUrl + `/api/position/${position.name}`,
            position)
            .pipe(
                catchError(handleError('position'))
            );
    }

}
