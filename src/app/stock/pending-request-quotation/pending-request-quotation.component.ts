import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import { SupplierQuotationsService } from '../supplier-quotations/supplier-quotations.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { AddPurchaseorderService } from '../purchase-order/add-purchaseorder.service';


@Component({
  selector: 'app-pending-request-quotation',
  templateUrl: './pending-request-quotation.component.html',
  styleUrls: ['./pending-request-quotation.component.scss'],
  providers: [SupplierQuotationsService, AddPurchaseorderService]
})
export class PendingRequestQuotationComponent implements OnInit {

  private getRowNodeId;

  columnDefs = [{
    headerName: 'Qtn No',
    field: 'quotationNo',
    sortable: true,
    resizable: true,
    filter: true,
    // checkboxSelection: true
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
    field: 'requestedName',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Created By',
    field: 'createdName',
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

  approvedGridOptions: GridOptions;
  pharmacyId: number = 1;

  showApprovedGrid: boolean = true;

  // onQuickFilterChanged($event) {

  //   this.onQuickFilterChanged["searchEvent"] = $event;
  //   // this.approvedGridOptions.api.setQuickFilter($event.target.value);
  //   this.onsearchrequestnewquotationbypharmacy($event);
  //   // if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
  //   //   this.approvedGridOptions.api.showNoRowsOverlay();
  //   // } else {
  //   //   this.approvedGridOptions.api.hideOverlay();
  //   // }
  // }

  onsearchrequestnewquotationbypharmacy(val) {
    this.addPurchaseOrderService.searchrequestnewquotationbypharmacy(this.pharmacyId, val).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
          
            this.approvedGridOptions.rowData = res['result'];
            this.showApprovedGrid = true;
          }
        }
      }
    );
  }

  // getApprovedData(pharmacyId: number) {
  //   this.showApprovedGrid = false;
  //   this.supplierQuotationsService.getrequestpendingquotationbypharmacy(pharmacyId).subscribe(
  //     res => {
  //       if (res instanceof Object) {
  //         if (res['responseStatus']['code'] == 200) {
  //           this.approvedGridOptions.rowData = res['result'];
  //           this.showApprovedGrid = true;
  //         }
  //       }
  //     }
  //   )
  // }

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.quotation-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').show();
        $('.grid-area').hide();
      });

    });
    this.quotationInformationForm = new FormGroup(this.quotationInformationFormValidations);

  }

  selctedQuotation;

  editGrid() {
    this.showForm = false;
    this.selctedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    this.quotationInformationForm.setValue({
      quotationNo: this.selctedQuotation.quotationNo,
      description: this.selctedQuotation.description,
      createdBy: this.selctedQuotation.createdBy,
      quotationDt: this.selctedQuotation.quotationDt,
      quotationExpiryDt: this.selctedQuotation.quotationExpiryDt,
      quantity: ''
    });
    this.selectedEmployee = this.employees.find(x => x.employeeId == this.selctedQuotation.requestedby.employeeId);
  }

  checkFormDisability() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      return ((this.quotationInformationForm.get('quotationNo').errors instanceof Object)
        || (this.quotationInformationForm.get('description').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationDt').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationExpiryDt').errors instanceof Object)
        || !(this.selectedEmployee instanceof Object)
        || this.quotationGridOptions.rowData.length === 0)
    }
  }

  quotationInformationForm: FormGroup;

  quotationInformationFormValidations = {
    quotationNo: new FormControl('', [Validators.required]),
    selectedEmployee: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    quotationDt: new FormControl('', [Validators.required]),
    quotationExpiryDt: new FormControl('', [Validators.required]),
    quantity: new FormControl('', Validators.required)
  };

  itemParameter: string = "";
  itemSearchTerm: string = "";
  selectedItem;
  quotationGridOptions: GridOptions;

  onItemSelected() {
    this.selectedItem = JSON.parse(JSON.stringify(this.itemGridOptions.api.getSelectedRows()[0]));
  }

  addRowsToPurchaseOrderGrid() {
    this.selectedItem['quantity'] = this.quotationInformationForm.get('quantity').value;
    this.selectedItem['supplierModel'] = JSON.parse(JSON.stringify(this.selectedSupplier));
    let addItem = JSON.parse(JSON.stringify(this.selectedItem))
    this.quotationGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 0
    });
    this.quotationGridOptions.rowData = this.quotationGridOptions.rowData.concat([addItem]);
  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object && this.quotationGridOptions.rowData.length > 0) {
      return this.quotationGridOptions.rowData.map(x => x.itemsModel.itemId).some(x => x == this.selectedItem['itemsModel']['itemId']);
    }
    else return false;
  }

  suppliers = [];

  getActiveSuppliers(searchTerm: string) {
    this.addPurchaseOrderService.getSuppliersData(searchTerm).subscribe(
      activeSupplierResponse => {
        if (activeSupplierResponse instanceof Object) {
          if (activeSupplierResponse['responseStatus']['code'] === 200) {
            this.suppliers = activeSupplierResponse['result'];
          }
        }
      }
    );
  }

  selectedSupplier;
  selectedSupplierName: string = '';

  onSupplierChange(selectedSupplier: any) {
    if (selectedSupplier instanceof Object) {
      this.selectedItem = undefined;
      this.selectedSupplier = selectedSupplier;
      this.selectedSupplierName = selectedSupplier['name'];
      this.retrieveSupplierItems(selectedSupplier['supplierId']);
    }
    else {
      this.selectedSupplier = undefined;
    }
  }

  retrieveSupplierItems(supplierId: number) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.retrieveSupplierItems(supplierId).subscribe(
      retrieveSupplierItemsResponse => {
        if (retrieveSupplierItemsResponse instanceof Object) {
          if (retrieveSupplierItemsResponse['responseStatus']['code'] === 200) {
            this.itemGridOptions.rowData = retrieveSupplierItemsResponse['result'];
            this.showItemGrid = true;
          }
        }
      }
    );
  }

  /**
 * Item Grid Changes
 * Start
 */

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
    { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, resizable: true,filter: true },
    { headerName: 'Item Name', field: 'itemsModel.itemName', sortable: true, resizable: true,filter: true, },
    { headerName: 'Item Description', field: 'itemsModel.itemDescription', sortable: true, resizable: true,filter: true },
  ]

	/**
	 * Item Grid Changes
	 * End
	 */

  quotationcolumnDefs = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true
    },
    {
      headerName: 'Quotation Id',
      field: 'quotationId',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
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
      filter: true,
      resizable: true,
      editable: true
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

  constructor(private supplierQuotationsService: SupplierQuotationsService, private toasterService: ToastrService,
    private appService: AppService, private addPurchaseOrderService: AddPurchaseorderService) {

    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];
    // this.getApprovedData(this.pharmacyId)

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    // this.appService.getPurchaseOrderDeletedRow().subscribe(
    //   (deletedRow: ICellRendererParams) => {
    //     if (deletedRow instanceof Object) {
    //       let deleteData = this.quotationGridOptions.rowData.filter(
    //         x => x.itemId === deletedRow.data.itemId
    //       );
    //       try {
    //         this.quotationGridOptions.api.updateRowData({ remove: deleteData });
    //         let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, deleteData[0], 'itemId');
    //         let deleteRowObj: Object = this.quotationGridOptions.rowData[deleteIndex];
    //         if (deleteRowObj.hasOwnProperty('quotationItemsId') && this.showForm == false) {
    //           this.deleteQuotationItem(deleteRowObj['quotationItemsId']);
    //         }
    //         if (deleteIndex !== -1) {
    //           this.quotationGridOptions.rowData.splice(deleteIndex, 1);
    //         }
    //       } catch (e) {
    //        
    //       }
    //     }
    //   }
    // );
    this.retrieveInitialValues();
  }

  deleteQuotationItem() {
    const row = this.gridApi2.getSelectedRows();
    if (row.length > 0) {
      const id = row[0].quotationId;
      this.addPurchaseOrderService.deletequotationItem(id).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              try {
                this.quotationGridOptions.api.updateRowData({ remove: row });
                let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], 'quotationId');
                if (deleteIndex !== -1) {
                  this.quotationGridOptions.rowData.splice(deleteIndex, 1);
                  this.quotationInformationForm.reset();
                  $('#pendingModal').modal('hide');
                }
              } catch (e) {
              }
            }
          }
        }
      );
    }
  }

  employees: any[];
  selectedEmployee;

  getAllEmployees() {
    this.addPurchaseOrderService.getallemployeesdata().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.employees = res['result'];
          }
        }
      }
    )
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  generateQuotationNo(pharmacyId) {
    this.supplierQuotationsService.generatequotationno(pharmacyId).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.quotationInformationForm.patchValue({ quotationNo: res['result'] })
          }
        }
      }
    )
  }

  checkQuantity() {
    if (typeof this.quotationInformationForm.get('quantity').value === 'number') {
      return true;
    }
    else return false;
  }


  getactiveItemsData() {
    this.showItemGrid = false;
    this.supplierQuotationsService.getactiveitemsdata().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.itemGridOptions.rowData = res['result'];
            this.showItemGrid = true;
          }
        }
      }
    )
  }


  onSeachTermClick() {
    this.getItembysupplieritemcditemname(this.selectedSupplier['supplierId'], this.itemParameter, this.itemSearchTerm);
  }

  getItembysupplieritemcditemname(supplierId: number, itemCode: string, itemName: string) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.getItembysupplieritemcditemname(supplierId, itemCode, itemName).subscribe(
      itemReponse => {
        if (itemReponse instanceof Object) {
          if (itemReponse['responseStatus']['code'] == 200) {
            this.itemGridOptions.rowData = itemReponse['result'];
            this.showItemGrid = true;
          }
        }
      }
    );
  }

  onSubmit() {

  }

  private gridApi;
  private gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private gridApi2;
  private gridColumnApi2;

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  formatPayload(payload) {
    payload = {};
    const new_desc = $('#requestQuotDesc').val();
    const new_quant = this.gridApi2.getSelectedRows()[0]['quantity'];

    payload['createdId'] = this.dataToSend.createdBy.employeeId;
    payload['createdUser'] = this.dataToSend.createdUser;
    payload['requestedId'] = this.dataToSend.requestedby.employeeId;
    payload['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };

    payload['supplier'] = { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId };
    payload['description'] = new_desc;
    payload['quotationDt'] = this.dataToSend.quotationDt;
    payload['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
    payload['quotationNo'] = this.dataToSend.quotationNo;
    payload['quotationItems'] = [{
      'activeS': this.dataToSend.quotationItems[0].item.activeS,
      'item': { 'itemId': this.dataToSend.quotationItems[0].item.itemId },
      'createdUser': this.dataToSend.createdUser, 'discountPercentage': this.dataToSend.quotationItems[0].discountPercentage,
      'formulation': this.dataToSend.quotationItems[0].item.itemForm.form,
      'manufacturerLicense': this.dataToSend.quotationItems[0].item.manufacturer.licence,
      'manufacturerName': this.dataToSend.quotationItems[0].item.manufacturer.name,
      'quantity': new_quant,
      'supplier': { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId },
      'quotationItemId': this.dataToSend.quotationItems[0].quotationItemId
    }];
    payload['quotationId'] = this.dataToSend.quotationId;
    return payload;
  }

  showForm: boolean = true;

  retrieveInitialValues() {
    this.itemParameter = "";
    this.itemSearchTerm = "";
    this.selectedEmployee = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedSupplierName = '';
    this.generateQuotationNo(this.pharmacyId);
    this.getActiveSuppliers('');
    this.getAllEmployees();
    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
    this.showGrid = false;
    this.loadRowData([], this.approvedGridOptions);
    this.showGrid = true;

    this.addPurchaseOrderService.getrequestnewquotationbypharmacy(this.pharmacyId).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            const data = res;
            if ((data['result']).length > 0) {
              for (var i = 0; i < (data['result']).length; i++) {
                if (data['result'][i]['quotationItems']) {
                  data['result'][i]['status'] =  data['result'][i]['quotationItems'][0]['quotationItemStatus']['status'];
                  data['result'][i]['itemName'] = data['result'][i]['quotationItems'][0]['item']['itemName'];
                  data['result'][i]['itemId'] = data['result'][i]['quotationItems'][0]['item']['itemId'];
                }
              }
              this.approvedGridOptions.api.updateRowData({ add: data['result'] });
            }
          }
        }
      }
    );

  }

  dataToSend;

  setData(data) {
    $('#requestQuotNumber').val(data.quotationNo);
    data.requestedby ? $('#requestQuotRequested').val(data.requestedby.firstName) : $('#requestQuotRequested').val(data.requestedName);
    data.requestedby ? $('#requestQuotCreated').val(data.createdUser) : $('#requestQuotCreated').val(data.createdName);
    $('#requestQuotDated').val(data.quotationDt);
    $('#requestQuotExpiry').val(data.quotationExpiryDt);
    $('#requestQuotDesc').val(data.description);
    this.quotationGridOptions.api.setRowData(
      [{
        itemCode: data.quotationItems ? data.quotationItems[0].item.itemCode : '',
        quotationId: data.quotationId,
        itemName: data.quotationItems ? data.quotationItems[0].item.itemName : '',
        itemDescription: data.description,
        name: data.quotationItems ? data.quotationItems[0].supplier.name : '',
        quantity: data.quotationItems ? data.quotationItems[0].quantity : '',
        manuf: data.quotationItems ? data.quotationItems[0].item.manufacturer.name : '',
        formulation: data.quotationItems ? data.quotationItems[0].item.itemForm.form : ''
      }]);
    setTimeout(() => {
      $('#pendingModal').modal('show');
      this.dataToSend = data;
    }, 100);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows[0] !== undefined) {
      this.setData(selectedRows[0]);
    }
  }

  en_dis = false;

  onSelectionChanged2() {
    var selectedRows = this.gridApi2.getSelectedRows();
    if (selectedRows.length > 0) {
      this.en_dis = true;
    } else {
      this.en_dis = false;
    }
  }

  onFilterTextBoxChanged() {
    
    this.onsearchrequestnewquotationbypharmacy($('#filter-text-box').val());
    this.gridApi.setQuickFilter($('#filter-text-box').val());
  }

  showGrid: boolean = true;

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  approval() {
    let sendData = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    sendData['createdId'] = this.dataToSend.createdBy ? this.dataToSend.createdBy.employeeId : this.dataToSend.createdId;
    sendData['createdUser'] = this.dataToSend.createdUser ? this.dataToSend.createdUser : this.dataToSend.createdName;
    sendData['requestedId'] = this.dataToSend.requestedby ? this.dataToSend.requestedby.employeeId : this.dataToSend.requestedId;
    if (this.dataToSend.pharmacyModel) {
      sendData['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel ? this.dataToSend.pharmacyModel.pharmacyId : '' };
    }

    sendData['supplier'] = { 'supplierId': this.dataToSend.quotationItems ? this.dataToSend.quotationItems[0].supplier.supplierId : '' };
    sendData['description'] = $('#requestQuotDesc').val();
    sendData['quotationDt'] = this.dataToSend.quotationDt;
    sendData['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
    sendData['quotationNo'] = this.dataToSend.quotationNo;
    if (this.dataToSend.quotationItems) {
      sendData['quotationItems'] = [{
        'activeS': this.dataToSend.quotationItems[0].item.activeS,
        'item': { 'itemId': this.dataToSend.quotationItems[0].item.itemId },
        'createdUser': this.dataToSend.createdUser, 'discountPercentage': this.dataToSend.quotationItems[0].discountPercentage,
        'formulation': this.dataToSend.quotationItems[0].item.itemForm.form,
        'manufacturerLicense': this.dataToSend.quotationItems[0].item.manufacturer.licence,
        'manufacturerName': this.dataToSend.quotationItems[0].item.manufacturer.name,
        'quantity': this.quotationGridOptions.api.getRowNode('0').data.quantity,
        'supplier': { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId },
        'quotationItemId': this.dataToSend.quotationItems[0].quotationItemId
      }];
    } else {
      sendData['quotationItems'] = [{}];
    }
    sendData['quotationId'] = this.dataToSend.quotationId;

    this.addPurchaseOrderService.approvalquotation(sendData).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.retrieveInitialValues();
            this.quotationInformationForm.reset();
            $('#pendingModal').modal('hide');
            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      }
    );
  }

  onCancel() {
    this.quotationInformationForm.reset();
    this.retrieveInitialValues();
    this.showForm = true;
  }

  later() {
    this.addPurchaseOrderService.laterquotation(this.formatPayload(this.quotationInformationForm.value)).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.retrieveInitialValues();
            this.quotationInformationForm.reset();
            $('#pendingModal').modal('hide');
            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      }
    );
  }

}
