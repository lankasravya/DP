
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { SalesModel } from './sales-model';
import { SalesItemsModel } from './sales-items-model';
import { DatePipe } from '@angular/common';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { GridOptions, ColDef, IGetRowsParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesBillingService } from './sales-billing.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';
import * as $ from 'jquery';

@Component({
  selector: 'app-sales-billing',
  templateUrl: './sales-billing.component.html',
  styleUrls: ['./sales-billing.component.scss']
})
export class SalesBillingComponent implements OnInit {
  payload: Object// = Object.assign({}, this.salesBillingForm.value);
  constructor(private salesService: SalesBillingService, private toasterService: ToastrService, private datePipe: DatePipe,
    private domSanitizer: DomSanitizer, private spinnerService: Ng4LoadingSpinnerService) {
    //this.getAllSales();
    this.getCustomersData();
    this.getDoctorsData();
    this.getHospitalsData();
    this.getPreviousBillCodes();
    //this.getItemssData();
    //this.getStockData();
    this.salesBillingForm = new FormGroup(this.salesBillingFormValidations);
    this.prescriptionForm = new FormGroup(this.prescriptionFormValidation);
    this.salesItemsForm = new FormGroup(this.salesItemsFormValidation);
    this.paymentTypeForm = new FormGroup(this.paymentTypeFormValidation);
    this.customerInformationForm = new FormGroup(this.customerInformationFormValidations);
    this.providerInformationForm = new FormGroup(this.providerInformationFormValidations);


    this.saleEditGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.saleEditGridOptions.rowSelection = 'single';
    this.saleEditGridOptions.columnDefs = this.saleEditColumDefs;


    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    let salesModel = new SalesModel();
    //this.itemGridOptions.rowData = [{ 'itemCode': '' }];
    this.itemGridOptions.onCellEditingStopped = this.stopGridEdit.bind(this);
    this.payload = Object.assign({}, this.salesBillingForm.value);
    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.stockGridOptions.rowSelection = 'multiple';
    this.stockGridOptions.columnDefs = this.stockColumDefs;
    this.stockGridOptions.rowData = [];
    /*  this.stockGridOptions.rowClassRules = {
       "stock-expired-warning": function (params) {
         var one_day = 1000 * 60 * 60 * 24;

         var expiryDate = new Date(params.data.expiryDt != undefined ? params.data.expiryDt : new Date());
         var present_date = new Date();
         var result = Math.round((expiryDate.getTime() - present_date.getTime()) / (one_day)).toFixed(0);

         return Number(result) <= 1;
       },
       "out-of-stock-warning": "data.quantity<=0",
       "low-item-stock-warning": "data.quantity<=data.item.reOrderLevel",
       "expiry-stock-warning": function (params) {
         var one_day = 1000 * 60 * 60 * 24;
         var expiryDate = new Date(params.data.expiryDt != undefined ? params.data.expiryDt : new Date());
         var present_date = new Date();
         var result = Math.round((expiryDate.getTime() - present_date.getTime()) / (one_day)).toFixed(0);

         return Number(result) <= 30;
       }
     }; */

    this.getBillNumber();
    this.isRowSelectable = function (rowNode) {
      var qty = isNaN(rowNode.data.quantity) ? 0 : rowNode.data.quantity;
      return rowNode.data ? qty > 0 : false;
    };

    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 2;
    this.stockGridOptions.cacheBlockSize = 50;
    this.stockGridOptions.rowModelType = 'infinite'

    this.salesEditCacheOverflowSize = 2;
    this.salesEditMaxConcurrentDatasourceRequests = 2;
    this.saleEditGridOptions.cacheBlockSize = 50;
    this.saleEditGridOptions.rowModelType = 'infinite'


  }

  ngOnInit() {
    /*  $(document).ready(function () {

       $(".nav-click-history").click(function () {

         $(".nav-click-history-tab").show();

       });
       $(".nav-click-history").click(function () {

         $(".nav-click-bill-tab").hide();
       });
       $(".nav-click-bill").click(function () {

         $(".nav-click-bill-tab").show();
       });
       $(".nav-click-bill").click(function () {

         $(".nav-click-history-tab").hide();
       });
     }); */

    $(document).ready(function () {
      $(".nav-click-history").click(function () {
        $(".nav-click-history-tab").show();
      }); $(".nav-click-history").click(function () {
        $(".nav-click-bill-tab").hide();
      }); $(".nav-click-bill").click(function () {
        $(".nav-click-bill-tab").show();
      }); $(".nav-click-bill").click(function () {
        $(".nav-click-history-tab").hide();
      });
      /*  $("#SalesHistory").click(function () {
         $("#pills-history").show();
         $("#pills-new").hide();
       });
       $("#SalesBilling").click(function () {
         $("#pills-history ").hide();
         $("#pills-new").show();
       });
       $("#Editclickbtn").on("click", function () {

         $("#SalesHistory").removeClass("active");
         $("#SalesBilling").addClass("active");
         $("#pills-history").hide();
         $("#pills-new").show();

       }); */
    });
    this.itemGridOptions.api.setRowData([]);

  }


  getBillNumber() {
    this.salesService.getSalesBillingNumber().subscribe(billNumber => {
      if (billNumber['responseStatus']['code'] == 200) {
        this.billNumber = billNumber['result'];
      }
    });
  }



  paginationSize = 50;
  cacheOverflowSize;
  maxConcurrentDatasourceRequests;
  infiniteInitialRowCount;
  adjustAmount;

