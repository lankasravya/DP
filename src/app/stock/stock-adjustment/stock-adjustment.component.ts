import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { ToastrService } from 'ngx-toastr';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { AddpurchaseorderinvoiceService } from '../purchase-invoice/addpurchaseorderinvoice.service';
import { StockAdjustmentModel } from '../new-stock/stock-adjustment/shared/stockadjustment.model';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss'],
  providers: [AddpurchaseorderinvoiceService, DatePipe]
})

export class StockAdjustmentComponent implements OnInit {

  constructor(
    private invoiceStockService: AddpurchaseorderinvoiceService, private toasterService: ToastrService,
    private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.columnDefs;

    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.stockGridOptions.columnDefs = this.columnDefs;

    this.getAllItemsByLimitWithItemCode(0, 300);
  }

  ngOnInit() {
    this.stockAdjustForm = new FormGroup(this.stockAdjustFormValidations);
    this.reset();
  }

  selectedItem: any;


  items = [
    { name: 'Item Code' },
    { name: 'Item Name' },
    { name: 'Item Description' },
    { name: 'Item Generic Name' }
  ];

  selectedItems = { name: 'Item Code' }
  stockAdjustForm: FormGroup;
  stockAdjustFormValidations = {
    batch: new FormControl('', [Validators.required]),
    expiry: new FormControl('', [Validators.required])
  }

  checkFormDisability() {
    return (this.stockAdjustForm.get('batch').errors instanceof Object)
      || (this.stockAdjustForm.get('expiry').errors instanceof Object)
  }

  itemsDropdown: any;

