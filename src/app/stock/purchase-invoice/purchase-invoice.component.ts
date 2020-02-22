import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Component, OnInit, NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddpurchaseorderinvoiceService } from './addpurchaseorderinvoice.service';
import { GridOptions, ICellRendererParams, ColDef } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateRenderer } from '../../core/date.renderer.component';
import { NumericEditor } from '../../core/numeric-editor.component';
import { AppService } from 'src/app/core/app.service';
import { AddPurchaseorderService } from '../purchase-order/add-purchaseorder.service';
import { PurchaseReturnService } from '../purchase-returns/purchase-return.service';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
//import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
//import "@ag-grid-community/all-modules/dist/styles/ag-theme-fresh.css";

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
  providers: [AddpurchaseorderinvoiceService, AddPurchaseorderService],
})
export class PurchaseInvoiceComponent implements OnInit {
  selectedItem: any;
  showSupplier: boolean;
  _prNumber: string;
  today: any;
  constructor(private addpurchaseorderinvoiceService: AddpurchaseorderinvoiceService, private toasterService: ToastrService, private appService: AppService,
    private addPurchaseOrderService: AddPurchaseorderService, private purchaseReturnSvc: PurchaseReturnService,
    private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
    this.purchaseInvoiceGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.purchaseInvoiceGridOptions.rowSelection = 'single';
    this.purchaseInvoiceGridOptions.columnDefs = this.columnDefs;
    this.purchaseInvoiceGridOptions.rowData = [];

    this.purchaseInvoiceGridOptions.onCellValueChanged = this.purchaseOrderGridModified.bind(this);

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    this.appService.getPurchaseOrderDeletedRow().subscribe(
      (deletedRow: ICellRendererParams) => {
        if (deletedRow instanceof Object) {
          let deleteData = this.purchaseInvoiceGridOptions.rowData.filter(
            x => x.itemId === deletedRow.data.itemId
          );
          try {
            this.purchaseInvoiceGridOptions.api.updateRowData({ remove: deleteData });
            let deleteIndex: number = this.findObjectIndex(this.purchaseInvoiceGridOptions.rowData, deleteData[0], 'itemId');
            if (deleteIndex !== -1) {
              this.purchaseInvoiceGridOptions.rowData.splice(deleteIndex, 1);
            }
          } catch (e) {

          }
        }
      }
    );
    this.resetInitialValues();
    this.generatePRNumber();
  }

  generatePRNumber() {
    this.purchaseReturnSvc.fetchPRNumber().subscribe(uniqueCode => {
      if (uniqueCode instanceof Object) {
        if (uniqueCode['responseStatus']['code'] === 200) {
          this._prNumber = uniqueCode['message'];
        }
      }
    });
  }

  purchaseOrderGridModified(modifiedRowNode) {
    if (modifiedRowNode.oldValue != modifiedRowNode.newValue) {
      this.postCellEditOperations(modifiedRowNode);
    }
  }

  postCellEditOperations(modifiedRowNode: ICellRendererParams) {
    if (modifiedRowNode.colDef.field == 'bonus') {

    }
  }

  selectedPaymentType: Object = {};
  paymentTypes: any[] = [];
  pharmacyId: number = 1;
  totalItems = 0;
  onPaymentTypeChange(event: Event) {

    this.selectedPaymentType = this.paymentTypes.find(x => x.paymentTypeId == event['paymentTypeId']);
  }

  generategrnno(pharmacyId: number) {
    this.addpurchaseorderinvoiceService.getGRNNumber().subscribe(
      generategrnnoResponse => {
        if (generategrnnoResponse['responseStatus']['code'] == 200) {
          this.purchaseInvoiceInformationForm.patchValue({ grnNo: generategrnnoResponse['result'] });
        }
      }
    );
  }

  generateprno(pharmacyId: number) {
    this.addpurchaseorderinvoiceService.generatepurchaseprno(pharmacyId).subscribe(
      res => {
        if (res['responseStatus']['code'] == 200) {
          (document.getElementById('purchaseReturnsPR') as HTMLInputElement).value = res['result'];
        }
      }

    );
  }




  formatPayLoad(payload: any) {
    payload['paymentType'] = this.selectedPaymentType;
    payload['supplierModel'] = this.selectedSupplier;
    //payload['invoiceStatus'] = { invoiceStatusId: this.selectedStatusId, status: this.selectedStatus };
    payload['pharmacy'] = { pharmacyId: this.pharmacyId };
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['createdBy'] = Number(localStorage.getItem('id'))//{ employeeId: Number(localStorage.getItem('id')) };
    payload['approvedBy'] = Number(localStorage.getItem('id'))//{ employeeId: Number(localStorage.getItem('id')) };
    payload['modifiedBy'] = Number(localStorage.getItem('id'))//{ employeeId: Number(localStorage.getItem('id')) };


    var rowData = []


    this.purchaseInvoiceGridOptions.api.forEachNode(
      dataRow => {


        rowData.push(dataRow['data']);

      }
    );

    var purchaseTaxAmount = 0;

    for (var i = 0; i < rowData.length; i++) {
      rowData[i]['purchaseOrderModel'] = (this.selectedPurchaseOrder != undefined && this.selectedPurchaseOrder != null) ? ((this.selectedPurchaseOrder[0].purchaseOrderId != null && this.selectedPurchaseOrder[0].purchaseOrderId != undefined) ? { purchaseOrderId: this.selectedPurchaseOrder[0].purchaseOrderId } : null) : null;
      rowData[i]['orderQuantity'] = rowData[i]['quantity']
      rowData[i]['packPPrice'] = rowData[i]['packRate'];
      purchaseTaxAmount += Number(rowData[i]['purchaseTaxAmount']);
    }
    payload['purchaseTaxAmount'] = purchaseTaxAmount;
    payload['invoiceItems'] = rowData;

    let dateValidation = true;
    for (var i = 0; i < rowData.length; i++) {
      if (rowData[i]['expiryDt'] == '' || rowData[i]['expiryDt'] == undefined || rowData[i]['expiryDt'] == null) {
        dateValidation = false;
        break;
      }
    }
    if (dateValidation) {
      return payload;
    }
    else {
      return null;
    }

  }

