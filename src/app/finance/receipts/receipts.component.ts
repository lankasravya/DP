import { InsuranceService } from './../../masters/insurance/shared/insurance.service';
import { Component, OnInit } from '@angular/core';
import { ReceiptsService } from './shared/receipts.service';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { SalesBillingService } from 'src/app/sales/sales-billing/sales-billing.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReceiptsModel } from './shared/receipts.model';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  providers: [ReceiptsService, CustomerService, SalesBillingService, InsuranceService, DatePipe, EmployeeService]
})
export class ReceiptsComponent implements OnInit {

  accountReceivablesGridOptions: GridOptions;

  constructor(private employeeService: EmployeeService, private datePipe: DatePipe, private receiptsService: ReceiptsService,
    private insuranceService: InsuranceService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.accountReceivablesGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountReceivablesGridOptions.rowSelection = 'multiple';
    this.accountReceivablesGridOptions.columnDefs = this.gridColumnDefs;
    this.receiptsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.receiptsGridOptions.rowSelection = 'single';
    this.receiptsGridOptions.columnDefs = this.columnDefs;
    this.getPolicyData();
    this.getEmployeeData();
    this.getAllAccountPayables();

    this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });


  }

  ngOnInit() {
    this.receiptsInformationForm = new FormGroup(this.receiptsInformationFormValidations);
    this.insurance = "Y";
    $(document).ready(function () {

      $("#ins").click(function () {
        $("#customerDiv").hide();
        $("#policyDiv").show();

      });
      $("#cust").click(function () {
        $("#customerDiv").show();
        $("#policyDiv").hide();
      });

      $("#receiptPayment").change(function () {
        $('#itemSearchModal').modal('show');
      });

    });
  }

  ngOnDestroy(): void {

  }

  makePayment = true;
  receiptStatusArray: any[] = ["Received", "Partially Received", "Pending"];
  cashCheckbox: boolean = false;
  mPesaCheckbox: boolean = false;
  card: boolean = false;
  cheque: boolean = false;

  customer: string = 'N';
  insurance: string = 'Y';
  selectedReceiptNumber: any;
  receiptsGridOptions: GridOptions;

  customers: any[] = [];
  bills: any[] = [];
  policies: any[] = [];
  showGrid: boolean = true;
  selectedCustomer: any;
  selectedPolicy: any;
  status = [
    { name: 'Approved' },
    { name: 'Not Approved' },
  ]
  selectedStatus: any = { name: 'Approved' };

  cashSelected(event) {
    this.cashCheckbox = !this.cashCheckbox;
  }

  mPesaSelected(event) {
    this.mPesaCheckbox = !this.mPesaCheckbox;
  }

  cardSelected(event) {
    this.card = !this.card;
  }

  chequeSelected(event) {
    this.cheque = !this.cheque;
  }


  selectedBill: any;
  amountToBeReceived = 0;
  totalRoundOff: number = 0;
  selectedPayments: any;

  receiptsInformationForm: FormGroup;
  receiptsInformationFormValidations = {
    receiptNumber: new FormControl('', [Validators.required]),
    selectedCustomer: new FormControl('', [Validators.required]),
    selectedPolicy: new FormControl('', [Validators.required]),
    selectedPaymentType: new FormControl('', [Validators.required]),
    receiptDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    totalBill: new FormControl('', [Validators.required]),
    totalAdvance: new FormControl('', [Validators.required]),
    totalCredit: new FormControl('', [Validators.required]),
    totalDebit: new FormControl('', [Validators.required]),
    totalRoundOff: new FormControl(''),
    amountToBeReceived: new FormControl(''),
    selectedStatus: new FormControl('', [Validators.required]),
    cashAmount: new FormControl(''),
    creditCardAmount: new FormControl(''),
    creditCardNo: new FormControl(''),
    upiPhoneNo: new FormControl(''),
    upiAmount: new FormControl(''),
    upiTransactionId: new FormControl(''),
    chequeNumber: new FormControl(''),
    chequeAmount: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    activeS: new FormControl('Y')
  };

  public showContainer: boolean = false;

  statusGrid = false;

  toggle() {
    this.statusGrid = true;
  }

  statusSelected(event) {
    this.statusGrid = true;
  }

  closeStatus() {
    this.statusGrid = false;
    this.approvedBy = undefined;
    this.receiptsInformationForm.get('approvedPin').setValue('');
    this.selectedStatus = { name: "Not Approved" };
    this.makePin = true;
    this.makePayment = true;
  }


  savePin() {
    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
  }


  onPaymentSelected(event) {
    this.selectedStatus = event['name'];
    if (event['name'] == "Approved") {
      this.makePayment = false;
    } else {
      this.makePayment = true;
    }
  }

  accountReceivablesFinalAmt: number;



  reset() {
    this.showContainer = false;
    this.receiptsInformationForm.reset();
    this.receiptsInformationForm.patchValue({
      'status': '',
      'customers': '',
      'salesModel': '',
      'paymentType': '',
      'policies': '',
      'receiptDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.receiptsGridOptions.api.setRowData([]);

    this.amountToBeReceived = 0;
    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });
    this.selectedPayments = undefined;
    this.getPolicyData();
    this.selectedStatus = { name: 'Approved' };
    this.selectedReceiptNumber = undefined;
    this.amountToBeReceived = 0;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.receiptGrid = false;
  }



  getAllAccountPayables() {
    this.receiptsService.getAllAccountPayables().subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.customers = response['result'];
      }
    });
  }

  searchCustomerName(event) {
    this.receiptsService.getAllRecievablesSearchedCustomers(event['target']['value']).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.customers = res['result'];
        }
      }
    })
  }


  getEmployeeData() {

    this.employeeService.getAllEmployeesWithAccess().subscribe(
      getEmployeeResponse => {
        if (getEmployeeResponse instanceof Object) {
          if (getEmployeeResponse['responseStatus']['code'] === 200) {
            this.employees = getEmployeeResponse['result'];
          }
          else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      }
    );

  }

  employees: any[] = [];


  close() {
    this.receiptsGridOptions.api.setRowData([]);

    document.getElementById('itemSearchModal').style.display = "none";
    this.receiptsGridOptions.api.setRowData([]);
    this.reset();
  }

  getPolicyData() {
    this.insuranceService.getRowDataFromServer().subscribe(
      getInsuranceResponse => {
        if (getInsuranceResponse instanceof Object) {
          if (getInsuranceResponse['responseStatus']['code'] === 200) {
            this.policies = getInsuranceResponse['result'];
          }
          else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      }
    );

  }



  checkReceiptsFormDisability() {
    return (this.receiptsInformationForm.get('receiptDate').errors instanceof Object)
      || (this.receiptsInformationForm.get('selectedCustomer').errors instanceof Object)
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

    { headerName: 'Receipt No', field: 'receiptNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Receipt Date', field: 'receiptDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount Received', field: 'amountReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Received', field: 'amountToBeReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Approved Date', field: 'approvedDate', sortable: true, resizable: true, filter: true, hide: true,
      valueGetter: this.dateFormatteForApproved.bind(this)
    },



  ];

  gridColumnDefs: ColDef[] = [
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

    { headerName: 'Receipt No', field: 'receiptNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Receipt Date', field: 'receiptDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount Received', field: 'amountReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Received', field: 'amountToBeReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Approved Date', field: 'approvedDate', sortable: true, resizable: true, filter: true, hide: true,
      valueGetter: this.dateFormatteForApproved.bind(this)
    },
  ];

  generateReceiptNumber() {
    if ((this.selectedCustomer != null && this.selectedCustomer != undefined)) {
      let receiptNumber = 'AP' + this.selectedCustomer['receiptDateDate'] + '0001';
      this.receiptsInformationForm.get('receiptNumber').setValue(receiptNumber);
    }
  }

  showInsurance: boolean = false;
  showCustomer: boolean = false;

  selectedCustomerName: string = 'Select';
  selectedInsuranceName: string = 'Select';

  onInsuranceSelected(policy: any) {
    this.receiptGrid = true;
    this.selectedInsuranceName = policy.name;
    this.selectedPolicy = policy;

    this.getInsurancesBillsGrid(this.selectedPolicy.insurancePolicyId);
    this.showInsurance = false;
    this.receiptsGridOptions.columnDefs = this.columnDefs;
  }

  rowData = [];
  getInsurancesBillsGrid(customerId: number) {
    this.showGrid = false;
    this.receiptsService.getCustomerBillIdSearch(customerId).subscribe(
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


  customersName: any;
  onCustomerSelected(customer: any) {
    this.receiptGrid = true;
    this.selectedCustomerName = customer.customerName;
    this.customersName = customer.customerName;
    this.getCustomersBillsGrid(this.selectedCustomerName);
    this.showCustomer = false;
    this.receiptsGridOptions.columnDefs = this.columnDefs;

  }

  makePin = true;
  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else {
      this.makePin = true;
    }
  }



  dateFormatteForApproved(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.approvedDate != null && params.data.approvedDate != undefined) {
        try {
          params.data.approvedDate = this.datePipe.transform(params.data.approvedDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.approvedDate;
      }
    }
  }



  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.receiptDate != null && params.data.receiptDate != undefined) {
        try {
          params.data.receiptDate = this.datePipe.transform(params.data.receiptDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.receiptDate;
      }
    }
  }

  approvedBy: any;
  approvedEmpName: any;
  selectedApprovedBy: any;

  selectedEmployee(event) {
    this.selectedApprovedBy = event;
    this.approvedBy = event;
    this.approvedEmpName = event['empName']

  }
  show: boolean;
  password() {
    this.show = !this.show;
  }




  customerGridArray: any;
  getCustomersBillsGrid(customerName: string) {
    this.showGrid = false;
    this.receiptsService.getCustomerIdSearch(customerName).subscribe(
      customerGridDataResponse => {
        if (customerGridDataResponse instanceof Object) {
          if (customerGridDataResponse['responseStatus']['code'] === 200) {
            this.customerGridArray = customerGridDataResponse['result'];
            this.rowData = this.customerGridArray;
            this.showGrid = true;
          }
        }
      }
    )

  }

  receiptGrid = false;
  gridArray: ReceiptsModel[] = [];

  accountRecievablesId: any;
  source: any;
  sourceRef: any;
  sourceType: any;
  sourceReference: any;
  paymentTypeId: any;
  receiptDate: any;

  getSelectedGridItems() {
    this.gridArray = [];


    var billTotalAmount = 0;
    var billTotalAdvance = 0;
    var billTotalCredit = 0;
    var billTotalDebit = 0;
    this.accountReceivablesGridOptions.api.getSelectedRows().forEach(data => {
      this.receiptGrid = false;
      let gridItem = new ReceiptsModel;
      gridItem['receiptNumber'] = data['receiptNumber'] != null && data['receiptNumber'] != undefined ? data['receiptNumber'] : null;
      gridItem['receiptDate'] = data['receiptDate'] != null && data['receiptDate'] != undefined ? data['receiptDate'] : '00-00-0000';
      gridItem['status'] = data['status'] != null && data['status'] != undefined ? data['status'] : '';
      gridItem['amountToBeReceived'] = data['amountToBeReceived'] != null && data['amountToBeReceived'] != undefined ? data['amountToBeReceived'] : 0;
      gridItem['paymentStatus'] = data['paymentStatus'] != null && data['paymentStatus'] != undefined ? data['paymentStatus'] : '';
      gridItem['amountReceived'] = data['amountReceived'] != null && data['amountReceived'] != undefined ? data['amountReceived'] : 0;
      gridItem['sourceType'] = data['sourceType'] != null && data['sourceType'] != undefined ? data['sourceType'] : '';
      gridItem['sourceRef'] = data['sourceRef'] != null && data['sourceRef'] != undefined ? data['sourceRef'] : '';
      gridItem['approvedDate'] = data['approvedDate'] != null && data['approvedDate'] != undefined ? data['approvedDate'] : '00-00-0000';
      gridItem['PaymentType'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['type'] : '';
      gridItem['accountReceivablesId'] = data['accountReceivablesId'];
      gridItem['source'] = data['source'] != null && data['source'] != undefined ? data['source'] : '';
      gridItem['paymentTypeId'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['paymentTypeId'] : 0;

      if (Number((isNaN(data['amountReceived']) ? 0 : data['amountReceived'])) < 0.0) {
        billTotalDebit += isNaN(data['amountReceived']) ? 0 : -1 * data['amountReceived'];
      }
      else {
        billTotalCredit += isNaN(data['amountReceived']) ? 0 : data['amountReceived'];
      }


      if (Number((isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'])) < 0.0) {
        billTotalDebit += isNaN(data['amountToBeReceived']) ? 0 : -1 * data['amountToBeReceived'];
      }
      else {
        billTotalCredit += isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'];
      }


      billTotalAmount += isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'];
      billTotalAdvance += isNaN(data['advance']) ? 0 : data['advance'];

      this.amountToBeReceived = parseFloat(Number(billTotalAmount).toFixed(2));

      if (gridItem['status'] == "Not Approved") {
        this.selectedStatus = gridItem['status'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
        this.receiptsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
      }


      this.gridArray.push(gridItem);

      this.amountToBeReceived = parseFloat(billTotalAmount.toFixed(2));
      this.accountReceivablesFinalAmt = this.amountToBeReceived;
      this.receiptsInformationForm.get('totalAdvance').setValue(billTotalAdvance);
      this.receiptsInformationForm.get('totalCredit').setValue(billTotalCredit);
      this.receiptsInformationForm.get('totalDebit').setValue(billTotalDebit);
      this.receiptsInformationForm.get('totalBill').setValue(billTotalCredit - billTotalDebit)

    });

  }


  searchSales: any;


  searchCode(event) {

    this.searchSales = event['target']['value'];
  }


  getSalesBySearch() {
    this.receiptsService.getSalesDataBySearch(this.searchSales).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.rowData = res['result'];
        }
      }
    )
  }



  getTotalAmount() {
    var billTotalAmount = 0;
    var billTotalAdvance = 0;
    var billTotalCredit = 0;
    var billTotalDebit = 0;
    this.rowData.forEach(node => {
      billTotalAmount += isNaN(node['totalAmount']) ? 0 : node['totalAmount'];
      billTotalAdvance += isNaN(node['advance']) ? 0 : node['advance'];
      billTotalCredit += isNaN(node['creditAmount']) ? 0 : node['creditAmount'];
      billTotalDebit += isNaN(node['debitAmount']) ? 0 : node['debitAmount'];
    });

    this.amountToBeReceived = parseFloat((billTotalAmount + billTotalCredit - billTotalDebit).toFixed(2));
    this.accountReceivablesFinalAmt = this.amountToBeReceived;
    this.receiptsInformationForm.get('totalAdvance').setValue(billTotalAdvance);
    this.receiptsInformationForm.get('totalCredit').setValue(billTotalCredit);
    this.receiptsInformationForm.get('totalDebit').setValue(billTotalDebit);
  }

  approvedRecords = [];

  onRoundOff(event: Event) {
    this.totalRoundOff = event['target']['value'];
    if (this.totalRoundOff != null && this.totalRoundOff != undefined && this.totalRoundOff != 0) {
      this.amountToBeReceived = Number(this.amountToBeReceived) + Number(event['target']['value']);
    } else {
      this.amountToBeReceived = parseFloat(this.accountReceivablesFinalAmt.toFixed(2));
    }
  }

  formatData(type) {
    let requestRecievablesObject = [];

    for (var i = 0; i < type.length; i++) {
      if (type[i]['status'] != 'Approved') {
        let payload = Object.assign({}, this.receiptsInformationForm.value);

        payload['accountReceivablesId'] = type[i]['accountReceivablesId'];
        payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
        payload['createdUser'] = localStorage.getItem('id');
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['receiptDate'] = this.receiptsInformationForm.get('receiptDate').value;
        payload['receiptNumber'] = type[i]['receiptNumber'];
        payload['amountToBeReceived'] = 0;
        payload['amountReceived'] = type[i]['amountToBeReceived'];


        payload['approvedBy'] = { 'employeeId': this.approvedBy['employeeId'] + i };
        payload['sourceRef'] = type[i]['sourceRef'];
        payload['source'] = type[i]['source'];
        payload['paymentStatus'] = 'Paid';
        payload['status'] = this.selectedStatus;
        payload['sourceType'] = type[i]['sourceType'];
        payload['customerName'] = this.customersName;
        payload['approvedDate'] = this.receiptsInformationForm.get('receiptDate').value;
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['paymentTypeId'] = { 'paymentTypeId': type[i]['paymentTypeId'] }

        requestRecievablesObject.push(payload);
      } else {
        this.approvedRecords.push(type[i]);
      }
    }
    return requestRecievablesObject;
  }

  onReceiptsSubmit() {
    this.statusGrid = true;
  }


  SavingAccountRecievables() {
    var data = [];

    this.receiptsGridOptions.api.forEachNode(node => {
      data.push(node.data);
    });
    this.saveReceiptsInformationFormChanges(this.formatData(data));
  }

  AccountRecievablesGridArray: any[] = [];

  saveReceiptsInformationFormChanges(receiptsInformationForm: Object[]) {
     this.receiptsInformationForm.get('receiptDate').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.receiptsService.updateAccountReceivables(receiptsInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.AccountRecievablesGridArray = saveFormResponse['result'];
            this.gridArray = [];
            var tempGridData = [];

            for (var i = 0; i < this.AccountRecievablesGridArray.length; i++) {

              this.amountToBeReceived = 0;
              let gridItem = new ReceiptsModel;
              this.receiptsGridOptions.api.setRowData([]);

              gridItem['receiptNumber'] = this.AccountRecievablesGridArray[i]['receiptNumber'] != null && this.AccountRecievablesGridArray[i]['receiptNumber'] != undefined ? this.AccountRecievablesGridArray[i]['receiptNumber'] : '';
              gridItem['receiptDate'] = this.AccountRecievablesGridArray[i]['receiptDate'] != null && this.AccountRecievablesGridArray[i]['receiptDate'] != undefined ? this.AccountRecievablesGridArray[i]['receiptDate'] : '00-00-0000';
              gridItem['status'] = this.AccountRecievablesGridArray[i]['status'] != null && this.AccountRecievablesGridArray[i]['status'] != undefined ? this.AccountRecievablesGridArray[i]['status'] : '';
              gridItem['amountReceived'] = this.AccountRecievablesGridArray[i]['amountReceived'] != null && this.AccountRecievablesGridArray[i]['amountReceived'] != undefined ? this.AccountRecievablesGridArray[i]['amountReceived'] : 0;
              gridItem['amountToBeReceived'] = this.AccountRecievablesGridArray[i]['amountToBeReceived'] != null && this.AccountRecievablesGridArray[i]['amountToBeReceived'] != undefined ? this.AccountRecievablesGridArray[i]['amountToBeReceived'] : 0;
              gridItem['paymentStatus'] = this.AccountRecievablesGridArray[i]['paymentStatus'] != null && this.AccountRecievablesGridArray[i]['paymentStatus'] != undefined ? this.AccountRecievablesGridArray[i]['paymentStatus'] : '';
              gridItem['sourceType'] = this.AccountRecievablesGridArray[i]['sourceType'] != null && this.AccountRecievablesGridArray[i]['sourceType'] != undefined ? this.AccountRecievablesGridArray[i]['sourceType'] : '';
              gridItem['sourceRef'] = this.AccountRecievablesGridArray[i]['sourceRef'] != null && this.AccountRecievablesGridArray[i]['sourceRef'] != undefined ? this.AccountRecievablesGridArray[i]['sourceRef'] : '';
              gridItem['approvedDate'] = this.AccountRecievablesGridArray[i]['approvedDate'] != null && this.AccountRecievablesGridArray[i]['approvedDate'] != undefined ? this.AccountRecievablesGridArray[i]['approvedDate'] : '00-00-0000';

              tempGridData.push(gridItem)
            }

            for (var i = 0; i < tempGridData.length; i++) {
              this.approvedRecords.push(tempGridData[i]);
            }

            this.gridArray = this.approvedRecords;

            for (var i = 0; i < this.AccountRecievablesGridArray.length; i++) {
              this.AccountRecievablesGridArray[i]['approvedBy'] = { employeeId: Number(this.AccountRecievablesGridArray[i]['approvedBy']['employeeId']) + Number(i) }
              this.AccountRecievablesGridArray[i]['createdUser'] = localStorage.getItem('id');
              this.AccountRecievablesGridArray[i]['lastUpdateUser'] = localStorage.getItem('id');
            }

            this.receiptsService.saveMultipleAccRecievables(this.AccountRecievablesGridArray).subscribe(res => {
            })

            this.statusGrid = false;
            this.selectedStatus = { name: 'Approved' };
            this.makePayment = true;

            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.approvedRecords = [];
            this.showContainer = false;

            this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
              if (receiptNumber['responseStatus']['code'] == 200) {
                this.spinnerService.hide();

                this.selectedReceiptNumber = receiptNumber['result'];
              }
            });

          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
            this.spinnerService.hide();

          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
          this.spinnerService.hide();

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
