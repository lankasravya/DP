import { StockService } from './../new-stock/stock.service';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, IGetRowsParams } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-editstock',
  templateUrl: './editstock.component.html',
  styleUrls: ['./editstock.component.scss']
})

export class EditstockComponent implements OnInit {

  constructor(private stockService: StockService, private toasterService: ToastrService, private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.stockGridOptions.columnDefs = this.saleColumDefs;
    this.stockGridOptions.rowModelType = 'infinite'

    this.stockForm = new FormGroup(this.stockFormValidations);

    this.getAllSuppliersByLimit(1, 100);
    this.getAllItemsByLimit(1, 100);
  }

  ngOnInit() {
    $(document).ready(function () {

      $("#common-grid-itembutton").click(function () {
        $("#item-grid").hide();
        $("#search").hide();
      });
      $("#common-grid-itembutton").click(function () {
        $("#item-Information").show();
      });

      $(".saved-item").click(function () {
        $("#item-grid").show();
        $("#search").show();
      });

      $("#cancelled-edit").click(function () {
        $("#item-grid").show();
        $("#search").show();
      });
      $("#common-grid-itembutton").click(function () {
        $("#item-Information").css("display", "block");
      });
      $(".saved-item").click(function () {
        $("#item-Information").css("display", "none");
      });
      $("#cancelled-edit").click(function () {
        $("#item-Information").css("display", "none");
      });
    });
  }

  searchKey;
  stockSearchCodeArray: any[] = ["Item Name", "Item Code", "Description", "Generic Name", "Batch Number"];
  selectedStockSearchCode = "Item Name";

  rowCount = 0;
  pageNumber = 0;
  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 2;
  paginationSize = 50;
  // grid option
  stockGridOptions: GridOptions;
  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  saleColumDefs: ColDef[] = [{
    headerName: 'Item Code',
    field: 'item.itemCode',
    sortable: true,
    resizable: true,
    filter: true,
    checkboxSelection: true
  },
  {
    headerName: 'Product Name',
    field: 'item.itemName',
    sortable: true,
    resizable: true,
    filter: true,
    cellRenderer: this.tooltipRenderer,
  },
  {
    headerName: 'Formulation',
    field: 'item.itemForm.form',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Tax',
    field: 'taxCategoryModel.categoryCode',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Batch No',
    field: 'batchNo',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Expiry',
    field: 'expiryDt',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Price',
    field: 'unitPurchaseRate',
    sortable: true,
    resizable: true,
    filter: true
  }
  ];

  rowData: any[] = [];

  taxArray: any[] = [{ taxCategoryId: 1, categoryCode: "A", categoryValue: 16 }, { taxCategoryId: 2, categoryCode: "B", categoryValue: 0 },
  { taxCategoryId: 3, categoryCode: "E", categoryValue: 0 }];

  prevPack = 0;
  prevPP = 0;
  prevSP = 0;
  prevMRP = 0;
  selectedTax;
  pdiscAmt: number = 0;
  sdiscAmt: number = 0;
  items: any[] = [];
  selectedItem: any;

  suppliers: any[] = [];
  selectedSupplier: any;

  status: any[] = ["Approved", "Not Approved"];
  selectedStatus: any = "Not Approved";

  entryTypes: any[] = ["Sales Update", "Invoice Addition", "Purchase Return", "Sales Return", "New Stock Addition", "Stock Adjustment"];
  selectedEntryType: any;

  itemSelected: any;

  stockForm: FormGroup;
  stockFormValidations = {
    stockId: new FormControl(),
    stockNumber: new FormControl(),
    item: new FormControl(null, Validators.required),
    pharmacy: new FormControl({ pharmacyId: localStorage.getItem('pharmacyId') }),
    supplier: new FormControl(null, Validators.required),
    quantity: new FormControl(null, Validators.required),
    //  unitSaleRate: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]),
    unitSaleRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),

