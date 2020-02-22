import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable({ providedIn: 'root' })
export class AddPurchaseorderService {

  urlRef = new Environment();

  constructor(private http: HttpClient) {

  }

  getPendingPurchaseQuotations(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getpendingpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getSupplier() {
    return this.http.get(this.urlRef.url + 'getsupplier');
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getpurchaseorderdata');
  }

  updateRowData(selectedPurchases: any) {
    return this.http.put(this.urlRef.url + 'update/purchaseorder', selectedPurchases)
  }

  deleteRowData(selectedPurchases) {
    return this.http.request('delete', this.urlRef.url + 'delete/purchaseorder' + selectedPurchases.join());
  }

  deletePurchaseOrderItem(id) {
    return this.http.request('delete', this.urlRef.url + 'delete/purchaseorderitem?purchaseOrderItemsId=' + id);
  }

  saveFormChanges(purchaseInformation: Object, submissionStatus: string) {
    if (submissionStatus === 'pending')
      return this.http.post(this.urlRef.url + 'save/pendingpurchaseorder', purchaseInformation);
    if (submissionStatus === 'later')
      return this.http.post(this.urlRef.url + 'save/partiallypurchaseorder', purchaseInformation);
  }

  getItembysupplieritemcditemname(supplierId: number, itemParameter: string, itemSearchTerm: string) {
    if (itemParameter.length == 0 && itemSearchTerm.length == 0) {
      return this.http.get(`${this.urlRef.url}getitemsbysupplier?supplierId=${supplierId}`);
    }
    return this.http.get(`${this.urlRef.url}getitemsbysupplieritemcditemname?supplierId=${supplierId}&&${itemParameter}=${itemSearchTerm}`);
  }
  getitemsbyitemcodeoritemnameoritemdesc(itemParameter: string, itemSearchTerm: string, supplierId) {
    if (itemParameter.length === 0 && itemSearchTerm.length === 0) {
      return;
    }
    return this.http.get(`${this.urlRef.url}getitemsbyitemcodeoritemnameoritemdesc?${itemParameter}=${itemSearchTerm}&supplierId=${supplierId}`);
  }

  submitLaterChanges(purchaseInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/pendingpurchaseorder', purchaseInformation);
  }

  generatepurchaseno(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}generatepurchaseno?pharmacyId=${pharmacyId}`);
  }

  public getPurchaseOrderNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=PO');
  }

  getalldeliverytypes() {
    return this.http.get(`${this.urlRef.url}getalldeliverytypes`);
  }

  getactivesuppliers() {
    return this.http.get(`${this.urlRef.url}getactivedistrubutorsdata`)
  }

  getSuppliersData(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}getallSuppliers/byName?searchTerm=${searchTerm}`);
  }

  retrieveSupplierItems(supplierId: number) {
    return this.http.get(`${this.urlRef.url}getitemsuppliers/basedonSupplierId/po?supplierId=${supplierId}`)
  }

  getallquotations() {
    return this.http.get(`${this.urlRef.url}getallquotations`);
  }

  getallemployeesdata() {
    return this.http.get(`${this.urlRef.url}getallemployeesdata`);
  }

  approvalquotation(quotation: any) {
    return this.http.post(`${this.urlRef.url}save/requestpendingquotation`, quotation);
  }

  deletequotationItem(quotationItemsId: number) {
    return this.http.delete(`${this.urlRef.url}delete/quotationitems?quotationItemsId=${quotationItemsId}`);
  }

  deletepurchaseOrderItem(purchaseOrderItemsId: number) {
    return this.http.delete(`${this.urlRef.url}delete/purchaseOrderItem?purchaseOrderItemsId=${purchaseOrderItemsId}`);
  }
  laterquotation(quotation: any) {
    return this.http.post(`${this.urlRef.url}save/requestnewquotation`, quotation);
  }

  getrequestnewquotationbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getrequestnewquotationbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getsuppliersbyquotation(id: number) {
    return this.http.get(`${this.urlRef.url}getsuppliersbyquotation?quotationId=${id}`);
  }

  getallsuppliers() {
    return this.http.get(`${this.urlRef.url}getallsuppliersdata/foritemsuppliers`);
  }

  getitemsbysupplier(id: number) {
    return this.http.get(`${this.urlRef.url}getitemsuppliers/basedonSupplierId/po?supplierId=${id}`);
  }

  getitemsbysupplierquotation(supplierId, quotationId) {
    return this.http.get(`${this.urlRef.url}getitemsbysupplierquotation?supplierId=${supplierId}&quotationId=${quotationId}`);
  }

  partiallypurchaseorder(data: any) {
    return this.http.post(`${this.urlRef.url}save/partiallypurchaseorder`, data);
  }

  pendingpurchaseorder(data: any) {
    return this.http.post(`${this.urlRef.url}save/pendingpurchaseorder`, data);
  }

  getrequestpendingquotationbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getrequestpendingquotationbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getpendingpurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getpendingpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  approvedpurchaseorder(data: any) {
    return this.http.post(`${this.urlRef.url}save/approvedpurchaseorder`, data);
  }

  rejectedpurchaseorder(data: any) {
    return this.http.post(`${this.urlRef.url}save/rejectedpurchaseorder`, data);
  }

  getapprovedpurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getapprovedpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getrejectedpurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getrejectedpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getsentpurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getsentpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getpartiallypurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getpartiallypurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getalluniqueids(value: string) {
    return this.http.get(`${this.urlRef.url}get/uniquecodebyuniquecodename?uniqueCode=${value}`);
  }

  searchrequestnewquotationbypharmacy(pharmacyId: number, term: string) {
    return this.http.get(`${this.urlRef.url}searchrequestnewquotationbypharmacy?searchTerm=${term}&&pharmacyId=${pharmacyId}`);
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


}





