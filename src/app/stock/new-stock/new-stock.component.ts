import { StockModel } from './stock.model';
import { ToastrService } from 'ngx-toastr';
import { StockService } from './stock.service';
import { FormGroup, FormControl, FormBuilder, Validator, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-new-stock',
  templateUrl: './new-stock.component.html',
  styleUrls: ['./new-stock.component.scss']
})

export class NewStockComponent implements OnInit {

  constructor(private stockService: StockService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

    // this.getLimitedItemsData();
    this.getAllSuppliersByLimit(1, 100);
    this.getAllItemsByLimit(1, 100);
    //this.getSuppliers();
    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.stockGridOptions.columnDefs = this.saleColumDefs;
    this.stockForm = new FormGroup(this.stockFormValidations);
  }

  ngOnInit() {
    this.getIOSNumber();
  }
  rowData: any[] = [];

  taxArray: any[] = [{ taxCategoryId: 1, categoryCode: "A", categoryValue: 16 }, { taxCategoryId: 2, categoryCode: "B", categoryValue: 0 },
  { taxCategoryId: 3, categoryCode: "E", categoryValue: 0 }];

  prevPack = 1;
  prevPP = 0;
  prevSP = 0;
  prevMRP = 0;
  selectedTax;
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
    headerName: 'Item Name',
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
  private gridApi;
  private gridColumnApi;

  showGrid: boolean = false;
  items: any[] = [];
  selectedItem: any;

  suppliers: any[] = [];
  selectedSupplier: any;

  status: any[] = ["Approved", "Not Approved"];
  selectedStatus: any = "Not Approved";

  entryTypes: any[] = ["Sales Update", "Invoice Addition", "Purchase Return", "Sales Return", "New Stock Addition", "Stock Adjustment"];
  selectedEntryType: any;

