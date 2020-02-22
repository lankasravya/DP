import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ReceiptsService } from './../../finance/receipts/shared/receipts.service';
import { isNumeric } from 'rxjs/util/isNumeric';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesBillingService } from 'src/app/sales/sales-billing/sales-billing.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.scss'],
  providers: [ReceiptsService]
})

export class SalesReturnsComponent implements OnInit {

  salesReturnNumber: any;
  private gridApi;
  payload: Object;
  constructor(private salesService: SalesBillingService, private toasterService: ToastrService, private datePipe: DatePipe
    , private receiptsService: ReceiptsService, private spinnerService: Ng4LoadingSpinnerService) {

    this.salesReturnGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.salesReturnGridOptions.rowSelection = 'single';
    this.salesReturnGridOptions.columnDefs = this.columnDefs;

    this.salesService.getSalesReturnBillNumber().subscribe(
      salesReturnNumber => {
        if (salesReturnNumber['responseStatus']['code'] === 200) {
          this.salesReturnNumber = salesReturnNumber['result'];
        }
      }
    );

    this.salesService.getCreditNoteNumber().subscribe(creditNoteNum => {
      if (creditNoteNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = creditNoteNum['result'];
      }
    });

    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });

  }

  ngOnInit() {
    this.salesReturnFormInformation = new FormGroup(this.salesReturnFormInformationValidations);
    this.salesReturnGridOptions.api.setRowData([]);
  }


  salesReturnGridOptions: GridOptions;
  retrievedSales = [];
  showGrid: boolean = false;
  selectedItemModel: Object;
  newItems: any;
  needToUpdateSalesTotal: any;
  creditNoteNo: any;

  items = [];
  selectedBill: any;
  selectedPaymentType: any[] = [];
  selPaymetObj: Object;
  selectedReturnType: any;
  selectedStockStatus: any;

  itemsCount: number;
  totalQuantity: number = 0;
  bonusQuantity: number = 0;
  serviceCharges = 0;
  totalAmount = 0;

  PaymentType = [

    { id: 1, name: 'CASH' },
    { id: 2, name: 'CREDIT' },
    { id: 3, name: 'M-PESA' },
    { id: 4, name: 'INSURANCE' },
    { id: 5, name: 'CARD' },
    { id: 6, name: 'UPI' },
    { id: 7, name: 'CHEQUE' }
  ];



  ReturnType = [
    { type: 'Not Required Any More' },
    { type: 'Customer Didn’t Turn Up' },
    { type: 'Medicine Changed' },
    { type: 'Treatment Changed' },
    { type: 'Wrong Medicine' }
  ];

  stockStatus = [
    { name: 'Not Approved' },
    { name: 'Approved' }
  ];

  defaultStockStatus = this.stockStatus[0];


  salesReturnFormInformation: FormGroup;

  salesReturnFormInformationValidations = {
    salesReturnNumber: new FormControl(''),
    salesReturnDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    status: new FormControl('', [Validators.required]),
    billNumber: new FormControl('', Validators.required),
    paymentType: new FormControl('', Validators.required),
    totalAmount: new FormControl(''),
    customerName: new FormControl(''),
    phoneNumber: new FormControl(''),
    policyCode: new FormControl(''),
    membershipCardNumber: new FormControl(''),
    items: new FormControl(''),
    salesReturnId: new FormControl(''),
    salesReturnType: new FormControl('', Validators.required),
    itemNameSelected: new FormControl('', Validators.required),
    purchaseQuantity: new FormControl(''),
    returnQuantity: new FormControl('', Validators.required),
    bonusItems: new FormControl(''),
    bonusQuantity: new FormControl(''),
    amount: new FormControl(''),
    charges: new FormControl('', [Validators.pattern(/^\d{0,7}(\.\d{1,2})?$/)]),
    itemsCount: new FormControl(''),
    totalQuantity: new FormControl(''),
    roundOff: new FormControl(''),
    activeS: new FormControl(''),
    createdUser: new FormControl(''),
    lastUpdateUser: new FormControl('')
  }

  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40

    },
    { headerName: 'Item Code', field: 'item', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
    { headerName: 'Purchase Quantity', field: 'quantity', sortable: true, resizable: true, filter: true },
    { headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true },
    { headerName: 'Return Quantity', field: 'returnQuantity', sortable: true, resizable: true, filter: true, editable: true },
    { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true },
    { headerName: 'Expiry Date', field: 'expiryDt', sortable: true, resizable: true, filter: true },
    { headerName: 'Sale Price', field: 'salePrice', sortable: true, resizable: true, filter: true },
    { headerName: 'Disc. Percent', field: 'discountPercentage', sortable: true, resizable: true, filter: true, hide: true },
    {
      headerName: 'Discount', field: 'discount', sortable: true, resizable: true, filter: true,

      valueGetter: function (params) {
        let discount = Number(params.data.discountPercentage * params.data.returnQuantity * params.data.salePrice / 100);
        params.data.discount = discount.toFixed(2);
        return params.data.discount;
      }
    },
    { headerName: 'Vat', field: 'vat', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Amount', field: 'total', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {

        var unit = params.data.salePrice * params.data.returnQuantity;
        var vat = params.data.vat;

        var disc = params.data.discountPercentage != null && params.data.discountPercentage != undefined ? params.data.discountPercentage : 0;
        var retQty = params.data.returnQuantity != null && params.data.returnQuantity != undefined ? params.data.returnQuantity : 0;
        var sprice = params.data.salePrice != null && params.data.salePrice != undefined ? params.data.salePrice : 0;

        var discount = Number(retQty * sprice * disc / 100);
        var vats = 1 + (vat / 100)
        var totals = (unit - discount) * vats;
        let s = totals.toFixed(2);
        var total = parseFloat(s);

        return total;
      }
    }
  ];

  accountRecievbles = [];
  customername: any;

  onBillSelected(bill: any) {
    this.selectedPaymentType = [];
    this.selectedBill = bill;
    this.salesService.getSalesItemsBasedOnBillCode({ billId: this.selectedBill['billId'] }).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.items = res['result'];

          let customerfirstName = this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['customerName'] : null;
          let customerLastName = this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['lastName'] : null;

          this.customername = customerfirstName + ' ' + customerLastName;

          this.salesReturnFormInformation.patchValue({

            customerName: this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.customername : null,
            phoneNumber: this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['phoneNumber'] : null,
            policyCode: this.items[0]['billId']['customerInsuranceModel'] != null && this.items[0]['billId']['customerInsuranceModel'] != undefined ? this.items[0]['billId']['customerInsuranceModel']['policyCode'] : null,
            membershipCardNumber: this.items[0]['billId']['customerMembershipModel'] != null && this.items[0]['billId']['customerMembershipModel'] != undefined ? this.items[0]['billId']['customerMembershipModel']['membershipCardNumber'] : null,
          });

        }
      }
    );

  }

  onChangeReturnType(event: Event) {
    this.selectedReturnType = event['type'];
  }

  onStockStatusChanged(event: Event) {
    this.selectedStockStatus = event['name'];
  }


  getAllSales() {
    this.salesService.getAllSales().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse['responseStatus']['code'] === 200) {
          this.retrievedSales = gridRowDataResponse['result'];
          this.showGrid = true;
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      }
    );
  }

  selectedItem: any;
  onItemCodeChange(selectedItemModel: any) {
    if (selectedItemModel instanceof Object) {
      this.selectedItemModel = selectedItemModel;
    }
  }

  sales_return_amount: any;

  onGridReady(params) {
    this.gridApi = params.api;
    this.itemsCount = this.gridApi.getDisplayedRowCount();
  }

  totalTemp: any;

  addSelected() {

    var newItems = [this.createNewRowData(this.selectedItemModel)];
    this.gridApi.updateRowData({ add: newItems });
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    this.totalQuantity = this.quantitySum(this.gridApi);
    this.bonusQuantity = this.bonusSum(this.gridApi);
    this.totalAmount = this.totalSum(this.gridApi);
    this.totalTemp = this.totalAmount;
    this.sales_return_amount = this.totalAmount
    this.needToUpdateSalesTotal = newItems[0]['totalSaleAmount'];
    this.resetAddGrid();
  }


  resetAddGrid() {
    this.selectedItem = undefined;
    this.selectedReturnType = undefined;
    this.selectedItemModel['saleQty'] = undefined;
    this.salesReturnFormInformation.get('returnQuantity').setValue('');
  }

  patchForm() {
    this.salesReturnFormInformation.patchValue({
      itemNameSelected: null,
      returnQuantity: null,
      salesReturnType: null
    });
  }

  createNewRowData(itemInfo: any) {
    var rowData = {
      itemId: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemId'] : 0,
      item: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemCode'] : null,
      itemName: itemInfo['itemsModel']['itemName'],
      formulation: itemInfo['itemsModel']['itemForm'] != null && itemInfo['itemsModel']['itemForm'] != undefined ? itemInfo['itemsModel']['itemForm']['form'] : null,
      quantity: itemInfo['saleQty'],
      bonus: itemInfo['qtyFree'] != null && itemInfo['qtyFree'] != undefined ? itemInfo['qtyFree'] : 0,
      batchNo: itemInfo['batchNo'] != null && itemInfo['batchNo'] != undefined ? itemInfo['batchNo'] : null,
      returnType: this.selectedReturnType,
      expiryDt: itemInfo['stockId'] != null && itemInfo['stockId'] != undefined ? itemInfo['stockId']['expiryDt'] : '0000-00-00',
      purchasePrice: Number(itemInfo['unitPurchasePrice']).toFixed(2),
      salePrice: Number(itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0).toFixed(2),
      returnQuantity: this.salesReturnFormInformation.get('returnQuantity').value,
      saleAmount: Number(itemInfo['saleAmount']).toFixed(2),
      vat: itemInfo['vat'],
      discountPercentage: itemInfo['discountPercentage'] != null && itemInfo['discountPercentage'] != undefined ? itemInfo['discountPercentage'] : 0,
      discount: Number(isNaN(itemInfo['discount'] ? 0 : itemInfo['discount'])),
      totalSaleAmount: itemInfo['billId']['totalAmount'],
      returnQty: (this.salesReturnFormInformation.get('returnQuantity').value != null && this.salesReturnFormInformation.get('returnQuantity').value != undefined ? this.salesReturnFormInformation.get('returnQuantity').value : 0),

      LabelledAmt: ((((itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0) * this.salesReturnFormInformation.get('returnQuantity').value)
        - (this.salesReturnFormInformation.get('returnQuantity').value * (itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0) * Number(isNaN(itemInfo['discount'] ? 0 : itemInfo['discount'])) / 100))
        * (1 + itemInfo['vat'] / 100)).toFixed(2)
    };

    return rowData;
  }

  payType: any;
  onPaymentTypeSelected(event) {
    this.payType = event;
  }

  totalSum(values) {
    let sum = 0;
    this.gridApi.forEachNode(function (node) {

      var unit = node.data.salePrice * node.data.returnQty;
      var vat = node.data.vat;
      var disc = node.data.discountPercentage;
      var returnQuantity = node.data.returnQty;
      var sprice = node.data.salePrice;
      var discount = Number(returnQuantity * sprice * disc / 100);
      var vats = 1 + (vat / 100);

      var s = (unit - discount) * vats;

      if (s && isNumeric(s)) {
        sum = +sum + +s;
      }
    });
    let sumoff = sum.toFixed(2);
    sum = parseFloat(sumoff);

    return sum;
  }


  totalAmtCharges: any;
  onServiceCharge(event: Event) {

    let val = event['path'][0]['value'];
    var am = Number(isNaN(val) ? 0 : val);
    am = (am < 0 ? 0 : am);
    var amt = this.totalSum(am);
    var amount = amt - am;
    this.totalAmount = parseFloat(amount.toFixed(2));
    this.totalAmtCharges = this.totalAmount;
  }



  onRoundOff(event: Event) {
    var roundOff = event['target']['value'];
    if (roundOff != null && roundOff != undefined && roundOff != 0) {
      this.totalAmount = Number(this.totalAmount) + Number(event['target']['value']);
    } else if (this.salesReturnFormInformation.get('charges').value != null) {
      this.totalAmount = this.totalAmtCharges;
    } else {
      this.totalAmount = this.totalTemp
    }

  }

  salesReturnModel: any;
  UpdateAccountRecievables = {};
  updateAccRecievables: any;
  creditNoteId: any;
  selectedReceiptNumber: any;


  onSubmit() {

    let saleReturnObject = {
      'salesReturnNumber': this.salesReturnNumber, 'billNumber': { 'billId': this.selectedBill['billId'] },
      'salesReturnDate': this.salesReturnFormInformation.value['salesReturnDate'],
      'status': this.selectedStockStatus, 'totalAmount': this.totalAmount,
      'paymentType': { 'paymentTypeId': this.payType['id'] },
      'pharmacy': { 'pharmacyId': localStorage.getItem('pharmacyId') },
      'activeS': 'Y',
      'createdUser': localStorage.getItem('id'),
      'lastUpdateUser': localStorage.getItem('id')
    }
    let payload = Object.assign({}, this.salesReturnFormInformation.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.spinnerService.show();
    this.salesService.saveSalesReturnData(saleReturnObject).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.salesReturnModel = saveFormResponse['result'];

            let salesReturnsItemsArray: any[] = [];
            this.gridApi.forEachNode(function (node) {
              salesReturnsItemsArray.push(node.data);
            });

            let data: any[] = [];

            for (var i = 0; i < salesReturnsItemsArray.length; i++) {
              this.salesReturnFormInformation.get('items').setValue({ 'itemId': salesReturnsItemsArray[i]['itemId'] }),
                this.salesReturnFormInformation.get('salesReturnType').setValue(salesReturnsItemsArray[i]['returnType']),
                this.salesReturnFormInformation.get('salesReturnId').setValue({ 'salesReturnId': this.salesReturnModel['salesReturnId'] }),
                this.salesReturnFormInformation.get('purchaseQuantity').setValue(salesReturnsItemsArray[i]['quantity']),
                this.salesReturnFormInformation.get('bonusQuantity').setValue(salesReturnsItemsArray[i]['bonus']),
                this.salesReturnFormInformation.get('returnQuantity').setValue(salesReturnsItemsArray[i]['returnQuantity']),
                this.salesReturnFormInformation.get('amount').setValue(salesReturnsItemsArray[i]['LabelledAmt']),
                this.salesReturnFormInformation.get('charges').setValue(this.salesReturnFormInformation.value['charges'])
              this.salesReturnFormInformation.get('paymentType').setValue({ 'paymentTypeId': this.payType['id'] }),
                this.salesReturnFormInformation.get('createdUser').setValue(localStorage.getItem('id')),
                this.salesReturnFormInformation.get('lastUpdateUser').setValue(localStorage.getItem('id')),
                this.salesReturnFormInformation.get('activeS').setValue('Y')

              data.push(this.salesReturnFormInformation.value)

            }

            let creditNoteObject = {
              'creditNoteNo': this.creditNoteNo,
              'creditDate': saleReturnObject['salesReturnDate'],
              'returnType': 'Sales Returns',
              'returnTypeReason': 'Sales Returns',
              'billId': this.items[0]['billId']['billCode'],
              'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
              'customerModel': this.items[0]['billId']['customerModel'],
              'amount': this.totalAmount,
              'paymentType': { 'paymentTypeId': this.payType['id'] },
              'createdUser': localStorage.getItem('id'),
              'lastUpdateUser': localStorage.getItem('id'),
              'remarks': 'Sales Returns',
              'activeS': 'Y',
              'approvedBy': { 'employeeId': localStorage.getItem('id') },
              'approvedDate': saleReturnObject['salesReturnDate'],
              'status': this.selectedStockStatus
            }

            this.salesService.saveCreditNote(creditNoteObject).subscribe(
              res => {
                this.creditNoteId = res['result'];

                this.salesService.saveSalesReturnItemsData(data).subscribe(
                  savesReturnItemResponse => {
                    if (savesReturnItemResponse instanceof Object) {
                      if (savesReturnItemResponse['responseStatus']['code'] === 200) {

                        this.spinnerService.hide();
                        this.updateAccRecievables = this.sales_return_amount;

                        let obect = {
                          'amountToBeReceived': this.updateAccRecievables * -1,
                          'netAmount': -1 * this.updateAccRecievables,
                          'amountReceived': 0,
                          'receiptDate': saleReturnObject['salesReturnDate'],
                          'source': this.creditNoteId['creditNoteId'],
                          'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                          'receiptNumber': this.selectedReceiptNumber,
                          'status': 'Not Approved',
                          'createdUser': localStorage.getItem('id'),
                          'lastUpdateUser': localStorage.getItem('id'),
                          'paymentTypeId': res['result']['paymentType'],
                          'paymentStatus': 'Pending',
                          'sourceType': 'Sales Returns - Credit Note',
                          'sourceRef': this.salesReturnModel['salesReturnNumber'],
                          'approvedDate': saleReturnObject['salesReturnDate'],
                          'approvedBy': { 'employeeId': localStorage.getItem('id') },
                          'customerName': this.customername,
                          'activeS': 'Y',

                        }
                        this.receiptsService.saveAccountReceivables(obect).subscribe(res => {
                        })

                      }
                    }
                  }
                );
              }
            )
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.onReset();
            this.selectedItem = undefined;
            this.items = [];
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
            this.spinnerService.hide();
          }

        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
          this.spinnerService.hide();
        }

      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }

    );

  }





  bonusSum(values) {
    let sum = 0;
    this.gridApi.forEachNode(function (node) {
      var b = node.data.bonus;
      if (b && isNumeric(b)) {
        sum = +sum + +b;
      }
    });
    return sum;
  }

  quantitySum(values) {
    let quantity = 0;
    this.gridApi.forEachNode(function (node) {
      var n = node.data.returnQuantity;
      if (n && isNumeric(n)) {
        quantity = +quantity + +n;
      }
    });
    return quantity;
  }

  checkFormDisability() {
    return (this.salesReturnFormInformation.get('status').errors instanceof Object)
      || (this.salesReturnFormInformation.get('billNumber').errors instanceof Object)
      //  || (this.salesReturnFormInformation.get('returnQuantity').errors instanceof Object)
      // || (this.salesReturnFormInformation.get('salesReturnType').errors instanceof Object)
      // || (this.salesReturnFormInformation.get('itemNameSelected').errors instanceof Object)
      || (this.salesReturnFormInformation.get('paymentType').errors instanceof Object)
      || (this.salesReturnFormInformation.get('charges').errors instanceof Object)



  }

  checkFormGrid() {
    return (this.salesReturnFormInformation.get('itemNameSelected').errors instanceof Object)

      || (this.salesReturnFormInformation.get('returnQuantity').errors instanceof Object)
      || (this.salesReturnFormInformation.get('salesReturnType').errors instanceof Object)



  }

  onReset() {

    this.salesReturnFormInformation.reset();
    this.selectedBill = undefined;
    this.selectedPaymentType = undefined;
    this.gridApi.setRowData([]);
    this.selectedItemModel['saleQty'] = null;
    this.totalAmount = 0;
    this.selectedReturnType = undefined;
    this.payType = undefined;
    this.selPaymetObj = undefined;
    this.selectedItem = undefined;

    this.salesReturnFormInformation.patchValue({
      'salesReturnDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'status': this.stockStatus[0]
    });

    this.salesService.getSalesReturnBillNumber().subscribe(
      salesReturnNumber => {
        if (salesReturnNumber['responseStatus']['code'] === 200) {
          this.salesReturnNumber = salesReturnNumber['result'];
        }
      }
    );

  }



  RetrievedSalesIds: any[] = [];
  onBillEntered(event) {

    this.spinnerService.show();
    this.salesService.getSalesBySearchNumber(event['target']['value']).subscribe(res => {

      if (res['responseStatus']['code'] === 200) {
        this.RetrievedSalesIds = res['result']
        this.spinnerService.hide();

      }
    },
      error => {
        this.RetrievedSalesIds = [];
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })


  }

}
