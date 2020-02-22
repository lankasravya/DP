import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
@Injectable({ providedIn: 'root' })
export class AddpurchaseorderinvoiceService {


  urlRef = new Environment();

  constructor(private http: HttpClient) { }

  getallpaymenttypes() {
    return this.http.get(`${this.urlRef.url}getallpaymenttypes`);
  }

  savepurchaseinvoice(purchaseinvoicepayload: any) {
    return this.http.post(`${this.urlRef.url}save/invoice`, purchaseinvoicepayload);
  }

  updatePurchaseInvoice(purchaseinvoicepayload: any) {
    return this.http.put(`${this.urlRef.url}update/invoice`, purchaseinvoicepayload);
  }

  deletepurchaseInvoiceItem(invoiceItemId: number) {
    return this.http.delete(`${this.urlRef.url}delete/invoiceitem?invoiceItemId=${invoiceItemId}`);
  }

  generatepurchasegrnno(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}generatepurchasegrnno?pharmacyId=${pharmacyId}`);
  }

  public getGRNNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=PI');
  }

  generatepurchaseprno(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}generatepurchasereturnno?pharmacyId=${pharmacyId}`);
  }

  getpurchaseordersbypharmacy(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}getpurchaseordersbypharmacy?pharmacyId=${pharmacyId}`);
  }

  getsupplierbypurchaseorder(purchaseOrderId: number) {
    return this.http.get(`${this.urlRef.url}getsupplierbypurchaseorder?purchaseOrderId=${purchaseOrderId}`);
  }

  getpoitemsbypono(purchaseOrderId: number) {
    return this.http.get(`${this.urlRef.url}getitemsbypurchaseorder?purchaseOrderId=${purchaseOrderId}`);
  }


  /* stockAdjustment services */

  saveStockAdjustmentData(stockGridSave: Object) {
    return this.http.post(this.urlRef.url + 'save/stockadjustment', stockGridSave);
  }

	/* 	multiSaveStockAdjustmentData(stockGridSave:Object){
			return this.http.post(this.urlRef.url+'save/stockadjustments',stockGridSave);
		   } */


  getStockAdjustmentTotal(batch, expiry, pharmacyId) {
    return this.http.get(`${this.urlRef.url}get/stockstotal/matchedstockadjustid?batch=${batch}&expiry=${expiry}&pharmacyId=${pharmacyId}`);
  }

  getStocksMatchedWithStockAdjustMent(batch, expiry, pharmacyId) {
    return this.http.get(`${this.urlRef.url}get/stocks/matchedIds?batch=${batch}&expiry=${expiry}&pharmacyId=${pharmacyId}`);
  }

  updateStockRecords(stocks: any[]) {
    return this.http.put(this.urlRef.url + 'update/stocks/basedonStockAdjust', stocks);
  }

  getStockBasedOnItemCode(formdata) {
    return this.http.post(this.urlRef.url + 'get/stockitems/basedonitemcode', formdata);
  }

  getStockBasedOnItemName(formData) {
    return this.http.post(this.urlRef.url + 'get/stockitems/basedonitemname', formData);
  }

  getStockBasedOnItemDesc(formdata) {
    return this.http.post(this.urlRef.url + 'get/stockitems/basedonitemdesc', formdata);
  }

  getStockBasedOnItemGenericName(formdata) {
    return this.http.post(this.urlRef.url + 'get/stockitems/basedonitemgeneric', formdata);
  }


  getStockBatchesBasedOnItemCode(searchTerm) {

    return this.http.get(this.urlRef.url + 'get/batch/basedonitemcode?searchTerm=' + searchTerm);
  }

  getItemsByLimit(start, end) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabylimit?start=' + start + '&end=' + end);
  }

  getItemsByLimitWithCode(start, end) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabylimit/withitemcode?start=' + start + '&end=' + end);
  }

  getItemsByLimitWithDesc(start, end) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabylimit/withitemdesc?start=' + start + '&end=' + end);
  }

  getItemsByLimitWithGeneric(start, end) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabylimit/withitem/genericname?start=' + start + '&end=' + end);
  }


  public getItemByName(searchKey: string) {
    return this.http.get(`${this.urlRef.url}item/getitemsdatabyname/forstock?key=${searchKey}`);
  }

  public getItemByCode(searchKey: string) {
    return this.http.get(`${this.urlRef.url}item/getitemsdatabycode/forstock?key=${searchKey}`);
  }

  getItemByGeneric(searchKey: string) {
    return this.http.get(`${this.urlRef.url}item/getitemsdatabygenericname/forstock?key=${searchKey}`);
  }

  getItemByDesc(searchKey: string) {
    return this.http.get(`${this.urlRef.url}item/getitemsdatabydesc/forstock?key=${searchKey}`);
  }

  getItemByGericName(searchKey: string) {
    return this.http.get(`${this.urlRef.url}item/getitemsdatabygenericname/forstock?key=${searchKey}`);
  }

  getStockBatchesBasedOnItemName(searchTerm) {
    return this.http.get(this.urlRef.url + 'get/batch/basedonItemName?searchTerm=' + searchTerm);
  }

  getStockBatchesBasedOnItemDesc(searchTerm) {
    return this.http.get(this.urlRef.url + 'get/batch/basedonItemDesc?searchTerm=' + searchTerm);
  }

  getStockBatchesBasedOnItemGeneric(searchTerm) {
    return this.http.get(this.urlRef.url + 'get/batch/basedonItemGeneric?searchTerm=' + searchTerm);
  }


  getExpiryBasedOnItemandBatch(itemId, batch) {
    return this.http.get(`${this.urlRef.url}get/expirydt?itemId=${itemId}&batch=${batch}`);
  }


  getExpiryBasedOnItemDesc(itemId, batch) {
    return this.http.get(`${this.urlRef.url}get/expiryDate/basedonitemdesc?itemId=${itemId}&batch=${batch}`);
  }

  getExpiryBasedOnItemGeneric(itemId, batch) {
    return this.http.get(`${this.urlRef.url}get/expiryDate/basedonitemgeneric?itemId=${itemId}&batch=${batch}`);
  }

  getExpiryBasedOnItemName(itemId, batch) {
    return this.http.get(`${this.urlRef.url}get/expiry?itemId=${itemId}&batch=${batch}`);
  }

  getStockByItemIdAndPharmacyId(itemId, pharmacyId) {
    return this.http.get(`${this.urlRef.url}getstockbyitemidandpharmacyid?itemId=${itemId}&pharmacyId=${pharmacyId}`);
  }

  getPurchaseInvoiceByPharmacyAndInvoiceStatus(pharmacyId, invoiceStatusId, pageNumber, pageSize, invoiceNo) {
    return this.http.get(`${this.urlRef.url}getinvoicesbypharmacyandstatus?pharmacyId=${pharmacyId}&invoiceStatusId=${invoiceStatusId}&pageNumber=${pageNumber}&pageSize=${pageSize}&invoiceNo=${invoiceNo}`);
  }

  getPurchaseInvoiceByPharmacyAndInvoiceStatusCount(pharmacyId, invoiceStatusId, invoiceNo) {
    return this.http.get(`${this.urlRef.url}getinvoicesbypharmacyandstatuscount?pharmacyId=${pharmacyId}&invoiceStatusId=${invoiceStatusId}&invoiceNo=${invoiceNo}`);
  }
}
