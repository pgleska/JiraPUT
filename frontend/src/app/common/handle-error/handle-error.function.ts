import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export function handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = errorResponse.error.error;
    if (errorMessage.includes('not.found')) {
        errorMessage = errorMessage.replace(/\./g, '-');
        return throwError(`error.${errorMessage}`);
    }
    if (errorMessage.includes('duplicated')) {
        errorMessage = errorMessage.replace(/\./g, '-');
        return throwError(`error.${errorMessage}`);
    }
    if (errorMessage.includes('not.empty')) {
        errorMessage = errorMessage.replace(/\./g, '-');
        return throwError(`error.${errorMessage}`);
    }
    if (errorMessage.includes('has')) {
        errorMessage = errorMessage.replace(/\./g, '-');
        return throwError(`error.${errorMessage}`);
    }

    return throwError('error.unknown');

}
