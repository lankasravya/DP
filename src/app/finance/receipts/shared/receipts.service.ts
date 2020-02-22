import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ReceiptsService {

    urlRef = new Environment();

    constructor(private http: HttpClient) {
    }


    getRowDataFromAccountReceivables() {
        return this.http.get(this.urlRef.url + 'getaccountReceivablesdata');
    }
    getRowDataFromAccountReceivablesBills() {
        return this.http.get(this.urlRef.url + 'getaccountReceivablesBillsdata');
    }
    getBillsByCustomerId() {
        return this.http.get(this.urlRef.url + 'getbillsbycustomerid');

    }

    updateAccountReceivables(accountReceivablesModel:Object[]) {
        return this.http.put(this.urlRef.url + 'update/accountsReceivables', accountReceivablesModel);
    }

    saveAccountReceivables(AccountReceivablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
    }
    saveAccountReceivablesBills(AccountReceivablesBillsInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivablesBills', AccountReceivablesBillsInformation)
    }

    deleteAccountReceivables(accountReceivablesId: number) {
        return this.http.post(this.urlRef.url + 'delete/accountReceivables', accountReceivablesId)
    }

      getCustomerIdSearch(customerName:string){
         return this.http.get(`${this.urlRef.url}getAll/accountrecievables/basedon/customername?customerName=${customerName}`)
     } 

    getCustomerBillIdSearch(customerId: number) {
        return this.http.get(`${this.urlRef.url}getbillsbycustomerid?customerId=${customerId}`)
    }

    getSalesDataBySearch(billCode:string){
        return this.http.get(this.urlRef.url+'getsalesbasedon/SalesNumber?billCode='+billCode);
      }

    public getAccountReceivablessNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
    }

    public saveMultipleAccRecievables(generalLedgerModels:Object[]){
        return this.http.post(this.urlRef.url+'save/multipleAccountRecievabes/generalledgers',generalLedgerModels)
    }

    public getAllAccountPayables(){
        return this.http.get(this.urlRef.url+'getAll/accountrecievables');
    }

    public getAllRecievablesSearchedCustomers(customerName){
        return this.http.get(this.urlRef.url+'getAccountRecievables/customername/search?customerName=',customerName)
    }
}