    spVat: new FormControl(),
    mrp: new FormControl('', Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)),
    margin: new FormControl(),
    marginAmount: new FormControl(),
    remarks: new FormControl(),
    saleDiscountAmount: new FormControl(),
    saleDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    auditId: new FormControl(),
    batchNo: new FormControl(null, Validators.required),
    expiryDt: new FormControl(null, [Validators.required, EndDateValidator]),
    manufactureDt: new FormControl(),
    purchaseDiscountAmount: new FormControl(),
    purchaseDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    // unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]),
    unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),

    rack: new FormControl(),
    //pack: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)]),
    pack: new FormControl(null, [Validators.required]),
    shelf: new FormControl(),
    barcode: new FormControl(),
    vat: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    status: new FormControl(),
    stockDt: new FormControl('', Validators.required),
    invoiceNo: new FormControl(),
    entryType: new FormControl(),
    storage: new FormControl(),
    taxCategoryModel: new FormControl(null, Validators.required),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateUser: new FormControl(localStorage.getItem('id'))
  }

  editGrid() {
    let selectedStockItem = this.stockGridOptions.api.getSelectedRows()[0];
    this.prevPack = selectedStockItem['pack'] != null && selectedStockItem['pack'] != undefined ? selectedStockItem['pack'] : 0;
    this.prevPP = selectedStockItem['unitPurchaseRate'] != null && selectedStockItem['unitPurchaseRate'] != undefined ? selectedStockItem['unitPurchaseRate'] * this.prevPack : 0,
      this.prevSP = selectedStockItem['unitSaleRate'] != null && selectedStockItem['unitSaleRate'] != undefined ? selectedStockItem['unitSaleRate'] * this.prevPack : 0;
    this.prevMRP = selectedStockItem['mrp'] != null && selectedStockItem['mrp'] != undefined ? selectedStockItem['mrp'] * this.prevPack : 0,

      this.stockForm.patchValue({
        stockId: selectedStockItem['stockId'] != null && selectedStockItem['stockId'] != undefined ? selectedStockItem['stockId'] : null,
        stockNumber: selectedStockItem['stockNumber'] != null && selectedStockItem['stockNumber'] != undefined ? selectedStockItem['stockNumber'] : null,

        item: selectedStockItem['item'] != null && selectedStockItem['item'] != undefined ? selectedStockItem['item'] : null,

        pharmacy: selectedStockItem['pharmacy'] != null && selectedStockItem['pharmacy'] != undefined ? selectedStockItem['pharmacy'] : null,
        supplier: selectedStockItem['supplier'] != null && selectedStockItem['supplier'] != undefined ? selectedStockItem['supplier'] : null,
        quantity: selectedStockItem['quantity'] != null && selectedStockItem['quantity'] != undefined ? selectedStockItem['quantity'] : null,
        unitSaleRate: selectedStockItem['unitSaleRate'] != null && selectedStockItem['unitSaleRate'] != undefined ? selectedStockItem['unitSaleRate'] : null,
        spVat: selectedStockItem['spVat'] != null && selectedStockItem['spVat'] != undefined ? selectedStockItem['spVat'] : null,
        mrp: selectedStockItem['mrp'] != null && selectedStockItem['mrp'] != undefined ? selectedStockItem['mrp'] : null,
        margin: selectedStockItem['margin'] != null && selectedStockItem['margin'] != undefined ? selectedStockItem['margin'] : null,
        marginAmount: selectedStockItem['marginAmount'] != null && selectedStockItem['marginAmount'] != undefined ? selectedStockItem['marginAmount'] : null,
        remarks: selectedStockItem['remarks'] != null && selectedStockItem['remarks'] != undefined ? selectedStockItem['remarks'] : null,
        saleDiscountAmount: selectedStockItem['saleDiscountAmount'] != null && selectedStockItem['saleDiscountAmount'] != undefined ? selectedStockItem['saleDiscountAmount'] : null,
        saleDiscountPercentage: selectedStockItem['saleDiscountPercentage'] != null && selectedStockItem['saleDiscountPercentage'] != undefined ? selectedStockItem['saleDiscountPercentage'] : null,
        auditId: selectedStockItem['auditId'] != null && selectedStockItem['auditId'] != undefined ? selectedStockItem['auditId'] : null,
        batchNo: selectedStockItem['batchNo'] != null && selectedStockItem['batchNo'] != undefined ? selectedStockItem['batchNo'] : null,
        expiryDt: selectedStockItem['expiryDt'] != null && selectedStockItem['expiryDt'] != undefined ? selectedStockItem['expiryDt'] : null,
        manufactureDt: selectedStockItem['manufactureDt'] != null && selectedStockItem['manufactureDt'] != undefined ? selectedStockItem['manufactureDt'] : null,
        purchaseDiscountAmount: selectedStockItem['purchaseDiscountAmount'] != null && selectedStockItem['purchaseDiscountAmount'] != undefined ? selectedStockItem['purchaseDiscountAmount'] : null,
        purchaseDiscountPercentage: selectedStockItem['purchaseDiscountPercentage'] != null && selectedStockItem['purchaseDiscountPercentage'] != undefined ? selectedStockItem['purchaseDiscountPercentage'] : null,
        unitPurchaseRate: selectedStockItem['unitPurchaseRate'] != null && selectedStockItem['unitPurchaseRate'] != undefined ? selectedStockItem['unitPurchaseRate'] : null,
        rack: selectedStockItem['rack'] != null && selectedStockItem['rack'] != undefined ? selectedStockItem['rack'] : null,
        pack: selectedStockItem['pack'] != null && selectedStockItem['pack'] != undefined ? selectedStockItem['pack'] : null,
        shelf: selectedStockItem['shelf'] != null && selectedStockItem['shelf'] != undefined ? selectedStockItem['shelf'] : null,
        barcode: selectedStockItem['barcode'] != null && selectedStockItem['barcode'] != undefined ? selectedStockItem['barcode'] : null,
        vat: selectedStockItem['vat'] != null && selectedStockItem['vat'] != undefined ? selectedStockItem['vat'] : null,
        status: selectedStockItem['status'] != null && selectedStockItem['status'] != undefined ? selectedStockItem['status'] : null,
        stockDt: selectedStockItem['stockDt'] != null && selectedStockItem['stockDt'] != undefined ? selectedStockItem['stockDt'] : null,
        invoiceNo: selectedStockItem['invoiceNo'] != null && selectedStockItem['invoiceNo'] != undefined ? selectedStockItem['invoiceNo'] : null,
        entryType: selectedStockItem['entryType'] != null && selectedStockItem['entryType'] != undefined ? selectedStockItem['entryType'] : null,

        storage: selectedStockItem['storage'] != null && selectedStockItem['storage'] != undefined ? selectedStockItem['storage'] : null,
        taxCategoryModel: selectedStockItem['taxCategoryModel'] != null && selectedStockItem['taxCategoryModel'] != undefined ? selectedStockItem['taxCategoryModel'] : null,
      });
    this.selectedStatus = selectedStockItem['status'] != null && selectedStockItem['status'] != undefined ? selectedStockItem['status'] : null;
  }
  datasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.stockService.getStockDataByItemAndPharmacyId(this.searchKey, this.selectedStockSearchCode, localStorage.getItem('pharmacyId'),
        this.pageNumber, 50).subscribe(data => {
          params.successCallback(data['result'], this.rowCount)
          this.spinnerService.hide();
          if (data['responseStatus']['code'] === 200) {
            if (data['result']['length'] > 0) {
              this.pageNumber++;
            }
            else {
              this.stockGridOptions.api.setRowData([]);
              this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                timeOut: 3000
              });
            }
          }
        }, error => {
          this.spinnerService.hide();
        });
    }

  }
  searchStock() {
    this.rowCount = 0;
    this.pageNumber = 0;
    this.getStockCountBySearch();
  }

  getStockCountBySearch() {
    this.stockService.getStockDataByItemAndPharmacyIdCount(this.searchKey, this.selectedStockSearchCode, localStorage.getItem('pharmacyId')).subscribe(data => {
      if (data['responseStatus']['code'] === 200) {
        this.spinnerService.show();
        this.rowCount = data['result'];

        this.stockGridOptions.api.setDatasource(this.datasource);
        this.spinnerService.hide();
      }
    })
  }

  checkSaveDisability() {
    return (this.stockForm.get('unitPurchaseRate').errors instanceof Object) ||
      (this.stockForm.get('vat').errors instanceof Object) ||
      (this.stockForm.get('unitSaleRate').errors instanceof Object) ||
      this.stockForm.get('quantity').errors ||
      this.stockForm.get('unitSaleRate').errors ||
      this.stockForm.get('unitPurchaseRate').errors ||
      this.stockForm.get('expiryDt').errors ||
      this.stockForm.get('vat').errors ||
      this.stockForm.get('batchNo').errors ||
      this.stockForm.get('item').errors ||
      this.stockForm.get('supplier').errors ||
      this.stockForm.get('stockDt').errors ||
      this.stockForm.get('taxCategoryModel').errors
  }


  setVat() {

    if (this.selectedTax != null && this.selectedTax != undefined) {
      this.stockForm.get('vat').setValue(this.selectedTax['categoryValue']);
    }
  }

  setSPVAT() {
    if (!this.stockForm.get('unitSaleRate').errors && !this.stockForm.get('taxCategoryModel').errors) {
      this.stockForm.get('spVat').setValue(this.stockForm.get('unitSaleRate').value * (1 + this.selectedTax['categoryValue'] / 100))
    }
  }

  setPP() {
    this.prevPP = this.stockForm.get('unitPurchaseRate').value
  }

  unitPurchansePriceCalc() {
    // if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitPurchaseRate').errors) {

    this.stockForm.get('unitPurchaseRate').setValue(((this.prevPP / this.stockForm.get('pack').value)).toFixed(2));
    //}
  }

  setSP() {
    this.prevSP = this.stockForm.get('unitSaleRate').value
  }
  unitSalePriceCalc() {
    this.stockForm.get('unitSaleRate').setValue(((this.prevSP / this.stockForm.get('pack').value)).toFixed(2));
  }

  setMRP() {
    this.prevMRP = this.stockForm.get('mrp').value
  }
  unitMRPCalc() {
    this.stockForm.get('mrp').setValue(((this.prevMRP / this.stockForm.get('pack').value)).toFixed(2));
  }


  onCalculations(event) {
    var sp = isNaN(this.stockForm.get('unitSaleRate').value) ? 0 : this.stockForm.get('unitSaleRate').value;
    var sd = isNaN(this.stockForm.get('saleDiscountPercentage').value) ? 0 : this.stockForm.get('saleDiscountPercentage').value;
    this.sdiscAmt = sp * (sd / 100);
    this.stockForm.patchValue({
      'saleDiscountAmount': this.sdiscAmt.toFixed(2)
    })
  }

  valueCalculator(event) {
    var pp = isNaN(this.stockForm.get('unitPurchaseRate').value) ? 0 : this.stockForm.get('unitPurchaseRate').value;
    var pd = isNaN(this.stockForm.get('purchaseDiscountPercentage').value) ? 0 : this.stockForm.get('purchaseDiscountPercentage').value;

    this.pdiscAmt = pp * (pd / 100);
    this.stockForm.patchValue({
      'purchaseDiscountAmount': this.pdiscAmt.toFixed(2)
    })
  }

  searchByItemCode(searchKey) {
    if (searchKey['term'] != "") {
      this.stockService.itemSearchByItemCode(searchKey['term']).subscribe(itemRes => {
        if (itemRes['responseStatus']['code'] == 200) {
          this.items = itemRes['result'];
        }
        else {
          this.toasterService.error("Search Not Working", "Error", {
            timeOut: 3000
          });
        }
      })
    }
    else {
      this.getAllItemsByLimit(1, 100)
    }
  }

  getAllSuppliersByLimit(start, end) {
    this.stockService.getItemsByLimit(start, end).subscribe(supplierResponse => {
      if (supplierResponse instanceof Object) {
        if (supplierResponse['responseStatus']['code'] === 200) {
          this.suppliers = supplierResponse['result'];
        }
      }
    },
      error => {
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }

  getAllItemsByLimit(start, end) {
    this.stockService.getLimitedItems(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.items = itemResponse['result'];
        }
      }

    },
      error => {
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }

  searchBySupplierName(searchKey) {
    if (searchKey['term'] != "") {
      this.stockService.getSuppliersByName(searchKey['term']).subscribe(supplierRes => {
        if (supplierRes['responseStatus']['code'] == 200) {
          this.suppliers = supplierRes['result'];
        }
        else {
          this.toasterService.error("Search Not Working", "Error", {
            timeOut: 3000
          });
        }
      })
    }
    else {
      this.getAllSuppliersByLimit(1,100);
    }
  }

  OnItemSelected(event) {
    this.itemSelected = event
    this.stockForm.patchValue({
      storage: this.itemSelected['storage']
    })
  }
  onSubmit() {
    this.spinnerService.show();
    this.stockService.updateStockRecord(this.stockForm.value).subscribe(stockRes => {
      if (stockRes['responseStatus']['code'] == 200) {
        this.spinnerService.hide();
        this.reset();
        this.searchStock();
        this.toasterService.success(stockRes['message'], "Success", {
          timeOut: 3000
        });

      }

    }
      , error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      });

  }

  reset() {
    this.stockForm.reset();

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
    this.selectedStatus = "Not Approved";
    this.sdiscAmt = 0;
    this.pdiscAmt = 0;
  }
}