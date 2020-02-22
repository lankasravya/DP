import {
  Component,
  OnInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef, ICellRendererParams, RowNode } from 'ag-grid-community';
import { SupplierQuotationsService } from '../supplier-quotations/supplier-quotations.service';
import { AddPurchaseorderService } from '../purchase-order/add-purchaseorder.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-request-new-quotation',
  templateUrl: './request-new-quotation.component.html',
  styleUrls: ['./request-new-quotation.component.scss'],
  providers: [SupplierQuotationsService, AddPurchaseorderService]
})
export class RequestNewQuotationComponent implements OnInit {

  quotationInformationForm: FormGroup;

  quotationInformationFormValidations = {
    quotationNo: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    quotationDt: new FormControl('', [Validators.required]),
    quotationExpiryDt: new FormControl('', [Validators.required]),
    quantity: new FormControl('', Validators.required),
    created: new FormControl('', Validators.required),
    reqBy: new FormControl('', Validators.required),
  };

  createdBy;

  itemParameter: string = "";
  itemSearchTerm: string = "";
  selectedItem;
  quotationGridOptions: GridOptions;
  private getRowNodeId;

  onItemSelected() {
    this.selectedItem = JSON.parse(JSON.stringify(this.itemGridOptions.api.getSelectedRows()[0]));
    this.itemGridOptions.api.setRowData([]);
    $('#itemParams').value = '';
    this.itemParameter = "";
    this.addRowsToPurchaseOrderGrid();
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
    $('#itemSearchModal').modal('hide');
  }

  noSelection() {
    $('#searchTerm').value = '';
    $('#itemParams').value = '';
    this.itemParameter = "";
    this.itemGridOptions.api.setRowData([]);
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
  }

