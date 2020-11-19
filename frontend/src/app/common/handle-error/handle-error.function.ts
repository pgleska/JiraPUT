import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export function handleError(type: string): (errorResponse: HttpErrorResponse) => Observable<never> {
   return (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
            case 404:
                return throwError(`error.${type}-not-found`);
            case 409:
                return throwError(`error.${type}-duplicated`);
            default:
                return throwError('error.unknown');
        }
    };
}
