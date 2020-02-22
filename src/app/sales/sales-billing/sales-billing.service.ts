import { Environment } from 'src/app/core/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesBillingService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  public getCustomersData() {
    return this.http.get(this.urlRef.url + 'getlimitedcustomerdata/forSalesbilling');
  }

  public getDoctorsData() {
    return this.http.get(this.urlRef.url + 'getlimitedprovidersdata/forsalesbilling');
  }

  public getHospitalsData() {
    return this.http.get(this.urlRef.url + 'getlimitedhospitaldata/forsalesbilling');
  }

  public getItemssData() {
    return this.http.get(this.urlRef.url + 'item/getactiveitemsdata');
  }

  public getStockData() {
    return this.http.get(this.urlRef.url + 'getallstockitems');
  }

  public getSupplierDataByItemId(itemId) {
    return this.http.get(this.urlRef.url + 'getitemsuppliersbyitemid?itemId=' + itemId);
  }

  public getBatchNumbersDataByItemId(itemId) {
    return this.http.post(this.urlRef.url + 'getitembatchnumbers', itemId);
  }

  public getStockDataByItemIdAndBatchNo(itemId, batchNo) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandbatch?itemId=' + itemId + '&batchNo=' + batchNo);
  }

  public getStockDataByItem(itemId) {
    return this.http.post(this.urlRef.url + 'getstockbyitem', itemId);
  }

  public getStockDataByItemName(itemName) {
    return this.http.post(this.urlRef.url + 'getstockbyitemnamesearch', itemName);
  }

  public getItemDataByItemName(searchTerm) {
    return this.http.get(this.urlRef.url + 'item/getallby/ItemNameSearch?searchTerm=' + searchTerm);
  }

  public getItemDataByItemCode(searchTerm) {
    return this.http.get(this.urlRef.url + 'item/getallby/searchkey?searchTerm=' + searchTerm);
  }

  public getStockDataByItemAndPharmacy(payload) {
    return this.http.post(this.urlRef.url + 'getstockbyitemandpharmacy', payload);
  }

  public getStockDataByItemAndPharmacyId(searchTerm, searchCode, pharmacyId, pageNumber, pageSize) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandpharmacyid?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
  }

  public getStockDataByItemAndPharmacyIdCount(searchTerm, searchCode, pharmacyId) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandpharmacyidcount?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId);
  }

  public getInsurenceDataByPolicyCode(policyCode) {
    return this.http.get(this.urlRef.url + 'getcustomerinsurancedatabypolicycode?policyCode=' + policyCode);
  }

  public getMembershipDataByMembershipCardNumber(membershipCardNumber) {
    return this.http.get(this.urlRef.url + 'getbymembershipcardnumber?membershipCardNumber=' + membershipCardNumber);
  }

  public getSalesBillingNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=SB');
  }

  public saveSales(payload) {
    return this.http.post(this.urlRef.url + 'save/sales', payload);
  }

  public updateSales(payload) {
    return this.http.post(this.urlRef.url + 'update/sales', payload);
  }

  public savePrescription(payload) {
    return this.http.post(this.urlRef.url + 'save/prescription', payload);
  }

  public saveSalesItems(payload) {
    return this.http.post(this.urlRef.url + 'save/salesItems', payload);
  }

  public getAllSales() {
    return this.http.get(this.urlRef.url + 'get/allsales');
  }

  public getSalesBySearchkeys(formData) {
    return this.http.post(this.urlRef.url + 'get/bysalessearchkeys', formData);
  }

  public getSalesHistoryBySearch(status, code, codeValue, startDate, endDate, pageNumber, pageSize) {
    return this.http.get(this.urlRef.url + 'getsaleshistorybysearch?status=' + status + '&code=' + code + '&codeValue=' + codeValue + '&startDate=' + startDate +
      '&endDate=' + endDate + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  public getSalesHistoryBySearchCoun(status, code, codeValue, startDate, endDate) {
    return this.http.get(this.urlRef.url + 'getsaleshistorybysearchcount?status=' + status + '&code=' + code + '&codeValue=' + codeValue + '&startDate=' + startDate +
      '&endDate=' + endDate);
  }

  public getSalesIemsByStockId(stock) {
    return this.http.post(this.urlRef.url + 'get/salesitemsbybillid', stock);
  }
  public getCustomerByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + searchKey);
  }

  public getCustomerByPhNo(searchKey) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyphno?key=' + searchKey);
  }

  public getHospitalByName(searchKey) {
    return this.http.get(this.urlRef.url + 'gethospitaldatabyname?key=' + searchKey);
  }

  public getPreviousBillCodeByKey(key) {
    return this.http.get(this.urlRef.url + 'getpreviousbillcodesbysearch?key=' + key);
  }

  public getPreviousBillCodes() {
    return this.http.get(this.urlRef.url + 'getpreviousbillcodes');
  }

  public getProviderByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getprovidersdatabyname?key=' + searchKey);
  }

  /* sales return urls */
  public getSalesReturnBillNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=SR');
  }

  public getSalesItemsBasedOnBillCode(sales) {
    return this.http.post(this.urlRef.url + 'get/salesitemsbybillid', sales);
  }

  getPrescription(payload) {
    return this.http.post(this.urlRef.url + 'getbycustomeranddate', payload);
  }

  getInsurenceByCustomer(customer) {
    return this.http.post(this.urlRef.url + 'getcustomerinsurancedatabycustomer', customer);
  }
  public saveSalesReturnData(salesReturnModel) {
    return this.http.post(this.urlRef.url + 'save/salesreturns', salesReturnModel);
  }

  public getCreditNoteNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CN');
  }

  public saveCreditNote(creditNoteModel) {
    return this.http.post(this.urlRef.url + 'save/creditNote', creditNoteModel);
  }

  public getAccountPaybalesBasedOnBillCode(salesModel: number) {
    return this.http.get(`${this.urlRef.url}getaccreceipts/basedonbillid?salesModel=${salesModel}`);
  }
  public saveSalesReturnItemsData(salesReturnItemsModel) {
    return this.http.post(this.urlRef.url + 'save/salesreturnitems', salesReturnItemsModel);
  }

  downloadPdfFile(encodeURI) {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Authorization': `Bearer localStorage.getItem('token')`,
      })
    };
    return this.http.get(this.urlRef.url + 'reports/generateReportPdf?inputJson=' + encodeURI, httpOptions);
  }

  getSalesBySearchNumber(key) {
    return this.http.get(this.urlRef.url + 'get/allsalesbasedonsearch?key=' + key)
  }

  saveCustomer(customerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/customer', customerInformation)
  }

  saveProvider(providerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/provider', providerInformation)
  }
  getEmployeeById() {
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId=' + localStorage.getItem('id'))
  }

  public getAccountReceivablessNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
  }

  saveAccountReceivables(AccountReceivablesInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
  }

  public saveGeneralLedger(generalLedgerModel: object) {
    return this.http.post(this.urlRef.url + 'save/recievableLedger/fomSalesBilling', generalLedgerModel)
  }

}