  dropdownSettings = {};

  resetInitialValues() {
    this.dropdownSettings = {
      text: 'Select Purchase Order Item',
      singleSelection: false,
      idField: 'itemId',
      textField: 'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.totalItems = 0;
    this.itemParameter = "";
    this.itemSearchTerm = "";
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedSupplierName = '';
    this.selectedPurchaseOrder = undefined;
    this.selectedPoItem = undefined;
    this.selectedPaymentType = {};
    this.generategrnno(this.pharmacyId);
    this.getPaymentTypes();
    this.getpurchaseordersbypharmacy(this.pharmacyId);
    this.getActiveSuppliers('');
    this.showGrid = false;
    this.loadRowData([], this.purchaseInvoiceGridOptions);
    this.showGrid = true;
    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
    this.getalldeliverytypes();
    this.selectedDeliveryId = undefined;

    this.today = new Date().toISOString().slice(0, 10);
    setTimeout(() => {

      (document.getElementById('purchaseInvoiceGRNDate') as HTMLInputElement).value = this.today;
    }, 200);
    this.ddd = this.sss[1];
    setTimeout(() => {
      this.purchaseInvoiceInformationForm.patchValue({ invoiceDt: this.invDate });
    }, 200)
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  checkFormDisability() {
    var batchStatus = true;
    //  var expiryDt = true;
    var pack = true;

    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      batchStatus = node.data.batchNo != null && node.data.batchNo != undefined ? false : true;
    })
    this.purchaseInvoiceGridOptions.api.forEachNode(node => {

      // expiryDt = node.data.expiryDt != null && node.data.expiryDt != undefined ? false : true;
    })


    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      pack = node.data.pack != null && node.data.pack != undefined ? false : true;
    })


    return (this.purchaseInvoiceInformationForm.get('quantity').errors instanceof Object)
      || (this.purchaseInvoiceInformationForm.get('invoiceNo').errors instanceof Object)
      || (this.purchaseInvoiceInformationForm.get('invoiceDt').errors instanceof Object)
      || (this.purchaseInvoiceInformationForm.get('payType').errors instanceof Object)
      || !(this.selectedSupplier instanceof Object)
      || (this.selectedStatusId !== 1)
      || batchStatus

      || pack
  }
  statusChanged = true;

  statusSelected(event) {

    if (event == "Approved") {
      this.statusChanged = false;

    }
    else {
      this.statusChanged = true;

    }

  }

  onSubmit() {

  }

  onPurchaseInvoiceSave(status) {
    this.purchaseInvoiceInformationForm.get('invoiceStatus').setValue({ invoiceStatusId: status })
    let payload = Object.assign({}, this.purchaseInvoiceInformationForm.value);
    this.spinnerService.show();
    payload = this.formatPayLoad(payload);
    if (payload != null && payload != undefined) {
      this.addpurchaseorderinvoiceService.savepurchaseinvoice(payload).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.spinnerService.hide();
              this.resetInitialValues();
              this.purchaseInvoiceInformationForm.reset();
              this.purchaseInvoiceInformationForm.patchValue({ quantity: 0 })
              this.toasterService.success(res['message'], 'Success', {
                timeOut: 3000
              });
            }
          }
        }, error => {
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      );
    }
    else {
      this.toasterService.error('Expiry Date is Not valid', 'Error Occurred', {
        timeOut: 5000
      })
      this.spinnerService.hide();
      return 0;
    }
  }

  onCancel() {
    this.resetInitialValues();
    this.purchaseInvoiceInformationForm.reset();
    this.purchaseInvoiceInformationForm.patchValue({ quantity: 0 })
    this.purchaseInvoiceGridOptions.api.setRowData([]);
    setTimeout(() => {
      this.purchaseInvoiceInformationForm.patchValue({ invoiceDt: this.invDate });
    }, 200)
  }

  purchaseOrderCalculations(addedItem: Object) {
    //console.log(addedItem)

    addedItem['totalQuantity'] = addedItem['quantity'];
    let quantityAmount = addedItem['totalQuantity'] * addedItem['unitRate'];
    addedItem['actualValue'] = quantityAmount;
    addedItem['discount'] = (quantityAmount * +(((addedItem['discountPercentage']) / 100)).toFixed(2));
    addedItem['unitRate'] = +((quantityAmount - addedItem['discount']) * +(((100 + addedItem['itemsModel']['tax']['percentage']) / (100))).toFixed(2)).toFixed(2);
    return addedItem;
  }

  addRowsToPurchaseOrderGrid() {
    this.selectedItem['quantity'] = this.purchaseInvoiceInformationForm.get('quantity').value;
    this.purchaseOrderCalculations(this.selectedItem);
    let addItem = JSON.parse(JSON.stringify(this.selectedItem));
    this.addpurchaseorderinvoiceService.getStockByItemIdAndPharmacyId(this.selectedItem['itemsModel']['itemId'], localStorage.getItem('pharmacyId'))
      .subscribe(stockRes => {
        //purchaseOrder[0]['purchaseorderitems'][index]['unitSaleRate'] = stockRes['result'][0]['unitSaleRate'];
        // console.log(stockRes)
        // console.log(stockRes['result'][0]['unitSaleRate'])
        if (stockRes['result'][0] != null && stockRes['result'][0] != undefined) {

          if (addItem['pack'] == null && addItem['pack'] == undefined) {
            addItem['pack'] = stockRes['result'][0]['pack'] != null && stockRes['result'][0]['pack'] != undefined ? stockRes['result'][0]['pack'] : 1
          }

          addItem['unitSaleRate'] = stockRes['result'][0]['unitSaleRate'] != null && stockRes['result'][0]['unitSaleRate'] != undefined ? stockRes['result'][0]['unitSaleRate'] : null;

          // console.log(addItem['unitSaleRate'])
          //console.log(addItem)

          addItem['saleDiscountPercentage'] = stockRes['result'][0]['saleDiscountPercentage'];
          addItem['packSaleRate'] =
            (stockRes['result'][0]['unitSaleRate'] != null && stockRes['result'][0]['unitSaleRate'] != undefined && stockRes['result'][0]['pack'] != null && stockRes['result'][0]['pack'] != undefined) ?
              (stockRes['result'][0]['unitSaleRate'] * stockRes['result'][0]['pack']) : 0;
          // console.log(addItem['packSaleRate'])
          // console.log(addItem)
        }



        // purchaseOrder[0]['purchaseorderitems'][i]['mrp'] = stockRes['result'][0]['mrp'];

        addItem['quantityApproved'] = addItem['quantity'];
        addItem['tax'] = addItem['itemsModel']['tax'];

        //var totalQuantity =  Number(isNaN(this.purchaseInvoiceInformationForm.get('quantity').value)?0:this.purchaseInvoiceInformationForm.get('quantity').value ) + purchaseOrder[0]['purchaseorderitems'][index]['quantityApproved'];
        //this.purchaseInvoiceInformationForm.get('quantity').setValue(totalQuantity);


        this.purchaseInvoiceGridOptions.api.updateRowData({ add: [addItem] });

      })
    /* this.purchaseInvoiceGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 0
    }); */
    //this.purchaseInvoiceGridOptions.rowData = this.purchaseInvoiceGridOptions.rowData.concat([addItem]);
    this.purchaseInvoiceInformationForm.get('quantity').reset();
    (document.getElementById('purchaseInvoiceCode') as HTMLInputElement).value = '';
    (document.getElementById('purchaseInvoiceDesc') as HTMLInputElement).value = '';
    this.selectedItem = null;
  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object) {
      // return this.purchaseInvoiceGridOptions.rowData.map(x => x.itemsModel.itemId).some(x => x == this.selectedItem['itemsModel']['itemId']);
      return true;
    }
    else return false;
  }

  getTotalAmount() {
    if (this.purchaseInvoiceGridOptions.rowData.length > 0) {
      // return this.purchaseInvoiceGridOptions.rowData
      //   .reduce((accumalator, currentValue) => (accumalator + parseInt(currentValue.totalValue)), 0)
    }
  }

  getTotalQuantity() {
    var tQuantity = 0;
    var tItems = 0;
    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      tQuantity += Number(node['data']['quantityApproved'])
      tItems++;
    })
    this.totalQuantity = tQuantity;
    this.totalItems = tItems;
    this.purchaseInvoiceInformationForm.get('quantity').setValue(this.totalQuantity);
  }

  getTotalBonus() {
    var tBonus = 0;
    var tItems = 0;
    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      // console.log(node);
      tBonus += Number(node['data']['bonus'])
      tItems++;
    })
    this.totalBonus = tBonus;
    this.totalItems = tItems;
    // console.log(this.totalBonus)
    this.purchaseInvoiceInformationForm.get('bonus').setValue(this.totalBonus);
    // if (this.purchaseInvoiceGridOptions.rowData.length > 0) {
    //   return this.purchaseInvoiceGridOptions.rowData
    //     .reduce((accumalator, currentValue) => (accumalator + parseInt(currentValue.bonus)), 0)
    // }
  }

  checkQuantity() {
    if (this.purchaseInvoiceInformationForm.get('quantity').value != undefined && this.purchaseInvoiceInformationForm.get('quantity').value != null) {
      return true;
    }
    else return false;
  }

  suppliers: any[] = [];

  selectedSupplierName: string = '';
  selectedSupplier: Object;

  onSupplierChange(selectedSupplier: any) {
    if (selectedSupplier instanceof Object) {
      //      console.log(this.suppliers)
      this.selectedItem = undefined;
      this.showSupplier = false;
      this.selectedSupplier = selectedSupplier;
      this.selectedSupplierName = selectedSupplier['name'];
      this.selectedPaymentType = selectedSupplier['paymentType']
      this.retrieveSupplierItems(selectedSupplier['supplierId']);
    }
    else {
      this.purchaseInvoiceGridOptions.api.setRowData([]);
      this.selectedSupplier = undefined;
      (document.getElementById('purchaseInvoiceLabelTItems') as HTMLInputElement).value = '0';
      (document.getElementById('purchaseInvoiceQuantity') as HTMLInputElement).value = '0';
    }
  }

	/**
	 * Item Grid Changes
	 * Start
	 */

  tooltipRenderer = function (params) {

    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }


  }
  itemGridOptions: GridOptions;
  showItemGrid: boolean = false;
  showPurchaseReturns = false;
  itemColumDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      resizable: true,
    },
    /*  { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, resizable: true, filter: true },
      { headerName: 'Item Name', field: 'itemsModel.itemName', sortable: true, resizable: true, filter: true, width: 400, },
      { headerName: 'Item Description', field: 'itemsModel.itemDescription', resizable: true, sortable: true, filter: true }, */
    { headerName: 'Item Code', field: 'itemsModel.itemCode', hide: true, sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Product Name', field: 'itemsModel.itemName', sortable: true, filter: true, resizable: true, width: 260, cellStyle: { 'border': '1px solid #BDC3C7' }, cellRenderer: this.tooltipRenderer, },
    { headerName: 'Strength', field: 'itemsModel.drugDose', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Manufacturer', field: 'itemsModel.manufacturer.name', sortable: true, filter: true, resizable: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Formulation TAB/CAP etc', field: 'itemsModel.itemForm.formCode', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'TAX', field: 'itemsModel.tax.categoryCode', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Pack', field: 'itemsModel.pack', sortable: true, resizable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },

  ]

	/**
	 * Item Grid Changes
	 * End
	 */

  poItems: any[] = [];
  selectedPoItem: any;
  obj = [];
  totalQuantity = 0;
  totalBonus = 0;
  getItemsBypurchaseOrderId(purchaseOrder) {
    this.poItems = [];
    this.obj = [];
    this.purchaseInvoiceGridOptions.api.setRowData([]);
    // this.purchaseInvoiceGridOptions.api.updateRowData({ add: purchaseOrder[0]['purchaseorderitems'] });

    purchaseOrder.forEach(pr => {

      var index = 0;
      // console.log(pr)
      let observables = new Array();
      for (var item of pr['purchaseorderitems']) {

        observables.push(this.addpurchaseorderinvoiceService.getStockByItemIdAndPharmacyId(item['itemsModel']['itemId'], localStorage.getItem('pharmacyId')));



      }
      Observable.forkJoin(observables).subscribe(stockRes => {
        // stockRes = stockRes[0];
        //  console.log(stockRes);
        //  console.log(pr['purchaseorderitems'])
        for (var item of pr['purchaseorderitems']) {


          //purchaseOrder[0]['purchaseorderitems'][index]['unitSaleRate'] = stockRes['result'][0]['unitSaleRate'];
          //  console.log(item['itemsModel']['itemId'])

          if (stockRes[index]['result'][0] != null && stockRes[index]['result'][0] != undefined) {

            item['unitSaleRate'] = stockRes[index]['result'][0]['unitSaleRate'] != null && stockRes[index]['result'][0]['unitSaleRate'] != undefined ? stockRes[index]['result'][0]['unitSaleRate'] : null;
            item['saleDiscountPercentage'] = stockRes[index]['result'][0]['saleDiscountPercentage'];
            item['packSaleRate'] =
              (stockRes[index]['result'][0]['unitSaleRate'] != null && stockRes[index]['result'][0]['unitSaleRate'] != undefined) ?
                stockRes[index]['result'][0]['unitSaleRate'] * stockRes[index]['result'][0]['pack'] : 0;
          }
          // purchaseOrder[0]['purchaseorderitems'][i]['mrp'] = stockRes['result'][0]['mrp'];
          item['quantityApproved'] = item['quantity'];

          // var totalQuantity =  Number(isNaN(this.purchaseInvoiceInformationForm.get('quantity').value)?0:this.purchaseInvoiceInformationForm.get('quantity').value ) + purchaseOrder[0]['purchaseorderitems'][index]['quantityApproved'];
          //this.purchaseInvoiceInformationForm.get('quantity').setValue(totalQuantity);
          //  console.log(item['quantity']);


          //  let vat= item['tax'] != null && item['tax']  != undefined ? item['tax'] ['categoryCode']== 'A' ? 16 : 0 : 0;
          //  console.log(item['quantityApproved'] );
          //  console.log(item['unitSaleRate']);
          //  console.log(item['saleDiscountPercentage']);

          this.purchaseInvoiceGridOptions.api.updateRowData({ add: [item] });
          index++;
          // console.log('loop end:')
        }
      })

    });
    //this.purchaseInvoiceGridOptions.api.updateRowData({ add: purchaseOrder[0]['purchaseorderitems'] });

    //this.addpurchaseorderinvoiceService.getStockByItemIdAndPharmacyId()
    /*  for (var i = 0; i < purchaseOrder.length; i++) {
       this.addpurchaseorderinvoiceService.getpoitemsbypono(purchaseOrder[i].purchaseOrderId).subscribe(
         itemsRes => {
           if (itemsRes instanceof Object) {

             if (itemsRes['responseStatus']['code'] == 200) {
               for (var j = 0; j < itemsRes['result'].length; j++) {
                 this.obj.push(itemsRes['result'][j]);
               }
               this.poItems = this.obj;
               this.purchaseInvoiceGridOptions.api.setRowData([]);
               this.purchaseInvoiceGridOptions.api.updateRowData({ add: this.poItems });

             }

           }
         }
       );
     } */

  }

  checkIfSelectedPoExists() {
    return this.selectedPurchaseOrder instanceof Object;
  }

  getSuppliersbyPoId(purchaseOrder) {
    //this.suppliers = [];
    //    console.log(this.suppliers)
    //this.selectedSupplier = undefined;
    for (var i = 0; i < purchaseOrder.length; i++) {
      this.addpurchaseorderinvoiceService.getsupplierbypurchaseorder(purchaseOrder[i].purchaseOrderId).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              if (this.selectedSupplier == null && this.selectedSupplier == undefined) {
                // this.suppliers = [res['result']];
                this.selectedSupplier = res['result'];
                //                console.log(this.suppliers)
                this.selectedPaymentType = this.selectedSupplier['paymentType']
              }
              else if (this.selectedSupplier['supplierId'] != res['result']['supplierId']) {
                this.toasterService.error("Error", "Selected PO's Suppliers Are Defferent", { timeOut: 3000 });
              }


              this.onSupplierChange(this.selectedSupplier);
            }
          }
        }
      );
    }
    //    console.log(this.suppliers)
  }
  gridApi;
  packPPrice: any;
  pPriceCal(purchaseOrder) {



    var urate = purchaseOrder['purchaseorderitems'][0]['unitRate'];
    var pack = purchaseOrder['purchaseorderitems'][0]['pack'];

    /*  this.gridApi.purchaseInvoiceGridOptions.getSelectedRows().forEach(element => {
       let gridItem=new purchaseInvoiceModel;
       gridItem['']
     });*/

    var packRate = Math.round(((urate * pack) * 100) / 100).toFixed();

    this.packPPrice = packRate;

  }

  onPurchaseOrderNoChanged(purchaseOrder) {
    //  console.log(purchaseOrder)
    if (purchaseOrder.length > 0) {

      this.getItemsBypurchaseOrderId(purchaseOrder);
      this.getSuppliersbyPoId(purchaseOrder);
      //this.pPriceCal(purchaseOrder);
    }
    else {
      //  console.log('in selected purchase order else part')

      this.poItems = [];
      //this.suppliers = [];
      this.getActiveSuppliers('');
      this.selectedSupplier = undefined;
      this.selectedPoItem = undefined;
      this.purchaseInvoiceGridOptions.rowData = [];
      this.selectedItem = undefined;
      this.getActiveSuppliers('');
      this.purchaseInvoiceGridOptions.api.setRowData([]);
    }
  }

  itemParameter: string = "";
  itemSearchTerm: string = "";

  onItemSelected() {
    this.selectedItem = JSON.parse(JSON.stringify(this.itemGridOptions.api.getSelectedRows()[0]));
    // this.loadRowData(this.selectedItem, this.purchaseInvoiceGridOptions);
    setTimeout(() => {
      this.itemGridOptions.api.deselectAll();
    }, 100);

  }

  onSeachTermClick() {
    this.getItembysupplieritemcditemname(this.selectedSupplier['supplierId'], this.itemParameter, this.itemSearchTerm);
  }

  getItembysupplieritemcditemname(supplierId: number, itemCode: string, itemName: string) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.getItembysupplieritemcditemname(supplierId, itemCode, itemName).subscribe(
      itemReponse => {
        if (itemReponse instanceof Object) {
          if (itemReponse['responseStatus']['code'] == 200) {
            if (itemReponse['result'].length > 0) {
              this.loadRowData(itemReponse['result'], this.itemGridOptions);
              // this.itemGridOptions.rowData = itemReponse['result'];
              this.showItemGrid = true;
            }
            else {
              this.loadRowData(itemReponse['result'], this.itemGridOptions);
              this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                timeOut: 5000
              });
              this.showItemGrid = true;
            }

          }
        }
      }
    );
  }

  retrieveSupplierItems(supplierId: number) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.retrieveSupplierItems(supplierId).subscribe(
      retrieveSupplierItemsResponse => {
        if (retrieveSupplierItemsResponse instanceof Object) {
          if (retrieveSupplierItemsResponse['responseStatus']['code'] === 200) {
            //console.log(retrieveSupplierItemsResponse['result']);
            this.itemGridOptions.rowData = retrieveSupplierItemsResponse['result'];
            this.showItemGrid = true;
          }
        } else {
        }
      }
    );
  }

  getActiveSuppliers(searchTerm: string) {
    this.addPurchaseOrderService.getSuppliersData(searchTerm).subscribe(
      activeSupplierResponse => {
        if (activeSupplierResponse instanceof Object) {
          if (activeSupplierResponse['responseStatus']['code'] === 200) {

            this.suppliers = activeSupplierResponse['result'];
          }
        }
      }
    );
  }

  purchaseorders: any[] = [];

  selectedPurchaseOrder: any;

  getpurchaseordersbypharmacy(pharmacyId: number) {
    this.addpurchaseorderinvoiceService.getpurchaseordersbypharmacy(pharmacyId).subscribe(
      generategrnnoResponse => {
        if (generategrnnoResponse['responseStatus']['code'] == 200) {

          this.purchaseorders = generategrnnoResponse['result'];
        }
      }
    );
  }



  getPaymentTypes() {
    this.addpurchaseorderinvoiceService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
          this.selectedPaymentType = this.paymentTypes[0];
        }
      }
    );
  }

  purchaseInvoiceGridOptions: GridOptions;
  purchaseInvoiceInformationForm: FormGroup;
  showGrid: boolean = true;
  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true
      // cellRendererFramework: CheckBoxComponent
    },
    { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, resizable: true, filter: true, hide: true },
    { headerName: 'Item Name', field: 'itemsModel.itemName', sortable: true, resizable: true, filter: true, width: 400, cellRenderer: this.tooltipRenderer, },

    {
      headerName: 'Total Qty', field: 'orderedQuantity', sortable: true, resizable: true, filter: true, singleClickEdit: true, width: 100,
      valueGetter: function (params) {
        //params.data.quantityApproved = params.data.quantity;
        return params.data.quantity;

      },

    },
    {
      headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor, singleClickEdit: true, editable: true, width: 80,

      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },
    {
      headerName: 'Pack', field: 'pack', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor, width: 80, editable: true, cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      },
      valueGetter: function (params) {
        if (params.data.pack != null && params.data.pack != undefined) {
          return params.data.pack;
        }
        else {
          params.data.pack = 1;
          return params.data.pack;
        }
      }
    },
    {
      headerName: 'Batch', field: 'batchNo', sortable: true, resizable: true, filter: true, editable: true, width: 100,
      singleClickEdit: true,
      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },
    {
      headerName: 'Expiry', field: 'expiryDt', sortable: true, resizable: true, filter: true, singleClickEdit: true,
      cellRendererFramework: DateRenderer
    },


    {
      headerName: 'Appd Qty', field: 'quantityApproved', width: 100, sortable: true, resizable: true, filter: true, singleClickEdit: true, editable: true,
      valueGetter: this.approvedQuantityCheck.bind(this),
    },

    {
      headerName: 'Rjt Qty', field: 'reject', sortable: true, width: 90, resizable: true, filter: true, singleClickEdit: true, cellEditorFramework: NumericEditor, editable: true,
      cellRenderer: (data) => {
        if ((Number(data.value) + (Number(data.data.bonus) ? Number(data.data.bonus) : 0) + (Number(data.data.quantityApproved) ? Number(data.data.quantityApproved) : 0)) > data.data.quantity) {
          return '0';
        }
        return data.value ? data.value : '0';
      },
      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },
    /* {
      headerName: 'Unit P.Price', field: 'unitRate', sortable: true, singleClickEdit: true, filter: true, editable: true, width: 100, hide: false,
      valueGetter: function (params) {
        var pack = params.data.pack != null && params.data.pack != undefined ? params.data.pack : 1;
        var ppPrice = params.data.packRate != null && params.data.packRate != undefined ? params.data.packRate : 0;
        params.data.unitRate = Math.round(((ppPrice / pack) * 100) / 100).toFixed(2);

        return params.data.unitRate;

      },
    }, */
    {
      headerName: 'Pack P.Price', field: 'packRate', sortable: true, resizable: true, singleClickEdit: true, filter: true, editable: true, width: 120, cellEditorFramework: NumericEditor,

      valueGetter: function (params) {
        var pack = params.data.pack != null && params.data.pack != undefined ? params.data.pack : 1;
        var ppPrice = params.data.packRate != null && params.data.packRate != undefined ? params.data.packRate : 0;
        params.data.unitRate = Math.round(((ppPrice / pack) * 100) / 100).toFixed(2);

        return params.data.packRate;

      },

    },

    // {
    //   headerName: 'Manufacturer Date', field: 'manufactureDt', sortable: true, filter: true,
    //   cellRendererFramework: DateRenderer
    // },
    {
      headerName: 'MRP', field: 'mrp', sortable: true, width: 80, filter: true, resizable: true, singleClickEdit: true, cellEditorFramework: NumericEditor, editable: true, hide: true,
      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },
    { headerName: 'P.Disc%', field: 'discountPercentage', sortable: true, resizable: true, singleClickEdit: true, filter: true, editable: true, width: 80, },


    {
      headerName: 'Pack.S.Price', field: 'packSaleRate', sortable: true, resizable: true, singleClickEdit: true, filter: true, cellEditorFramework: NumericEditor,
      editable: true, width: 120,
      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      },

      valueGetter: function (params) {
        var pack = (params.data.pack != null && params.data.pack) != undefined ? params.data.pack : 1;
        var psRate = (params.data.packSaleRate != null && params.data.packSaleRate != undefined) ? params.data.packSaleRate : 0;
        //console.log("pack:", pack)
        //console.log("psRate:", psRate)
        params.data.unitSaleRate = (Math.round((psRate / pack) * 100) / 100).toFixed(2);
        params.data.mrp = params.data.unitSaleRate;
        return params.data.packSaleRate;
      }
    },
    /*  {
       headerName: 'U.S-Price', field: 'unitSaleRate', hide: false, sortable: true, singleClickEdit: false, filter: true, cellEditorFramework: NumericEditor,
       editable: false, width: 120,
       valueGetter: function (params) {

         var pack = params.data.pack != null && params.data.pack != undefined ? params.data.pack : 1;
         var usRate = params.data.unitSaleRate != null && params.data.unitSaleRate != undefined ? params.data.unitSaleRate : 0;
         params.data.packSaleRate = (Math.round((usRate * pack) * 100) / 100).toFixed(2);

         params.data.mrp = params.data.unitSaleRate;
         return params.data.unitSaleRate;
       }

     }, */
    {
      headerName: 'S.Disc%', field: 'saleDiscountPercentage', sortable: true, resizable: true, singleClickEdit: true, filter: true, cellEditorFramework: NumericEditor, editable: true, width: 100, hide: false,
      cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },

    { headerName: 'Tax', field: 'tax.categoryCode', sortable: true, resizable: true, singleClickEdit: false, filter: true, editable: false, width: 80, },
    {
      headerName: 'Margin%', field: 'marginPer', sortable: true, resizable: true, singleClickEdit: false, filter: true, editable: false, width: 100,
      valueGetter: function (params) {
        // pPackPrice*(1-pDisc/100)*(1+vat/100) -> p
        // sPackPrice*(1-sDisc/100)*(1+vat/100) -> s
        // mgr% = ((s-p)/p)*100
        var pPackPrice = params.data.packRate != null && params.data.packRate != undefined ? params.data.packRate : 0;
        var pDisc = params.data.discountPercentage != null && params.data.discountPercentage != undefined ? params.data.discountPercentage : 0;
        var vat = params.data.tax.categoryCode == "A" ? 16 : 0;

        var sPackPrice = params.data.packSaleRate != null && params.data.packSaleRate != undefined ? params.data.packSaleRate : 0;
        var sDisc = params.data.saleDiscountPercentage != null && params.data.saleDiscountPercentage != undefined ? params.data.saleDiscountPercentage : 0;

        var p = pPackPrice * (1 - pDisc / 100) * (1 + vat / 100);
        var s = sPackPrice * (1 - sDisc / 100) * (1 + vat / 100);
        var mgrPer = p > 0 ? ((s - p) / p) * 100 : 0;
        params.data.marginPer = Math.round(mgrPer);

        //VAT AMOUNT CALICULATIONS
        var qty = isNaN(params.data.quantityApproved) ? 0 : params.data.quantityApproved;
        var ppPrice = isNaN(params.data.packRate) ? 0 : params.data.packRate;
        var discountPercentage = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
        var tax = params.data.tax != null && params.data.tax != undefined ? params.data.tax.categoryCode == 'A' ? 16 : 0 : 0;
        params.data.purchaseTaxAmount = Number(((qty * ppPrice * (1 - discountPercentage / 100)) * (tax / 100))).toFixed(2);
        params.data.purchaseTaxPercentage = tax;
        // console.log("tax amount:",params.data.purchaseTaxAmount);
        // console.log("tax %:",params.data.purchaseTaxPercentage);


        return params.data.marginPer;
      }
    },
    {
      headerName: 'Net Amount',
      field: 'netAmount',
      pinned: 'right',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      cellEditorFramework: NumericEditor,
      valueGetter: this.netAmountCalc.bind(this), width: 120,
    }
    // { headerName: 'Total Value', field: 'totalValue', sortable: true, filter: true },
    // { headerName: 'Purc UOM ', field: 'purchaseUOM', sortable: true, filter: true },
    // { headerName: 'Issue UOM ', field: 'issueUOM', sortable: true, filter: true },
  ];

  netAmountCalc(params) {
    var qty = isNaN(params.data.quantityApproved) ? 0 : params.data.quantityApproved;

    var reject = isNaN(params.data.reject) ? 0 : params.data.reject;

    var ppPrice = isNaN(params.data.packRate) ? 0 : params.data.packRate;

    var discountPercentage = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;

    var tax = params.data.tax != null && params.data.tax != undefined ? params.data.tax.categoryCode == 'A' ? 16 : 0 : 0;

    params.data.netAmount = Number((((qty * ppPrice * (1 - discountPercentage / 100)) * (1 + tax / 100)) * 100) / 100).toFixed(2);
    this.netAmtCalc();
    return Number(params.data.netAmount).toFixed(2);
  }
  vatAmount(params) {
    var qty = isNaN(params.data.quantityApproved) ? 0 : params.data.quantityApproved;
    var ppPrice = isNaN(params.data.packRate) ? 0 : params.data.packRate;
    var discountPercentage = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
    var tax = params.data.tax != null && params.data.tax != undefined ? params.data.tax.categoryCode == 'A' ? 16 : 0 : 0;

    params.data.vatAmount = Number(((qty * ppPrice * (1 - discountPercentage / 100)) * (tax / 100))).toFixed(2);
    return Number(params.data.vatAmount).toFixed(2);
  }
  approvedQuantityCheck(params) {
    var orderedQuantity = params.data.quantity != null && params.data.quantity != undefined ? params.data.quantity : 0;
    var quantityApproved = params.data.quantityApproved != null && params.data.quantityApproved != undefined ? params.data.quantityApproved : 0;

    if (quantityApproved > orderedQuantity) {
      this.toasterService.warning("Approved Quantity is more than Ordered Quantity", "Error", { timeOut: 3000 })

      params.data.quantityApproved = 0;
      return params.data.quantityApproved;
    }
    else if (quantityApproved < 0) {
      this.toasterService.warning("Approved Quantity Can't be negative", "Error", { timeOut: 3000 })
      params.data.quantityApproved = 0;
      return params.data.quantityApproved;
    }

    this.getTotalQuantity();
    this.netAmtCalc();
    return params.data.quantityApproved;
  }

  ngOnInit() {
    // this.today = new Date();
    this.purchaseInvoiceInformationForm = new FormGroup(this.purchaseInvoiceInformationFormValidations);
    this.invDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')//formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    setTimeout(() => {
      this.purchaseInvoiceInformationForm.patchValue({ invoiceDt: this.invDate });
    }, 200)
  }

  selectedStatus;
  selectedStatusId;

  onStatusChange(params) {
    this.selectedStatus = params;
    this.selectedStatusId = params === 'Approved' ? 1 : 2;
  }
  invDate;
  purchaseInvoiceInformationFormValidations = {
    grnNo: new FormControl('', Validators.required),
    invoiceDt: new FormControl('', Validators.required),
    invoiceNo: new FormControl('', Validators.required),
    creditPeriod: new FormControl(''),
    quantity: new FormControl(0, Validators.required),
    balance: new FormControl(''),
    bonus: new FormControl(''),
    handlingCharges: new FormControl(''),
    roundOff: new FormControl(''),
    advance: new FormControl(''),
    payType: new FormControl('', Validators.required),
    discountPercentage: new FormControl(''),
    discount: new FormControl(''),
    invoiceAmount: new FormControl(''),
    remarks: new FormControl(''),
    totalRejects: new FormControl(''),
    broughtBy: new FormControl(''),
    parcelNo: new FormControl(''),
    reason: new FormControl(''),
    status: new FormControl(''),
    invoiceActualAmount: new FormControl(''),
    purchaseReturnsItems: new FormControl(''),
    purchageReturnsQty: new FormControl(''),
    invoiceStatus: new FormControl(),
  }

  invAmountCalc() {
    var charges = this.purchaseInvoiceInformationForm.get('handlingCharges').value;
    charges = charges != null && charges != undefined ? charges : 0;

    var advance = this.purchaseInvoiceInformationForm.get('advance').value;
    advance = advance != null && advance != undefined ? advance : 0;

    var roundOff = this.purchaseInvoiceInformationForm.get('roundOff').value;
    roundOff = roundOff != null && roundOff != undefined ? roundOff : 0;

    var balance = this.purchaseInvoiceInformationForm.get('balance').value;
    balance = balance != null && balance != undefined ? balance : 0;

    var netAmount = this.purchaseInvoiceInformationForm.get('invoiceActualAmount').value;
    netAmount = netAmount != null && netAmount != undefined ? netAmount : 0;

    var invAmount = Number(netAmount) + Number(charges) + Number(balance) - Number(advance) + Number(roundOff);
    this.purchaseInvoiceInformationForm.get('invoiceAmount').setValue(invAmount.toFixed(2))
  }

  netAmtCalc() {
    var itemsArray = [];
    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      itemsArray.push(node['data']);
    });

    var totalNetAmount = 0;
    var disc = 0;
    for (var i = 0; i < itemsArray.length; i++) {

      disc += Number(isNaN(itemsArray[i]['discount']) ? 0 : itemsArray[i]['discount']);
      // vat += Number(isNaN(itemsArray[i]['discount']) ? 0 : itemsArray[i]['discount']);
      totalNetAmount += Number(isNaN(itemsArray[i]['netAmount']) ? 0 : itemsArray[i]['netAmount']);

      this.purchaseInvoiceInformationForm.get('invoiceActualAmount').setValue(totalNetAmount.toFixed(2));
      this.purchaseInvoiceInformationForm.get('invoiceAmount').setValue(totalNetAmount.toFixed(2));
      this.purchaseInvoiceInformationForm.get('discount').setValue(disc.toFixed(2));

      this.invAmountCalc();
      //this.invoiceAmountCalc(event);
    }
  }

  invoiceAmountCalc(param) {
    let val = 0;
    let dis = 0;

    dis = Number(this.purchaseInvoiceInformationForm.get('invoiceActualAmount').value);

    let adv = Number(this.purchaseInvoiceInformationForm.get('advance').value);
    let bal = Number(this.purchaseInvoiceInformationForm.get('balance').value);
    let charg = Number(this.purchaseInvoiceInformationForm.get('handlingCharges').value);



    val = dis + charg + bal - adv;

    this.purchaseInvoiceInformationForm.get('InvoiceAmount').setValue(val);
  }

  getTotalItem() {
    let item = 0;
    let qty = 0;

    this.gridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemName) {

        item += 1;
      }
    });
    this.gridApi.forEachNode(function (rowNode, index) {
      qty += rowNode.data.quantity;

    });


    this.purchaseInvoiceInformationForm.get('purchaseReturnsItems').setValue(item);
    this.purchaseInvoiceInformationForm.get('purchaseReturnsQty').setValue(qty);

  }
  sss = ['Approved', 'Not Approved'];

  ddd = this.sss[1];

  showReturns(params) {

    if (params.colDef.headerName === 'Bonus Qty' || params.colDef.headerName === 'Appd Qty') {
      if (Number(params.newValue) > Number(params.data.quantity)) {
        params.newValue = 0;
      }
    }

    if (params.colDef.headerName === 'Reject Qty') {
      if (Number(params.newValue) > 0) {
        this.generateprno(this.pharmacyId);
        this.showPurchaseReturns = true;
        (document.getElementById('purchaseInvoiceRejects') as HTMLInputElement).value = params.newValue;
        // this.purchaseInvoiceInformationForm.patchValue({ totalRejects: Number(params.newValue) });
      } else {
        this.showPurchaseReturns = false;
        // this.purchaseInvoiceInformationForm.patchValue({ totalRejects: 0 });
        (document.getElementById('purchaseInvoiceRejects') as HTMLInputElement).value = '0';
      }
    } else {
    }
    this.netAmtCalc();
  }

  deliveries;
  selectedDeliveryId;

  getalldeliverytypes() {
    this.addPurchaseOrderService.getalldeliverytypes().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.deliveries = res['result'];
            this.selectedDeliveryId = this.deliveries[1];
            // this.purchaseOrderInformationForm.patchValue({ selectedDeliveryId: res['result'] });
          }
        }
      }
    );
  }


  onRemoveSelected() {
    var selectedData = this.purchaseInvoiceGridOptions.api.getSelectedRows();
    var res = this.purchaseInvoiceGridOptions.api.updateRowData({ remove: selectedData });
    this.loadResult(res);
    this.getTotalAmount();
    //this.getTotalItem();
    this.getTotalQuantity();
    this.getTotalBonus();
  }

  loadResult(res) {

    if (res.add) {
      res.add.forEach(function (rowNode) {

      });
    }
    if (res.remove) {
      res.remove.forEach(function (rowNode) {

      });
    }
    if (res.update) {
      res.update.forEach(function (rowNode) {

      });
    }
  }




}
