import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../../add-purchaseorder.service";

@Component({
  selector: 'app-outstanding-approved',
  templateUrl: './outstanding-approved.component.html',
  styleUrls: ['./outstanding-approved.component.scss'],
  providers: [AddPurchaseorderService]
})
export class OutstandingApprovedComponent implements OnInit {

  constructor(private service: AddPurchaseorderService, private datePipe: DatePipe) {
    this.approvedPurchaseGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady.bind(this)
    };
    this.approvedPurchaseGridOptions.rowSelection = 'single';
    this.approvedPurchaseGridOptions.columnDefs = this.columnDefs;
    this.approvedPurchaseGridOptions.rowData = [];

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

  ngOnInit() {
  }

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
      filter: true
    },
    {
      headerName: 'PO Date',
      field: 'purchaseOrderDate',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: this.dateFormatter.bind(this)
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
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'PO Disc',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
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
      field: 'approvedDate',
      sortable: true,
      resizable: true,
      filter: true,
      //valueGetter :this.dateFormatter.bind(this)
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
      headerName: 'Qtn No',
      field: 'quotationModel.quotationNo',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Qtn Name',
      field: 'quotationModel.description',
      sortable: true,
      resizable: true,
      filter: true
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

  approvedPurchaseGridOptions: GridOptions;
  emailGridOptions: GridOptions;
  blob: Blob;


  pharmacyId: number = 1;

  mainData;

  gridApi;
  gridColumnApi;

  gridApi2;
  gridColumnApi2;

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

  getApprovedData(pharmacyId: number) {


    this.loadRowData([], this.approvedPurchaseGridOptions);
    // this.showApprovedGrid = true;

    // this.showApprovedGrid = false;
    this.service.getapprovedpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;

        for (var i = 0; i < res['result'].length; i++) {

          // data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['itemCode'] : null : null;
          //  data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['itemName'] : null : null;
          // data['result'][i]['totalQuantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] != null && res['result'][i]['purchaseorderitems'][0] != undefined ? res['result'][i]['purchaseorderitems'][0]['quantity'] : null : null;
          // data['result'][i]['totalValue'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] !=null && res['result'][i]['purchaseorderitems'][0] !=undefined ? res['result'][i]['purchaseorderitems'][0]['totalValue'] :null: null;
          //data['result'][i]['approvedDate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] != null && res['result'][i]['purchaseorderitems'][0] != undefined ? res['result'][i]['purchaseorderitems'][0]['approvedDate'] : null : null;
          //data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['manufacturer']['name'] : null : null;
          //  data['result'][i]['unitRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['unitRate'] : null;
          //data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['packRate'] : null;
        }

        this.loadRowData(data['result'], this.approvedPurchaseGridOptions);
      }
    );
  }

  send() {
    let data = this.approvedPurchaseGridOptions.api.getSelectedRows()[0];

    let addData = {};

    addData = data;
    addData['supplierName'] = data['supplierModel']['name'];
    addData['supplierEmail'] = data['supplierModel']['emailId'];


    this.gridApi2.updateRowData({ add: [addData], addIndex: 0 });
  }

  download() {

    // var gridApi = this.gridApi;
    // this.setPrinterFriendly(gridApi);
    // setTimeout(() => {
    //   print();
    //   this.setNormal(gridApi);
    // }, 1000);
    let uri = { "ReportCode": 'PURCHASE_ORDER_DETAILS' };

    var encoded = encodeURI(JSON.stringify(uri));

    let reportURI = encoded;
    this.service.downloadPdfFile(reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      //var link = document.createElement('a');
      //link.href = downloadURL;
      // link.download = 'SALES REPORT BY BILLID' + '.pdf';
      // link.click();

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadURL;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })
  }

  setPrinterFriendly(api) {
    var eGridDiv = document.querySelector("#approvePurchase");
    eGridDiv['style']['width'] = "";
    eGridDiv['style']['height'] = "";
    api.setDomLayout("print");
  }

  setNormal(api) {
    var eGridDiv = document.querySelector("#approvePurchase");
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

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedPurchaseGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedPurchaseGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedPurchaseGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedPurchaseGridOptions.api.hideOverlay();
    }
  }



}
