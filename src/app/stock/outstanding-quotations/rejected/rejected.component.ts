import {
  Component,
  OnInit
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.scss'],
  providers: [SupplierQuotationsService]
})
export class RejectedComponent implements OnInit {

  columnDefs = [
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
      filter: true
    },
    {
      headerName: 'Reason',
      field: 'rejectedReason',
      sortable: true,
      resizable: true,
      filter: true
    }
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
    this.getApprovedData(this.pharmacyId);
  }

  pharmacyId: number = 1;

  getApprovedData(pharmacyId: number) {
    this.showApprovedGrid = false;
    this.supplierService.getrequestrejectedquotationbypharmacy(pharmacyId).subscribe(
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
          this.showApprovedGrid = true;
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

  showApprovedGrid: boolean = true;

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  ngOnInit() { }

}
