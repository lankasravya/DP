import { Component, OnInit } from '@angular/core';

import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-pending',
  templateUrl: './supplier-pending.component.html',
  styleUrls: ['./supplier-pending.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierPendingComponent implements OnInit {

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
      width: 40
    },
    {
      headerName: 'Qtn No',
      field: 'quotation.quotationNo',
      sortable: true,
      resizable: true,
      filter: true,
    },
    {
      headerName: 'Qtn Name',
      field: 'quotationName',
      sortable: true,
      resizable: true,
      filter: true
    }, ,
    {
      headerName: 'Item Code',
      field: 'itemCode',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
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
      headerName: 'Qty',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'P.Price',
      field: 'mrp',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'P.Disc%',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true
    },
  ];

  pendingVendorApprovalGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService, private router: Router) {
    this.pendingVendorApprovalGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingVendorApprovalGridOptions.rowSelection = 'single';
    this.pendingVendorApprovalGridOptions.columnDefs = this.columnDefs;
    this.pendingVendorApprovalGridOptions.rowData = [];
    this.getSupplierPending();
  }

  private gridApi;
  private gridColumnApi;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onCellClicked(params) {
    // if (params.column.colId !== 'check') {
    //   this.change(params.data);
    //   setTimeout(() => {
    //     $('#pendingModal').modal('show');
    //   }, 200);
    // }
  }

  getSupplierPending() {
    
    this.loadRowData([], this.pendingVendorApprovalGridOptions);
    
    this.supplierService.getpendingquotationitems().subscribe(
      res => {
        const data = res;
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['quotationName'] = data['result'][i]['quotation']['quotationName'];
            data['result'][i]['itemCode'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemCode'];
            data['result'][i]['itemName'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemName'];
            data['result'][i]['supplierName'] = data['result'][i]['quotation']['quotationItems'][0]['supplier']['name'];
            data['result'][i]['quantity'] = data['result'][i]['quotation']['quotationItems'][0]['quantity'];
          }
          this.loadRowData(data['result'], this.pendingVendorApprovalGridOptions);
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

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.pendingVendorApprovalGridOptions.api.setQuickFilter($event.target.value);
    if (this.pendingVendorApprovalGridOptions.api.getDisplayedRowCount() === 0) {
      this.pendingVendorApprovalGridOptions.api.showNoRowsOverlay();
    } else {
      this.pendingVendorApprovalGridOptions.api.hideOverlay();
    }
  }


  ngOnInit() {
  }

  dataToSend;
  approve() {
    const data = this.pendingVendorApprovalGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
    let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    // send['createdId'] = this.dataToSend.quotation.createdBy ? this.dataToSend.quotation.createdBy.employeeId : null;
    send['createdUser'] = this.dataToSend.quotation.createdUser;
    send['quotationItemId'] = this.dataToSend.quotationItemId;
    send['discount'] = this.dataToSend.quotationItemId;
    send['advance'] = this.dataToSend.advance;
    send['supplier'] = { 'supplierId': this.dataToSend.quotation.quotationItems[0].supplier.supplierId };
    send['supplier'] = { 'supplierId': this.dataToSend.supplier.supplierId };
    send['quantity'] = this.dataToSend.quotation.quotationItems[0].quantity;
    send['item'] = { 'itemId': this.dataToSend.quotation.quotationItems[0].item.itemId };
    send['quotation'] = { 'quotationId': this.dataToSend.quotation.quotationId };
    send['unitPurchasePrice'] = this.dataToSend.unitPurchasePrice;
    send['remarks'] = this.dataToSend.remarks;
    // send['rejectedReason'] = this.reason;

    // let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    // selectedQuotation['rejectedReason'] = this.reason;
    this.supplierService.approvedquotationitem(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.getSupplierPending();
            location.reload();
          }
        }
      }
    );
  }

  reject() {

    const data = this.pendingVendorApprovalGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
    let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    send['createdUser'] = this.dataToSend.quotation.createdUser;
    send['quotationItemId'] = this.dataToSend.quotationItemId;
    send['discount'] = this.dataToSend.quotationItemId;
    send['advance'] = this.dataToSend.advance;
    send['supplier'] = { 'supplierId': this.dataToSend.quotation.quotationItems[0].supplier.supplierId };
    send['supplier'] = { 'supplierId': this.dataToSend.supplier.supplierId };
    send['quantity'] = this.dataToSend.quotation.quotationItems[0].quantity;
    send['item'] = { 'itemId': this.dataToSend.quotation.quotationItems[0].item.itemId };
    send['quotation'] = { 'quotationId': this.dataToSend.quotation.quotationId };
    send['unitPurchasePrice'] = this.dataToSend.unitPurchasePrice;
    send['remarks'] = this.dataToSend.remarks;
    // send['rejectedReason'] = this.reason;

    // let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    // selectedQuotation['rejectedReason'] = this.reason;
    this.supplierService.rejectedquotationitem(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.getSupplierPending();
            location.reload();
          }
        }
      }
    );
  }

}