  stockForm: FormGroup;
  stockFormValidations = {
    stockId: new FormControl(),
    stockNumber: new FormControl(),
    item: new FormControl(null, Validators.required),
    pharmacy: new FormControl({ pharmacyId: localStorage.getItem('pharmacyId') }),
    supplier: new FormControl(null, Validators.required),
    quantity: new FormControl(null, Validators.required),
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
    unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
    rack: new FormControl(),
    pack: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)]),
    shelf: new FormControl(),
    barcode: new FormControl(),
    vat: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    status: new FormControl(),
    stockDt: new FormControl('', Validators.required),
    invoiceNo: new FormControl(),
    entryType: new FormControl(),
    itemName: new FormControl(),
    storage: new FormControl(),
    taxCategoryModel: new FormControl(null, Validators.required),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateUser: new FormControl(localStorage.getItem('id'))
  }

  itemSelected: any;

  OnItemSelected(event) {
    this.itemSelected = event
    this.stockForm.patchValue({
      storage: this.itemSelected['storage']
    })
  }


  onReset() {
    this.stockGridOptions.api.setRowData([]);
    this.stockForm.reset();
    this.getIOSNumber();
    this.selectedStatus = "Not Approved";
  }

  onSubmit() {
    let stocks = [];
    this.stockGridOptions.api.forEachNode(function (node) {
      stocks.push(node['data']);
    });
    this.stockForm.get('unitPurchaseRate').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.stockService.saveMultipleStockRecords(stocks).subscribe(stockRes => {
      if (stockRes['responseStatus']['code'] == 200) {
        this.spinnerService.hide();
        this.onReset();
        this.toasterService.success(stockRes['message'], "Success", {
          timeOut: 3000
        });
      }
    }, error => {
      this.spinnerService.hide();
      this.toasterService.error('Please contact administrator', 'Error Occurred', {
        timeOut: 3000
      });
    }
    );
  }

  onGridReady(params) {
    params.api.setRowData([]);
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
      this.getAllItemsByLimit(1, 100);
    }
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
      this.getAllSuppliersByLimit(1, 100);
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

  pdiscAmt: number = 0;
  sdiscAmt: number = 0;
  valueCalculator(event) {
    var pp = isNaN(this.stockForm.get('unitPurchaseRate').value) ? 0 : this.stockForm.get('unitPurchaseRate').value;
    var pd = isNaN(this.stockForm.get('purchaseDiscountPercentage').value) ? 0 : this.stockForm.get('purchaseDiscountPercentage').value;

    this.pdiscAmt = pp * (pd / 100);
    this.stockForm.patchValue({
      'purchaseDiscountAmount': this.pdiscAmt.toFixed(2)
    })
  }

  onCalculations(event) {
    var sp = isNaN(this.stockForm.get('unitSaleRate').value) ? 0 : this.stockForm.get('unitSaleRate').value;
    var sd = isNaN(this.stockForm.get('saleDiscountPercentage').value) ? 0 : this.stockForm.get('saleDiscountPercentage').value;
    this.sdiscAmt = sp * (sd / 100);
    this.stockForm.patchValue({
      'saleDiscountAmount': this.sdiscAmt.toFixed(2)
    })

  }

  addToGrid() {
    this.showGrid = true;
    let stock = new StockModel();
    this.createRow();
    try {
      this.stockGridOptions.api.updateRowData({ add: [this.stockForm.value] });
    }
    catch (error) {
      this.stockGridOptions.rowData = [this.stockForm.value]
    }
    this.stockForm.reset();
    this.getIOSNumber();
    this.selectedStatus = "Not Approved";

  }
  getIOSNumber() {
    this.stockService.getIOSNumber().subscribe(IOSNumber => {
      if (IOSNumber['responseStatus']['code'] == 200) {
        this.stockForm.get('stockNumber').setValue(IOSNumber['result']);
      }
    });
  }

  createRow() {
    this.stockForm.get('item').setValue(this.selectedItem);
    this.stockForm.get('supplier').setValue(this.selectedSupplier);
    this.stockForm.get('status').setValue(this.selectedStatus);
  }

  pathchForm() {

    this.stockForm.patchValue({
      stockId: null,
      item: null,
      pharmacy: { pharmacyId: localStorage.getItem('pharmacyId') },
      supplier: null,
      quantity: null,
      unitSaleRate: null,
      mrp: null,
      margin: null,
      marginAmount: null,
      remarks: null,
      saleDiscountAmount: null,
      saleDiscountPercentage: null,
      auditId: null,
      batchNo: null,
      expiryDt: null,
      manufactureDt: null,
      purchaseDiscountAmount: null,
      purchaseDiscountPercentage: null,
      unitPurchaseRate: null,
      rack: null,
      pack: null,
      shelf: null,
      barcode: null,
      vat: null,
      status: null,
      stockDt: null,
      invoiceNo: null,
      entryType: null,
    })

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
  }
  reset() {
    this.stockForm.reset();

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
    this.getIOSNumber();
    this.showGrid = false;
    this.selectedStatus = "Not Approved";
    this.sdiscAmt = 0;
    this.pdiscAmt = 0;


  }

  checkAddToGriddisablility() {
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

  checkSaveDisability() {
    try {
      return this.stockGridOptions['rowData']['length'] < 0;
    }
    catch (error) {
      return true;
    }

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
    //if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitPurchaseRate').errors) {

    this.stockForm.get('unitPurchaseRate').setValue(((this.prevPP / this.stockForm.get('pack').value)).toFixed(2));
    //}
  }

  setSP() {
    this.prevSP = this.stockForm.get('unitSaleRate').value
  }
  unitSalePriceCalc() {
    //if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitSaleRate').errors) {
    this.stockForm.get('unitSaleRate').setValue(((this.prevSP / this.stockForm.get('pack').value)).toFixed(2));
    // }
  }

  setMRP() {
    this.prevMRP = this.stockForm.get('mrp').value
  }
  unitMRPCalc() {
    // if (!this.stockForm.get('pack').errors && !this.stockForm.get('mrp').errors) {
    this.stockForm.get('mrp').setValue(((this.prevMRP / this.stockForm.get('pack').value)).toFixed(2));
    // }

  }

  changePrevPack() {
    if (this.prevPack != this.stockForm.get('pack').value && this.prevPack != 1) {
      this.prevPack = this.stockForm.get('pack').value;
    }
  }

}