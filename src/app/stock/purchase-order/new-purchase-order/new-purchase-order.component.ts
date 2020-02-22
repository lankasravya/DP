import { NumericEditor } from 'src/app/core/numeric-editor.component';
import {
  Component,
  OnInit
} from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef, ICellRendererParams, GridApi, RowNode } from 'ag-grid-community';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { AddPurchaseorderService } from '../../purchase-order/add-purchaseorder.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import { formatDate } from '@angular/common';
import { AddpurchaseorderinvoiceService } from './../../purchase-invoice/addpurchaseorderinvoice.service';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'app-new-purchase-order',
  templateUrl: './new-purchase-order.component.html',
  styleUrls: ['./new-purchase-order.component.scss'],
  providers: [SupplierQuotationsService, AddPurchaseorderService, AddpurchaseorderinvoiceService]
})
export class NewPurchaseOrderComponent implements OnInit {

  purchaseOrderInformationForm: FormGroup;

  purchaseOrderInformationFormValidations = {
    purchaseOrderNo: new FormControl('', [Validators.required]),
    medicalOrNonMedical: new FormControl('M', [Validators.required]),
    emergency: new FormControl('', [Validators.required]),
    cash: new FormControl('', [Validators.required]),
    purchaseOrderDate: new FormControl('', [Validators.required]),
    deliveryTime: new FormControl('14', [Validators.required]),
    deliveryDate: new FormControl('', [Validators.required]),
    quotationDate: new FormControl('', [Validators.required]),
    shippingAddress: new FormControl("DOCPHARMA LIMITED Doctors' Park, 3rd Parklands Ave.,Nairobi-62934-619 PIN No: P051645464Q Mob: +254735929000 / 702929000", Validators.required),
    paymentTime: new FormControl('', Validators.required),
    advance: new FormControl('', Validators.required),
    balance: new FormControl('', Validators.required),
    otherCharges: new FormControl('', Validators.required),
    discPercentage: new FormControl('', Validators.required),
    discount: new FormControl('', Validators.required),
    poValue: new FormControl('', Validators.required),
    poTerm: new FormControl('', Validators.required),
    remarks: new FormControl('', Validators.required),
    totalAmount: new FormControl('', Validators.required),
    taxAmt: new FormControl(),
    poDesc: new FormControl(),
    status: new FormControl('Y')
  };

