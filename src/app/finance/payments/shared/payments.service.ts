import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PaymentsService {

    urlRef = new Environment();

    constructor(private http: HttpClient) {
    }


    getRowDataFromAccountPayables() {
        return this.http.get(this.urlRef.url + 'getaccountPayablesdata');
    }
    getRowDataFromAccountPayablesInvoices() {
        return this.http.get(this.urlRef.url + 'getaccountPayablesInvoicesdata');
    }
    getInvoicesBySupplierId() {
        return this.http.get(this.urlRef.url + 'getinvoicesbysupplierid');

    }

    updateAccountPayables(accountPayablesModels: Object[]) {
        return this.http.put(this.urlRef.url + 'update/accountPayables', accountPayablesModels);
    }

    updateAccountPayablesInvoices(selectedAccountPayablesInvoices: any) {
        return this.http.put(this.urlRef.url + 'update/accountPayablesInvoices', selectedAccountPayablesInvoices);
    }

    saveAccountPayables(accountPayablesModel: Object) {
        return this.http.post(this.urlRef.url + 'save/accountPayables', accountPayablesModel)
    }

    getInvoiceDataBySearch(invoiceNo: string) {
        return this.http.get(this.urlRef.url + 'getinvoicebasedon/InvoiceNumber?invoiceNo=' + invoiceNo);
    }


    deleteAccountPayables(accountPayablesId: number) {
        return this.http.post(this.urlRef.url + 'delete/accountPayables', accountPayablesId)
    }

    saveAccountPayablesInvoices(AccountPayablesInvoicesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountPayablesInvoices', AccountPayablesInvoicesInformation)
    }

    getSupplierSearch(supplierName: string) {
        return this.http.get(`${this.urlRef.url}getAll/AccountPayables/basedonSupplier?supplierName=${supplierName}`)
    }

    getCustomerIdSearch(customerName: string) {
        return this.http.get(`${this.urlRef.url}getAll/Accountpayables/basedonCustomer?customerName=${customerName}`)
    }


    public getAccountPayablesNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
    }

    public getGeneralLedgerNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=GL')
    }

    public saveMultipleLedgers(generalLedgerModels: Object[]) {
        return this.http.post(this.urlRef.url + 'save/multipleAccountPayables/generalledgers', generalLedgerModels)
    }

    public getAllAccountPayables() {
        return this.http.get(this.urlRef.url + 'getAll/accountpayables')
    }


    public getAllAccountPayablesForSuppliers() {
        return this.http.get(this.urlRef.url + 'getAll/AccountPayables/basedonsuppliers');
    }

    public getAllSuppliersBasedonNameSearch(supplierName){
        return this.http.get(this.urlRef.url+'getAll/suppliersby/nameSearch?supplierName=',supplierName)
    }

}