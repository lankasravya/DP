import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  urlRef = new Environment();
  constructor(private reportService: ReportService, private http: HttpClient) {

  }
  getReports() {
    return this.http.get(this.urlRef.url + 'reports/getReports');
  }
  getReportDataByInputParams(reportURI) {
    return this.http.get(this.urlRef.url + 'reports/getReportData?inputJson=' + reportURI);
  }
  getReportData(reportCode) {
    return this.http.get(this.urlRef.url + 'reports/getReportData?inputJson=' + reportCode);
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
  downloadExcelFile(encodeURI) {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Authorization': `Bearer localStorage.getItem('token')`,
      })
    };
    return this.http.get(this.urlRef.url + 'reports/generateReport?inputJson=' + encodeURI, httpOptions)
  }
  getAllInvoices() {
    return this.http.get(this.urlRef.url + 'getallinvoices');
  }

  getMfrBySearch(key) {
    return this.http.get(this.urlRef.url + 'getallmanufacturersdatabysearch?searchTerm=' + key);
  }
  getProviderBySearch(key) {
    return this.http.get(this.urlRef.url + 'getprovidersdatabyname?key=' + key);
  }
  getCustomerBySearch(key) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + key);
  }
  getPaymentTypeBySearch(key) {
    return this.http.get(this.urlRef.url + 'getallpaymenttypes');
  }
  getInvoiceNoBySearch(key) {
    return this.http.get(this.urlRef.url + 'getallinvoicenosbysearchpid?searchTerm=' + key);
  }
  getBatchNoBySearch(key) {
    return this.http.get(this.urlRef.url + 'getallbatchnosbysearch?searchTerm=' + key);
  }
  getBillCodeBySearch(key) {
    return this.http.get(this.urlRef.url + 'getallbillcodesbysearch?searchTerm=' + key);
  }

  // Purchase Invoice Details

  getSuppliersPIDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpid?searchTerm=' + key);
  }
  getAllSuppliersPID() {
    return this.http.get(this.urlRef.url + 'getallsupplierspid');
  }
  getInvoiceNosPIDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getgrnnosbysearchpid?searchTerm=' + key);
  }
  getAllInvoiceNosPID() {
    return this.http.get(this.urlRef.url + 'getallgrnnospid');
  }
  getInvoiceDtPIDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getinvoicedatebysearchpid?searchTerm=' + key);
  }
  getAllInvoiceDtPID() {
    return this.http.get(this.urlRef.url + 'getallinvoicedatepid');
  }

  getInvoiceNumbersPIDBySearch(key){
    return this.http.get(this.urlRef.url + 'getallinvoicenumberspid?searchTerm=' + key);
  }
  getAllInvoiceNumbersPID(){
    return this.http.get(this.urlRef.url + 'getallinvoicenumberspid');
  }
  //Purchase Return
  getSuppliersPRBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpurret?searchTerm=' + key);
  }
  getAllSuppliersPR() {
    return this.http.get(this.urlRef.url + 'getallsupplierspurret');
  }
  getGRNNosPRBySearch(key) {
    return this.http.get(this.urlRef.url + 'getgrnnosbysearchpurret?searchTerm=' + key);
  }
  getAllGRNNosPR() {
    return this.http.get(this.urlRef.url + 'getallgrnnospurret');
  }
  getInvoiceNoPRBySearch(key) {
    return this.http.get(this.urlRef.url + 'getinvoicenosbysearchpurret?searchTerm=' + key);
  }
  getAllInvoiceNoPR() {
    return this.http.get(this.urlRef.url + 'getallinvoicenospurret');
  }
  //Purchase Margin Comparison

  getItemsPMCBySearch(key) {
    return this.http.get(this.urlRef.url + 'gettemnamesbysearchpmc?searchTerm=' + key);
  }
  getAllItemsPMC() {
    return this.http.get(this.urlRef.url + 'getallitemnamespmc');
  }
  getSuppliersPMCBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpmc?searchTerm=' + key);
  }
  getAllSuppliersPMC() {
    return this.http.get(this.urlRef.url + 'getallsupplierspmc');
  }
  getAllSuppliersPOL() {
    return this.http.get(this.urlRef.url + 'getallsupplierspol');
  }
  getSuppliersPOLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpol?searchTerm=' + key);
  }
  getAllManufacturersPOL() {
    return this.http.get(this.urlRef.url + 'getallmanufacturerpol');
  }
  getManufacturerPOLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getmanufacturerbysearchpol?searchTerm=' + key);
  }
  getAllInvoiceDatesPOL() {
    return this.http.get(this.urlRef.url + 'getallinvoicedatespol');
  }
  getInvoiceDatePOLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getinvoicedatesbysearchpol?searchTerm=' + key);
  }
  getAllManufacturersSCL() {
    return this.http.get(this.urlRef.url + 'getallmanufacturerscl');
  }
  getManufacturersclBySearch(key) {
    return this.http.get(this.urlRef.url + 'getmanufacturerbysearchscl?searchTerm=' + key);
  }
  getAllDoctorsSCL() {
    return this.http.get(this.urlRef.url + 'getallprovidersscl');
  }
  getDoctorssclBySearch(key) {
    return this.http.get(this.urlRef.url + 'getprovidersbysearchscl?searchTerm=' + key);
  }
  getAllBillDatesSCL() {
    return this.http.get(this.urlRef.url + 'getallbilldatesscl');
  }
  getBillDatesclBySearch(key) {
    return this.http.get(this.urlRef.url + 'getbilldatesbysearchscl?searchTerm=' + key);
  }
  getAllManufacturersPBPD() {
    return this.http.get(this.urlRef.url + 'getallmanufacturerpbpd');
  }
  getManufacturersPBPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getmanufacturerbysearchpbpd?searchTerm=' + key);
  }
  getAllSuppliersPBPD() {
    return this.http.get(this.urlRef.url + 'getallsupplierspbpd');
  }
  getSuppliersPBPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpbpd?searchTerm=' + key);
  }


  //Purchase Invoice Report
  getSuppliersPIRBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpir?searchTerm=' + key);
  }
  getAllSuppliersPIR() {
    return this.http.get(this.urlRef.url + 'getallsupplierspir');
  }
  getInvoiceDtPIRBySearch(key) {
    return this.http.get(this.urlRef.url + 'getinvoicedatesbysearchpir?searchTerm=' + key);
  }
  getAllInvoiceDtPIR() {
    return this.http.get(this.urlRef.url + 'getallinvoicedatespir');
  }

  //Sales By Product Details
  getCustomersSBPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getcustomersbysearchsbpd?searchTerm=' + key);
  }
  getAllCustomersSBPD() {
    return this.http.get(this.urlRef.url + 'getallcustomerssbpd');
  }
  getBillDatesSBPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getbilldatesbysearchsbpd?searchTerm=' + key);
  }
  getAllBillDatesSBPD() {
    return this.http.get(this.urlRef.url + 'getallbilldatessbpd');
  }
  //Dummy Bill List
  getAllDoctorsDBL() {
    return this.http.get(this.urlRef.url + 'getallfirstnmbysearchdbl');
  }
  getDoctorsdblBySearch(key) {
    return this.http.get(this.urlRef.url + 'getfirstnmbysearchdbl?searchTerm=' + key);
  }
  getAllManufacturersDBL() {
    return this.http.get(this.urlRef.url + 'getallnamebysearchdbl');
  }
  getManufacturerdblBySearch(key) {
    return this.http.get(this.urlRef.url + 'getnamebysearchdbl?searchTerm=' + key);
  }
  //Sales  Register Details
  getAllTypesSRD() {
    return this.http.get(this.urlRef.url + 'getalltypebysearchsrd');
  }
  getTypesrdBySearch(key) {
    return this.http.get(this.urlRef.url + 'gettypebysearchsrd?searchTerm=' + key);
  }
  //Sales Register Areawise Details
  getAllLocationsSRAD() {
    return this.http.get(this.urlRef.url + 'getallcitynamesrad');
  }
  getLocationsradBySearch(key) {
    return this.http.get(this.urlRef.url + 'getcitynamebysearchsrad?searchTerm=' + key);
  }
  //Sales By Proctuct Summary
  getAllitemsSPS() {
    return this.http.get(this.urlRef.url + 'getallitemNamesbps');
  }
  getItemNamespsBySearch(key) {
    return this.http.get(this.urlRef.url + 'getitemNamebysearchsbps?searchTerm=' + key);
  }
  getAllmanufacturersSPS() {
    return this.http.get(this.urlRef.url + 'getAllnamebysearchsbps');
  }
  getManufacturerspsBySearch(key) {
    return this.http.get(this.urlRef.url + 'getnamebysearchsbps?searchTerm=' + key);
  }
  //Sales Report By Bill Id
  getAllBillCodesSRBB() {
    return this.http.get(this.urlRef.url + 'getallbillcodesrb');
  }
  getBillCodesrbbBySearch(key) {
    return this.http.get(this.urlRef.url + 'getbillcodesbysearchsrb?searchTerm=' + key);
  }


  //Supplier By Manufacturer List
  getSuppliersSBMLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchssbml?searchTerm=' + key);
  }
  getAllSuppliersSBML() {
    return this.http.get(this.urlRef.url + 'getallsupplierssbml');
  }
  //Purchase Details By PO NO
  getPurNoPDPOBySearch(key) {
    return this.http.get(this.urlRef.url + 'getpurNobysearchspdpo?searchTerm=' + key);
  }
  getAllPurNoPDPO() {
    return this.http.get(this.urlRef.url + 'getallpurNoinpdpo');
  }
  getSuppliersPDPOBySearch(key){
    return this.http.get(this.urlRef.url + 'getsupplierbysearchspdpo?searchTerm=' + key);
  }
  getAllSupplersPDPO(){
    return this.http.get(this.urlRef.url + 'getallsuppliersinpdpo');
  }
  //Purchase Details by Batch No
  getbatchNoPDBNBySearch(key) {
    return this.http.get(this.urlRef.url + 'getbatchnobysearchpdbn?searchTerm=' + key);
  }
  getAllBatchNoPDBN() {
    return this.http.get(this.urlRef.url + 'getallbatchnopdbn');
  }
  getsuppliersPDBNBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchpdbn?searchTerm=' + key);
  }
  getAllsuppliersPDBN() {
    return this.http.get(this.urlRef.url + 'getallsupplierspdbn');
  }
  //Purchase Details By Product Name

  getItemsPDPNBySearch(key) {
    return this.http.get(this.urlRef.url + 'getitemsbysearchpdpn?searchTerm=' + key);
  }
  getAllItemsPDPN() {
    return this.http.get(this.urlRef.url + 'getallitemspdpn');
  }
  //Purchase Register List
  getSuppliersPRLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getsuppliersbysearchprl?searchTerm=' + key);
  }
  getAllSuppliersPRL() {
    return this.http.get(this.urlRef.url + 'getallsuppliersprl');
  }
  getPayTypePRLBySearch(key) {
    return this.http.get(this.urlRef.url + 'getpaytypesbysearchprl?searchTerm=' + key);
  }
  getAllPayTypesPRL() {
    return this.http.get(this.urlRef.url + 'getallpaytypesprl');
  }

  //Slow Moving Product Details
  getAllItemNamesSMPD() {
    return this.http.get(this.urlRef.url + 'getallitemnamessmpd');
  }
  getItemNameSMPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getitemnamesbysearchsmpd?searchTerm=' + key);
  }
  getItemCodesSMPD() {
    return this.http.get(this.urlRef.url + 'getallitemcodessmpd');
  }
  getItemCodesSMPDBySearch(key) {
    return this.http.get(this.urlRef.url + 'getitemcodesbysearchsmpd?searchTerm=' + key);
  }
  //Credit Note
  getAllCreditNoteNoCN(){
    return this.http.get(this.urlRef.url + 'getallcreditnotenoCN');
  }
  getCreditNoteNoCNBySearch(key){
    return this.http.get(this.urlRef.url + 'getcreditnotenobysearchCN?searchTerm=' + key);
  }
  //Account Receivables
  getAllReceiptNoAR(){
    return this.http.get(this.urlRef.url + 'getallreceiptnoAR');
  }
  getReceiptNoARBySearch(key){
    return this.http.get(this.urlRef.url + 'getreceiptnobysearchAR?searchTerm=' + key);
  }
  getCustomerNamesARBySearch(key){
    return this.http.get(this.urlRef.url + 'getcustnamesbysearchAR?searchTerm=' + key);
  }
  getAllCustomerNamesAR(){
    return this.http.get(this.urlRef.url + 'getallcustnamesAR');
  }
  //Debit Note
  getDebitNosBySearch(key){
    return this.http.get(this.urlRef.url + 'getdebitnosindnbysearch?DNNO=' + key);
  }
  getDebitNos(){
    return this.http.get(this.urlRef.url + 'getalldebitnosindn');
  }
//Account Payables
getPaymentNosBySearch(key){
  return this.http.get(this.urlRef.url + 'getpaymentnosinapbysearch?PNO=' + key);
}
getPaymentNos(){
  return this.http.get(this.urlRef.url + 'getallpaymentnosinap');
}
getSupplierNamesBySearchInAP(key){
  return this.http.get(this.urlRef.url + 'getsuppliernamesinapbysearch?searchTerm=' + key);
}
getSupplierNamesInAP(){
  return this.http.get(this.urlRef.url + 'getallsuppliernamesinap');
}
//sales return
getSrNosrBySearch(key){
  return this.http.get(this.urlRef.url + 'getsalesreturnnobysearchsr?searchTerm=' + key);
}
getAllRNosSR(){
  return this.http.get(this.urlRef.url + 'getallsalesreturnnosr');
}

}
