import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {Position} from './position.model';
import {map} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';


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
                    position.nameDisplay = position.name.replace('_', ' ');
                    return position;
                })
            ));
    }

    createPosition(position: Position): Observable<any> {
        return this.http.post<Position>(
            environment.apiUrl + '/api/position/create',
            position)
            .pipe(
                catchError(PositionService.handlePositionError)
            );
    }

    modifyPosition(position: Position): Observable<any> {
        return this.http.post<Position>(
            environment.apiUrl + `/api/position/${position.name}`,
            position)
            .pipe(
                catchError(PositionService.handlePositionError)
            );
    }

    private static handlePositionError(errorResponse: HttpErrorResponse): Observable<never> {
        if (errorResponse.error.message === 'Unauthorized') {
            return throwError('error.login-error');
        } else {
            return throwError('error.unknown');
        }
    }


}
