import { PaymentsModel } from './shared/payments.model';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { AddpurchaseorderinvoiceService } from './../../stock/purchase-invoice/addpurchaseorderinvoice.service';
import { SupplierService } from './../../masters/supplier/shared/supplier.service';
import { PaymentsService } from './shared/payments.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [PaymentsService, SupplierService, AddpurchaseorderinvoiceService, CustomerService, EmployeeService]
})

export class PaymentsComponent implements OnInit {
  api: any;
  public showPaymentType: boolean = false;
  paymentNumber: any;

  payload: Object;
  makePayment = true;

  constructor(private employeeService: EmployeeService, private customerService: CustomerService, private datePipe: DatePipe, private paymentsService: PaymentsService,

    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.accountPayablesGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountPayablesGridOptions.rowSelection = 'multiple';
    this.accountPayablesGridOptions.columnDefs = this.gridColumnDefs;
    this.paymentsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.paymentsGridOptions.rowSelection = 'multiple';
    this.paymentsGridOptions.columnDefs = this.columnDefs;
    this.getSuppliersData();
    this.getEmployeeData();
    this.getAllPayables();
    this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });
  }

  ngOnInit() {
    this.paymentsInformationForm = new FormGroup(this.paymentsInformationFormValidations);
    this.supplier = "Y";

    $(document).ready(function () {
      $("#ins").click(function () {
        $("#customerDiv").hide();
        $("#policyDiv").show();
      });
      $("#cust").click(function () {
        $("#customerDiv").show();
        $("#policyDiv").hide();
      });

      $("#paymentsInputSupplier").change(function () {
        $('#itemSearchModal').modal('show');
      });

      $(".checkradiotrue").click(function () {
        $(".checkradiotrue").prop("checked", true);
        $(".checkradiofalse").prop("checked", false);
      });
      $(".checkradiofalse").click(function () {
        $(".checkradiofalse").prop("checked", true);
        $(".checkradiotrue").prop("checked", false);
      });
    });
  }

  ngOnDestroy(): void {

  }

  customer: string = 'Y';
  supplier: string = 'N';

  cashCheckbox: boolean = false;
  mPesaCheckbox: boolean = false;
  card: boolean = false;
  cheque: boolean = false;

  selectedPaymentNumber: any;
  paymentsGridOptions: GridOptions;
  accountPayablesGridOptions: GridOptions;
  customers: any[] = [];
  suppliers: any[] = [];
  invoices: any[] = [];
  showGrid: boolean = false;
  selectedSupplier: any;
  selectedCustomer: any;
  paymentGrid = false;

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' }
  ]
  selectedStatus: any = { name: 'Approved' };
  totalAmountToBePaid = 0;
  totalRoundOff: number = 0;
  paymentStatusArray: any[] = ["Paid", "Partially Paid", "Pending"];
  searchCodeArr: any[] = ["Invoice", "Debit Note", "Credit Note"];
  showApproveBy = false;

  cashSelected(event) {
    this.makePayment = false;
    this.cashCheckbox = true;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
  }

  mPesaSelected(event) {
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = true;
    this.card = false;
    this.cheque = false;
  }

  cardSelected(event) {
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = true;
    this.cheque = false;
  }

  chequeSelected(event) {
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = true;
  }

  paymentsInformationForm: FormGroup;
  paymentsInformationFormValidations = {
    paymentNumber: new FormControl('', [Validators.required]),
    paymentDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    supplierModel: new FormControl('', [Validators.required]),
    totalInvoiceAmount: new FormControl(''),
    totalAdvanceAmount: new FormControl(''),
    totalCreditAmount: new FormControl(''),
    totalDebitAmount: new FormControl(''),
    totalAmountToBePaid: new FormControl(''),
    totalRoundOff: new FormControl(''),
    selectedStatus: new FormControl('', [Validators.required]),
    cashAmount: new FormControl(''),
    creditCardAmount: new FormControl(''),
    creditCardNo: new FormControl(''),
    upiPhoneNo: new FormControl(''),
    upiAmount: new FormControl(''),
    selectedPaymentStatus: new FormControl(''),
    authCode: new FormControl(''),
    chequeDate: new FormControl(''),
    upiTransactionId: new FormControl(''),
    chequeNumber: new FormControl(''),
    chequeAmount: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedByEmp: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    activeS: new FormControl('Y')
  };

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

  onPaymentSelected(event) {
    this.showPaymentType = true
    if (event['name'] == "Approved") {
      this.status = [{ name: 'Approved' }]
    } else {
      this.makePayment = true;
    }

    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
  }
  approvedBy: any;
  approvedEmpName: any;
  selectedEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName'];
  }

  reset() {
    this.showPaymentType = false;
    this.approvedBy = undefined;
    this.paymentsInformationForm.reset();
    this.selectedStatus = { name: "Approved" };
    this.paymentsInformationForm.patchValue({
      'paymentDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
    this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });
    this.selectedSupplier = undefined;
    this.selectedPaymentNumber = undefined;
    this.paymentsGridOptions.api.setRowData([]);
    this.totalAmountToBePaid = 0;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.makePayment = true;
    this.showApproveBy = undefined;
    this.approvedRecords = [];
    this.makePayment = true;
    this.paymentsInformationForm.get('approvedPin').setValue('');
    this.approvedBy = undefined;
    this.makePin = true;

  }

  searchInvoice: any;


  searchCode(event) {
    this.searchInvoice = event['target']['value'];
  }


  getSalesBySearch() {
    this.paymentsService.getInvoiceDataBySearch(this.searchInvoice).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.rowData = res['result'];
        }
      }
    )
  }

  statusGrid = false;

  statusSelected(event) {
    this.statusGrid = true;

  }

  closeStatus() {
    this.statusGrid = false;
    this.showPaymentType = false
    this.makePayment = true;
    this.paymentsInformationForm.get('approvedPin').setValue('');
    this.approvedBy = undefined;
    this.selectedStatus = { name: "Not Approved" };
    this.status = [
      { name: 'Approved' },
      { name: 'Not Approved' },
    ];

  }

  savePin() {

    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
    this.showApproveBy = true;

  }
  show: boolean;
  password() {
    this.show = !this.show;
  }


  searchSupplierName(event) {
    this.paymentsService.getAllSuppliersBasedonNameSearch(event['target']['value']).subscribe(response => {
      if (response instanceof Object) {
        if (response['responseStatus']['code'] === 200) {
          this.suppliers = response['result'];
        }
      }
    })

  }




  getSuppliersData() {
    this.paymentsService.getAllAccountPayablesForSuppliers().subscribe(
      getSupplierResponse => {
        if (getSupplierResponse instanceof Object) {
          if (getSupplierResponse['responseStatus']['code'] === 200) {
            this.suppliers = getSupplierResponse['result'];
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


  getAllPayables() {
    this.paymentsService.getAllAccountPayables().subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.customers = response['result'];

      }
    })

  }

  onRoundOff(event: Event) {
    var totalRoundOff = event['target']['value'];
    if (totalRoundOff != null && totalRoundOff != undefined && totalRoundOff != 0) {
      this.totalAmountToBePaid = Number(this.totalAmountToBePaid) + Number(event['target']['value']);
    } else {
      this.totalAmountToBePaid = parseFloat(this.accountPayablesFinalAmt.toFixed(2));
    }
  }

  close() {
    this.paymentsGridOptions.api.setRowData([]);
    document.getElementById('itemSearchModal').style.display = "none";
    this.paymentsGridOptions.api.setRowData([]);
    this.paymentGrid = false;
  }



  onTypeChanged(event) {
    this.selectedSupplier = undefined;
    this.selectedCustomer = undefined;
    if (this.supplier == 'Y') {
      this.paymentsInformationForm.reset();
      this.paymentsGridOptions.api.setRowData([]);
      this.reset()
    } else if (this.customer == 'N') {
      this.paymentsInformationForm.reset();
      this.paymentsGridOptions.api.setRowData([]);
      this.reset()
    }
  }



  makePin = true;
  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else {
      this.makePin = true;
    }
  }


  checkPaymentsFormDisability() {
    return (this.paymentsInformationForm.get('paymentDate').errors instanceof Object)
      || (this.paymentsInformationForm.get('selectedStatus').errors instanceof Object)
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

    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'selectedStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount paid', field: 'totalAmountPaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Paid', field: 'totalAmountToBePaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true }
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

    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'selectedStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount paid', field: 'totalAmountPaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Paid', field: 'totalAmountToBePaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true }
  ];


  rowData = [];
  getSuppliersGrid(supplierName: string) {
    this.paymentsService.getSupplierSearch(supplierName).subscribe(
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

  accountPayablesFinalAmt: number;
  getTotalAmount() {

    var invoiceTotalAmount = 0;
    var invoiceTotalAdvance = 0;
    var invoiceTotalCredit = 0;
    var invoiceTotalDebit = 0;
    this.rowData.forEach(node => {
      invoiceTotalAmount += isNaN(node['invoiceAmount']) ? 0 : node['invoiceAmount'];
      invoiceTotalAdvance += isNaN(node['advance']) ? 0 : node['advance'];
      invoiceTotalCredit += isNaN(node['creditAmount']) ? 0 : node['creditAmount'];
      invoiceTotalDebit += isNaN(node['debitAmount']) ? 0 : node['debitAmount'];
    });


    this.totalAmountToBePaid = parseFloat((invoiceTotalAmount + invoiceTotalCredit - invoiceTotalDebit).toFixed(2));
    this.accountPayablesFinalAmt = this.totalAmountToBePaid
    this.paymentsInformationForm.get('totalAdvanceAmount').setValue(invoiceTotalAdvance);
    this.paymentsInformationForm.get('totalCreditAmount').setValue(invoiceTotalCredit);
    this.paymentsInformationForm.get('totalDebitAmount').setValue(invoiceTotalDebit);
  }

  generatePaymentNumber() {

    if ((this.selectedSupplier != null && this.selectedSupplier != undefined)) {
      let paymentNumber = 'AP' + this.selectedSupplier['paymentDate'] + '0001';
      this.paymentsInformationForm.get('paymentNumber').setValue(paymentNumber);
    }
  }

  showInvoice: boolean = false;
  showCustomer: boolean = false;
  selectedSupplierName: string = 'Select';
  supplierName: any;

  onSupplierSelected(supplier: any) {
    this.paymentGrid = true
    this.selectedSupplierName = supplier.supplierName;
    this.supplierName = supplier.supplierName;
    this.selectedSupplier = supplier;
    this.getSuppliersGrid(this.selectedSupplierName);
    this.showInvoice = false;
    this.paymentsGridOptions.columnDefs = this.columnDefs;
  }

  customerName: any;
  onCustomerSelected(customer: any) {
    this.paymentGrid = true
    this.selectedCustomerName = customer.customerName;
    this.customerName = customer.customerName;
    this.selectedCustomer = customer;
    this.getCustomersBillsGrid(this.selectedCustomerName);
    this.showCustomer = false;
    this.paymentsGridOptions.columnDefs = this.columnDefs;

  }

  selectedCustomerName: string = 'Select';

  gridArray: PaymentsModel[] = [];

  sourceReference: any;
  accountPayablesId: any;
  sourceRef: any;
  sourceType: any;
  source: any;
  datePayment: string;

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.paymentDate != null && params.data.paymentDate != undefined) {
        try {
          params.data.paymentDate = this.datePipe.transform(params.data.paymentDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.paymentDate;
      }
    }
  }

  supplierModel: any;
  getSelectedGridItems() {
    this.gridArray = [];
    var invoiceTotalAmount = 0;
    var invoiceTotalAdvance = 0;
    var invoiceTotalCredit = 0;
    var invoiceTotalDebit = 0;
    this.accountPayablesGridOptions.api.getSelectedRows().forEach(data => {
      this.paymentGrid = false;
      let gridItem = new PaymentsModel;
      gridItem['paymentNumber'] = data['paymentNumber'] != null && data['paymentNumber'] != undefined ? data['paymentNumber'] : 0;
      gridItem['paymentDate'] = data['paymentDate'] != null && data['paymentDate'] != undefined ? data['paymentDate'] : '00-00-0000';//    this.datePipe.transform(data['paymentDate'], 'yyyy-MM-dd') : '00-00-0000';
      gridItem['totalAmountPaid'] = data['totalAmountPaid'] != null && data['totalAmountPaid'] != undefined ? data['totalAmountPaid'] : 0;
      gridItem['totalAmountToBePaid'] = data['totalAmountToBePaid'] != null && data['totalAmountToBePaid'] != undefined ? data['totalAmountToBePaid'] : 0;
      gridItem['selectedStatus'] = data['selectedStatus'] != null && data['selectedStatus'] != undefined ? data['selectedStatus'] : ' ';
      gridItem['selectedPaymentStatus'] = data['selectedPaymentStatus'] != null && data['selectedPaymentStatus'] != undefined ? data['selectedPaymentStatus'] : '';
      gridItem['sourceRef'] = data['sourceRef'] != null && data['sourceRef'] != undefined ? data['sourceRef'] : '';
      gridItem['sourceType'] = data['sourceType'] != null && data['sourceType'] != undefined ? data['sourceType'] : '';
      gridItem['source'] = data['source'] != null && data['source'] != undefined ? data['source'] : '';
      gridItem['supplierModel'] = data['supplierModel'];
      gridItem['accountPayablesId'] = data['accountPayablesId'];
      gridItem['invoiceNo'] = data['invoiceNo'];

      invoiceTotalAmount += isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'];
      invoiceTotalAdvance += isNaN(data['advance']) ? 0 : data['advance'];

      if (Number((isNaN(data['totalAmountPaid']) ? 0 : data['totalAmountPaid'])) < 0.0) {
        invoiceTotalCredit += isNaN(data['totalAmountPaid']) ? 0 : -1 * data['totalAmountPaid'];
      }
      else {
        invoiceTotalDebit += isNaN(data['totalAmountPaid']) ? 0 : data['totalAmountPaid'];
      }
      if (Number((isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'])) < 0.0) {
        invoiceTotalCredit += isNaN(data['totalAmountToBePaid']) ? 0 : -1 * data['totalAmountToBePaid'];
      }
      else {
        invoiceTotalDebit += isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'];
      }

      this.totalAmountToBePaid = parseFloat((invoiceTotalAmount - invoiceTotalAdvance).toFixed(2));

      if (gridItem['selectedStatus'] == "Not Approved") {
        this.selectedStatus = gridItem['selectedStatus'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
        this.paymentsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
      }

      this.gridArray.push(gridItem);

      this.accountPayablesFinalAmt = this.totalAmountToBePaid
      this.paymentsInformationForm.get('totalAdvanceAmount').setValue(invoiceTotalAdvance);
      this.paymentsInformationForm.get('totalCreditAmount').setValue(invoiceTotalCredit);
      this.paymentsInformationForm.get('totalDebitAmount').setValue(invoiceTotalDebit);
      this.paymentsInformationForm.get('totalInvoiceAmount').setValue(invoiceTotalDebit - invoiceTotalCredit);
    });
  }

  getCustomersBillsGrid(customerName: string) {
    this.showGrid = false;
    this.paymentsService.getCustomerIdSearch(customerName).subscribe(
      customerGridDataResponse => {
        if (customerGridDataResponse instanceof Object) {
          if (customerGridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = customerGridDataResponse['result'];
            this.getTotalAmount();
            this.showGrid = true;
          }
        }
      }
    )
  }

  approvedRecords = [];

  formatData(type) {
    let requestObjectArray = [];
    for (var i = 0; i < type.length; i++) {
      if (type[i]['selectedStatus'] != 'Approved') {
        let payload = Object.assign({}, this.paymentsInformationForm.value);

        payload['accountPayablesId'] = type[i]['accountPayablesId']
        payload['paymentNumber'] = type[i]['paymentNumber']
        payload['supplierModel'] = type[i]['supplierModel']
        payload['selectedPaymentStatus'] = 'Paid';
        payload['createdUser'] = localStorage.getItem('id'),
          payload['lastUpdateUser'] = localStorage.getItem('id'),
          payload['sourceRef'] = type[i]['sourceRef'];
        payload['approvedBy'] = { 'employeeId': this.approvedBy['employeeId'] + i };
        payload['approvedDate'] = this.paymentsInformationForm.get('paymentDate').value;
        payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
        payload['createdUser'] = localStorage.getItem('id');
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['totalAmountToBePaid'] = 0;
        payload['sourceType'] = type[i]['sourceType']
        payload['source'] = type[i]['source']
        payload['totalAmountPaid'] = type[i]['totalAmountToBePaid']
        payload['supplierName'] = this.supplierName != null && this.supplierName != undefined ? this.supplierName : null;
        payload['customerName'] = this.customerName != null && this.customerName != undefined ? this.customerName : null;
        payload['invoiceNo'] = type[i]['invoiceNo']

        requestObjectArray.push(payload);
      } else {
        this.approvedRecords.push(type[i])
      }
    }
    return requestObjectArray;
  }


  onPaymentsSubmit() {

    this.statusGrid = false;
    var data = [];

    this.paymentsGridOptions.api.forEachNode(node => {
      data.push(node.data);
    })
    this.savePaymentsInformationFormChanges(this.formatData(data));
  }


  AccountPayablesGridArray: any[] = [];
  generalLedgerJournald: any;
  savePaymentsInformationFormChanges(paymentsInformationForm: Object[]) {
    this.paymentsInformationForm.get('selectedStatus').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.paymentsService.updateAccountPayables(paymentsInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.AccountPayablesGridArray = saveFormResponse['result'];
            this.gridArray = [];
            var tempGridItems = [];

            for (var i = 0; i < this.AccountPayablesGridArray.length; i++) {

              this.totalAmountToBePaid = 0;
              let gridItem = new PaymentsModel;
              this.paymentsGridOptions.api.setRowData([]);

              gridItem['paymentNumber'] = this.AccountPayablesGridArray[i]['paymentNumber'] != null && this.AccountPayablesGridArray[i]['paymentNumber'] != undefined ? this.AccountPayablesGridArray[i]['paymentNumber'] : '';
              gridItem['paymentDate'] = this.AccountPayablesGridArray[i]['paymentDate'] != null && this.AccountPayablesGridArray[i]['paymentDate'] != undefined ? this.AccountPayablesGridArray[i]['paymentDate'] : '00-00-0000';
              gridItem['totalAmountToBePaid'] = this.AccountPayablesGridArray[i]['totalAmountToBePaid'] != null && this.AccountPayablesGridArray[i]['totalAmountToBePaid'] != undefined ? this.AccountPayablesGridArray[i]['totalAmountToBePaid'] : 0;
              gridItem['selectedStatus'] = this.AccountPayablesGridArray[i]['selectedStatus'] != null && this.AccountPayablesGridArray[i]['selectedStatus'] != undefined ? this.AccountPayablesGridArray[i]['selectedStatus'] : '';
              gridItem['selectedPaymentStatus'] = this.AccountPayablesGridArray[i]['selectedPaymentStatus'] != null && this.AccountPayablesGridArray[i]['selectedPaymentStatus'] != undefined ? this.AccountPayablesGridArray[i]['selectedPaymentStatus'] : '';
              gridItem['sourceRef'] = this.AccountPayablesGridArray[i]['sourceRef'] //! =null && saveFormResponse['result']['sourceRef'] !=undefined ? saveFormResponse['result']['sourceRef']:'';
              gridItem['sourceType'] = this.AccountPayablesGridArray[i]['sourceType'] != null && this.AccountPayablesGridArray[i]['sourceType'] != undefined ? this.AccountPayablesGridArray[i]['sourceType'] : '';
              gridItem['totalAmountPaid'] = this.AccountPayablesGridArray[i]['totalAmountPaid'] != null && this.AccountPayablesGridArray[i]['totalAmountPaid'] != undefined ? this.AccountPayablesGridArray[i]['totalAmountPaid'] : 0;
              gridItem['invoiceNo'] = this.AccountPayablesGridArray[i]['invoiceNo'] != null && this.AccountPayablesGridArray[i]['invoiceNo'] != undefined ? this.AccountPayablesGridArray[i]['invoiceNo'] : 'no number';

              tempGridItems.push(gridItem);

            }
            for (var i = 0; i < tempGridItems.length; i++) {
              this.approvedRecords.push(tempGridItems[i]);
            }
            this.gridArray = this.approvedRecords;

            for (var i = 0; i < this.AccountPayablesGridArray.length; i++) {
              this.AccountPayablesGridArray[i]['approvedBy'] = { employeeId: Number(this.AccountPayablesGridArray[i]['approvedBy']['employeeId']) + Number(i) };
              this.AccountPayablesGridArray[i]['createdUser'] = localStorage.getItem('id');
              this.AccountPayablesGridArray[i]['lastUpdateUser'] = localStorage.getItem('id');
            }

            this.paymentsService.saveMultipleLedgers(this.AccountPayablesGridArray).subscribe(res => {

            })



            this.selectedStatus = { name: 'Approved' };
            this.makePayment = true;
            this.showApproveBy = undefined;
            this.approvedRecords = [];
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });


            this.showPaymentType = false;

            this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
              if (paymentNumber['responseStatus']['code'] == 200) {
                this.spinnerService.hide();
                this.selectedPaymentNumber = paymentNumber['result'];
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


/*
    deleteGrid() {
        this.deleteInvoicesFromGrid(this.paymentsGridOptions.api.getSelectedRows()[0].accountPayablesId);
    }

    deleteInvoicesFromGrid(accountPayablesId: number) {
        this.paymentsService.deleteAccountPayables(accountPayablesId).subscribe(
            deleteDataResponse => {
                if (deleteDataResponse instanceof Object) {
                    if (deleteDataResponse['responseStatus']['code'] === 200) {
                        this.rowData = deleteDataResponse['result'];
                        this.toasterService.success(deleteDataResponse['message'], 'Success', {
                        })
                    }
                }
            }
        )

    } */
