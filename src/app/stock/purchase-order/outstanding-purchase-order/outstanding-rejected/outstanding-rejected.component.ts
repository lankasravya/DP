import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AddPurchaseorderService } from './../../add-purchaseorder.service';

@Component({
  selector: 'app-outstanding-rejected',
  templateUrl: './outstanding-rejected.component.html',
  styleUrls: ['./outstanding-rejected.component.scss'],
  providers: [AddPurchaseorderService]
})
export class OutstandingRejectedComponent implements OnInit {

  columnDefs = [
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
      valueGetter:this.dateFormatter.bind(this)
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
      hide:true
    },
    {
      headerName: 'PO Disc',
      field: '',
      sortable: true,
      resizable: true,
      filter: true,
      hide:true
    },
    {
      headerName: 'Rejected By',
      field: 'rejectedBy',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Rejected Date',
      field: 'rejectedDate',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter:this.dateFormatter.bind(this)
    },
    {
      headerName: 'Reason',
      field: 'quotationModel.rejectedReason',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  approvedGridOptions: GridOptions;

  constructor(private service: AddPurchaseorderService,private datePipe:DatePipe) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

  }

  pharmacyId: number = 1;

  getApprovedData(pharmacyId: number) {
    this.service.getrejectedpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;
        for (var i = 0; i < res['result'].length; i++) {
         // data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemCode'] : null : null;
         // data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemName'] : null : null;
        //  data['result'][i]['quantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['totalQuantity'] : null;
          data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['manufacturer']['name'] : null : null;
          //data['result'][i]['unitRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['unitRate'] : null;
          data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['packRate'] : null;
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
    if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  dateFormatter(params){
		if(params.data !=null && params.data !=undefined){
			if(params.data.purchaseOrderDate !=null && params.data.purchaseOrderDate !=undefined){
				try{
					params.data.purchaseOrderDate=this.datePipe.transform(params.data.purchaseOrderDate,"dd-MM-yyyy");
				}
				catch(error){

				}
				return params.data.purchaseOrderDate;
			}
		}
	}

  ngOnInit() {
    this.getApprovedData(this.pharmacyId);
  }

}
