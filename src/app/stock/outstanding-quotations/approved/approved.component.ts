import {
  Component,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss'],
  providers: [SupplierQuotationsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovedComponent {

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
      headerName: 'Approved By',
      field: 'approvedBy',
      sortable: true,
      resizable: true,
      filter: true
    }, {
      headerName: 'Approved Date',
      field: 'approvedDt',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  emailColumns = [
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
      headerName: 'Supplier Details',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier Email ID',
      field: 'supplierEmail',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  approvedGridOptions: GridOptions;
  emailGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService, private cdRef: ChangeDetectorRef) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady.bind(this)
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.emailGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady2.bind(this)
    };
    this.emailGridOptions.rowSelection = 'single';
    this.emailGridOptions.columnDefs = this.emailColumns;
    this.emailGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);
  }

  pharmacyId: number = 1;

  mainData;

  gridApi;
  gridColumnApi;

  gridApi2;
  gridColumnApi2;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  en_dis = true;
  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.en_dis = false;
    } else {
      this.en_dis = true;
    }
  }

  en_dis2 = true;
  onSelectionChanged2() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.en_dis2 = false;
    } else {
      this.en_dis2 = true;
    }
  }


  getApprovedData(pharmacyId: number) {

    this.showApprovedGrid = true;
    this.loadRowData([], this.approvedGridOptions);
    // this.showApprovedGrid = true;

    // this.showApprovedGrid = false;
    this.supplierService.getrequestapprovedquotationbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;

        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['itemName'] = data['result'][i]['quotationItems'][0]['item']['itemName'];
          }

          setTimeout(() => {
            this.loadRowData(data['result'], this.approvedGridOptions);
            // this.approvedGridOptions.rowData = data['result'];
          }, 100);

          this.mainData = data['result'];
          // this.showApprovedGrid = true;
        }
      }
    );
  }

  send() {
    let data = this.approvedGridOptions.api.getSelectedRows();
    data = data[0];
    let addData = {};

    addData['supplierName'] = data['quotationItems'][0]['supplier']['name'];
    addData['supplierEmail'] = data['quotationItems'][0]['supplier']['emailId'];

    this.gridApi2.updateRowData({ add: [addData], addIndex: 0 });
  }

  download() {
    var gridApi = this.gridApi;
    this.setPrinterFriendly(gridApi);
    setTimeout(() => {
      print();
      this.setNormal(gridApi);
    }, 1000);
  }

  setPrinterFriendly(api) {
    var eGridDiv = document.querySelector("#approve");
    eGridDiv['style']['width'] = "";
    eGridDiv['style']['height'] = "";
    api.setDomLayout("print");
  }

  setNormal(api) {
    var eGridDiv = document.querySelector("#approve");
    eGridDiv['style']['width'] = "100%";
    eGridDiv['style']['height'] = "200px";
    api.setDomLayout(null);
  }

  onCellClicked(params) {
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
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }


}
