import { Component, OnInit } from '@angular/core';

import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-supplier-approved',
  templateUrl: './supplier-approved.component.html',
  styleUrls: ['./supplier-approved.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierApprovedComponent implements OnInit {

  columnDefs = [
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
    {
      headerName: 'Approved By',
      field: 'approvedBy',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Approved Date',
      field: 'approvedDt',
      sortable: true,
      resizable: true,
      filter: true
    },
  ];

  approvedGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

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

    this.loadRowData([], this.approvedGridOptions);

    this.supplierService.getapprovedquotationitems().subscribe(
      res => {
        const data = res;
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['quotationName'] = data['result'][i]['quotation']['quotationName'];
            data['result'][i]['itemCode'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemCode'];
            data['result'][i]['itemName'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemName'];
            data['result'][i]['supplierName'] = data['result'][i]['quotation']['quotationItems'][0]['supplier']['name'];
            data['result'][i]['quantity'] = data['result'][i]['quotation']['quotationItems'][0]['quantity'];
            data['result'][i]['approvedBy'] = data['result'][i]['quotation']['approvedBy'];
            data['result'][i]['approvedDt'] = data['result'][i]['quotation']['approvedDt'];
          }
          this.loadRowData(data['result'], this.approvedGridOptions);
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
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }


  ngOnInit() {
  }

}
