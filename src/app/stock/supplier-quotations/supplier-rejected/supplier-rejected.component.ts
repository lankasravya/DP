import { Component, OnInit } from '@angular/core';

import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-supplier-rejected',
  templateUrl: './supplier-rejected.component.html',
  styleUrls: ['./supplier-rejected.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierRejectedComponent implements OnInit {

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
      field: 'unitPurchasePrice',
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
      headerName: 'Rejected By',
      field: 'approvedBy',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Rejected Date',
      field: 'approvedDt',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Reason',
      field: 'reason',
      sortable: true,
      resizable: true,
      filter: true
    },
  ];

  rejectedGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService) {
    this.rejectedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.rejectedGridOptions.rowSelection = 'single';
    this.rejectedGridOptions.columnDefs = this.columnDefs;
    this.rejectedGridOptions.rowData = [];

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

    this.loadRowData([], this.rejectedGridOptions);

    this.supplierService.getrejectedquotationitems().subscribe(
      res => {
        const data = res;
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['quotationName'] = data['result'][i]['quotation']['quotationName'];
            data['result'][i]['itemCode'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemCode'];
            data['result'][i]['itemName'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemName'];
            data['result'][i]['supplierName'] = data['result'][i]['quotation']['quotationItems'][0]['supplier']['name'];
            data['result'][i]['quantity'] = data['result'][i]['quotation']['quotationItems'][0]['quantity'];
            data['result'][i]['approvedBy'] = data['result'][i]['quotation']['rejectedBy'];
            data['result'][i]['approvedDt'] = data['result'][i]['quotation']['rejectedDate'];
            data['result'][i]['reason'] = data['result'][i]['quotation']['rejectedReason'];
          }
          this.loadRowData(data['result'], this.rejectedGridOptions);
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
    this.rejectedGridOptions.api.setQuickFilter($event.target.value);
    if (this.rejectedGridOptions.api.getDisplayedRowCount() === 0) {
      this.rejectedGridOptions.api.showNoRowsOverlay();
    } else {
      this.rejectedGridOptions.api.hideOverlay();
    }
  }

  ngOnInit() {
  }

}
