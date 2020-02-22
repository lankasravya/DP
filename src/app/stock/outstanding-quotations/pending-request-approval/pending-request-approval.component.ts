import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import * as $ from 'jquery';
import { CheckBoxComponent } from 'src/app/core/check-box/check-box.component';
import { Router } from '@angular/router';
import { ApprovedComponent } from '../approved/approved.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pending-request-approval',
  templateUrl: './pending-request-approval.component.html',
  styleUrls: ['./pending-request-approval.component.scss'],
  providers: [SupplierQuotationsService, ApprovedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingRequestApprovalComponent implements OnInit, AfterViewInit {
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
    field: 'quotationNo',
    sortable: true,
    resizable: true,
    filter: true,
  },
  {
    headerName: 'Qtn Name',
    field: 'description',
    sortable: true,
    resizable: true,
    filter: true
  }, ,
  {
    headerName: 'Requested By',
    field: 'requestedby.firstName',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Created By',
    field: 'createdUser',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Created Date',
    field: 'quotationDt',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Expiry Date',
    field: 'quotationExpiryDt',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    resizable: true,
    filter: true
  },
  ];

  quotationcolumnDefs = [
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
      headerName: 'Formulation',
      field: 'formulation',
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
      headerName: 'Supplier',
      field: 'name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Manufacturer',
      field: 'manuf',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Description',
      field: 'itemDescription',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  // selectedRowIndex = '';

  // checkboxCellRenderer(params: any) {
  //   const context = params.context.componentParent;
  //   const input = document.createElement('input');
  //   input.type = 'checkbox';
  //   input.checked = params.value;
  //   input.addEventListener('click', event => {
  //     params.value = !params.value;
  //     params.node.data.fieldName = params.value;

  //     if (params.value) {
  //       context.selectedRowIndex = params.rowIndex;
 
  //     } else {
  //       context.selectedRowIndex = '';
  //     }
 
  //   });
  //   return input;
  // }

  aapprovedGridOptions: GridOptions;
  quotationGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService, private router: Router, private cdr: ChangeDetectorRef, private app_comp: ApprovedComponent) {
    this.aapprovedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.aapprovedGridOptions.rowSelection = 'single';
    this.aapprovedGridOptions.columnDefs = this.columnDefs;
    this.aapprovedGridOptions.rowData = [];

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);
  }

  ngAfterViewInit() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }

  pharmacyId: number = 1;

  reason: string = '';

  private gridApi;
  private gridColumnApi;

  change(params) {
    const data = params;
  
    $('#requestQuotNumber').val(data.quotationNo);
    $('#requestQuotRequested').val(data.requestedby.firstName);
    $('#requestQuotCreated').val(data.createdUser);
    $('#requestQuotDated').val(data.quotationDt);
    $('#requestQuotExpiry').val(data.quotationExpiryDt);
    $('#requestQuotDesc').val(data.description);
    this.quotationGridOptions.api.setRowData(
      [{
        itemCode: data.quotationItems[0].item.itemCode,
        itemName: data.quotationItems[0].item.itemName, itemDescription: data.description,
        name: data.quotationItems[0].supplier.name, quantity: data.quotationItems[0].quantity,
        manuf: data.quotationItems[0].item.manufacturer.name, formulation: data.quotationItems[0].item.itemForm.form
      }]);
    // setTimeout(() => {
    //   $('#pendingModal').modal('show');
    // }, 200);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });
  }

  onCellClicked(params) {
  
    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#pendingModal').modal('show');
      }, 200);
    }
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getApprovedData(pharmacyId: number) {

    this.loadRowData([], this.quotationGridOptions);
    this.showApprovedGrid = false;
    this.loadRowData([], this.aapprovedGridOptions);
    this.showApprovedGrid = true;

    this.showApprovedGrid = false;
    this.supplierService.getrequestpendingquotationbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;
      
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['status'] = data['result'][i]['quotationItems'][0]['quotationItemStatus']['status'];
            data['result'][i]['itemName'] = data['result'][i]['quotationItems'][0]['item']['itemName'];
          }
         
          this.aapprovedGridOptions.api.updateRowData({ add: data['result'] });
        }
      }
    );
    this.showApprovedGrid = true;
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  showApprovedGrid: boolean = true;

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.aapprovedGridOptions.api.setQuickFilter($event.target.value);
    if (this.aapprovedGridOptions.api.getDisplayedRowCount() === 0) {
      this.aapprovedGridOptions.api.showNoRowsOverlay();
    } else {
      this.aapprovedGridOptions.api.hideOverlay();
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

   dataToSend;

  approve() {

    const data = this.aapprovedGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
   
    let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    send['createdId'] = this.dataToSend.createdBy ? this.dataToSend.createdBy.employeeId : null;
    send['createdUser'] = this.dataToSend.createdUser;
    send['requestedId'] = this.dataToSend.requestedby.employeeId;
    send['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };

    send['supplier'] = { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId };
    send['description'] = this.dataToSend.description;
    send['quotationDt'] = this.dataToSend.quotationDt;
    send['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
    send['quotationNo'] = this.dataToSend.quotationNo;
    send['quotationItems'] = [{
      'activeS': this.dataToSend.quotationItems[0].item.activeS,
      'item': { 'itemId': this.dataToSend.quotationItems[0].item.itemId },
      'createdUser': this.dataToSend.createdUser, 'discountPercentage': this.dataToSend.quotationItems[0].discountPercentage,
      'formulation': this.dataToSend.quotationItems[0].item.itemForm.form,
      'manufacturerLicense': this.dataToSend.quotationItems[0].item.manufacturer.licence,
      'manufacturerName': this.dataToSend.quotationItems[0].item.manufacturer.name,
      'quantity': this.dataToSend.quotationItems[0] .quantity,
      'supplier': { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId },
      'quotationItemId': this.dataToSend.quotationItems[0].quotationItemId
    }];
    send['quotationId'] = this.dataToSend.quotationId;
    send['approvedId'] = localStorage.getItem('id');
    // send['approvedBy'] = localStorage.getItem('user');
    send['approvedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    // send['rejectedReason'] = this.reason;
   
    this.supplierService.saverequestapprovedquotation(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.reason = '';
            this.getApprovedData(this.pharmacyId);
            // this.router.navigate(['/stock']);
            // this.router.navigate(['/stock/outstandingquotations']);
            // location.reload();
            setTimeout(() => {
              this.reloadCurrentRoute();
            }, 200);
          }
        }
      }
    );
  }

  reject() {

    const data = this.aapprovedGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
   
    let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    send['createdId'] = this.dataToSend.createdBy.employeeId;
    send['createdUser'] = this.dataToSend.createdUser;
    send['requestedId'] = this.dataToSend.requestedby.employeeId;
    send['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };

    send['supplier'] = { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId };
    send['description'] = this.dataToSend.description;
    send['quotationDt'] = this.dataToSend.quotationDt;
    send['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
    send['quotationNo'] = this.dataToSend.quotationNo;
    send['quotationItems'] = [{
      'activeS': this.dataToSend.quotationItems[0].item.activeS,
      'item': { 'itemId': this.dataToSend.quotationItems[0].item.itemId },
      'createdUser': this.dataToSend.createdUser, 'discountPercentage': this.dataToSend.quotationItems[0].discountPercentage,
      'formulation': this.dataToSend.quotationItems[0].item.itemForm.form,
      'manufacturerLicense': this.dataToSend.quotationItems[0].item.manufacturer.licence,
      'manufacturerName': this.dataToSend.quotationItems[0].item.manufacturer.name,
      'quantity': this.dataToSend.quotationItems[0].quantity,
      'supplier': { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId },
      'quotationItemId': this.dataToSend.quotationItems[0].quotationItemId
    }];
    send['quotationId'] = this.dataToSend.quotationId;
    send['rejectedReason'] = this.reason;
    send['rejectedId'] = localStorage.getItem('id');
    // send['rejectedBy'] = localStorage.getItem('user');
    send['rejectedDate'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  
    // let selectedQuotation = JSON.parse(JSON.stringify(this.aapprovedGridOptions.api.getSelectedRows()[0]));
    // selectedQuotation['rejectedReason'] = this.reason;
    this.supplierService.saverequestrejectedquotation(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] == 200) {
            this.reason = '';
            this.getApprovedData(this.pharmacyId);
            // this.router.navigate(['/stock']);
            // this.router.navigate(['/stock/outstandingquotations']);
            setTimeout(() => {
              this.reloadCurrentRoute();
            }, 200);
          }
        }
      }
    );
  }

}
