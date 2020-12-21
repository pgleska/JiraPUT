import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/internal/operators';
import {catchError, map} from 'rxjs/operators';
import {handleError} from '../common/handle-error/handle-error.function';
import {ListState} from '../common/list-components/search/search.model';
import {search} from '../common/list-components/search/search.function';
import {Contract} from './contract.model';


@Injectable({
    providedIn: 'root'
})
export class ContractService {

    private _contracts$ = new BehaviorSubject<Contract[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    search$ = new Subject<void>();
    allContractList: Contract[] = [];
    state: ListState = {
        page: 1,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    get contracts$() {
        return this._contracts$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    constructor(private http: HttpClient) {
        this.search$.pipe(
            debounceTime(200),
            switchMap(() => search<Contract>(this.allContractList, this.state, this.matches))
        ).subscribe(result => {
            this._contracts$.next(result.itemsList);
            this._total$.next(result.total);
        });
    }

    getContractList(): Observable<Contract[]> {
        return this.http.get<Contract[]>(environment.apiUrl + '/api/contract/list');
    }

    getContract(contractNumber: string): Observable<Contract> {
        return this.http.get<Contract[]>(environment.apiUrl + '/api/contract/list').pipe(
            map(contracts => contracts.find(con => con.contractNumber === contractNumber)),
        );
    }

    createContract(contract: Contract): Observable<Contract> {
        return this.http.post<Contract>(
            environment.apiUrl + '/api/contract/create',
            contract)
            .pipe(
                catchError(handleError('contract'))
            );
    }

    // modifyContract(contract: Contract): Observable<any> {
    //     return this.http.patch(
    //         environment.apiUrl + `/api/contract/${contract.name}`,
    //         contract)
    //         .pipe(
    //             catchError(handleError('contract'))
    //         );
    // }

    deleteContract(contract: Contract): Observable<any> {
        return this.http.post(
            environment.apiUrl + `/api/contract/delete`,
            {
                contractNumber: contract.contractNumber
            })
            .pipe(
                catchError(handleError('contract'))
            );
    }

    matches(contract: Contract, term: string): boolean {
        return contract.contractNumber.toLowerCase().includes(term.toLowerCase())
            || contract.companyName.toLowerCase().includes(term.toLowerCase())
            || contract.projectName.toLowerCase().includes(term.toLowerCase());
    }

    resetState() {
        this.state = {
            page: 1,
            searchTerm: '',
            sortColumn: '',
            sortDirection: ''
        };
    }

}