  salesEditCacheOverflowSize;
  salesEditMaxConcurrentDatasourceRequests;
  salesEditPaginationSize = 50;
  isRowSelectable;
  editScreen: boolean = false;
  customerPhoneNumber
  tab = "sales"
  blob: Blob;
  griddata: any[] = [];
  itemGridOptions: GridOptions;
  stockGridOptions: GridOptions;
  showItemGrid: boolean = false;
  stockRowData: any[] = [];
  paymentStatusArray: any[] = [{ name: "Paid", disabled: true }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }, { name: "Over Paid" }];
  selectedPaymentStatus: any = { name: "Pending" };
  billNumber: any;
  itemSearchKey: string = '';
  isItemSearchEnabled;
  finalAmount: any = 0;
  originalFinalAmount: any = 0;
  roundOff: any = undefined;
  totalItemsCount = 0;
  totalVATAmount: any = 0;
  totalDiscPercentage = 0;
  totalDiscPercentageAmount: any = 0
  totalDiscAmount = 0;
  totalQty = 0;
  netAmount: any = 0;
  paidAmount: any = 0;
  balance: any = 0;
  totalVAT: any = 0;
  narcoticDrugCount = 0;
  speciality;
  editedSalesRecord;
  public rowClassRules;
  tooltipRenderer = function (params) {

    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }


  }

  saleEditGridOptions: GridOptions;
  saleEditColumDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40, cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    { headerName: 'Bill Id', field: 'billId', sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Bill Code', field: 'billCode', sortable: true, filter: true, editable: true, resizable: true, width: 130, cellStyle: { 'border': '1px solid #BDC3C7' } },
    {
      headerName: 'Bill Date', field: 'billDate', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' },
      //valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Customer Name', field: 'customerNm', sortable: true, filter: true, resizable: true, width: 130, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Products', field: 'totalProducts', sortable: true, filter: true, resizable: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Quantity', field: 'totalQty', sortable: true, filter: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' }, },
    { headerName: 'Payment Status', field: 'paymentStatus', sortable: true, width: 150, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Discount%', field: 'effectiveOverallDiscount', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Margin%', field: 'effectiveMargin', sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Sales Discount%', field: 'effectiveSalesDisc', hide: true, sortable: true, filter: true, resizable: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Amount', field: 'totalAmount', hide: true, sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Net Amount', field: 'netAmount', sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'balance Amount', field: 'balanceAmount', sortable: true, filter: true, resizable: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' } },

  ];

  startDate;
  endDate;
  paymentStatusArr: any[] = ["Paid", "Partially Paid", "Pending", "Dummy Bill", "Cancel"];
  paymentStatus;
  searchCodeArr: any[] = ["Bill Number", "Customer Name", "Customer Phone Number"];
  searchCode;
  addRowButton = false;
  searchCodeValue;
  selectedSalesRecord = undefined;
  selectedSalesItemRecords = undefined;
  salesItemModelsArray: SalesModel[] = [];

  stockSearchDisable = false;
  // private suppressKeyboardEvent;
  itemColumDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: "SR No",
      width: 60,
      pinned: "left",
      cellRenderer: function (params) {
        if (params.data.itemCode != '')
          return params.rowIndex + 1;
      },
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Stock Id', field: 'stockId', hide: true, sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    { headerName: 'Item Code', field: 'itemCode.itemCode', hide: true, singleClickEdit: true, sortable: true, filter: true, editable: true, resizable: true, suppressKeyboardEvent: this.suppressEnterItemCode.bind(this), cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120, pinned: 'left' },
    { headerName: 'Product Name', field: 'itemName.itemName', singleClickEdit: true, sortable: true, filter: true, resizable: true, editable: true, suppressKeyboardEvent: this.suppressEnterItemName.bind(this), cellStyle: { 'border': '1px solid #BDC3C7' }, width: 260, pinned: 'left', cellRenderer: this.tooltipRenderer, },
    { headerName: 'Strength', field: 'itemName.drugDose', sortable: true, filter: true, resizable: true, editable: true, suppressKeyboardEvent: this.suppressEnterItemName.bind(this), cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120, pinned: 'left' },
    { headerName: 'Formulation', field: 'formulation.itemForm.form', sortable: true, resizable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Expiry', field: 'expiryDate', sortable: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    {
      headerName: 'Qty', field: 'quantity', singleClickEdit: true, cellEditorFramework: NumericEditor, sortable: true, resizable: true, filter: true, editable: true, width: 90, pinned: 'left',
      valueGetter: function (params) {

        /* if (Number(params.data.fquantity) >= Number(params.data.quantity)) {


          return params.data.quantity;
        }
        else {

          return params.data.fquantity;
        } */
        return isNaN(params.data.quantity) ? 0 : params.data.quantity
      },
      cellStyle: function (params) {
        try {
          var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;
          var actualQty = isNaN(params.data.stockId['quantity']) ? 0 : params.data.stockId['quantity'];
          if ((qty > 0 && actualQty != 0) && (qty <= actualQty)) {
            return { border: '1px solid #BDC3C7', backgroundColor: 'white' };
          }
          else {
            return { border: '1px solid #BDC3C7', backgroundColor: 'red' };
          }
        }
        catch (error) {
          return { border: '1px solid #BDC3C7' };
        }
      }
    },
    { headerName: 'Bonus', field: 'bonus', sortable: true, hide: true, cellEditorFramework: NumericEditor, resizable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 90 },

    { headerName: 'Shelf', field: 'shelf', sortable: true, hide: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Pack', field: 'pack.pack', sortable: true, hide: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Rack No', field: 'rackNo', sortable: true, hide: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Supplier', field: 'supplier.name', hide: true, sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'Mfg ', field: 'manufacturerDate', hide: true, sortable: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'hQty', field: 'fquantity', hide: true, cellEditorFramework: NumericEditor, sortable: true, resizable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 90, },
    { headerName: 'Storage', field: 'storage.storage', hide: true, sortable: true, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
    { headerName: 'P Price', field: 'purchasePrice', hide: true, cellEditorFramework: NumericEditor, resizable: true, sortable: true, filter: true, editable: false, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120, },
    {
      headerName: 'Markup %', field: 'markupPercenage', hide: true, singleClickEdit: true, cellEditorFramework: NumericEditor, resizable: true, sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: function (params) {
        var markup = isNaN(params.data.markupPercenage) ? 0 : params.data.markupPercenage;
        var sp = params.data.salesPrice;
        var pp = params.data.purchasePrice;
        if (markup != 0) {
          params.data.salesPrice = pp * (1 + markup / 100);
          return markup
        }
        return 0;
      }
    },
    { headerName: 'MRP', field: 'mrp', hide: true, cellEditorFramework: NumericEditor, resizable: true, sortable: true, filter: true, editable: false, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120, },
    {
      headerName: 'S.Price (Inc)', field: 'saleWithVAT', singleClickEdit: true, cellEditorFramework: NumericEditor, resizable: true, sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: this.sPriceIncVAT.bind(this),
    },

    {
      headerName: 'S Price', field: 'salesPrice', singleClickEdit: true, sortable: true, filter: true, resizable: true, cellEditorFramework: NumericEditor, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 90,
      valueGetter: this.sPrice.bind(this)
    },
    { headerName: 'TAX', field: 'tax.categoryCode', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    {
      headerName: 'Tax', field: 'VAT', hide: true, sortable: true, singleClickEdit: true, resizable: true, filter: true, cellEditorFramework: NumericEditor, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 90,
      valueGetter: function (params) {
        return isNaN(params.data.VAT) ? 0 : params.data.VAT;
      },
      /* valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          //params.data["comments"] = params.newValue;
          return true;
        }
        else {
          return false;
        }
      } */
    },
    {
      headerName: 'Sale Disc %', field: 'salesDiscount', singleClickEdit: true, resizable: true, cellEditorFramework: NumericEditor, sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: function (params) {
        if (params.data.salesDiscount > 50) {
          params.data.salesDiscount = 0;
          params.data.salesDiscountPrice = (params.data.qty * params.data.salesPrice) * (params.data.salesDiscount / 100);
          return params.data.salesDiscount;
        }
        //(params.data.quantity * params.data.salesPrice) * (params.data.salesDiscount / 100))
        params.data.salesDiscountPrice = Number((params.data.quantity * params.data.salesPrice) * (params.data.salesDiscount / 100)).toFixed(2);
        params.data.salesDiscountPrice = isNaN(params.data.salesDiscountPrice) ? 0 : params.data.salesDiscountPrice;
        return params.data.salesDiscount;
      },

    },
    {
      headerName: 'Sale Disc Price', field: 'salesDiscountPrice', singleClickEdit: false, resizable: true, cellEditorFramework: NumericEditor, sortable: true, filter: true, editable: false, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      /* valueGetter: function (params) {
        params.data.salesDiscountPrice = (params.data.qty * params.data.salesPrice) * (params.data.salesDiscount / 100);
        return params.data.salesDiscountPrice;
      }, */

    },
    {
      headerName: 'Margin %', field: 'marginPercentage', resizable: true, cellEditorFramework: NumericEditor, editable: false, sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: function (params) {
        var sp = params.data.salesPrice;
        var sd = params.data.salesDiscount;
        var pp = params.data.purchasePrice;
        var marginPer = Math.round(((sp - ((sd / 100) * sp) - pp) / (pp)) * 100);
        if (sp != 0 && pp != 0) {
          return isNaN(marginPer) ? 0 : marginPer;
        }
        return 0;
      },
      valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          //params.data["comments"] = params.newValue;
          return true;
        }
        else {
          return false;
        }
      }
    },

    {
      headerName: 'Total Amount', field: 'itemtotalAmount', resizable: true, cellEditorFramework: NumericEditor, sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: this.total.bind(this), editable: false, pinned: 'right'
    },
  ]

  sPrice(params) {
    let tax = (params.data.tax != null && params.data.tax != undefined) ? params.data.tax['categoryValue'] : 0;
    params.data.saleWithVAT = params.data.salesPrice * (1 + tax / 100);
    return isNaN(params.data.salesPrice) ? 0 : Number(params.data.salesPrice).toFixed(2);
  }

  sPriceIncVAT(params) {
    let tax = (params.data.tax != null && params.data.tax != undefined) ? params.data.tax['categoryValue'] : 0;
    params.data.salesPrice = params.data.saleWithVAT / (1 + tax / 100);
    return isNaN(params.data.saleWithVAT) ? 0 : Number(params.data.saleWithVAT).toFixed(2)
  }
  stockColumDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40, cellStyle: { 'border': '1px solid #BDC3C7' }
    },

    { headerName: 'Item Code', field: 'item.itemCode', hide: true, sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Product Name', field: 'item.itemName', sortable: true, filter: true, resizable: true, width: 260, cellStyle: { 'border': '1px solid #BDC3C7' }, cellRenderer: this.tooltipRenderer, },
    { headerName: 'Strength', field: 'item.drugDose', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Manufacturer', field: 'item.manufacturer.name', sortable: true, filter: true, resizable: true, width: 150, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Formulation TAB/CAP etc', field: 'item.itemForm.formCode', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Expiry', field: 'expiryDt', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Margin %', field: 'margin', hide: true, sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, },
    { headerName: 'Supplier', field: 'supplier.name', hide: true, sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'On Hand Stock', field: 'quantity', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Bonus', field: 'bonus', sortable: true, hide: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' } },

    { headerName: 'Rack No', field: 'rack', sortable: true, hide: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Pack', field: 'item.pack', sortable: true, hide: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Storage', field: 'item.storage', sortable: true, hide: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Purchase Price', field: 'unitPurchaseRate', hide: true, sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Markup %', field: 'purchaseDiscountPercentage', hide: true, sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'S Price', field: 'unitSaleRate', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'TAX', field: 'taxCategoryModel.categoryCode', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'TAX', field: 'vat', hide: true, sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'S Disc %', field: 'saleDiscountPercentage', hide: true, sortable: true, filter: true, resizable: true, width: 100, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'MRP', field: 'mrp', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Pack', field: 'pack', sortable: true, hide: false, filter: true, resizable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120 },
  ]
  // checkboxes
  cashCheckbox: boolean = false;
  creditCheckbox: boolean = false;
  insurenceCheckbox: boolean = false;
  mPesaCheckbox: boolean = false;
  membershipCheckbox: boolean = false;
  card: boolean = false;
  cheque: boolean = false;
  dummyBill: boolean = false;
  // dropdown variables
  customersArray: any[] = [];
  doctorsArray: any[] = [];
  hospitalsArray: any[] = [];
  itemsArray: any[] = [];
  suppliersArray: any[] = [];
  batchNumbersArray: any[] = [];
  searchTermsArray: any[] = ["Item Name", "Item Code", "Description", "Generic Name", "Batch Number"];
  // dropdown selected data

  prevBillCodeArray: any[] = [];
  selectedPrevBillNo: any;
  selectedCustomer: any;
  selectedDoctor: any;
  selectedHospital: any;
  selectedSupplier: any;
  selectedItem: any;
  selectedBatchNumber: any;
  selectedSearchTerms: any = "Item Code";
  searchTerm: string;
  toggle: string = 'none';
  generateBill: boolean = false;
  insuranceModel: Object = {
    'customerInsuranceId': '',
    'policyCode': '', 'contributionPercentage': '', 'contactNumber': '', 'insurenceContributionPercentage': '',
    'customerConributionAmount': '', 'insurenceContributionAmount': ''
  }

  membershipModel: Object = {
    'customerMembershipId': '',
    'membershipCardNumber': '', 'membershipDiscountPercentage': '', 'membershipEndDate': '', 'discountAmount': ''
  }

  paymentTypeForm: FormGroup;
  paymentTypeFormValidation = {
    cash: new FormControl(),
    credit: new FormControl(),
    mPesa: new FormControl(),
    card: new FormControl(),
    cheque: new FormControl(),
  }
  salesBillingForm: FormGroup;
  salesBillingFormValidations = {
    adjustedQty: new FormControl(),
    balanceAmount: new FormControl(),
    billCode: new FormControl(),
    previousBillCode: new FormControl(),
    billDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
    cashAmount: new FormControl(null, Validators.required),
    creationTs: new FormControl(),
    creationUserId: new FormControl(),
    creditDays: new FormControl(null, Validators.required),
    creditAmount: new FormControl(null, Validators.required),
    creditCardAmount: new FormControl(null, Validators.required),
    creditCardNo: new FormControl(null, Validators.required),
    creditCardAuthNo: new FormControl(null),
    customerNm: new FormControl(),
    customerPhoneNo: new FormControl(),
    effectiveMargin: new FormControl(),
    effectiveOverallDiscount: new FormControl(),
    effectiveSalesDisc: new FormControl(),
    effectiveVat: new FormControl(),
    insuranceContribAmt: new FormControl(),
    insuranceContribPercent: new FormControl(),
    lastUpdateTs: new FormControl(),
    lastUpdateUserId: new FormControl(),
    marginAmt: new FormControl(),
    membershipContribAmt: new FormControl(),
    membershipContribPercent: new FormControl(),
    overallDiscount: new FormControl(),
    paidAmount: new FormControl(),
    chequeNumber: new FormControl(null, Validators.required),
    chequeAmount: new FormControl(null, Validators.required),
    chequeDate: new FormControl(null, Validators.required),
    paymentStatus: new FormControl(),
    presciptionDate: new FormControl(),
    prescripion: new FormControl(),
    remarks: new FormControl(),
    roundedOff: new FormControl(),
    saleDiscAmt: new FormControl(),
    totalAmount: new FormControl(),
    netAmount: new FormControl(),
    totalProducts: new FormControl(),
    totalQty: new FormControl(),
    upiAmount: new FormControl(null, Validators.required),
    upiTransactionId: new FormControl(null, Validators.required),
    upiPhoneNo: new FormControl(null, Validators.required),
    vatAmt: new FormControl(),
    customerInsuranceModel: new FormControl(),
    customerMembershipModel: new FormControl(),
    customerModel: new FormControl(undefined, Validators.required),
    employeeModel: new FormControl(),
    pharmacyModel: new FormControl(),
    providerModel: new FormControl(),
    hospitalModel: new FormControl(),

  };

  selectedPrescriptionImage: File;
  prescriptionForm: FormGroup;
  prescriptionFormValidation = {
    prescriptionImage: new FormControl(),
    prescriptionDate: new FormControl(),
    customer: new FormControl(),
    sales: new FormControl()
  }

  salesItemsForm: FormGroup;
  salesItemsFormValidation = {
    salesItemsId: new FormControl(),
    stockId: new FormControl(),
    billId: new FormControl(),
    barcode: new FormControl(),
    batchNo: new FormControl(),
    creationTs: new FormControl(),
    creationUserId: new FormControl(),
    discount: new FormControl(),
    discountPercentage: new FormControl(),
    freeQtyApprover: new FormControl(),
    lastUpdateTs: new FormControl(),
    lastUpdateUserId: new FormControl(),
    margin: new FormControl(),
    mrp: new FormControl(),
    qtyFree: new FormControl(),
    remarks: new FormControl(),
    saleAmount: new FormControl(),
    saleWithVAT: new FormControl(),
    saleQty: new FormControl(),
    unitPurchasePrice: new FormControl(),
    unitSalePrice: new FormControl(),
    vat: new FormControl(),
    itemsModel: new FormControl(),
    taxCategoryModel: new FormControl(),
  }

  customerInformationForm: FormGroup;
  customerInformationFormValidations = {
    customerName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    country: new FormControl(),
    state: new FormControl(),
    activeS: new FormControl('Y')
  }
  onCustomerSubmit() {
    if (this.customerInformationForm.get('customerName').errors || this.customerInformationForm.get('phoneNumber').errors) {
      return;
    }
    this.salesService.getEmployeeById().subscribe(employeeResponse => {
      if (employeeResponse['responseStatus']['code'] === 200) {

        this.customerInformationForm.get('country').setValue(employeeResponse['result']['country'])
        this.customerInformationForm.get('state').setValue(employeeResponse['result']['state'])

        this.salesService.saveCustomer(this.customerInformationForm.value).subscribe(
          saveFormResponse => {
            let payload = Object.assign({}, this.customerInformationForm.value);
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['createdUser'] = localStorage.getItem('id');
            if (saveFormResponse instanceof Object) {
              if (saveFormResponse['responseStatus']['code'] === 200) {
                this.customerInformationForm.reset();
                this.selectedCustomer = saveFormResponse['result'];
                this.customersArray.push(saveFormResponse['result']);
              }
            }
          })
      }
    })

  }

  providerInformationForm: FormGroup;
  providerInformationFormValidations = {
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    country: new FormControl(),
    state: new FormControl(),
    activeS: new FormControl('Y')
  }

  onProviderSubmit() {

    if (this.providerInformationForm.get('lastName').errors || this.providerInformationForm.get('phoneNumber').errors || this.providerInformationForm.get('firstName').errors) {
      return;
    }
    this.salesService.getEmployeeById().subscribe(employeeResponse => {
      if (employeeResponse['responseStatus']['code'] === 200) {
        this.providerInformationForm.get('country').setValue(employeeResponse['result']['country'])
        this.providerInformationForm.get('state').setValue(employeeResponse['result']['state'])

        this.salesService.saveProvider(this.providerInformationForm.value).subscribe(
          saveFormResponse => {
            let payload = Object.assign({}, this.providerInformationForm.value);
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['createdUser'] = localStorage.getItem('id');
            if (saveFormResponse instanceof Object) {
              if (saveFormResponse['responseStatus']['code'] === 200) {
                this.providerInformationForm.reset();
                this.selectedDoctor = saveFormResponse['result'];
                this.doctorsArray.push(saveFormResponse['result']);
              }
            }
          }
        )
      }
    })

  }
  onSubmit() {
    if (this.salesBillingForm.get('customerModel').errors instanceof Object) {

      this.salesBillingForm.get('customerModel').markAsTouched();

      this.toasterService.warning('Please Select Customer', 'Customer Not Selected', {
        timeOut: 3000
      });
      return;
    }
    if (!this.cashCheckbox && !this.creditCheckbox && !this.mPesaCheckbox && !this.card && !this.cheque) {
      $("#cash").focus();
      this.toasterService.warning('Please Select Payment Type', 'No Payment Type Selected', {
        timeOut: 3000
      });
      return;
    }
    if (
      (this.cashCheckbox && this.salesBillingForm.get('cashAmount').errors instanceof Object) ||
      (this.creditCheckbox && ((this.salesBillingForm.get('creditDays').errors instanceof Object)
        || (this.salesBillingForm.get('creditAmount').errors instanceof Object)))
      || (this.mPesaCheckbox && (this.salesBillingForm.get('upiPhoneNo').errors instanceof Object || this.salesBillingForm.get('upiAmount').errors instanceof Object || this.salesBillingForm.get('upiTransactionId').errors instanceof Object)) ||
      (this.card && (this.salesBillingForm.get('creditCardAmount').errors instanceof Object || this.salesBillingForm.get('creditCardNo').errors instanceof Object)) ||
      (this.cheque && (this.salesBillingForm.get('chequeNumber').errors instanceof Object || this.salesBillingForm.get('chequeAmount').errors instanceof Object || this.salesBillingForm.get('chequeDate').errors instanceof Object))
    ) {
      //if (this.salesBillingForm.get('cashAmount').errors instanceof Object && (this.paidAmount != null && this.paidAmount != undefined && this.paidAmount != 0 && this.paidAmount != ''))
      this.toasterService.warning('Please Fill Selected Payment Type', 'No In Value Selected Payment Type ', {
        timeOut: 3000
      });
      return;
    }

    if (this.salesBillingForm.get('creditAmount').value > 0) {

      if (this.paidAmount >= this.netAmount) {
        this.salesBillingForm.get('creditAmount').setValue(0);
        this.salesBillingForm.get('creditDays').setValue(0);
      }
    }
    let payload = Object.assign({}, this.salesBillingForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.payload = Object.assign({}, this.salesBillingForm.value);

    this.payload['billCode'] = this.billNumber;
    this.payload['lastUpdateUserId'] = localStorage.getItem('id');
    this.payload['creationUserId'] = localStorage.getItem('id');
    this.payload['totalProducts'] = this.totalItemsCount;
    this.payload['effectiveOverallDiscount'] = this.totalDiscPercentage;
    this.payload['overallDiscount'] = this.totalDiscPercentageAmount;
    this.payload['activeS'] = 'Y'   //this.totalDiscAmount;
    this.payload['effectiveVat'] = this.totalVAT;
    this.payload['vatAmt'] = this.totalVATAmount;
    this.payload['paidAmount'] = this.paidAmount;
    this.payload['balanceAmount'] = this.balance;
    this.payload['paymentStatus'] = this.selectedPaymentStatus['name'];
    this.payload['totalAmount'] = this.finalAmount;
    this.payload['netAmount'] = this.netAmount;
    this.payload['customerNm'] = this.selectedCustomer != null && this.selectedCustomer != undefined ? this.selectedCustomer['customerName'] : null;
    this.payload['customerPhoneNo'] = this.selectedCustomer != null && this.selectedCustomer != undefined ? this.selectedCustomer['phoneNumber'] : null;
    if (this.cashCheckbox && ((this.payload['creditAmount'] == null && this.payload['creditAmount'] == undefined) &&
      (this.payload['creditCardAmount'] == null && this.payload['creditCardAmount'] == undefined) &&
      (this.payload['upiAmount'] == null && this.payload['upiAmount'] == undefined) &&
      (this.payload['chequeAmount'] == null && this.payload['chequeAmount'] == undefined) &&
      (this.payload['cashAmount'] == null && this.payload['cashAmount'] == undefined))) {
      this.payload['cashAmount'] = this.paidAmount;
    }

    if (this.insurenceCheckbox && this.insuranceModel != null && this.insuranceModel != undefined) {
      this.payload['customerInsuranceModel'] = this.insuranceModel;
    }
    if (this.membershipCheckbox && this.membershipModel != null && this.membershipModel != undefined) {
      this.payload['customerMembershipModel'] = this.membershipModel;
    }

    this.payload['pharmacyModel'] = { pharmacyId: localStorage.getItem('pharmacyId') };
    this.payload['employeeModel'] = { employeeId: localStorage.getItem('id') };
    this.payload['customerModel'] = this.selectedCustomer;
    this.payload['providerModel'] = (this.selectedDoctor != null && this.selectedDoctor != undefined) ? this.selectedDoctor : { providerId: 512 };
    this.payload['hospitalModel'] = this.selectedHospital;
    this.payload['insuranceContribPercent'] = this.insuranceModel['insurenceContributionPercentage'];
    this.payload['membershipContribPercent'] = this.membershipModel['membershipDiscountPercentage'];
    if (this.selectedSalesRecord != null && this.selectedSalesRecord != undefined && this.editScreen) {
      this.payload['billId'] = this.selectedSalesRecord['billId'];
    }

    this.saveSales(this.payload);
    //this.resetSave();
  }

  accountRecievablesRes: any;
  generalLedgerId: any;
  saveSales(payload) {
    this.salesService.saveSales(payload).subscribe(
      salesRes => {
        let payload = Object.assign({}, this.salesBillingForm.value);
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['createdUser'] = localStorage.getItem('id');
        if (salesRes['responseStatus']['code'] == 200) {

          if (salesRes['result'] != null) {
            let index = 0;
            let salesItemsArray: any[] = [];
            try {
              this.itemGridOptions.api.forEachNode(function (node) {
                let saleItem = new SalesItemsModel();
                saleItem['salesItemsId'] = node.data['salesItemsId']
                saleItem['stockId'] = node.data['stockId']
                saleItem['billId'] = { billId: salesRes['result']['billId'] }
                saleItem['barcode'] = null;
                saleItem['batchNo'] = node.data['batchNo'];
                saleItem['saleWithVAT'] = node.data['saleWithVAT'];
                saleItem['discount'] = node.data['salesDiscountPrice'];
                saleItem['discountPercentage'] = node.data['salesDiscount']
                saleItem['freeQtyApprover']
                saleItem['margin'] = node.data['marginPercentage'];
                saleItem['mrp'] = node.data['mrp'];
                saleItem['qtyFree']
                saleItem['remarks']
                saleItem['saleAmount'] = node.data['itemtotalAmount']
                saleItem['saleQty'] = node.data['quantity']
                saleItem['unitPurchasePrice'] = node.data['purchasePrice']
                saleItem['unitSalePrice'] = node.data['salesPrice']
                saleItem['vat'] = node.data['VAT']
                saleItem['itemsModel'] = node.data['itemName'];
                saleItem['taxCategoryModel'] = node.data['tax'];

                if (saleItem['stockId'] != null && saleItem['stockId'] != undefined && saleItem['stockId'] != 0) {
                  salesItemsArray.push(node.data);
                }
                index++;
              });
            }
            catch (error) {

              this.itemGridOptions.rowData.forEach(function (node) {
                let saleItem = new SalesItemsModel();
                saleItem['salesItemsId'] = node['salesItemsId']
                saleItem['stockId'] = node['stockId']
                saleItem['billId'] = { billId: salesRes['result']['billId'] }
                saleItem['barcode'] = null;
                saleItem['batchNo'] = node['batchNo'];

                saleItem['discount'] = null;
                saleItem['discountPercentage'] = node['salesDiscount']
                saleItem['freeQtyApprover']

                saleItem['margin'] = node['marginPercentage'];
                saleItem['mrp'] = node.data['mrp'];
                saleItem['qtyFree']
                saleItem['remarks']
                saleItem['saleAmount'] = node['itemtotalAmount']
                saleItem['saleQty'] = node['quantity']
                saleItem['unitPurchasePrice'] = node['purchasePrice']
                saleItem['unitSalePrice'] = node['salesPrice']
                saleItem['vat'] = node['VAT']
                saleItem['taxCategoryModel'] = node['tax'];
                saleItem['itemsModel'] = node['itemName'];
                if (index != 0) {
                  salesItemsArray.push(node);
                }
                index++;
              });
            }


            let data: any[] = [];
            for (var i = 0; i < salesItemsArray.length; i++) {
              this.salesItemsForm.get('salesItemsId').setValue(salesItemsArray[i]['salesItemsId']);
              this.salesItemsForm.get('stockId').setValue({ stockId: salesItemsArray[i]['stockId']['stockId'] });
              this.salesItemsForm.get('billId').setValue({ billId: salesRes['result']['billId'] });
              this.salesItemsForm.get('batchNo').setValue(salesItemsArray[i]['batchNo']);
              this.salesItemsForm.get('discountPercentage').setValue(salesItemsArray[i]['salesDiscount']);
              this.salesItemsForm.get('margin').setValue(salesItemsArray[i]['marginPercentage']);
              this.salesItemsForm.get('saleAmount').setValue(salesItemsArray[i]['itemtotalAmount']);
              this.salesItemsForm.get('saleQty').setValue(salesItemsArray[i]['quantity']);
              this.salesItemsForm.get('unitPurchasePrice').setValue(salesItemsArray[i]['purchasePrice']);
              this.salesItemsForm.get('saleWithVAT').setValue(salesItemsArray[i]['saleWithVAT']);
              this.salesItemsForm.get('unitSalePrice').setValue(salesItemsArray[i]['salesPrice'])
              this.salesItemsForm.get('vat').setValue(salesItemsArray[i]['VAT']);
              this.salesItemsForm.get('taxCategoryModel').setValue(salesItemsArray[i]['tax']);
              this.salesItemsForm.get('itemsModel').setValue(salesItemsArray[i]['itemName']);
              data.push(this.salesItemsForm.value);
            }
            if (this.selectedPrescriptionImage != null) {
              this.prescriptionForm.get('customer').setValue({ customerId: this.selectedCustomer['customerId'] });
              this.prescriptionForm.get('sales').setValue({ billId: salesRes['result']['billId'] });
              const formData = new FormData();
              formData.append('prescription', JSON.stringify(this.prescriptionForm.value))
              formData.append('prescriptionImage', this.selectedPrescriptionImage)

              this.salesService.savePrescription(formData).subscribe(prescripionRes => {
                if (prescripionRes['responseStatus']['code'] == 200) {

                }
                else {
                  this.toasterService.error(prescripionRes['message'], "Error", {
                    timeOut: 3000
                  });
                }
              })
            }

            this.salesService.saveSalesItems(data).subscribe(salesItemsRes => {
              if (salesItemsRes['responseStatus']['code'] == 200) {
                console.log('new generate bill', this.generateBill);
                console.log('Few flags , biilid and edit screen', this.editScreen, this.billNumber);
                console.log('edit screen status i : ', salesRes['result']['billId']);
                var billNo = this.billNumber;

                if (this.generateBill) {
                  // let uri = { "ReportCode": 'SALES_RECEIPT', "BILL_CODE": salesRes['result']['billCode'] };
                  let uri = { "ReportCode": 'SALES_RECEIPT', "BILL_CODE": billNo };
                  var encoded = encodeURI(JSON.stringify(uri));

                  let reportURI = encoded;
                  this.salesService.downloadPdfFile(reportURI).subscribe((data: any) => {
                    this.blob = new Blob([data], { type: 'application/pdf' });
                    var downloadURL = window.URL.createObjectURL(data);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = 'SALES REPORT BY BILLID-' + billNo + '.pdf';
                    link.click();
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = downloadURL;
                    document.body.appendChild(iframe);
                    iframe.contentWindow.print();
                    this.resetSave();
                    console.log('new generate bill - 2', this.generateBill, billNo);
                    console.log('Few flags , biilid and edit screen -2 ', this.editScreen, this.billNumber);
                    console.log('edit screen status with Bill Date :2 ', salesRes['result']['billId'], salesRes['result']['billDate']);

                  })
                }
                /* this.toasterService.success(salesItemsRes['message'], "Success", {
                  timeOut: 3000
                }); */
              }
            });
            if (this.selectedPaymentStatus['name'] != 'Dummy Bill') {
              this.salesService.getAccountReceivablessNumber().subscribe(receiptNumber => {
                if (receiptNumber['responseStatus']['code'] == 200) {

                  if (this.selectedSalesRecord instanceof Object) {
                    let obect = {
                      'amountReceived': salesRes['result']['paymentStatus'] == 'Cancel' ? -salesRes['result']['paidAmount'] : salesRes['result']['paidAmount'] - this.selectedSalesRecord['paidAmount'],
                      'amountToBeReceived': salesRes['result']['balanceAmount'] != null && salesRes['result']['balanceAmount'] != undefined ? salesRes['result']['balanceAmount'] - this.selectedSalesRecord['balanceAmount'] : 0,
                      'receiptDate': new Date(),
                      'source': salesRes['result']['billId'],
                      'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                      'receiptNumber': receiptNumber['result'],
                      'status': 'Approved',
                      'activeS': 'Y',
                      'createdUser': localStorage.getItem('id'),
                      'lastUpdateUser': localStorage.getItem('id'),
                      'paymentTypeId': { paymentTypeId: 1 },
                      'paymentStatus': salesRes['result']['paymentStatus'],
                      'sourceType': 'Sales Billing',
                      'sourceRef': salesRes['result']['billCode'],
                      'approvedDate': new Date(),
                      'approvedBy': { 'employeeId': localStorage.getItem('id') },
                      'customerName': salesRes['result']['customerNm']
                    }
                    this.salesService.saveAccountReceivables(obect).subscribe(res => {
                    })
                    this.selectedSalesRecord = undefined;
                  }
                  else {
                    let obect = {
                      'amountReceived': salesRes['result']['paymentStatus'] == 'Cancel' ? -salesRes['result']['paidAmount'] : salesRes['result']['paidAmount'],
                      'amountToBeReceived': salesRes['result']['balanceAmount'] != null && salesRes['result']['balanceAmount'] != undefined ? salesRes['result']['balanceAmount'] : 0,
                      'receiptDate': new Date(),
                      'source': salesRes['result']['billId'],
                      'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                      'receiptNumber': receiptNumber['result'],
                      'status': 'Approved',
                      'activeS': 'Y',
                      'createdUser': localStorage.getItem('id'),
                      'lastUpdateUser': localStorage.getItem('id'),
                      'paymentTypeId': { paymentTypeId: 1 },
                      'paymentStatus': salesRes['result']['paymentStatus'],
                      'sourceType': 'Sales Billing',
                      'sourceRef': salesRes['result']['billCode'],
                      'approvedDate': new Date(),
                      'approvedBy': { 'employeeId': localStorage.getItem('id') },
                      'customerName': salesRes['result']['customerNm']
                    }
                    this.salesService.saveAccountReceivables(obect).subscribe(res => {
                      this.accountRecievablesRes = res['result'];
                      this.salesService.saveGeneralLedger(obect).subscribe(response => {
                      })
                    })
                  }


                }
              });
            }

          }
          this.toasterService.success(salesRes['message'], "Success", {
            timeOut: 3000
          });
          if (!this.generateBill) {
            this.resetSave();
          }

        }
        else {
          this.toasterService.error(salesRes['message'], "Error", {
            timeOut: 3000
          });
        }

      }
    );
  }
  searchPreviousBillCode(event) {
    if (event['target']['value'] != "") {
      this.salesService.getPreviousBillCodeByKey(event['target']['value']).subscribe(previousBillCodeRes => {
        if (previousBillCodeRes['responseStatus']['code'] == 200) {
          this.prevBillCodeArray = previousBillCodeRes['result']

        }
      });
    }
    else {
      this.getPreviousBillCodes();
    }
  }

  getPreviousBillCodes() {
    if (this.prevBillCodeArray['length'] == 0) {
      this.salesService.getPreviousBillCodes().subscribe(previousBillCodeRes => {
        if (previousBillCodeRes['responseStatus']['code'] == 200) {
          this.prevBillCodeArray = previousBillCodeRes['result']
        }
      });
    }
  }


  selectPrescriptionImage(event) {
    console.log(document.getElementById('prescriptionImage')['title'])
    console.log(document.getElementById('prescriptionImage')['value'])
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 3000
      });
      document.getElementById('prescriptionImage')['value'] = '';
      try {
        event.target.value = undefined;
      }
      catch (error) {

      }


    }
    else {
      this.selectedPrescriptionImage = event.target.files[0];
    }
  }
  onGridSizeChanged(params) {
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = params.columnApi.getAllColumns();
    for (var i = 0; i < allColumns.length; i++) {
      let column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }

  cashSelected(event) {

    this.cashCheckbox = !this.cashCheckbox;
    this.salesBillingForm.get('cashAmount').setValue(this.paidAmount);

  }

  creditSelected(event) {

    this.creditCheckbox = !this.creditCheckbox;

  }

  insurenceSelected(event) {

    this.insurenceCheckbox = !this.insurenceCheckbox;


    this.customerInsurenceCheck();

  }

  customerInsurenceCheck() {
    if (this.selectedCustomer != undefined && this.selectedCustomer != null && this.insurenceCheckbox) {
      this.salesService.getInsurenceByCustomer(this.selectedCustomer).subscribe(insurenceRes => {
        if (insurenceRes['responseStatus']['code'] == 200) {

          if (insurenceRes['result'] != null) {
            this.insuranceModel['policyCode'] = insurenceRes['result']['customerPolicyNumber']
            this.insuranceModel['customerInsuranceId'] = insurenceRes['result']['customerInsuranceId']
            this.insuranceModel['contributionPercentage'] = 100 - insurenceRes['result']['contributionPercentage'];
            this.insuranceModel['contactNumber'] = insurenceRes['result']['insuranceModel']['contactNumber'];
            this.insuranceModel['insurenceContributionPercentage'] = insurenceRes['result']['contributionPercentage'];
          }
        }
        this.totalBillCaliculation();
      });
    }
  }

  mPesaSelected(event) {
    this.mPesaCheckbox = !this.mPesaCheckbox;

  }

  cardSelected(event) {
    this.card = !this.card;

  }

  chequeSelected(event) {
    this.cheque = !this.cheque;
  }

  dummyBillSelected(event) {
    this.dummyBill = !this.dummyBill;
  }

  membershipSelected(event) {
    this.membershipCheckbox = !this.membershipCheckbox;
  }


  getDoctorsData() {
    this.salesService.getDoctorsData().subscribe(doctorDataRes => {

      if (doctorDataRes['responseStatus']['code'] == 200) {
        this.doctorsArray = doctorDataRes['result']
      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getHospitalsData() {
    this.salesService.getHospitalsData().subscribe(hospitalDataRes => {
      if (hospitalDataRes['responseStatus']['code'] == 200) {
        this.hospitalsArray = hospitalDataRes['result']
      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getCustomersData() {
    this.salesService.getCustomersData().subscribe(customerDataRes => {
      if (customerDataRes['responseStatus']['code'] == 200) {
        this.customersArray = customerDataRes['result'];
      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getItemssData() {
    this.salesService.getItemssData().subscribe(itemDataRes => {

      if (itemDataRes['responseStatus']['code'] == 200) {
        this.itemsArray = itemDataRes['result'];

      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getStockData() {
    this.salesService.getStockData().subscribe(stockItemDataRes => {

      if (stockItemDataRes['responseStatus']['code'] == 200) {
        this.itemsArray = stockItemDataRes['result'];

      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getSupplierDataByItemId(itemId) {
    this.salesService.getSupplierDataByItemId(itemId).subscribe(supplierDataRes => {

      if (supplierDataRes['responseStatus']['code'] == 200) {
        this.suppliersArray = supplierDataRes['result'];

      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }

  getBatechNumbersDataByItemId(itemId) {
    this.salesService.getBatchNumbersDataByItemId(itemId).subscribe(batchNumbersDataRes => {

      if (batchNumbersDataRes['responseStatus']['code'] == 200) {
        this.batchNumbersArray = batchNumbersDataRes['result'];
        this.toggle = 'model';
      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    })
  }
  customerSelected(event) {

    this.customerPhoneNumber = this.selectedCustomer['phoneNumber'];
    this.getPresciption();
  }
  doctorSelected(event) {

    this.speciality = this.selectedDoctor['speciality']
  }
  itemSelected(event) {

    this.getSupplierDataByItemId(event['itemId']);
    //this.itemGridOptions.rowData = [event];

    this.getBatechNumbersDataByItemId(event);
  }


  addItemTOGrid() {
    this.griddata.push(this.selectedItem)
    this.itemGridOptions.rowData = this.griddata;
    //this.itemGridOptions.rowData = this.itemGridOptions.rowData;

  }

  batchNumberSelected(event) {

    this.salesService.getStockDataByItemIdAndBatchNo(this.selectedItem['itemId'], this.selectedBatchNumber[0]).subscribe(res => {
      if (res['responseStatus']['code'] == 200) {

        //this.batchNumbersArray = res['result'];
        this.stockGridOptions.rowData = res['result']


      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    });
  }

  searchItemByNameInStock(): void {
    if ((this.itemSearchKey != null && this.itemSearchKey != undefined && this.itemSearchKey != '') &&
      (this.selectedSearchTerms != null && this.selectedSearchTerms != undefined && this.selectedSearchTerms != ''))
      this.findStockDataByItemAndPharmacy(this.itemSearchKey, this.selectedSearchTerms, localStorage.getItem('pharmacyId'));
    /*  this.salesService.getItemDataByItemName(this.itemSearchKey).subscribe(itemRes => {

       if (itemRes['responseStatus']['code'] == 200) {
         if (itemRes['result'].length > 0) {
           let formData = new FormData();

           formData.set('itemlist', JSON.stringify(itemRes['result']));
           formData.set('pharmacy', JSON.stringify({ 'pharmacyId': localStorage.getItem('pharmacyId') }));
           let payload = Object.assign({}, { 'listOfItems': '', 'pharmacy': {} });;
           payload['listOfItems'] = itemRes['result'];
           payload['pharmacy'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
           this.findStockDataByItemAndPharmacy(payload);
         }

       }
       else {
         this.toasterService.error('Please contact administrator', 'Error Occurred', {
           timeOut: 3000
         });
       }

     }) */
  }
  searchItemByCodeInStock() {
    this.findStockDataByItemAndPharmacy(this.itemSearchKey, this.selectedSearchTerms, localStorage.getItem('pharmacyId'));
    /* this.salesService.getItemDataByItemCode(this.itemSearchKey).subscribe(itemRes => {
      if (itemRes['responseStatus']['code'] == 200) {
        if (itemRes['result'].length > 0) {
          let formData = new FormData();

          formData.set('itemlist', JSON.stringify(itemRes['result']));
          formData.set('pharmacy', JSON.stringify({ 'pharmacyId': localStorage.getItem('pharmacyId') }));
          let payload = Object.assign({}, { 'listOfItems': '', 'pharmacy': {} });;
          payload['listOfItems'] = itemRes['result'];
          payload['pharmacy'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
          this.findStockDataByItemAndPharmacy(this.itemSearchKey, localStorage.getItem('pharmacyId'));
        }

      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }

    }); */
  }
  rowCount = 0;
  pageNumber = 0;
  datasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.salesService.getStockDataByItemAndPharmacyId(this.itemSearchKey, this.selectedSearchTerms, localStorage.getItem('pharmacyId'),
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

  getStockCountBySearch() {
    this.salesService.getStockDataByItemAndPharmacyIdCount(this.itemSearchKey, this.selectedSearchTerms, localStorage.getItem('pharmacyId')).subscribe(data => {
      if (data['responseStatus']['code'] === 200) {
        this.spinnerService.show();
        this.rowCount = data['result'];

        this.stockGridOptions.api.setDatasource(this.datasource);
        this.spinnerService.hide();
      }
    })
  }

  searchStock() {
    this.rowCount = 0;
    this.pageNumber = 0;
    this.getStockCountBySearch();

  }


  findStockDataByItemAndPharmacy(itemName, selectedSearchTerms, pharmacyId) {
    this.salesService.getStockDataByItemAndPharmacyId(itemName, selectedSearchTerms, pharmacyId, 0, 0).subscribe(stockRes => {
      if (stockRes['responseStatus']['code'] == 200) {
        var data = stockRes['result'];
        //this.stockGridOptions.api.setRowData([]);// = [];
        //this.stockGridOptions.rowData.splice(1, 0, stockRes['result'][0]);
        try {
          if (data[0]['item']['scheduleCode']['scheduleCategoryCode'] == 'X') {

            alert(data[0]['item']['scheduleCode']['scheduleCategoryCode'] + ':' + 'Narcotic and Psychotropic');
            this.stockSearchDisable = false;
          }
        }
        catch (error) {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }

        this.stockGridOptions.api.updateRowData({
          add: data
        });
        //this.stockRowData = [];
        //this.stockRowData.splice(1, 0, stockRes['result']);
        this.stockRowData.push(stockRes['result']);
      }
      else {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    },
      error => {
        this.stockGridOptions.api.setRowData([]);
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      });
  }


  searchItemsBasedOnSearchTerm() {
    this.stockSearchDisable = true;
    //this.itemSearchKey = null;
    if (this.selectedSearchTerms == 'Item Name') {

      this.searchItemByNameInStock();
    }
    else {
      this.searchItemByCodeInStock();
    }
  }
  resetEdits() {
    $("#cash").prop("checked", false);
    $("#credit").prop("checked", false);
    $("#insurance").prop("checked", false);
    $("#membership").prop("checked", false);
    $("#m-pesa").prop("checked", false);
    $("#card").prop("checked", false);
    $("#cheque").prop("checked", false);
    $("#dummyBill").prop("checked", false);
    try {
      document.getElementById('prescriptionImage')['value'] = '';
    }
    catch (error) {

    }
    this.isImageLoading = false;
    this.url = undefined;
    this.salesBillingForm.get('cashAmount').enable();
    this.salesBillingForm.get('creditAmount').enable();
    this.salesBillingForm.get('creditDays').enable();
    this.salesBillingForm.get('creditCardAmount').enable();
    this.salesBillingForm.get('creditCardNo').enable();
    this.salesBillingForm.get('creditCardAuthNo').enable();
    this.salesBillingForm.get('upiAmount').enable();
    this.salesBillingForm.get('upiPhoneNo').enable();
    this.salesBillingForm.get('upiTransactionId').enable();
    this.salesBillingForm.get('chequeAmount').enable();
    this.salesBillingForm.get('chequeNumber').enable();
    this.salesBillingForm.get('chequeDate').enable();
    this.salesBillingForm.get('customerModel').enable();
    this.salesBillingForm.get('previousBillCode').enable();
    this.salesBillingForm.get('hospitalModel').enable();
    this.salesBillingForm.get('providerModel').enable();
    this.prescriptionForm.get('prescriptionDate').enable();
    this.salesBillingForm.reset();

    this.salesItemsForm.reset();
    this.prescriptionForm.reset();


    this.cashCheckbox = false;
    this.creditCheckbox = false;
    this.insurenceCheckbox = false;
    this.mPesaCheckbox = false;
    this.membershipCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.dummyBill = false;
    // dropdown variables
    this.itemsArray = [];
    // dropdown selected data
    this.selectedCustomer = undefined;
    this.selectedDoctor = undefined;
    this.selectedHospital = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedBatchNumber = undefined;
    this.selectedSearchTerms = "Item Code";
    this.searchTerm = null;

    //this.startDate = undefined;
    //this.endDate = undefined;
    this.paymentStatusArray = [{ name: "Paid", disabled: true }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }, , { name: "Over Paid" }];
    this.paymentStatusArr = ["Paid", "Partially Paid", "Pending", "Dummy Bill", "Cancel", "Over Paid"];


    this.searchCode = undefined;
    this.searchCodeValue = undefined;
    //this.selectedSalesRecord = [];
    this.selectedSalesItemRecords = undefined;
    this.salesItemModelsArray = [];


    this.customerPhoneNumber = undefined;
    this.griddata = [];
    this.stockRowData = [];

    this.selectedPaymentStatus = { name: "Pending" };
    this.billNumber;
    //this.getBillNumber();
    this.itemSearchKey = '';
    this.isItemSearchEnabled;
    this.finalAmount = 0;
    this.totalItemsCount = 0;
    this.totalDiscPercentage = 0;
    this.totalDiscAmount = 0;
    this.netAmount = 0;
    this.paidAmount = 0;
    this.balance = 0;
    this.totalVAT = 0;
    this.narcoticDrugCount = 0;
    this.speciality = undefined;
    this.totalQty = 0;
    this.roundOff = undefined;
    this.totalVATAmount = 0;
    this.totalDiscPercentageAmount = 0;



    this.itemGridOptions.api.setRowData([]);
    // this.itemGridOptions.api.setRowData([{ 'itemCode': '' }]);

    //this.stockGridOptions.api.setRowData([]);
    this.generateBill = false;
    this.addRowButton = false;
  }


  resetSave() {
    $("#cash").prop("checked", false);
    $("#credit").prop("checked", false);
    $("#insurance").prop("checked", false);
    $("#membership").prop("checked", false);
    $("#m-pesa").prop("checked", false);
    $("#card").prop("checked", false);
    $("#cheque").prop("checked", false);
    $("#dummyBill").prop("checked", false);
    try {
      document.getElementById('prescriptionImage')['value'] = '';
    }
    catch (error) {

    }
    this.isImageLoading = false;
    this.url = undefined;
    this.salesBillingForm.get('cashAmount').enable();
    this.salesBillingForm.get('creditAmount').enable();
    this.salesBillingForm.get('creditDays').enable();
    this.salesBillingForm.get('creditCardAmount').enable();
    this.salesBillingForm.get('creditCardNo').enable();
    this.salesBillingForm.get('creditCardAuthNo').enable();
    this.salesBillingForm.get('upiAmount').enable();
    this.salesBillingForm.get('upiPhoneNo').enable();
    this.salesBillingForm.get('upiTransactionId').enable();
    this.salesBillingForm.get('chequeAmount').enable();
    this.salesBillingForm.get('chequeNumber').enable();
    this.salesBillingForm.get('chequeDate').enable();
    this.salesBillingForm.get('customerModel').enable();
    this.salesBillingForm.get('previousBillCode').enable();
    this.salesBillingForm.get('hospitalModel').enable();
    this.salesBillingForm.get('providerModel').enable();
    this.prescriptionForm.get('prescriptionDate').enable();
    this.salesBillingForm.reset();
    this.salesBillingForm.patchValue({ billDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') })

    this.salesItemsForm.reset();
    this.prescriptionForm.reset();


    this.cashCheckbox = false;
    this.creditCheckbox = false;
    this.insurenceCheckbox = false;
    this.mPesaCheckbox = false;
    this.membershipCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.dummyBill = false;
    // dropdown variables
    this.itemsArray = [];
    // dropdown selected data
    this.selectedCustomer = undefined;
    this.selectedDoctor = undefined;
    this.selectedHospital = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedBatchNumber = undefined;
    this.selectedSearchTerms = "Item Code";
    this.searchTerm = null;
    this.selectedSalesRecord = undefined;
    this.adjustAmount = undefined;
    //this.startDate = undefined;
    //this.endDate = undefined;
    this.paymentStatusArray = [{ name: "Paid", disabled: true }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }, , { name: "Over Paid" }];
    this.paymentStatusArr = ["Paid", "Partially Paid", "Pending", "Dummy Bill", "Cancel", "Over Paid"];


    this.searchCode = undefined;
    this.searchCodeValue = undefined;
    //this.selectedSalesRecord = [];
    this.selectedSalesItemRecords = undefined;
    this.salesItemModelsArray = [];


    this.customerPhoneNumber = undefined;
    this.griddata = [];
    this.stockRowData = [];

    this.selectedPaymentStatus = { name: "Pending" };
    this.billNumber;
    this.getBillNumber();
    this.itemSearchKey = '';
    this.isItemSearchEnabled;
    this.finalAmount = 0;
    this.totalItemsCount = 0;
    this.totalDiscPercentage = 0;
    this.totalDiscAmount = 0;
    this.netAmount = 0;
    this.paidAmount = 0;
    this.balance = 0;
    this.totalVAT = 0;
    this.narcoticDrugCount = 0;
    this.speciality = undefined;
    this.totalQty = 0;
    this.roundOff = undefined;
    this.totalVATAmount = 0;
    this.totalDiscPercentageAmount = 0;

    this.getCustomersData();
    this.getDoctorsData();
    this.getHospitalsData();
    this.getPreviousBillCodes();
    this.generateBill = false;
    this.addRowButton = false;
    //this.resetEdits();
    this.editScreen = false;
    this.itemGridOptions.api.setRowData([]);
    // this.itemGridOptions.api.setRowData([{ 'itemCode': '' }]);

    //this.stockGridOptions.api.setRowData([]);

  }

  resetEdit() {

    this.resetSave();

    this.editScreen = false;
  }

  suppressEnterItemCode(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    this.isItemSearchEnabled = suppress;
    if (suppress) {

      this.selectedSearchTerms = "Item Code";
      if (params['event']['target']['value'] != '') {
        //this.stockGridOptions.api.setRowData([]);
        //this.stockRowData = [];
        this.itemSearchKey = params['event']['target']['value'];
        //this.searchItemByCodeInStock();
        this.searchStock();
        document.getElementById('itemSearchModal').classList.add("show");
        document.getElementById('itemSearchModal').style.display = "block";
      }
    }
    return false;
  }

  suppressEnterItemName(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    this.isItemSearchEnabled = suppress;
    if (suppress) {

      this.selectedSearchTerms = "Item Name";
      if (params['event']['target']['value'] != '') {
        //this.stockGridOptions.api.setRowData([]);
        //this.stockRowData = [];
        this.itemSearchKey = params['event']['target']['value'];
        //this.searchItemByCodeInStock();
        this.searchStock();
        document.getElementById('itemSearchModal').classList.add("show");
        document.getElementById('itemSearchModal').style.display = "block";
      }
    }
    return false;
  }

  getSelectedStockItems() {


    this.salesItemModelsArray = [];
    var data = this.stockGridOptions.api.getSelectedRows();
    this.stockGridOptions.api.getSelectedRows().forEach(data => {

      let salesItem = new SalesModel();
      salesItem['stockId'] = data;
      salesItem['itemCode'] = data['item'];
      salesItem['itemName'] = data['item'];
      salesItem['batchNo'] = data['batchNo'];
      salesItem['formulation'] = data['item'];
      salesItem['shelf'] = data['self'];
      salesItem['rackNo'] = data['rack'];
      salesItem['pack'] = data['item'];
      salesItem['storage'] = data['item'];
      salesItem['supplier'] = data['supplier'];
      salesItem['quantity'] = 0;//isNaN(data['quantity']) ? 0 : data['quantity'];
      salesItem['fquantity'] = isNaN(data['quantity']) ? 0 : data['quantity'];
      salesItem['bonus'] = isNaN(data['bonus']) ? 0 : data['bonus'];
      salesItem['manufacturerDate'] = data['manufactureDt'];
      salesItem['expiryDate'] = data['expiryDt'];
      salesItem['purchasePrice'] = isNaN(data['unitPurchaseRate']) ? 0 : data['unitPurchaseRate'];
      salesItem['markupPercenage'] = 0;//isNaN(data['purchaseDiscountPercentage']) ? 0 : data['purchaseDiscountPercentage'];
      salesItem['mrp'] = (data['mrp'] != null && data['mrp'] != undefined && data['mrp'] != 0) ? data['mrp'].toFixed(2) : 0;
      salesItem['saleWithVAT'] = (data['mrp'] != null && data['mrp'] != undefined && data['mrp'] != 0) ? data['mrp'].toFixed(2) : 0;
      salesItem['salesPrice'] = (data['mrp'] != null && data['mrp'] != undefined && data['mrp'] != 0) ? data['mrp'].toFixed(2) : salesItem['unitSaleRate'].toFixed(2);
      salesItem['salesDiscount'] = isNaN(data['saleDiscountPercentage']) ? 0 : data['saleDiscountPercentage'];
      salesItem['marginPercentage'] = isNaN(data['marginPercentage']) ? 0 : data['marginPercentage'];
      salesItem['VAT'] = (data['vat'] == null || data['vat'] == undefined || data['vat'] == '') ? 0 : data['vat'];
      salesItem['tax'] = (data['taxCategoryModel'] == null || data['taxCategoryModel'] == undefined || data['taxCategoryModel'] == '') ? 0 : data['taxCategoryModel'];
      salesItem['itemtotalAmount'] = 0;
      this.salesItemModelsArray.push(salesItem);
      if (data['item']['scheduleCode']['scheduleCategoryCode'] == 'X') {
        this.narcoticDrugCount++;

        this.salesBillingForm.get('customerModel').markAsTouched();
        this.salesBillingForm.get('customerModel').setErrors(Validators.required)

      }
    })

    /* data.forEach(rowData => {

      rowData['totalAmount'] = rowData['quantity'] * rowData['unitRetailRate'];
    }) */
    this.itemGridOptions.api.updateRowData({
      add: this.salesItemModelsArray
    });

    //this.itemGridOptions.rowData.push(data);
    this.itemGridOptions.api.forEachNode(function (params) {

    });
    this.totalItemsCount = this.itemGridOptions.api.getDisplayedRowCount() - 1;
    this.totalBillCaliculation();
    this.balanceCalc();
    this.close();
  }

  close() {
    this.stockGridOptions.api.setRowData([]);
    document.getElementById('itemSearchModal').classList.remove("show");
    document.getElementById('itemSearchModal').style.display = "none";
    this.itemSearchKey = null;
    this.selectedSearchTerms = null;
    this.searchTerm = null;
    this.stockGridOptions.api.setRowData([]);
  }

  stopGridEdit(modifiedRowNode) {
    if (modifiedRowNode.oldValue != modifiedRowNode.newValue) {
      //this.postCellEditOperations(modifiedRowNode);

    }
  }

  checkSearchTermDisability() {
    if ((this.selectedSearchTerms != '' && this.selectedSearchTerms != null) && (this.itemSearchKey != '' && this.itemSearchKey != null)) {
      return false;
    }
    return true;
  }

  getInsurenceByPolicyCode(event) {

    this.salesService.getInsurenceDataByPolicyCode(event['target']['value']).subscribe(insurenceRes => {
      if (insurenceRes['responseStatus']['code'] == 200) {

        if (insurenceRes['result'] != null) {
          this.insuranceModel['customerInsuranceId'] = insurenceRes['result']['customerInsuranceId']
          this.insuranceModel['contributionPercentage'] = 100 - insurenceRes['result']['contributionPercentage'];
          this.insuranceModel['contactNumber'] = insurenceRes['result']['insuranceModel']['contactNumber'];
          this.insuranceModel['insurenceContributionPercentage'] = insurenceRes['result']['contributionPercentage'];
        }
      }
      this.totalBillCaliculation();
    });
  }

  getMembershipDataByMembershipCardNumber(event) {
    this.salesService.getMembershipDataByMembershipCardNumber(event['target']['value']).subscribe(membershipRes => {

      if (membershipRes['responseStatus']['code'] == 200) {
        if (membershipRes['result'] != null) {
          this.membershipModel['customerMembershipId'] = membershipRes['result']['customerMembershipId'];
          this.membershipModel['membershipDiscountPercentage'] = membershipRes['result']['membershipDiscountPercentage'];
          this.membershipModel['membershipEndDate'] = membershipRes['result']['membershipEndDate'];
        }
      }
      this.totalBillCaliculation();
    });
  }


  adjustItems(event) {
    if (event['target']['value'] != null && event['target']['value'] != undefined && event['target']['value'] != '' &&
      event['target']['value'] != 0) {
      let adjAmount = event['target']['value'];

      let total = 0;
      for (var i = 0; i < this.itemGridOptions.api['rowModel']['rowsToDisplay'].length; i++) {
        //if (i != 0) {
        total += Number(this.itemGridOptions.api['rowModel']['rowsToDisplay'][i]['data']['itemtotalAmount']);
        //}
      }
      console.log("total: ", total)
      for (let i = 0; i < this.itemGridOptions.api['rowModel']['rowsToDisplay'].length; i++) {
        //if (i != 0) {
        let itemTotal = Number(this.itemGridOptions.api['rowModel']['rowsToDisplay'][i]['data']['itemtotalAmount']);

        let itemPrice = Number(this.itemGridOptions.api['rowModel']['rowsToDisplay'][i]['data']['salesPrice']);

        let result = (((itemTotal / total) * adjAmount) / itemPrice);

        let items: Array<Object> = [];
        var j = 0;
        var rowNode = this.itemGridOptions.api.getRowNode(stringify(i));
        rowNode.setDataValue("quantity", Number(Math.round(result)));
        var newTotal = rowNode.data['quantity'] * rowNode.data['salesPrice'] * (1 - rowNode.data['salesDiscount'] / 100);
        rowNode.setDataValue("itemtotalAmount", Number(newTotal.toFixed(2)));
        this.itemGridOptions.api.refreshView();
        //}
      }
    }
  }

  total(params) {


    /* var vatPer = params.data.vat;

    var sPrice = params.data.unitRetailRate;
    var sDisc = params.data.saleDiscountPercentage;

    var pPrice = params.data.purchasePrice;
    var pDisc = params.data.purchaseDiscountPercentage;

    var qty = params.data.quantity;

    var totalAmount = sPrice * (1 - (((sDisc / 100) * sPrice) / 100 + ((pDisc / 100) * pPrice) / 100)) * qty;
    var vat = (vatPer / 100) * totalAmount; */

    var total = params.data.quantity * params.data.salesPrice * (1 - params.data.salesDiscount / 100);

    let tax = (params.data.tax != null && params.data.tax != undefined) ? params.data.tax['categoryValue'] : 0;
    var totalPluseVat = Number(Math.round(total * (1 + tax / 100) * 100) / 100).toFixed(2);

    //this.finalAmount += isNaN(Number(totalPluseVat)) ? 0 : Number(totalPluseVat);
    params.node.data['itemtotalAmount'] = totalPluseVat;
    /* var rowNode = params.api.getRowNode

    rowNode.setData(totalPluseVat); */
    this.totalBillCaliculation();
    return isNaN(Number(totalPluseVat)) ? 0 : totalPluseVat;
  }


  totalBillCaliculation() {
    let allItemsTotalWithVat = 0;
    let allItemsTotalWithoutVat = 0;
    let totalItems = 0;
    let totalVAT: number = 0;
    let totalDisc = 0;
    let totalMarginPercentage = 0;
    let totalQuantity = 0;

    try {
      this.itemGridOptions.api.forEachNode(function (node) {


        allItemsTotalWithVat += Number(isNaN(node.data['itemtotalAmount']) ? 0 : node.data['itemtotalAmount']);

        var quantity = Number(isNaN(node.data['quantity']) ? 0 : node.data['quantity']);
        totalQuantity += Number(quantity);
        var salesPrice = isNaN(node.data['salesPrice']) ? 0 : node.data['salesPrice'];
        totalDisc += Number(isNaN(node.data['salesDiscount']) ? 0 : node.data['salesDiscount']);
        allItemsTotalWithoutVat += quantity * salesPrice;
        var VAT: number = Number(isNaN(node.data['tax']['categoryValue']) ? 0 : node.data['tax']['categoryValue']);
        totalVAT = totalVAT + (isNaN(VAT) ? 0 : VAT);
        totalMarginPercentage += Number(isNaN(node.data['marginPercentage']) ? 0 : node.data['marginPercentage']);
        if (node['quantity'] != null && node['quantity'] != undefined || node['quantity'] != 0) {
          totalItems++;
        }

      });
    }
    catch (error) {
      this.itemGridOptions.rowData.forEach(function (node) {


        allItemsTotalWithVat += Number(isNaN(node['itemtotalAmount']) ? 0 : node['itemtotalAmount']);

        var quantity = Number(isNaN(node['quantity']) ? 0 : node['quantity']);
        totalQuantity += Number(quantity);
        var salesPrice = isNaN(node['salesPrice']) ? 0 : node['salesPrice'];
        totalDisc += Number(isNaN(node['salesDiscount']) ? 0 : node['salesDiscount']);
        allItemsTotalWithoutVat += quantity * salesPrice;
        let tax = (node.tax != null && node.tax != undefined) ? node.tax['categoryValue'] : 0;
        var VAT: number = tax;//Number(isNaN(node['tax']['categoryValue']) ? 0 : node['tax']['categoryValue']);
        totalVAT = totalVAT + (isNaN(VAT) ? 0 : VAT);

        totalMarginPercentage += Number(isNaN(node['marginPercentage']) ? 0 : node['marginPercentage']);
        if (node['itemCode'] != "") {
          totalItems++;
        }

      });
    }

    totalDisc /= Number(this.totalItemsCount);
    totalMarginPercentage /= Number(this.totalItemsCount);

    this.salesBillingForm.get('totalQty').setValue(totalQuantity);
    this.salesBillingForm.get('effectiveMargin').setValue(totalMarginPercentage);
    this.totalVAT = isNaN(totalVAT / (Number(this.totalItemsCount))) ? 0 : (totalVAT / (Number(this.totalItemsCount)));
    totalVAT /= this.totalItemsCount;


    if (this.insurenceCheckbox && this.membershipCheckbox) {

      var insurenceContributionPercentage = isNaN(this.insuranceModel['insurenceContributionPercentage']) ? 0 : this.insuranceModel['insurenceContributionPercentage'];

      totalDisc += insurenceContributionPercentage;
      allItemsTotalWithoutVat -= (insurenceContributionPercentage / 100) * allItemsTotalWithoutVat;


      var membershipDiscountPercentage = isNaN(this.membershipModel['membershipDiscountPercentage']) ? 0 : this.membershipModel['membershipDiscountPercentage'];

      allItemsTotalWithoutVat -= (membershipDiscountPercentage / 100) * allItemsTotalWithoutVat;
      totalDisc += membershipDiscountPercentage;
      allItemsTotalWithVat = allItemsTotalWithoutVat * (1 + totalVAT / 100);
    }
    else if (this.insurenceCheckbox) {
      var insurenceContributionPercentage = isNaN(this.insuranceModel['insurenceContributionPercentage']) ? 0 : this.insuranceModel['insurenceContributionPercentage'];

      totalDisc += insurenceContributionPercentage;
      allItemsTotalWithoutVat -= (insurenceContributionPercentage / 100) * allItemsTotalWithoutVat;
      allItemsTotalWithVat = allItemsTotalWithoutVat * (1 + totalVAT / 100);
    }
    else if (this.membershipCheckbox) {
      var membershipDiscountPercentage = isNaN(this.membershipModel['membershipDiscountPercentage']) ? 0 : this.membershipModel['membershipDiscountPercentage'];

      totalDisc += membershipDiscountPercentage;
      allItemsTotalWithoutVat -= (membershipDiscountPercentage / 100) * allItemsTotalWithoutVat;
      allItemsTotalWithVat = allItemsTotalWithoutVat * (1 + totalVAT / 100);
    }

    this.totalVATAmount = Number(Math.round(((isNaN(totalVAT) ? 0 : totalVAT / 100) * allItemsTotalWithoutVat) * 100) / 100).toFixed(2);
    this.totalQty = totalQuantity;
    this.finalAmount = Number(Math.round(allItemsTotalWithVat)).toFixed(2);
    this.totalDiscPercentageAmount = Number(Math.round((isNaN(totalDisc) ? 0 : (totalDisc / 100) * allItemsTotalWithoutVat) * 100) / 100).toFixed(2);
    this.totalDiscPercentage = isNaN(totalDisc) ? 0 : totalDisc;

    this.netAmount = Number(Math.round(allItemsTotalWithVat * 100) / 100).toFixed(2);
    if (this.roundOff != null && this.roundOff != undefined && this.roundOff != 0) {
      this.netAmount += this.roundOff;
    }
    this.originalFinalAmount = this.netAmount;
    this.totalAmountsCalic();

    this.balanceCalc();
    /* if (this.itemGridOptions.api.getDisplayedRowCount() != null) {
      this.totalItemsCount = this.itemGridOptions.api.getDisplayedRowCount() - 1;
    } */
  }

  totalAmountsCalic() {
    //value
    var qty = 0;

    //value
    var salesPrice = 0;

    //value
    var membershipDiscPer = 0;

    //value
    var salesDiscPer = 0;

    //salesDiscPer + membershipDiscPer
    var totalDiscPer = 0;

    //value
    var VATPer = 0;

    // qty*salesPrice
    var totalWithoutVATWithoutDisc = 0;

    //totalWithoutVATWithoutDisc*(1-totalDiscPer/100)
    var totalWithDiscWithoutVAT = 0

    //totalWithoutVATWithoutDisc*(1+VATPer/100)
    var totalAmountWithVAT = 0;

    //totalWithoutVATWithoutDisc*totalDiscPer/100
    var discAmount = 0;

    //totalWithDiscWithoutVAT*VATPer/100
    var VATamount = 0;

    //totalAmountWithVAT-discAmount
    var netAmount = 0;

    //totalAmountWithVAT-amountPaid
    var balance = 0;

    var allItemsNetAmount = 0;
    var allItemsTotalAmountWithVAT = 0;
    var allItemsTotalVATPer = 0;
    var allItemsVATamount = 0;
    var allItemsTotalDiscPer = 0;
    var allItemsDiscAmount = 0;

    this.totalItemsCount = 0;
    this.totalDiscPercentage = 0
    this.totalVAT = 0;
    var gridData: any[] = [];

    this.itemGridOptions.api.forEachNode(function (node) {
      gridData.push(node.data);
    });


    for (var i = 0; i < gridData.length; i++) {
      if (gridData[i]['itemCode'] != "") {
        this.totalItemsCount++;


        qty = Number(gridData[i]['quantity']);


        salesPrice = Number(gridData[i]['salesPrice']);


        VATPer = Number(gridData[i]['tax']['categoryValue']);


        if (this.membershipModel['membershipDiscountPercentage'] != '') {
          membershipDiscPer = Number(this.membershipModel['membershipDiscountPercentage']);
        }

        salesDiscPer = Number(gridData[i]['salesDiscount']);


        totalDiscPer = salesDiscPer + membershipDiscPer;


        totalWithoutVATWithoutDisc = qty * salesPrice;


        totalWithDiscWithoutVAT = totalWithoutVATWithoutDisc * (1 - totalDiscPer / 100);


        //totalAmountWithVAT = totalWithDiscWithoutVAT * (1 + VATPer / 100);


        discAmount = totalWithoutVATWithoutDisc * totalDiscPer / 100;


        VATamount = totalWithDiscWithoutVAT * VATPer / 100;

        //netAmount = totalAmountWithVAT - discAmount;
        netAmount = totalWithoutVATWithoutDisc + VATamount - discAmount;
        totalAmountWithVAT = netAmount + discAmount;


        allItemsTotalVATPer += VATPer;
        allItemsVATamount += VATamount;
        allItemsTotalDiscPer += totalDiscPer;
        allItemsDiscAmount += discAmount;
        allItemsNetAmount += netAmount;
        //allItemsNetAmount += (qty * salesPrice) * (1 - totalDiscPer / 100) * (1 + VATPer / 100);
        allItemsTotalAmountWithVAT += totalAmountWithVAT;
        //allItemsTotalAmountWithVAT += (qty * salesPrice) * (1 + VATPer / 100);
      }
    }


    this.totalDiscPercentage = allItemsTotalDiscPer;
    this.totalVAT = allItemsTotalVATPer;
    this.totalDiscPercentageAmount = allItemsDiscAmount.toFixed(2);
    this.totalVATAmount = allItemsVATamount.toFixed(2);
    this.finalAmount = allItemsTotalAmountWithVAT.toFixed(2);
    this.netAmount = Math.round(allItemsNetAmount).toFixed(2);
    this.balance = this.netAmount;
    this.originalFinalAmount = this.netAmount;
  }

  balanceCalc() {



    var bal = Number((this.netAmount - this.paidAmount).toFixed(2));
    if (this.roundOff != null || this.roundOff != undefined || this.roundOff != 0) {

      this.balance = isNaN(bal) ? 0 : bal;
    }
    else {
      this.balance = Number(Math.round(this.netAmount - this.paidAmount * 100) / 100).toFixed(2);
    }

    if (this.selectedPaymentStatus['name'] == 'Cancel') {

      this.selectedPaymentStatus['name'] = 'Cancel';




    }
    else if (this.balance < 0) {

      this.selectedPaymentStatus = { name: "Over Paid" };
    }
    else if (this.balance == 0 && this.paidAmount > 0) {
      this.selectedPaymentStatus = { name: 'Paid' }


    }
    else if (this.balance > 0 && this.paidAmount == 0) {
      this.selectedPaymentStatus = { name: 'Pending' }
    }

    else if (this.paidAmount > 0 && this.balance > 0) {
      this.selectedPaymentStatus = { name: 'Partially Paid' }

    }

    if (this.balance < 0) {

      this.selectedPaymentStatus = { name: "Over Paid" };
    }
    else if (this.balance == 0 && this.paidAmount > 0) {

      //this.paymentStatusArray = [{ name: "Paid", disabled: false }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }, { name: "Cancel" }];
      this.paymentStatusArray[0]['disabled'] = false;
      //this.salesBillingForm.get('creditAmount').setValue(0);
      //this.salesBillingForm.get('creditDays').setValue(0);

    }
    else {

      // this.paymentStatusArray = [{ name: "Paid", disabled: true }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }];
      this.paymentStatusArray[0]['disabled'] = true;
    }

  }

  paidCalc() {

    this.salesBillingForm.get('cashAmount').setValue(isNaN(this.paidAmount) ? 0 : this.paidAmount);
    this.balanceCalc();
  }

  roundOffCalc(event) {
    var roundOff = event['target']['value'];

    if (roundOff != null && roundOff != undefined && roundOff != 0) {
      this.netAmount = Number(this.netAmount) + Number(event['target']['value']);

      this.balanceCalc();
    }
    else {

      this.netAmount = this.originalFinalAmount;
      this.balanceCalc();
    }

  }

  onCellKeyDown(e) {

    let keyPressed = e.event.key;

    if (keyPressed === "Delete") {
      //var rowNode = e.node;
      //var newSelection = !rowNode.selected;

      //rowNode.setSelected(newSelection);

      var selectedData = this.itemGridOptions.api.getSelectedRows();

      var res = this.itemGridOptions.api.updateRowData({ remove: selectedData });
      this.printResult(res);
    }
  }
  printResult(res) {

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

  /* Sales History Screen Coding */

  getAllSales() {
    this.salesService.getAllSales().subscribe(salesRes => {
      if (salesRes['responseStatus']['code'] == 200) {

        try {
          this.saleEditGridOptions.api.setRowData(salesRes['result']);
        }
        catch (error) {

        }

        //this.saleEditGridOptions.api.updateRowData({ add: salesRes['result'] })
      }
    });
  }

  salesHistoryRowCount = 0;
  salesHistoryPageNumber = 0;
  salesHistoryDatasource = {
    getRows: (params: IGetRowsParams) => {

      if (this.paymentStatus == '') {
        this.paymentStatus = undefined;
      }
      if (this.searchCode == '') {
        this.searchCode = undefined;
      }
      if (this.searchCodeValue == '') {
        this.searchCodeValue = undefined;
      }
      if (this.startDate == '') {
        this.startDate = undefined;
      }
      if (this.endDate == '') {
        this.endDate = undefined;
      }

      this.spinnerService.show();
      this.salesService.getSalesHistoryBySearch(this.paymentStatus, this.searchCode, this.searchCodeValue, this.startDate,
        this.endDate, this.salesHistoryPageNumber, 50).subscribe(data => {
          try {
            params.successCallback(data['result'], this.salesHistoryRowCount)
          }
          catch (error) {
            this.spinnerService.hide();
            this.toasterService.error('Please Provide Search Criteria', 'Error Occurred', {
              timeOut: 5000
            });
          }
          this.spinnerService.hide();
          if (data['responseStatus']['code'] === 200) {
            if (data['result'] != null) {
              if (data['result']['length'] > 0) {

                this.salesHistoryPageNumber++;
              }
              else {
                this.saleEditGridOptions.api.setRowData([]);
                this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                });
              }
            }
          }
        }, error => {
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        });
    }

  }


  checkSearch() {
    if (
      (this.startDate == '' || this.endDate == '') &&
      (this.paymentStatus == null && this.paymentStatus == undefined) &&
      (this.searchCode == undefined || (this.searchCodeValue == undefined || this.searchCodeValue == '' || this.searchCodeValue == null))
    ) {
      return true;
    }
    else {
      return false;
    }

  }

  getSalesBySearch() {
    let formData = new FormData();

    if (this.paymentStatus == '') {
      this.paymentStatus = undefined;
    }
    if (this.searchCode == '') {
      this.searchCode = undefined;
    }
    if (this.searchCodeValue == '') {
      this.searchCodeValue = undefined;
    }
    if (this.startDate == '') {
      this.startDate = undefined;
    }
    if (this.endDate == '') {
      this.endDate = undefined;
    }

    if (this.searchCodeValue != null && this.searchCode != undefined) {
      this.paymentStatus = undefined;
      this.startDate = undefined;
      this.endDate = undefined;
    }

    /* formData.append("status", this.paymentStatus);
    formData.append("code", this.searchCode);
    formData.append("codeValue", this.searchCodeValue);
    formData.append("startDate", this.startDate);
    formData.append("endDate", this.endDate); */
    //this.saleEditGridOptions.api.getSelectedRows();
    /* this.salesService.getSalesBySearchkeys(formData).subscribe(salesRes => {
      if (salesRes['responseStatus']['code'] == 200) {

        this.saleEditGridOptions.api.setRowData(salesRes['result']);
        //this.saleEditGridOptions.api.updateRowData({ add: salesRes['result'] })
      }
    }); */
    this.salesHistoryPageNumber = 0;
    this.salesService.getSalesHistoryBySearchCoun(this.paymentStatus, this.searchCode, this.searchCodeValue, this.startDate,
      this.endDate).subscribe(salesHistoryCount => {
        if (salesHistoryCount['responseStatus']['code'] == 200) {
          this.salesHistoryRowCount = salesHistoryCount['result'];

          //if (this.salesHistoryRowCount > 0) {
          this.saleEditGridOptions.api.setDatasource(this.salesHistoryDatasource);
          //}
          /* else {
            this.saleEditGridOptions.api.setRowData([]);
            this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
              timeOut: 3000
            });
          } */

        }

      }, error => {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      });

  }

  getSelectedSalesRecord() {
    this.resetEdits();
    this.editScreen = true;
    this.addRowButton = true;
    let selectedStockRow = this.saleEditGridOptions.api.getSelectedRows()[0];
    /* try {
      selectedStockRow['billDate'] = this.datePipe.transform(selectedStockRow['billDate'], "'yyyy-MM-dd");
    }
    catch (error) {
      // selectedStockRow['billDate'] = selectedStockRow['billDate'];
    } */


    this.editedSalesRecord = selectedStockRow;

    this.selectedSalesRecord = selectedStockRow;

    this.selectedPaymentStatus = { name: this.selectedSalesRecord['paymentStatus'] };
    if (this.selectedPaymentStatus['name'] == 'Paid') {
      this.paymentStatusArray = [{ name: "Paid", disabled: false }, { name: "Cancel" }];
    }
    else {
      this.paymentStatusArray = [{ name: "Paid", disabled: true }, { name: "Partially Paid" }, { name: "Pending" }, { name: "Dummy Bill" }, { name: "Cancel" }, { name: "Over Paid" }];
    }

    if (this.selectedPaymentStatus['name'] == 'Paid' || this.selectedPaymentStatus['name'] == 'Cancel') {
      this.salesBillingForm.get('cashAmount').disable();
      this.salesBillingForm.get('creditAmount').disable();
      this.salesBillingForm.get('creditDays').disable();
      this.salesBillingForm.get('creditCardAmount').disable();
      this.salesBillingForm.get('creditCardNo').disable();
      this.salesBillingForm.get('creditCardAuthNo').disable();
      this.salesBillingForm.get('upiAmount').disable();
      this.salesBillingForm.get('upiPhoneNo').disable();
      this.salesBillingForm.get('upiTransactionId').disable();
      this.salesBillingForm.get('chequeAmount').disable();
      this.salesBillingForm.get('chequeNumber').disable();
      this.salesBillingForm.get('chequeDate').disable();
      this.salesBillingForm.get('customerModel').disable();
      this.salesBillingForm.get('previousBillCode').disable();
      this.salesBillingForm.get('hospitalModel').disable();
      this.salesBillingForm.get('providerModel').disable();

      this.prescriptionForm.get('prescriptionDate').disable();
    }
    else {
      this.salesBillingForm.get('cashAmount').enable();
      this.salesBillingForm.get('creditAmount').enable();
      this.salesBillingForm.get('creditDays').enable();
      this.salesBillingForm.get('creditCardAmount').enable();
      this.salesBillingForm.get('creditCardNo').enable();
      this.salesBillingForm.get('creditCardAuthNo').enable();
      this.salesBillingForm.get('upiAmount').enable();
      this.salesBillingForm.get('upiPhoneNo').enable();
      this.salesBillingForm.get('upiTransactionId').enable();
      this.salesBillingForm.get('chequeAmount').enable();
      this.salesBillingForm.get('chequeNumber').enable();
      this.salesBillingForm.get('chequeDate').enable();
      this.salesBillingForm.get('customerModel').enable();
      this.salesBillingForm.get('previousBillCode').enable();
      this.salesBillingForm.get('hospitalModel').enable();
      this.salesBillingForm.get('providerModel').enable();
      this.prescriptionForm.get('prescriptionDate').enable();
    }

    this.billNumber = selectedStockRow['billCode']
    try {
      this.salesBillingForm.get('billDate').setValue(this.datePipe.transform(selectedStockRow['billDate'], 'yyyy-MM-dd'));
    }
    catch (error) {
      this.salesBillingForm.get('billDate').setValue(new Date(selectedStockRow['billDate']));
    }

    if (selectedStockRow['cashAmount'] != null) {
      //$("#cash").prop("checked", true);
      // alert('in cash')
      //document.getElementById('cash')['checked'] = true
      this.cashCheckbox = true;
      this.salesBillingForm.get('cashAmount').setValue(selectedStockRow['cashAmount']);
    }
    if (selectedStockRow['creditDays'] != null) {
      // $("#credit").prop("checked", true);
      this.creditCheckbox = true;
      this.salesBillingForm.get('creditDays').setValue(selectedStockRow['creditDays']);
      this.salesBillingForm.get('creditAmount').setValue(selectedStockRow['creditAmount']);

    }
    if (selectedStockRow['upiPhoneNo'] != null) {
      //$("#m-pesa").prop("checked", true);
      this.mPesaCheckbox = true;
      this.salesBillingForm.get('upiPhoneNo').setValue(selectedStockRow['upiPhoneNo']);
      this.salesBillingForm.get('upiAmount').setValue(selectedStockRow['upiAmount']);
      this.salesBillingForm.get('upiTransactionId').setValue(selectedStockRow['upiTransactionId']);
    }
    if (selectedStockRow['creditCardAmount'] != null) {
      //$("#card").prop("checked", true);
      this.card = true;
      this.salesBillingForm.get('creditCardAmount').setValue(selectedStockRow['creditCardAmount']);
      this.salesBillingForm.get('creditCardNo').setValue(selectedStockRow['creditCardNo']);
      this.salesBillingForm.get('creditCardAuthNo').setValue(selectedStockRow['creditCardAuthNo']);
    }
    if (selectedStockRow['chequeNumber'] != null) {
      //$("#cheque").prop("checked", true);
      this.cheque = true;
      this.salesBillingForm.get('chequeNumber').setValue(selectedStockRow['chequeNumber']);
      this.salesBillingForm.get('chequeAmount').setValue(selectedStockRow['chequeAmount']);
      this.salesBillingForm.get('chequeDate').setValue(selectedStockRow['chequeDate']);
    }
    selectedStockRow['customerModel']['customerName'] = selectedStockRow['customerNm'];
    this.selectedCustomer = selectedStockRow['customerModel']
    this.customerPhoneNumber = selectedStockRow['customerModel'] != null ? selectedStockRow['customerModel']['phoneNumber'] : undefined
    this.selectedDoctor = selectedStockRow['providerModel']
    this.speciality = this.selectedDoctor == null ? undefined : this.selectedDoctor['speciality'];
    this.selectedHospital = selectedStockRow['hospitalModel']
    this.selectedPrevBillNo = selectedStockRow['previousBillCode'] ? selectedStockRow['previousBillCode'] : null
    this.balance = selectedStockRow['balanceAmount'];
    this.paidAmount = selectedStockRow['paidAmount'];
    this.salesBillingForm.get('remarks').setValue(selectedStockRow['remarks']);

    /*  let paymentStatusArrayCancelValueCheck = this.paymentStatusArray.find(data => data['name'] == "Cancel")

     if (paymentStatusArrayCancelValueCheck == null || paymentStatusArrayCancelValueCheck == undefined) {

       this.paymentStatusArray.push({ name: "Cancel" })

     } */
    //this.selectedPaymentStatus = selectedStockRow['paymentStatus'];

    this.salesService.getSalesIemsByStockId({ billId: selectedStockRow['billId'] }).subscribe(res => {
      this.selectedSalesItemRecords = res['result'];
      this.tab = 'sales'
      this.salesItemModelsArray = []//: any = [{ 'itemCode': '' }];
      //this.salesItemModelsArray.push({ 'itemCode': '' });
      this.selectedSalesItemRecords = res['result'];
      this.totalItemsCount = this.selectedSalesItemRecords.length;
      res['result'].forEach(data => {
        let salesItem = new SalesModel();
        salesItem['salesItemsId'] = data['salesItemsId'];
        salesItem['stockId'] = data['stockId'];
        salesItem['itemCode'] = data['itemsModel'];
        salesItem['previousBillCode'] = data['previousBillCode'] ? data['previousBillCode'] : null;
        salesItem['itemName'] = data['itemsModel'];
        salesItem['batchNo'] = data['batchNo'];
        salesItem['formulation'] = data['itemsModel'];
        salesItem['rackNo'] = data['rack'];
        salesItem['pack'] = data['itemsModel'];
        salesItem['storage'] = data['itemsModel'];
        salesItem['supplier'] = data['stockId']['supplier'];
        salesItem['quantity'] = isNaN(data['saleQty']) ? 0 : data['saleQty'];
        salesItem['bonus'] = isNaN(data['qtyFree']) ? 0 : data['qtyFree'];
        salesItem['manufacturerDate'] = data['manufactureDt'];
        salesItem['expiryDate'] = data['expiryDt'];
        salesItem['purchasePrice'] = isNaN(data['unitPurchasePrice']) ? 0 : data['unitPurchasePrice'];
        salesItem['markupPercenage'] = isNaN(data['purchaseDiscountPercentage']) ? 0 : data['purchaseDiscountPercentage'];
        salesItem['mrp'] = isNaN(data['mrp']) ? 0 : data['mrp'];
        salesItem['salesPrice'] = isNaN(data['unitSalePrice']) ? 0 : data['unitSalePrice'];
        salesItem['saleWithVAT'] = data['saleWithVAT'] ? data['saleWithVAT'] : 0;
        salesItem['salesDiscount'] = (data['discountPercentage'] != null && data['discountPercentage'] != undefined) ? data['discountPercentage'] : 0;
        salesItem['marginPercentage'] = isNaN(data['discountPercentage']) ? 0 : data['discountPercentage'];
        salesItem['VAT'] = (data['vat'] == null || data['vat'] == undefined || data['vat'] == '') ? 0 : data['vat'];
        salesItem['tax'] = (data['taxCategoryModel'] == null || data['taxCategoryModel'] == undefined || data['taxCategoryModel'] == '') ? 0 : data['taxCategoryModel'];
        salesItem['itemtotalAmount'] = data['saleAmount'];
        salesItem['remarks'] = data['remarks'];


        this.salesItemModelsArray.push(salesItem);
        if (data['itemsModel']['scheduleCode']['scheduleCategoryCode'] == 'X') {
          this.narcoticDrugCount++;
          this.salesBillingForm.get('customerModel').markAsTouched();
          this.salesBillingForm.get('customerModel').setErrors(Validators.required)

        }
      })

      this.itemGridOptions.rowData = this.salesItemModelsArray;
      this.itemGridOptions.api.setRowData([]);
      this.itemGridOptions.api.updateRowData({ add: this.salesItemModelsArray });

      try {
        //this.itemGridOptions.rowData = salesItemModelsArray;
        //this.gridApi.setRowData(salesItemModelsArray);
        /* let res = this.itemGridOptions.api.updateRowData({
          add: this.salesItemModelsArray
        }); */
        //this.printResult(res);
        //this.itemGridOptions.api.updateRowData({ add: salesItemModelsArray })
      }
      catch (error) {

      }




      /* this.itemGridOptions.api.updateRowData({
        add: salesItemModelsArray
      }); */


      this.totalItemsCount = this.itemGridOptions.rowData.length;
      this.totalBillCaliculation();
      this.editScreen = true;
    },
      error => {
        this.toasterService.error('There Are No Items With This Sale', 'Error Occurred', {
          timeOut: 3000
        });
      });
  }
  private gridApi;
  private rowData = [];
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    if (!this.editScreen) {
      this.itemGridOptions.api.setRowData([]);
      this.itemGridOptions.api.setPinnedTopRowData([{ 'itemCode': '' }]);
    }

  }
  addSearchRowToEditScreen() {
    //this.itemGridOptions.rowData.splice(0, 0, { 'itemCode': '' })
    this.itemGridOptions.api.updateRowData({ add: [{ 'itemCode': '' }] })

    //this.editScreen = !this.editScreen;
    this.addRowButton = false;
  }

  searchCustomer(searchKey) {

    if (searchKey['term'] != "") {
      this.salesService.getCustomerByName(searchKey['term']).subscribe(customerSearchRes => {
        if (customerSearchRes['responseStatus']['code'] == 200) {

          this.customersArray = customerSearchRes['result'];
        }
      });
    }
    else {
      this.getCustomersData();

    }

  }

  searchHospital(searchKey) {

    if (searchKey['term'] != "") {
      this.salesService.getHospitalByName(searchKey['term']).subscribe(hospitalSearchRes => {
        if (hospitalSearchRes['responseStatus']['code'] == 200) {
          this.customersArray = hospitalSearchRes['result']

        }
      });
    }
    else {

      this.getHospitalsData();
    }

  }

  searchProviders(searchKey) {
    if (searchKey['term'] != "") {
      this.salesService.getProviderByName(searchKey['term']).subscribe(providerSearchRes => {
        if (providerSearchRes['responseStatus']['code'] == 200) {
          this.customersArray = providerSearchRes['result'];
        }
      });
    }
    else {

      this.getDoctorsData();

    }

  }
  url;
  self = this;
  isImageLoading = false;
  getPresciption() {
    if ((this.prescriptionForm.get('prescriptionDate').value != null && this.prescriptionForm.get('prescriptionDate').value != undefined) &&
      (this.selectedCustomer != null && this.selectedCustomer != undefined)) {
      const formData = new FormData();
      formData.append('customer', JSON.stringify(this.selectedCustomer['customerId']));
      formData.append('date', this.prescriptionForm.get('prescriptionDate').value);
      this.salesService.getPrescription(formData).subscribe(res => {

        if (res['responseStatus']['code'] == 200) {

          this.url = res['result']['prescriptionImage']
          /*
          const TYPED_ARRAY = new Uint8Array([res['result']['prescriptionImage']]);

          // converts the typed array to string of characters
          const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);

          //converts string of characters to base64String
          let base64String = btoa(STRING_CHAR);

          //sanitize the url that is passed as a value to image src attrtibute
          this.url = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + base64String); */
        };
        this.isImageLoading = true;


      })
    }

  }

  saveGenerateBill() {
    this.generateBill = true;

    var billNo = this.billNumber;

    if (this.generateBill && this.editScreen && this.editedSalesRecord['paidAmount'] == this.paidAmount) {
      this.editScreen = true

      let uri = { "ReportCode": 'SALES_RECEIPT', "BILL_CODE": billNo };

      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.salesService.downloadPdfFile(reportURI).subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'SALES REPORT BY BILLID-' + billNo + '.pdf';
        link.click();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
        this.resetSave();
      })
    }
    else {
      this.onSubmit();
    }
  }

  editScreenDisableCheck() {
    if (this.editScreen && this.selectedPaymentStatus['name'] == 'Paid') {

    }
  }

  paymentTypeCalc() {

    let cashAmount = this.salesBillingForm.get('cashAmount').value ? Number(this.salesBillingForm.get('cashAmount').value) : 0;
    let creditAmount = this.salesBillingForm.get('creditCardAmount').value ? Number(this.salesBillingForm.get('creditCardAmount').value) : 0;
    let upiAmount = this.salesBillingForm.get('upiAmount').value ? Number(this.salesBillingForm.get('upiAmount').value) : 0;

    let chequeAmount = this.salesBillingForm.get('chequeAmount').value ? Number(this.salesBillingForm.get('chequeAmount').value) : 0;
    this.paidAmount = cashAmount + creditAmount + upiAmount + chequeAmount;

    if (this.salesBillingForm.get('creditAmount').value > 0) {

      if (this.paidAmount >= this.netAmount) {
        this.toasterService.warning("Please correct credit amount", "Wrong Amount", { timeOut: 3000 })
      }
    }
    this.balanceCalc();
  }
  clearSearchCode() {
    this.searchCodeValue = undefined
  }

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.billDate != null && params.data.billDate != undefined) {

        try {
          params.data.billDate = this.datePipe.transform(params.data.billDate, "dd-MM-yyyy");
        }
        catch (error) {

        }


        return params.data.billDate;
      }
    }

  }

}