  itemParameter = { name: 'Item Name', value: 'itemName' };
  searchPerameter = [{ name: 'Item Code', value: 'itemCode' },
  { name: 'Item Name', value: 'itemName' },
  { name: 'Description', value: 'description' },
  { name: 'Generic Name', value: 'genericName' },
  { name: 'Batch Number', value: 'batchNumber' },]
  purchaseOrderGridOptions: GridOptions;

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

    },
    {
      headerName: 'Item Code',
      field: 'itemCode',
      sortable: true,
      resizable: true,
      filter: true,

    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      cellRenderer: this.tooltipRenderer,
    },
    {
      headerName: 'Formulation',
      field: 'formulation',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Manufacturer',
      field: 'manufacturerName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true
    },
    {
      headerName: 'P.Price',
      field: 'unitRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true
    },
    {
      headerName: 'P.disc%',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true
    },
    {
      headerName: 'Alternate Medicine',
      field: 'alternate',
      sortable: true,
      resizable: true,
      filter: true
    },
  ];

  /**
   * Item Grid Changes
   * End
   */

  columnDefs = [
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
    {
      headerName: 'Item Code',
      field: 'itemCode',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      sortable: true,
      resizable: true,
      filter: true,
      width: 400,
      cellRenderer: this.tooltipRenderer,
    },
    {
      headerName: 'Form',
      field: 'formulation',
      sortable: true,
      resizable: true,
      filter: true,
      width: 80
    },
    {
      headerName: 'Supplier',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'Mfg',
      field: 'manufacturerName',
      sortable: true,
      resizable: true,
      filter: true,
      hide: false,
      width: 80,
      valueGetter: this.modifyMfgName.bind(this)
    },
    {
      headerName: 'Qty',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      width: 80,
      cellEditorFramework: NumericEditor,
    },
    {
      headerName: 'Bonus Qty',
      field: 'bonus',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      hide:true,
      singleClickEdit: true,
      width: 90,
      cellEditorFramework: NumericEditor,
    },
    {
      headerName: 'Pack',
      field: 'pack',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      width: 80,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        if (params.data.pack == undefined || params.data.pack == null) {
          if (params.data.itemName) {
            var pack = params.data.itemsModel ? params.data.itemsModel.pack != null && params.data.itemsModel.pack != undefined ? params.data.itemsModel.pack : null : null;
            params.data.pack = pack;
          }
        }

        return params.data.pack;
      }
    },
    {
      headerName: 'Pack P.Price',
      field: 'packRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      width: 120,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        let uRate = params.data.packRate / params.data.pack
        params.data.unitRate = Math.round(uRate).toFixed(2);

        return isNaN(params.data.packRate) ? 0 : params.data.packRate;
      }

    },
    {
      headerName: 'Unit P.Price',
      field: 'unitRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      width: 120,
      hide: true,
      cellEditorFramework: NumericEditor
    },
    {
      headerName: 'P.disc%',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      width: 100,
      singleClickEdit: true,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;
        var ppRate = isNaN(params.data.packRate) ? 0 : params.data.packRate;
        var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
        params.data.discount = (Math.round(qty * ppRate * (pDisc / 100))).toFixed(2);
        return params.data.discountPercentage;
      }
    },
    {
      headerName: 'P.disc Amt',
      field: 'discount',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      cellEditorFramework: NumericEditor,
      width: 130,
      hide: true
      /*    valueGetter: function (params) {
           var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;
           var ppRate = isNaN(params.data.packRate) ? 0 : params.data.packRate;
           var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
           params.data.discount = Math.round(qty * ppRate * (pDisc / 100));
           return params.data.discount;
         } */
    },
    {
      headerName: 'Tax',
      field: 'tax',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      pinned:"right",
      width: 80,
      cellEditor: "agSelectCellEditor",
      singleClickEdit: false,

      valueGetter: function (params) {

        if (params.data.itemName) {
          var tax = params.data.itemsModel ? params.data.itemsModel.tax != null && params.data.itemsModel.tax != undefined ? params.data.itemsModel.tax.categoryCode : null : null;
          params.data.tax = tax;
        }



        return params.data.tax;
      }
    },
    {
      headerName: 'Net Amount',
      field: 'netAmount',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      pinned:"right",
      width: 120,
      cellEditorFramework: NumericEditor,
      valueGetter: this.netAmountCalc.bind(this)
    }
  ];

  netAmountCalc(params) {
    var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;

    var packPrice = isNaN(params.data.packRate) ? 0 : params.data.packRate;

    var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;

    var tax = params.data.tax == 'A' ? 16 : 0;


    params.data.netAmount = Number(((qty * packPrice * (1 - pDisc / 100) * (1 + tax / 100)) * 100) / 100).toFixed(2);

    return Number(params.data.netAmount).toFixed(2);
  }

  modifyMfgName(params) {
    var str = params.data.manufacturerName;

    params.data.manufacturerName = str != null && str != undefined ? str.substr(0, 4) : "";
    return params.data.manufacturerName;
  }
  constructor(private supplierQuotationsService: SupplierQuotationsService, private toasterService: ToastrService,
    private appService: AppService, private spinnerService: Ng4LoadingSpinnerService, private addPurchaseOrderService: AddPurchaseorderService, private addpurchaseorderinvoiceService: AddpurchaseorderinvoiceService) {
    this.purchaseOrderGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.purchaseOrderGridOptions.rowSelection = 'single';
    this.purchaseOrderGridOptions.columnDefs = this.columnDefs;
    this.purchaseOrderGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'multiple';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    this.appService.getPurchaseOrderDeletedRow().subscribe(
      (deletedRow: ICellRendererParams) => {
        // this.purchaseOrderInformationForm.reset();
        this.getTotalQ = 0;
        this.getTotalA = 0;
        this.getTotalItem();
        if (deletedRow instanceof Object) {
          let deleteData = this.purchaseOrderGridOptions.rowData.filter(
            x => x.itemId === deletedRow.data.itemId
          );
          try {
            this.purchaseOrderGridOptions.api.updateRowData({ remove: deleteData });
            let deleteIndex: number = this.findObjectIndex(this.purchaseOrderGridOptions.rowData, deleteData[0], 'itemId');
            if (deleteIndex !== -1) {
              this.purchaseOrderGridOptions.rowData.splice(deleteIndex, 1);
            }
          } catch (e) {

          }
        }
      }
    );

    this.retrieveInitialValues();
    this.getAllSuppliers();
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  pharmacyId = 1;

  generatePurchaseNo() {
    this.addPurchaseOrderService.getPurchaseOrderNumber().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.purchaseOrderInformationForm.patchValue({ purchaseOrderNo: res['result'] });
          }
        }
      }
    );
  }

  cash = false;
  emergency = false;

  onCashChange() {
    this.cash = !this.cash;
  }

  onEmergencyChange() {
    this.emergency = !this.emergency;
  }

  selectedDeliveryId;
  deliveries;
  quotations;
  selectedQuote;
  suppliers;
  selectedSupplier;
  item;
  getTotalQ;
  getTotalA;
  getTotalItems;

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

  /*  getallquotations() {
     this.addPurchaseOrderService.getallquotations().subscribe(
       res => {

         if (res instanceof Object) {
           if (res['responseStatus']['code'] == 200) {
             this.quotations = res['result'];
             // this.purchaseOrderInformationForm.patchValue({ selectedDeliveryId: res['result'] });
           }
         }
       }
     );
   } */

  getAllSuppliers() {
    this.addPurchaseOrderService.getallsuppliers().subscribe(res => {
      if (res['responseStatus']['code'] == 200) {
        this.suppliers = res['result'];
      }
    });
  }


  getSuppliers() {
    this.suppliers = [];
    this.selectedSupplier = null;
    if (this.selectedQuote) {
      this.addPurchaseOrderService.getsuppliersbyquotation(this.selectedQuote.quotationId).subscribe(
        res => {

          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.suppliers = res['result'];
              this.selectedSupplier = this.suppliers[0];
              this.getitemsbysupplierquotation();
              let temp_date = formatDate(res['result'][0]['creationTimeStamp'], 'yyyy-MM-dd', 'en-US');
              this.purchaseOrderInformationForm.patchValue({ quotationDate: temp_date });
            }
          }
        }
      );
    } else {
      this.retrieveInitialValues();
      this.getAllSuppliers();
      this.purchaseOrderInformationForm.patchValue({ quotationDate: '' });
    }
  }

  onSupplierChange(params) {
    this.loadRowData([{}], this.purchaseOrderGridOptions);
    this.getitemsbysupplierquotation();
  }

  getitemsbysupplierquotation() {

    this.getTotalItem();
    if ((this.selectedSupplier != null && this.selectedSupplier != undefined) && (this.selectedQuote != null && this.selectedQuote != undefined)) {
      this.selectedPaymentType = this.selectedSupplier['paymentType'];
      this.addPurchaseOrderService.getitemsbysupplierquotation(this.selectedSupplier.supplierId, this.selectedQuote.quotationId).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.item = res['result'];
              // this.loadRowData(res['result'], this.purchaseOrderGridOptions);
              // this.selectedItem = res['result'][0];
              // this.selectedItem = undefined;

              const addItem = JSON.parse(JSON.stringify(res['result']));
              this.purchaseOrderGridOptions.api.setRowData([]);
              this.loadRowData([{}], this.purchaseOrderGridOptions);
              this.purchaseOrderGridOptions.rowData = [];
              this.purchaseOrderGridOptions.api.updateRowData({
                add: addItem,
                addIndex: 1
              });
              this.purchaseOrderGridOptions.rowData = this.purchaseOrderGridOptions.rowData.concat(addItem);

              this.getTotalAmount();
              this.getTotalQuantity();
              this.getTotalItem();
              this.getAmount()
              // this.addRowsToPurchaseOrderGrid();
              // this.purchaseOrderInformationForm.patchValue({ selectedDeliveryId: res['result'] });
            }
          }
        }
      );
    } else {
      try {
        this.selectedPaymentType = this.selectedSupplier['paymentType'];
        // this.loadRowData([], this.purchaseOrderGridOptions);
        this.addPurchaseOrderService.getitemsbysupplier(this.selectedSupplier.supplierId).subscribe(res => {
          if (res['responseStatus']['code'] == 200) {
            this.item = res['result'];
            //  this.selectedItem = undefined;

            const addItem = JSON.parse(JSON.stringify(res['result']));
            this.itemGridOptions.api.setRowData([]);
            //this.loadRowData([{}], this.purchaseOrderGridOptions);
            this.itemGridOptions.rowData = [];
            this.itemGridOptions.api.updateRowData({
              add: addItem,
              addIndex: 1
            });
            this.itemGridOptions.rowData = this.itemGridOptions.rowData.concat(addItem);
            setTimeout(() => {
              $('#itemSearchModal').modal('show');
            }, 200);
            //this.getTotalAmount();
            // this.getTotalQuantity();
            // this.getTotalItem();
          }
        })
      }
      catch (error) {

      }
    }
  }

  getRowNodeId;
  today;

  retrieveInitialValues() {
    this.selectedPaymentType = undefined;
    // this.loadRowData([], this.purchaseOrderGridOptions);
    this.generatePurchaseNo();
    this.getalldeliverytypes();
    //  this.getallquotations();
    // this.getalluniqueids();
    this.getPaymentTypes();
    this.itemParameter = { name: 'Item Name', value: 'itemName' }
    this.itemSearchTerm = "";
    this.showItemGrid = true;
    this.selectedItem = undefined;
    this.getTotalQ = 0;
    this.getTotalA = 0;
    this.getTotalItems = 0;
    this.selectedDeliveryId = undefined;
    this.selectedQuote = undefined;
    this.selectedSupplier = undefined;
    this.loadRowData([{}], this.purchaseOrderGridOptions);


    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.purchaseOrderInformationForm.patchValue({ purchaseOrderDate: this.today, deliveryDate: this.today });
    }, 200);

    setTimeout(() => {
      this.getRowNodeId = function (data) {
        return data.symbol;
      };

      var rowNode = this.purchaseOrderGridOptions.api.getRowNode('0');
      rowNode.addEventListener(RowNode.EVENT_ROW_SELECTED, function () {
        $('#itemSearchModal').modal('show');
        rowNode.setSelected(false, true);
      });
    }, 200);
  }

  uids;

  getalluniqueids() {
    this.addPurchaseOrderService.getalluniqueids('PO').subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.uids = res['result'];
            // this.purchaseOrderInformationForm.patchValue({ selectedDeliveryId: res['result'] });
          }
        }
      }
    );
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  selectedPaymentType: Object = {};
  paymentTypes: any[] = [];

  getPaymentTypes() {
    this.addpurchaseorderinvoiceService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  onPaymentTypeChange(event: Event) {
    try {
      this.selectedPaymentType = this.paymentTypes.find(x => x.paymentTypeId === event['paymentTypeId']);
    } catch (error) {
      this.selectedPaymentType = undefined;
    }
  }

  gridApi;

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onCellClicked(params) {
    if (this.selectedQuote == null || this.selectedQuote == undefined) {
      if (params['rowIndex'] === 0) {
        if (params['data']['itemName'] == undefined || params['data']['itemName'] == null) {
          setTimeout(() => {
            this.getitemsbysupplierquotation();
          }, 200);
        }

      }
    }

  }

  onCellValueChanged(params) {
    this.getTotalQ += Number(params.newValue);
  }

  change(params) {
    const data = params;

    this.itemGridOptions.api.setRowData(
      [{
        itemCode: data.itemCode,
        itemName: data.itemName, itemDescription: data.description,
      }]);
    // setTimeout(() => {
    //   $('#pendingModal').modal('show');
    // }, 200);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });
  }

  getTotalQuantity() {
    let quant = 0;
    let totalQty = 0;

    this.gridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemName) {
        quant += Number(rowNode.data.quantity);
        // totalQty +=ny
      }
    });


    this.getTotalQ = quant;
    this.getAmount();
  }

  getTotalAmount() {
    let amt = 0;
    this.gridApi.forEachNode(function (rowNode, index) {
      amt += rowNode.data.packRate;
    });
    const quant = this.getTotalQ;
    amt = amt ? amt : 0;
    this.getTotalA = (quant * amt).toFixed(2);
  }

  poValueCalculate(param) {
    let val = 0;
    if (param) {
      if (isNaN(Number(param.srcElement.value))) {
        val = Number(this.purchaseOrderInformationForm.get('totalAmount').value);
      }
      else {
        val = Number(param.srcElement.value);
      }
    } else {
      val = Number(this.purchaseOrderInformationForm.get('totalAmount').value);
    }

    let adv = Number(this.purchaseOrderInformationForm.get('advance').value);
    let bal = Number(this.purchaseOrderInformationForm.get('balance').value);
    let charg = Number(this.purchaseOrderInformationForm.get('otherCharges').value);

    let p = Number(this.purchaseOrderInformationForm.get('discPercentage').value);
    if (p > 0) {

      p = 0.01 * Number(p);
      const ta = val;
      let dis_amt = p * Number(ta);
      dis_amt = Math.round(dis_amt * 100) / 100;
      let dis = ta - dis_amt;
      val = dis + charg + bal - adv;
    } else {

      val = val + charg + bal - adv;

    }
    this.purchaseOrderInformationForm.patchValue({ 'poValue': val.toFixed(2) });
  }

  getTotalItem() {
    let item = 0;

    this.gridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemName) {

        item += 1;
      }
    });

    this.getTotalItems = item;

  }
  getAmount() {
    var items = [];
    var obj = {}
    this.gridApi.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemName) {

        /*  if (rowNode.data.quantity >= 0 &&
           rowNode.data.pack >= 0 &&

           rowNode.data.discount >= 0 &&
           rowNode.data.netAmount >= 0 &&
           (rowNode.data.tax == 'A' || rowNode.data.tax == 'B' || rowNode.data.tax == 'E')) { */
        obj = {
          activeS: rowNode.data.activeS,
          formulation: rowNode.data.formulation,
          itemCode: rowNode.data.itemCode,
          itemDescription: rowNode.data.itemDescription,
          itemId: rowNode.data.itemId,
          itemName: rowNode.data.itemName,
          itemSupplierId: rowNode.data.itemSupplierId,
          itemsId: rowNode.data.itemsId,
          itemsModel: rowNode.data.itemsModel,
          manufacturerLicense: rowNode.data.manufacturerLicense,
          manufacturerName: rowNode.data.manufacturerName,
          percentage: rowNode.data.percentage,
          supplierId: rowNode.data.supplierId,
          supplierModel: rowNode.data.supplierModel,
          supplierName: rowNode.data.supplierName,
          supplierPriority: rowNode.data.supplierPriority,
          quantity: rowNode.data.quantity,
          bonus: rowNode.data.bonus,
          pack: rowNode.data.pack,
          packRate: rowNode.data.packRate,
          unitRate: rowNode.data.unitRate,
          discountPercentage: rowNode.data.discountPercentage,
          discount: isNaN(rowNode.data.discount) ? 0 : rowNode.data.discount,

          tax: rowNode.data.tax == 'A' ? { taxCategoryId: 1 } : rowNode.data.tax == 'B' ? { taxCategoryId: 2 } : { taxCategoryId: 3 },
          netAmount: rowNode.data.netAmount,
          validity: rowNode.data.validity,
        };

        items.push(obj);
        //}
      }
    });

    this.getTotalA = 0;
    var totalDiscount = 0;
    var totalTaxAmount = 0;

    for (var i = 0; i < items.length; i++) {
      this.getTotalA += Number(items[i]['netAmount']);
      this.purchaseOrderInformationForm.get('totalAmount').setValue(this.getTotalA.toFixed(2));
      totalDiscount += Number(items[i]['discount']);
      this.purchaseOrderInformationForm.get('discount').setValue(totalDiscount.toFixed(2));

      totalTaxAmount += Number(items[i]['quantity'] * items[i]['packRate'] *
        (1 - Number(items[i]['discountPercentage']) / 100) * ((items[i]['tax']['taxCategoryId'] == 1 ? 16 : 0) / 100));

      this.purchaseOrderInformationForm.get('taxAmt').setValue(totalTaxAmount.toFixed(2));
      this.poValueCalculate(event);
    }
  }

  percent(params) {
    let p = Number(params.srcElement.value);

    p = 0.01 * Number(p);
    const ta = Number(this.purchaseOrderInformationForm.get('totalAmount').value);

    setTimeout(() => {
      let dis_amt = p * Number(ta);
      dis_amt = Math.round(dis_amt * 100) / 100;
      let dis = ta - dis_amt;

      let adv = Number(this.purchaseOrderInformationForm.get('advance').value);
      let bal = Number(this.purchaseOrderInformationForm.get('balance').value);
      let charg = Number(this.purchaseOrderInformationForm.get('otherCharges').value);

      dis = dis + charg + bal - adv;

      // this.purchaseOrderInformationForm.patchValue({ 'discount': '' });
      // this.purchaseOrderInformationForm.patchValue({ 'poValue': '' });

      this.purchaseOrderInformationForm.patchValue({ 'discount': dis_amt });
      this.purchaseOrderInformationForm.patchValue({ 'poValue': dis });
    }, 100);
  }

  checkFormDisability() {
    if (this.purchaseOrderGridOptions.rowData instanceof Array) {
      let pPrice = true;
      let pDisc = true;

      for (var i = 0; i < this.purchaseOrderGridOptions.rowData.length; i++) {

        /* if ((this.purchaseOrderGridOptions.rowData[i]['discountPercentage'] != null &&
        this.purchaseOrderGridOptions.rowData[i]['discountPercentage'] != undefined &&
        this.purchaseOrderGridOptions.rowData[i]['discountPercentage'] != "") &&
          this.purchaseOrderGridOptions.rowData[i]['discountPercentage'] >= 0) {
          pDisc = false;

        }
        else {
          pDisc = true;

        } */
        if ((this.purchaseOrderGridOptions.rowData[i]['packRate'] != null && this.purchaseOrderGridOptions.rowData[i]['packRate'] != undefined && this.purchaseOrderGridOptions.rowData[i]['packRate'] != "") &&
          this.purchaseOrderGridOptions.rowData[i]['packRate'] >= 0) {
          pPrice = false;

        }
        else {
          pPrice = true;

        }

      }
      return ((this.purchaseOrderInformationForm.get('purchaseOrderDate').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('purchaseOrderNo').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('deliveryTime').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('poTerm').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('remarks').errors instanceof Object)
        || pPrice
      );
    }
  }

  formatData(type) {
    let sendData = {};

    //    let itemId = this.selectedItem.itemId;
    //   let quan = this.selectedItem.quantity;

    let purchaseorderitems = [];
    this.purchaseOrderGridOptions.api.forEachNode(node => {
      if (node.data['itemId']) {
        purchaseorderitems.push({
          "createdUser": localStorage.getItem('id'),
          "lastUpdateUser": localStorage.getItem('id'),
          "discount": node.data['discount'] ? node.data['discount'] : 0,
          "discountPercentage": node.data['discountPercentage'] ? node.data['discountPercentage'] : 0,
          "itemsModel": {
            "itemId": node.data['itemId'] ? node.data['itemId'] : null //check
          },
          "quantity": node.data['quantity'] ? node.data['quantity'] : 0, //check
          "netAmount": node.data['netAmount'] ? node.data['netAmount'] : 0,
          "bonus": node.data['bonus'] ? node.data['bonus'] : 0,
          "unitRate": node.data['unitRate'] ? node.data['unitRate'] : 0,
          "tax": node.data['tax'] == 'A' ? { taxCategoryId: 1 } : node.data['tax'] == 'B' ? { taxCategoryId: 2 } : { taxCategoryId: 3 },
          "unitSaleRate": node.data['unitSaleRate'] ? node.data['unitSaleRate'] : 0,
          "pack": node.data['pack'] ? node.data['pack'] : 0,
          "packRate": node.data['packRate'] ? node.data['packRate'] : 0,
          "status": 'Y'
        });
      }
    })




    sendData['advance'] = this.purchaseOrderInformationForm.get('advance').value;
    sendData['paymentType'] = this.selectedPaymentType != null && this.selectedPaymentType != undefined ? { 'paymentTypeId': this.selectedPaymentType['paymentTypeId'] } : null;
    sendData['lastUpdateUser'] = localStorage.getItem('id');
    sendData['createdUser'] = localStorage.getItem('id');
    sendData['deliveryTime'] = this.purchaseOrderInformationForm.get('deliveryTime').value;
    sendData['deliveryTypesModel'] = this.selectedDeliveryId != null && this.selectedDeliveryId != undefined ? { "deliveryTypeId": this.selectedDeliveryId.deliveryTypeId } : null;
    sendData['discount'] = this.purchaseOrderInformationForm.get('discount').value;
    //sendData['discPercentage'] = this.purchaseOrderInformationForm.get('discPercentage').value;
    sendData['emergency'] = this.emergency ? "Y" : "N";
    sendData['medicalOrNonMedical'] = this.purchaseOrderInformationForm.get('medicalOrNonMedical').value;
    sendData['paymentTime'] = this.purchaseOrderInformationForm.get('paymentTime').value;
    sendData['pharmacyModel'] = { "pharmacyId": 1 };
    sendData['remarks'] = this.purchaseOrderInformationForm.get('remarks').value;
    if (this.selectedQuote != null && this.selectedQuote != undefined) {
      sendData['quotationModel'] = { "quotationId": this.selectedQuote != null ? this.selectedQuote.quotationId : undefined }; //check
    }

    sendData['poAmount'] = this.purchaseOrderInformationForm.get('poValue').value;
    sendData['purchaseorderitems'] = purchaseorderitems;
    sendData['poTerm'] = this.purchaseOrderInformationForm.get('poTerm').value;
    sendData['sentId'] = this.selectedQuote != null ? this.selectedQuote.sentId : null;
    sendData['shippingAddress'] = this.purchaseOrderInformationForm.get('shippingAddress').value;
    sendData['poDesc'] = this.purchaseOrderInformationForm.get('poDesc').value;
    sendData['balance'] = this.purchaseOrderInformationForm.get('balance').value;
    sendData['otherCharges'] = this.purchaseOrderInformationForm.get('otherCharges').value;
    sendData['deliveryDate'] = this.purchaseOrderInformationForm.get('deliveryDate').value;
    sendData['supplierModel'] = { "supplierId": this.selectedSupplier != null ? this.selectedSupplier.supplierId : null };
    sendData['purchaseOrderNo'] = this.purchaseOrderInformationForm.get('purchaseOrderNo').value;
    sendData['purchaseOrderStatusModel'] = { "purchaseOrderStatusId": 0 };
    sendData['purchaseOrderDate'] = this.purchaseOrderInformationForm.get('purchaseOrderDate').value;
    sendData['totalQuantity'] = this.getTotalQ;
    sendData['totalValue'] = this.getTotalA;

    return sendData;

  }

  reset() {
    this.purchaseOrderInformationForm.reset();
    this.purchaseOrderInformationForm.patchValue({
      deliveryTime: '14'
    });
    this.purchaseOrderInformationForm.patchValue({
      shippingAddress: "DOCPHARMA LIMITED Doctors' Park, 3rd Parklands Ave.,Nairobi-62934-619 PIN No: P051645464Q Mob: +254735929000 / 702929000"
    });
    this.purchaseOrderInformationForm.controls.medicalOrNonMedical.setValue('M')
  }

  onSubmitPurchaseOrder(type) {
    if (type === 'pending') {
      const send = this.formatData(type);
      this.spinnerService.show();
      this.addPurchaseOrderService.pendingpurchaseorder(send).subscribe(
        res => {

          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.spinnerService.hide();
              this.retrieveInitialValues();

              this.reset();
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
    if (type === 'later') {
      const send = this.formatData(type);
      this.spinnerService.show();

      this.addPurchaseOrderService.partiallypurchaseorder(send).subscribe(
        res => {

          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.spinnerService.hide();

              this.retrieveInitialValues();
              this.reset();
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
  }

  itemSearchTerm = '';

  onSeachTermClick() {
    this.getItembysupplieritemcditemname(this.itemParameter['value'], this.itemSearchTerm, this.selectedSupplier.supplierId);
  }

  getItembysupplieritemcditemname(itemCode: string, itemName: string, supplierId) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.getitemsbyitemcodeoritemnameoritemdesc(itemCode, itemName, supplierId).subscribe(
      itemReponse => {

        if (itemReponse instanceof Object) {
          if (itemReponse['responseStatus']['code'] == 200) {
            this.itemGridOptions.rowData = itemReponse['result'];
            if (itemReponse['result'] == null || itemReponse['result']['length'] == 0) {
              this.toasterService.warning("No Items Found WIth Given Search For Selected Supplier", 'Not Found', {
                timeOut: 3000
              });
            }
          }
        }
        this.showItemGrid = true;
      }
    );
  }

  selectedItem = [];

  onItemSelected() {
    this.itemGridOptions.api.getSelectedRows().forEach(obj => {
      this.selectedItem = JSON.parse(JSON.stringify(obj));
      this.addRowsToPurchaseOrderGrid();
      this.getTotalAmount();
      this.getTotalItem();
      this.getTotalQuantity();
      this.getAmount();
      this.itemGridOptions.api.setRowData([]);
    })

    $('#itemParams').value = '';
    this.itemParameter = { name: 'Item Name', value: 'itemName' };
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
    $('#itemSearchModal').modal('hide');
  }

  noSelection() {
    $('#searchTerm').value = '';
    $('#itemParams').value = '';
    this.itemParameter = { name: 'Item Name', value: 'itemName' };
    this.itemGridOptions.api.setRowData([]);
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
  }

  addRowsToPurchaseOrderGrid() {
    const addItem = JSON.parse(JSON.stringify(this.selectedItem));
    this.purchaseOrderGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 1
    });
    this.purchaseOrderGridOptions.rowData = this.purchaseOrderGridOptions.rowData.concat(addItem);
  }

  ngOnInit() {
    this.purchaseOrderInformationForm = new FormGroup(this.purchaseOrderInformationFormValidations);
  }

  onRemoveSelected() {
    var selectedData = this.purchaseOrderGridOptions.api.getSelectedRows();
    var res = this.purchaseOrderGridOptions.api.updateRowData({ remove: selectedData });

    this.loadResult(res);
    this.getTotalAmount();
    this.getTotalItem();
    this.getTotalQuantity();
    this.getAmount();
    this.purchaseOrderGridOptions.api.forEachNode(Node => {
    })

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
