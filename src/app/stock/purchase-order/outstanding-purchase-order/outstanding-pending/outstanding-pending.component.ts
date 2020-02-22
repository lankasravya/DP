import { AppService } from './../../../../core/app.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../../add-purchaseorder.service";
import { formatDate } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-outstanding-pending',
  templateUrl: './outstanding-pending.component.html',
  styleUrls: ['./outstanding-pending.component.scss'],
  providers: [AddPurchaseorderService]
})
export class OutstandingPendingComponent implements OnInit {

  columnDefs = [
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
      headerName: 'PO No',
      field: 'purchaseOrderNo',
      sortable: true,
      resizable: true,
      filter: true,

    },
    {
      headerName: 'PO Date',
      field: 'purchaseOrderDate',
      sortable: true,
      resizable: true,
      filter: true,
      //valueGetter: this.dateFormatter.bind(this)
    },

    {
      headerName: 'PO Description',
      field: 'poDesc',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier',
      field: 'supplierModel.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Total Quantity',
      field: 'totalQuantity',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Total Value',
      field: 'totalValue',
      sortable: true,
      resizable: true,
      filter: true,
    },
    {
      headerName: 'Manufacturer',
      field: 'manuName',
      sortable: true,
      filter: true,
      resizable: true,
      hide: true
    },
    {
      headerName: 'PO Disc',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    }
  ];

  pharmacyId = 1;
  approvedGridOptions: GridOptions;
  permissions: any;
  constructor(private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private service: AddPurchaseorderService, private datePipe: DatePipe, private appService: AppService, ) {
    this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];

      }
    });

    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);
  }

  reason = "";

  gridApi;
  gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onCellClicked(params) {

    if (params.colDef.field !== '') {
      this.change(params.data);

    }
  }
  approvePermissionCheck() {
    if (this.permissions instanceof Array) {
      if (this.permissions[14]['activeS'] === 'Y') {

        return false;
      }
      else {

        return true;
      }
    }
    else {
      return false;
    }
  }

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.purchaseOrderDate != null && params.data.purchaseOrderDate != undefined) {
        try {
          params.data.purchaseOrderDate = this.datePipe.transform(params.data.purchaseOrderDate, "dd-MM-yyyy");
        }
        catch (error) {

        }
        return params.data.purchaseOrderDate;
      }
    }
  }

  change(params) {
    const data = params;
    // setTimeout(() => {
    //   $('#pendingModal').modal('show');
    // }, 200);
    // this.gridApi.forEachNodeAfterFilter(function (node) {
    //   node.setSelected(false);
    // });
  }

  getApprovedData(pharmacyId: number) {

    this.loadRowData([], this.approvedGridOptions);

    this.service.getpendingpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;
        for (var i = 0; i < res['result']['length']; i++) {
          if (res['result'][i]['purchaseorderitems'].length > 0) {
            //data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemCode'] : null : null;
            //data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemName'] : null : null;
            // data['result'][i]['quantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['totalQuantity'] : null;
            //  data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['manufacturer']['name'] : null : null;
            // data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['packRate'] : null;
          }

        }

        this.loadRowData(data['result'], this.approvedGridOptions);
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

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  formatData(type, status) {
    let sendData = {};

    let itemId = type.purchaseorderitems[0].itemsModel.itemId;
    let quan = type.purchaseorderitems[0].quantity;
    sendData['advance'] = type.advance;
    if (status === 'approve') {
      sendData['approvedDate'] = type.approvedDate;
      sendData['approvedId'] = type.approvedId;
      this.reason = undefined;
    }
    if (status === 'reject') {
      sendData['rejectedDate'] = type.approvedDate;
      sendData['rejectedId'] = type.approvedId;
      sendData['rejectedReason'] = type.rejectedReason;
      this.reason = undefined;
    }
    sendData['auditId'] = type.auditId;
    sendData['otherCharges'] = type.otherCharges;
    sendData['poCategory'] = type.poCategory;
    sendData['poNature'] = type.poNature;
    sendData['poTerm'] = type.poTerm;
    sendData['purchaseOrderDate'] = type.purchaseOrderDate;
    sendData['createdId'] = type.createdId;
    sendData['createdUser'] = type.createdUser;
    sendData['deliveryTime'] = type.deliveryTime;
    sendData['deliveryTypesModel'] = type.deliveryTypesModel;
    sendData['discount'] = type.discount;
    sendData['discountPercentage'] = type.discountPercentage;
    sendData['emergency'] = type.emergency;
    sendData['medicalOrNonMedical'] = type.medicalOrNonMedical;
    sendData['paymentTime'] = type.paymentTime;
    sendData['pharmacyModel'] = { 'pharmacyId': type.pharmacyModel.pharmacyId };
    if (type.quotationModel != null && type.quotationModel != undefined) {
      sendData['quotationModel'] = { 'quotationId': type.quotationModel };
    }

    sendData['poAmount'] = type.poAmount;
    /* sendData['purchaseorderitems'] = [
      {
        "actualValue": type.purchaseorderitems[0].actualValue,
        "purchaseOrderItemsId": type.purchaseorderitems[0].purchaseOrderItemsId,
        "createdUser": type.createdUser,
        'auditId': type.auditId,
        "discount": type.discount,
        "discount_percentage": type.discountPercentage,
        "itemsModel": {
          "itemId": itemId //check
        },
        "quantity": quan ? quan : 0, //check
        "remarks": type.remarks,
        "unitRate": type.purchaseorderitems[0].unitRate,
        "unitSaleRate": type.purchaseorderitems[0].unitSaleRate,
        "totalQuantity": type.purchaseorderitems[0].totalQuantity,
        "totalValue": type.purchaseorderitems[0].totalValue
      }
    ]; */
    sendData['remarks'] = type.remarks;
    sendData['sentId'] = type.sentId;
    sendData['shippingAddress'] = type.shippingAddress;
    sendData['supplierModel'] = { 'supplierId': type.supplierModel.supplierId };
    sendData['purchaseOrderNo'] = type.purchaseOrderNo
    sendData['purchaseOrderStatusModel'] = type.purchaseOrderStatusModel;
    sendData['purchaseOrderId'] = type.purchaseOrderId;
    sendData['variationType'] = type.variationType;
    sendData['paymentType'] = type.paymentType;
    sendData['approvedDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //data['result'][i]['']



    return sendData;
  }

  approve() {
    // let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    selectedQuotation['purchaseOrderDate'] = new Date(selectedQuotation['purchaseOrderDate'])//this.datePipe.transform(selectedQuotation['purchaseOrderDate'], "yyyy-MM-dd")

    const send = this.formatData(selectedQuotation, 'approve');
    this.spinnerService.show();
    this.service.approvedpurchaseorder(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.getApprovedData(this.pharmacyId);
            //location.reload();
            this.toasterService.success(approveRes['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      },error=>{
        this.spinnerService.show();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    );
  }

  reject() {

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    selectedQuotation['purchaseOrderDate'] = this.datePipe.transform(selectedQuotation['purchaseOrderDate'], "yyyy-MM-dd")
    const send = this.formatData(selectedQuotation, 'reject');

    this.service.rejectedpurchaseorder(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] == 200) {
            this.getApprovedData(this.pharmacyId);
            //location.reload();
            this.toasterService.success(approveRes['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      }
    );
  }

  ngOnInit() {
  }

}
