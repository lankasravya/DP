import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable()
export class CreditNoteService {

    constructor(private http: HttpClient) { }
    urlRef = new Environment();


    saveCreditNoteData(creditNote: Object) {
        return this.http.post(`${this.urlRef.url}save/creditNote`, creditNote);
    }
    updateCreditNote(creditNoteModel: Object) {
        return this.http.put(`${this.urlRef.url}update/creditNote`, creditNoteModel);
    }
    getCreditNoteData(creditNoteId: Object) {
        return this.http.get(`${this.urlRef.url}getCreditNote`, creditNoteId);
    }
    public getCreditNoteNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CN');
    }

    public getAccountReceivablessNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
    }

    saveAccountReceivables(AccountReceivablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
    }

    saveAccountPayables(AccountPayablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountPayables', AccountPayablesInformation)
    }

    getRowDataFromServer() {
        return this.http.get(this.urlRef.url + 'getallsuppliersdata/foritemsuppliers');
    }

    getRowDataFromServerForCustomer() {
        return this.http.get(this.urlRef.url + 'getlimitedcustomerdata/forSalesbilling');
    }


    public getAccountPayablesNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
    }

}