  getAllItemsByLimit(start, end) {
    this.invoiceStockService.getItemsByLimit(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.itemsDropdown = itemResponse['result'];

        }
      }

    },
      error => {
        //  this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }

  getAllItemsByLimitWithGenericName(start, end) {
    this.invoiceStockService.getItemsByLimitWithGeneric(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.itemsDropdown = itemResponse['result'];

        }
      }

    },
      error => {
        //  this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }


  getAllItemsByLimitWithItemCode(start, end) {
    this.invoiceStockService.getItemsByLimitWithCode(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.itemsDropdown = itemResponse['result'];
        }
      }

    },
      error => {
        //  this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }


  getAllItemsByLimitWithItemDesc(start, end) {
    this.invoiceStockService.getItemsByLimitWithDesc(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.itemsDropdown = itemResponse['result'];
        }
      }

    },
      error => {
        //  this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 3000
          });
      })
  }


  searchItem(searchKey) {
    if (this.searchCriteria == 'Item Name') {
      if (searchKey['term'] != "") {
        this.invoiceStockService.getItemByName(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }
    else if (this.selectedItems['name'] == 'Item Code') {
      if (searchKey['term'] != "") {
        this.invoiceStockService.getItemByCode(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }
    else if (this.searchCriteria == 'Item Description') {
      if (searchKey['term'] != "") {
        this.invoiceStockService.getItemByDesc(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    } else if (this.searchCriteria == 'Item Generic Name') {
      if (searchKey['term'] != "") {
        this.invoiceStockService.getItemByGericName(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }

    else if (this.searchCriteria == 'Item Code') {
      if (searchKey['term'] != "") {

        this.invoiceStockService.getItemByCode(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }
    else if (this.searchCriteria == 'Item Generic Name') {

      if (searchKey['term'] != "") {

        this.invoiceStockService.getItemByGeneric(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }




  }
  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  columnDefs: ColDef[] = [
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
    { headerName: 'Item Code', field: 'item.itemCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'item.itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer },
    { headerName: 'Formulation', field: 'form.form', sortable: true, resizable: true, filter: true },
    { headerName: 'Batch No', field: 'stock.batchNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Expiry Date', field: 'stock.expiryDt', sortable: true, resizable: true, filter: true },
    { headerName: 'Unit Sale Rate', field: 'stock.unitSaleRate', sortable: true, resizable: true, filter: true },
    { headerName: 'OnHandStock', field: 'onHandStock', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Total Value', field: 'total', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        var units = params.data.stock.unitSaleRate;
        var total = (params.data.onHandStock * units)
        return total;
      },
      editable: true
    }

  ];



  columnDefsformain: ColDef[] = [
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

    { headerName: 'Item Code', field: 'itemCode', sortable: true, resizable: true, filter: true, pinned: 'left' },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, pinned: 'left',cellRenderer: this.tooltipRenderer },
    { headerName: 'Stock Adj Date', field: 'date', sortable: true, resizable: true, filter: true, type: 'Date' },
    { headerName: 'Formulation', field: 'form', sortable: true, resizable: true, filter: true },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Expiry Date', field: 'expiryDt', sortable: true, resizable: true, filter: true },
    { headerName: 'Unit Sale Rate', field: 'unitSaleRate', sortable: true, resizable: true, filter: true },
    { headerName: 'OnHandStock', field: 'onHandStock', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Adjustable Stock', field: 'adjustedStock', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var recievedPhysicalStock = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        params.data.adjustedStock = recievedPhysicalStock;
        return recievedPhysicalStock;

      },
      editable: true
    },
    {
      headerName: 'Physical Stock', field: 'physicalStock', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var unitRate = params.data.onHandStock;
        var recieveAdjustStock = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        var physicalStock = unitRate - recieveAdjustStock;
        params.data.physicalStock = physicalStock;
        return physicalStock;
      },
      editable: true
    },
    {
      headerName: 'Total Value', field: 'total', sortable: true, filter: true, resizable: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        var total = isNaN(params.data.onHandStockValue) ? 0 : params.data.onHandStockValue;
        var units = params.data.unitSaleRate;
        total = params.data.onHandStock * units;

        params.data.total = total;
        return total;
      },
      editable: true
    },

    {
      headerName: 'Adjustable Value', field: 'adjustmentValue', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        var unitRate = params.data.unitSaleRate;
        var recievedStockValue = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        var adjustmentValues = unitRate * recievedStockValue;
        params.data.adjustmentValue = adjustmentValues;
        return adjustmentValues;
      }, editable: true
    },
    {
      headerName: 'Physical Value', field: 'physicalValue', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,

      valueGetter: function (params) {

        var total = isNaN(params.data.onHandStockValue) ? 0 : params.data.onHandStockValue;
        var units = params.data.unitSaleRate;
        total = params.data.onHandStock * units;

        var recievedStockValue = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        var adjustmentValues = units * recievedStockValue;
        var physicalValues = total - adjustmentValues;
        params.data.physicalValue = physicalValues;
        return physicalValues;
      }, editable: true,

    },

  ];



  itemGridOptions: GridOptions;
  stockGridOptions: GridOptions;
  showGrid: boolean = false;
  rowData = [];
  searchCriteria;
  search: string = '';
  stockItemArray: StockAdjustmentModel[] = [];

  /* sending params */
  expiryDt: string = '';
  batchNumber: string = '';
  pharmacy = { 'pharmacyId': localStorage.getItem('pharmacyId') };


  reset() {
    this.search = null;
    this.selectedItems = { name: 'Item Code' }
    this.batchNumber = null;
    this.expiryDt = null;
    this.stockAdjustForm.reset();

  }

  resetsForChange() {
    this.batchNumber = null;
    this.expiryDt = null;
    this.stockAdjustForm.reset();
    this.stockGridOptions.api.setRowData([]);
    this.search = null;
  }

  onClickItem(event: Event) {
    this.resetsForChange();
    this.searchCriteria = event['name'];

    if (this.searchCriteria == 'Item Description') {
      this.getAllItemsByLimitWithItemDesc(0, 200);
    }
    else if (this.searchCriteria == 'Item Name') {
      this.getAllItemsByLimit(0, 200);
    }
    else if (this.searchCriteria == "Item Code") {
      this.getAllItemsByLimitWithItemCode(0, 200);
    }
    else if (this.searchCriteria == 'Item Generic Name') {
      this.getAllItemsByLimitWithGenericName(0, 200);
    }

  }

  batchArray: any;
  itemSearch: string = '';



  searchItemToGetBatch(event) {

    this.itemSearch = event['target']['value'];

    if (this.searchCriteria == 'Item Name') {
      this.invoiceStockService.getStockBatchesBasedOnItemName(this.selectedItemId['itemName']).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            this.batchArray = res['result'];

            /*  if (this.batchArray.length == 0) {
               this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                 timeOut: 3000
               })
             } */
          }
        }
      )
    }
    else if (this.searchCriteria == 'Item Description') {
      this.invoiceStockService.getStockBatchesBasedOnItemDesc(this.itemSearch).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            this.batchArray = res['result'];
            /* if (this.batchArray.length == 0) {
              this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                timeOut: 3000
              })
            } */
          }
        }
      )
    }
    else if (this.searchCriteria == 'Item Generic Name') {
      this.invoiceStockService.getStockBatchesBasedOnItemGeneric(this.itemSearch).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            this.batchArray = res['result'];
            /*  if (this.batchArray.length == 0) {
               this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                 timeOut: 3000
               })
             } */
          }
        }
      )
    }


  }

  onBatchSelected(event) {
    this.batchNumber = event['batchNo'];
    if (this.selectedItems['name'] == "Item Code") {
      this.invoiceStockService.getExpiryBasedOnItemandBatch(this.selectedItemId['itemId'], this.batchNumber).subscribe(
        response => {
          if (response['responseStatus']['code'] === 200) {
            if (response['result'] != null) {
              this.expiryDt = response['result'];

              if (this.expiryDt == null) {
                this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 3000
              });
            }
          }

        }, error => {
          this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
            timeOut: 3000
          })
        }
      );
    }


    if (this.searchCriteria == 'Item Name') {
      this.invoiceStockService.getExpiryBasedOnItemName(this.selectedItemId['itemId'], this.batchNumber).subscribe(
        response => {
          if (response['responseStatus']['code'] === 200) {
            if (response['result'] != null) {
              this.expiryDt = response['result'];
              if (this.expiryDt == null) {
                this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 3000
              });
            }
          }

        }, error => {
          this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
            timeOut: 3000
          })
        }
      )
    }


    if (this.searchCriteria == 'Item Description') {

      this.invoiceStockService.getExpiryBasedOnItemDesc(this.selectedItemId['itemId'], this.batchNumber).subscribe(
        response => {
          if (response['responseStatus']['code'] === 200) {
            if (response['result'] != null) {
              this.expiryDt = response['result'];
              if (this.expiryDt == null) {
                this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 3000
              });
            }
          }

        }, error => {
          this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
            timeOut: 3000
          })
        }
      );
    }

    if (this.searchCriteria == 'Item Generic Name') {

      this.invoiceStockService.getExpiryBasedOnItemGeneric(this.selectedItemId['itemId'], this.batchNumber).subscribe(
        response => {
          if (response['responseStatus']['code'] === 200) {
            if (response['result'] != null) {
              this.expiryDt = response['result'];
              if (this.expiryDt == null) {
                this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 3000
              });
            }
          }

        }, error => {
          this.toasterService.warning('No Data to Show With Selected Date', 'Data Not Found', {
            timeOut: 3000
          })
        }
      )
    }



  }

  selectedItemId: any
  onItemSelected(event) {
    this.selectedItemId = event;
    if (this.selectedItems['name'] == "Item Code") {
      this.invoiceStockService.getStockBatchesBasedOnItemCode(this.selectedItemId['itemName']).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            if (res['result'] != null) {
              this.batchArray = res['result'];
              if (this.batchArray.length == 0) {
                this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            }

          }
        }

      )
    }
    else if (this.searchCriteria == "Item Description") {

      this.invoiceStockService.getStockBatchesBasedOnItemDesc(this.selectedItemId['itemName']).subscribe(
        res => {

          if (res['responseStatus']['code'] === 200) {
            if (res['result'] != null) {
              this.batchArray = res['result'];
              if (this.batchArray.length == 0) {
                this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            }

          }
        }

      )
    }
    else if (this.searchCriteria == "Item Generic Name") {
      this.invoiceStockService.getStockBatchesBasedOnItemGeneric(this.selectedItemId['itemName']).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            if (res['result'] != null) {
              this.batchArray = res['result'];
              if (this.batchArray.length == 0) {
                this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            }

          }
        }

      )
    }
    else if (this.searchCriteria == "Item Name") {
      this.invoiceStockService.getStockBatchesBasedOnItemName(this.selectedItemId['itemName']).subscribe(
        res => {
          if (res['responseStatus']['code'] === 200) {
            if (res['result'] != null) {
              this.batchArray = res['result'];
              if (this.batchArray.length == 0) {
                this.toasterService.warning('No Data to Show With Search Criteria', 'Data Not Found', {
                  timeOut: 3000
                })
              }
            }

          }
        }

      );
    }




  }

  onQuickChanged() {

    let formData = new FormData();
    formData.set('searchTerm', this.selectedItemId['itemName']);
    formData.set('batch', this.batchNumber);
    formData.set('expiry', this.expiryDt);
    formData.set('pharmacyId', this.pharmacy.pharmacyId);

    if (this.searchCriteria == 'Item Name') {

      this.invoiceStockService.getStockBasedOnItemName(formData).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {

            this.rowData = gridRowDataResponse['result'];
            this.showGrid = true;
            if (this.rowData.length == 0) {
              this.toasterService.error('No Data Found with Search Criteria', 'No Data To Show'), {
                timeOut: 3000
              }
            }

            if (this.itemGridOptions.api.getDisplayedRowCount() == 0) {
              this.itemGridOptions.api.showNoRowsOverlay();
            } else {
              this.itemGridOptions.api.hideOverlay();
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        }
      )
    } else if (this.searchCriteria == "Item Description") {

      this.invoiceStockService.getStockBasedOnItemDesc(formData).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.showGrid = true;
            if (this.rowData.length == 0) {
              this.toasterService.error('No Data Found with Search Criteria', 'No Data To Show'), {
                timeOut: 3000
              }
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        }
      )
    } else if (this.selectedItems['name'] == "Item Code") {
      this.invoiceStockService.getStockBasedOnItemCode(formData).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.showGrid = true;
            if (this.rowData.length == 0) {
              this.toasterService.error('No Data Found with Search Criteria', 'No Data To Show'), {
                timeOut: 3000
              }
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        }
      )
    } else if (this.searchCriteria == "Item Generic Name") {
      this.invoiceStockService.getStockBasedOnItemGenericName(formData).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.showGrid = true;
            if (this.rowData.length == 0) {
              this.toasterService.error('No Data Found with Search Criteria', 'No Data To Show'), {
                timeOut: 3000
              }
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        }
      )
    }
  }



  getGridOnItemCode(itemCode: string) {
    this.showGrid = false;
    this.invoiceStockService.getStockBasedOnItemCode(itemCode).subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.showGrid = true;
          }
        }
      }
    )
  }

  getGridOnItemName(itemName: string) {
    this.showGrid = false;
    this.invoiceStockService.getStockBasedOnItemName(itemName).subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.showGrid = true;
          }
        }
      }
    )
  }


  getGridOnItemDesc(itemDesc: string) {
    this.showGrid = false;
    this.invoiceStockService.getStockBasedOnItemDesc(itemDesc).subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.showGrid = true;
          }
        }
      }
    )
  }

  getGridOnItemGenericName(itemGeneric: string) {
    this.showGrid = false;
    this.invoiceStockService.getStockBasedOnItemGenericName(itemGeneric).subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.showGrid = true;
          }
        }
      }
    )
  }


  getSelectedStockItems() {
    this.stockItemArray = [];
    this.itemGridOptions.api.getSelectedRows().forEach(data => {

    })
    this.itemGridOptions.api.getSelectedRows().forEach(data => {
      let stockItem = new StockAdjustmentModel();
      stockItem['itemCode'] = data.item['itemCode'];
      stockItem['itemName'] = data.item['itemName'];
      stockItem['itemId'] = data['item'];
      stockItem['stockId'] = data['stock'];
      stockItem['batchNo'] = data.stock['batchNo'];
      stockItem['form'] = data.form['form'];
      stockItem['date'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      stockItem['unitSaleRate'] = data.stock['unitSaleRate'];
      stockItem['expiryDt'] = data.stock['expiryDt'];
      stockItem['onHandStock'] = data['onHandStock'];
      stockItem['physicalStock'] = isNaN(data['physicalStock']) ? 0 : data['physicalStock']
      stockItem['physicalValue'] = isNaN(data['physicalValue']) ? 0 : data['physicalValue']
      stockItem['adjustedStock'] = isNaN(data['adjustedStock']) ? 0 : data['adjustedStock']
      stockItem['adjustmentValue'] = isNaN(data['adjustmentValue']) ? 0 : data['adjustmentValue']
      stockItem['total'] = (data.stock['unitSaleRate'] * data['onHandStock'])
      stockItem['pharmacy'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };

      this.stockItemArray.push(stockItem);

    });


  }


  retrievedStockAdj: any;
  retrievedTotal: any;
  retrievedStocks: any[] = [];

  onSubmit() {

    var tableData = [];
    this.stockGridOptions.api.forEachNode(function (node) {
      tableData.push(node['data'])
    })

    var item = tableData[0]['itemId'];
    var stock = tableData[0]['stockId'];

    let totalObject = {
      'item': item, 'adjustedStock': tableData[0]['adjustedStock'],
      'adjustmentStockValue': tableData[0]['adjustmentValue'],
      'physicalStock': tableData[0]['physicalStock'],
      'physicalStockValue': tableData[0]['physicalValue'],
      'batchNo': tableData[0]['batchNo'],
      'expiryDt': tableData[0]['expiryDt'],
      'stock': stock,
      'date': tableData[0]['date'],
      'onHandStock': tableData[0]['onHandStock'],
      'onHandStockValue': tableData[0]['total'],
      'pharmacy': tableData[0]['pharmacy'],
      'createdUser': localStorage.getItem('id'),
      'lastUpdateUser': localStorage.getItem('id')
    }
    this.stockAdjustForm.get('batch').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.invoiceStockService.saveStockAdjustmentData(totalObject).subscribe(

      saveResponse => {
        if (saveResponse instanceof Object) {
          if (saveResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.retrievedStockAdj = saveResponse['result'];

            this.reset();
            this.stockAdjustForm.reset();
            this.stockGridOptions.api.setRowData([]);
            this.toasterService.success(saveResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.invoiceStockService.getStockAdjustmentTotal(this.retrievedStockAdj.stock.batchNo, this.retrievedStockAdj.stock.expiryDt,

              this.retrievedStockAdj.stock.pharmacy.pharmacyId).subscribe(
                retrievedCount => {
                  if (retrievedCount instanceof Object) {
                    if (retrievedCount['responseStatus']['code'] === 200) {
                      this.spinnerService.hide();
                      this.retrievedTotal = retrievedCount['result'];

                    }
                  }

                  this.invoiceStockService.getStocksMatchedWithStockAdjustMent(this.retrievedStockAdj.stock.batchNo, this.retrievedStockAdj.stock.expiryDt,
                    this.retrievedStockAdj.stock.pharmacy.pharmacyId).subscribe(
                      res => {
                        if (res instanceof Object) {
                          if (res['responseStatus']['code'] === 200) {
                            this.spinnerService.hide();
                            this.retrievedStocks = res['result'];

                            if (this.retrievedStockAdj.onHandStock == this.retrievedTotal) {
                              let i = 0;
                              while (i < this.retrievedStocks.length) {

                                var quantity = Math.floor(this.retrievedStocks[i]['quantity'] - ((this.retrievedStocks[i]['quantity'] / this.retrievedTotal) * this.retrievedStockAdj.adjustedStock));

                                this.retrievedStocks[i]['quantity'] = quantity;
                                i++;
                              }
                              this.invoiceStockService.updateStockRecords(this.retrievedStocks).subscribe(
                                response => {

                                }
                              )
                            }
                            this.selectedItems = { name: 'Item Code' }
                          }
                        }
                      }
                    )
                }
              )
          }
        }
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    );
  }

}
