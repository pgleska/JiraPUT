import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/internal/operators';
import {catchError} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Company} from './company.model';


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private _companies$ = new BehaviorSubject<Company[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allCompanyList: Company[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get companies$() {
        return this._companies$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Company>(this.allCompanyList, this.state, this.matches))
        ).subscribe(result => {
            this._companies$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getCompanyList(): Observable<Company[]> {
        return this.http.get<Company[]>(environment.apiUrl + '/api/company/list')
            .pipe(map((companies: Company[]) => companies.map(
                (company: Company) => {
                    company.nameDisplay = company.name.replace(/_/g, ' ');
                    return company;
                })
            ));
    }

    createCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(
            environment.apiUrl + '/api/company/create',
            company)
            .pipe(
                catchError(handleError('company'))
            );
    }

    modifyCompany(company: Company): Observable<any> {
        return this.http.patch(
            environment.apiUrl + `/api/company/${company.name}`,
            company)
            .pipe(
                catchError(handleError('company'))
            );
    }

    deleteCompany(company: Company): Observable<any> {
        return this.http.delete(
            environment.apiUrl + `/api/company/${company.name}`)
            .pipe(
                catchError(handleError('company'))
            );
    }

    matches(company: Company, term: string): boolean {
        return company.nameDisplay.toLowerCase().includes(term.toLowerCase());
    }
}