  addRowsToPurchaseOrderGrid() {
    this.selectedItem['quantity'] = this.quotationInformationForm.get('quantity').value;
    this.selectedSupplierName = this.selectedItem.supplierName;
    const addItem = JSON.parse(JSON.stringify(this.selectedItem));
    this.quotationGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 1
    });
    this.quotationGridOptions.rowData = this.quotationGridOptions.rowData.concat(addItem);
  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object && this.quotationGridOptions.rowData.length > 0) {
      return this.quotationGridOptions.rowData.map(x => x.itemId).some(x => x == this.selectedItem['itemId']);
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
    { headerName: 'Item Code', field: 'itemCode', sortable: true,resizable: true, filter: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true,resizable: true, filter: true, },
    { headerName: 'Formulation', field: 'formulation', sortable: true,resizable: true, filter: true, },
    { headerName: 'Supplier', field: 'supplierName', sortable: true,resizable: true, filter: true, },
    { headerName: 'Manufacturer', field: 'manufacturerName', sortable: true,resizable: true, filter: true, },
    { headerName: 'Item Description', field: 'itemDescription', sortable: true,resizable: true, filter: true },
  ]

	/**
	 * Item Grid Changes
	 * End
	 */

  columnDefs = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
      // cellRendererFramework: CheckBoxComponent
    }, {
      headerName: 'Item Code',
      field: 'itemCode',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      singleClickEdit: true,
      suppressKeyboardEvent: this.suppressEnterItemCode.bind(this),
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      singleClickEdit: true,
      suppressKeyboardEvent: this.suppressEnterItemName.bind(this)
    },
    {
      headerName: 'Formulation',
      field: 'formulation',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Supplier',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Manufacturer',
      field: 'manufacturerName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Description',
      field: 'itemDescription',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    }
  ];

  onGridReady(params) {

  }

  constructor(private supplierQuotationsService: SupplierQuotationsService, private toasterService: ToastrService,
    private appService: AppService, private spinnerService: Ng4LoadingSpinnerService, private addPurchaseOrderService: AddPurchaseorderService, private router: Router) {
    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.columnDefs;
    this.quotationGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    this.appService.getPurchaseOrderDeletedRow().subscribe(
      (deletedRow: ICellRendererParams) => {
        if (deletedRow instanceof Object) {
          let deleteData = this.quotationGridOptions.rowData.filter(
            x => x.itemId === deletedRow.data.itemId
          );
          try {
            this.quotationGridOptions.api.updateRowData({ remove: deleteData });
            let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, deleteData[0], 'itemId');
            if (deleteIndex !== -1) {
              this.quotationGridOptions.rowData.splice(deleteIndex, 1);
            }
          } catch (e) {
            
          }
        }
      }
    );
    this.retrieveInitialValues();
  }

  employees: any[];
  selectedEmployee;

  selectedSearchTerms;
  itemSearchKey;
  suppressEnterItemCode(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    // this.isItemSearchEnabled = suppress;
    if (suppress) {

      this.selectedSearchTerms = "itemCode";
      if (params['event']['target']['value'] != '') {
        // this.stockGridOptions.api.setRowData([]);
        // this.stockRowData = [];
        this.itemSearchKey = params['event']['target']['value'];
        this.onSeachTermClick();
        document.getElementById('itemSearchModal').classList.add("show");
        document.getElementById('itemSearchModal').style.display = "block";
      }
    }
    return false;
  }

  suppressEnterItemName(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    // this.isItemSearchEnabled = suppress;
    // if (suppress) {

    //   this.selectedSearchTerms = "Item Name";
    //   if (params['event']['target']['value'] != '') {
    //     this.stockGridOptions.api.setRowData([]);
    //     this.stockRowData = [];
    //     this.itemSearchKey = params['event']['target']['value'];
    //     this.searchItemByCodeInStock();
    //     document.getElementById('itemSearchModal').classList.add("show");
    //     document.getElementById('itemSearchModal').style.display = "block";
    //   }
    // }
    return false;
  }

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

  pharmacyId: number = 1;

  generateQuotationNo(pharmacyId) {
    this.supplierQuotationsService.generatequotationno(pharmacyId).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.quotationInformationForm.patchValue({ quotationNo: res['result'] });
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

  ngOnInit() {
    this.quotationInformationForm = new FormGroup(this.quotationInformationFormValidations);
    this.quotationGridOptions.rowData = [{}];
  }

  onSeachTermClick() {
   
    this.getItembysupplieritemcditemname(this.itemParameter, this.itemSearchTerm, this.selectedSupplier.supplierId);
  }

  onSeachTermClick2() {
   
    this.showItemGrid = false;
    this.addPurchaseOrderService.getitemsbyitemcodeoritemnameoritemdesc(this.selectedSearchTerms, this.itemSearchKey, this.selectedSupplier.supplierId).subscribe(
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

  getItembysupplieritemcditemname(itemCode: string, itemName: string, supplierId) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.getitemsbyitemcodeoritemnameoritemdesc(itemCode, itemName, supplierId).subscribe(
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

  deleteRow() {
    const row = this.quotationGridOptions.api.getSelectedRows();
    try {
      this.quotationGridOptions.api.updateRowData({ remove: row });
      let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], 'itemId');
      if (deleteIndex !== -1) {
        this.quotationGridOptions.rowData.splice(deleteIndex, 1);
      }
    } catch (e) {
     
    }
  }

  formatPayload(payload, data) {
    // payload['createdBy'] = { employeeId: this.selectedEmployee.employeeId };
    delete payload['quantity'];
    payload['createdId'] = this.createdBy.employeeId;     //check
    payload['createdUser'] = localStorage.getItem('user');
    // payload['createdUser'] = this.quotationInformationForm.get('created').value.firstName;  //check
    payload['requestedId'] = this.selectedEmployee.employeeId;
    payload['pharmacyModel'] = { "pharmacyId": this.pharmacyId };
    let quotationItemArray = [];
    // this.quotationGridOptions.rowData.forEach(
    // dataRow => {
    let quotationDataRow = JSON.parse(JSON.stringify(data));
    if (quotationDataRow['itemId'] !== undefined && quotationDataRow['itemName'] !== undefined) {
      quotationDataRow['supplier'] = { 'supplierId': quotationDataRow['supplierId'] };
      quotationDataRow['item'] = { 'itemId': quotationDataRow['itemId'] };
      // quotationDataRow['createdUser'] = this.quotationInformationForm.get('created').value.firstName;
      quotationDataRow['createdUser'] = localStorage.getItem('user');
      delete quotationDataRow['itemsModel'];
      delete quotationDataRow['supplierModel'];
      delete quotationDataRow['itemCode'];
      delete quotationDataRow['itemDescription'];
      delete quotationDataRow['itemId'];
      delete quotationDataRow['itemName'];
      delete quotationDataRow['itemSupplierId'];
      delete quotationDataRow['supplierId'];
      delete quotationDataRow['supplierName'];
      delete quotationDataRow['supplierPriority'];
      quotationItemArray.push(quotationDataRow);
    }
    // }
    // );
    payload['quotationItems'] = quotationItemArray;
   

    return payload;
  }

  // thisDay;
  today: any;

  retrieveInitialValues() {
    this.itemParameter = "";
    this.itemSearchTerm = "";
    this.createdBy = localStorage.user;
    this.selectedEmployee = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedSupplierName = '';
    this.generateQuotationNo(this.pharmacyId);
    // this.getActiveSuppliers('');
    this.getAllEmployees();
    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
    this.showGrid = false;
    this.loadRowData([{}], this.quotationGridOptions);
    this.showGrid = true;

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
   
    setTimeout(() => {
      this.quotationInformationForm.patchValue({ quotationDt: this.today });
      this.quotationInformationForm.patchValue({ created: localStorage.user });
    }, 200);

    setTimeout(() => {
      this.getRowNodeId = function (data) {
       
        return data.symbol;
      };

      var rowNode = this.quotationGridOptions.api.getRowNode('0');
      rowNode.addEventListener(RowNode.EVENT_ROW_SELECTED, function () {
        $('#itemSearchModal').modal('show');
        rowNode.setSelected(false, true);
      });
    }, 200);

  }

  changeDate(event: any) {
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const selectedDate = formatDate(event, 'yyyy-MM-dd', 'en-US');
  }

  setItemsGrid() {
    this.itemGridOptions.api.setRowData([]);
    $('#itemParams').value = '';
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
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

  // onQuantityChange(params) {
 
  // }

  approval() {
    const data = this.quotationGridOptions.api.getSelectedRows()[0];
    // this.formatPayload(this.quotationInformationForm.value, data);
    if (data) {
      this.spinnerService.show();
      this.addPurchaseOrderService.approvalquotation(this.formatPayload(this.quotationInformationForm.value, data)).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.spinnerService.hide();
              this.retrieveInitialValues();
              this.setItemsGrid();
              this.quotationInformationForm.reset();
              this.toasterService.success(res['message'], 'Success', {
                timeOut: 3000
              });
            }
          }
        },error=>{
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      );
    }
  }

  checkFormDisability() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      return ((this.quotationInformationForm.get('quotationNo').errors instanceof Object)
        || (this.quotationInformationForm.get('description').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationDt').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationExpiryDt').errors instanceof Object)
        || !(this.selectedEmployee instanceof Object)
        || (this.quotationInformationForm.get('created').errors instanceof Object)
        || this.quotationGridOptions.rowData.length === 1);
    }
  }

  getTotalQuantity() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      if (this.quotationGridOptions.rowData.length > 1) {
        const temp = this.quotationGridOptions.api.getSelectedRows()[0];
        if (temp) {
        
          if (Number(temp.quantity) > 0) {
         
            return false;
          }
        }
      }
    }
    return true;
  }

  checkFormDisability2() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      return (this.quotationGridOptions.rowData.length === 1);
    }
  }

  later() {
    const data = this.quotationGridOptions.api.getSelectedRows()[0];
    if (data) {
      this.addPurchaseOrderService.laterquotation(this.formatPayload(this.quotationInformationForm.value, data)).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.retrieveInitialValues();
              this.setItemsGrid();
              this.quotationInformationForm.reset();
              this.toasterService.success(res['message'], 'Success', {
                timeOut: 3000
              });
            }
          }
        }
      );
    }
  }

  item_supplier() {
    this.router.navigate(['/master/itemsuppliers']);
  }

  supplier_item() {
    this.router.navigate(['/master/itemsuppliers'], { state: { data: 'Supplier-Item' } });
  }

  onlyCharKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32);
  }

}
