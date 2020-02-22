import { EmployeeService } from './../../masters/employee/shared/employee.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CreditNoteService } from './shared/credit-note.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
  providers: [CreditNoteService, SupplierService, CustomerService, EmployeeService]
})

export class CreditNoteComponent implements OnInit {
  creditNoteNo: any;
  type1: string = 'Y';
  type2: string = 'N';
  purchaseReturnType: any;
  salesReturnType: any;
  billId: any;
  selectedSupplier: any;
  selectedCustomer: any;
  amount: string;
  netAmount: number = 0;
  invoiceId: any;
  remarks: string;
  pharmacyId: number = 1;

  constructor(private customerService: CustomerService, private supplierService: SupplierService, private employeeService: EmployeeService
    , private creditNoteService: CreditNoteService, private datePipe: DatePipe, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

    this.creditNoteService.getCreditNoteNumber().subscribe(creditNoteNum => {
      if (creditNoteNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = creditNoteNum['result'];
      }
    });

    this.creditNoteService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });

    this.creditNoteService.getAccountPayablesNumber().subscribe(res => {
      if (res['responseStatus']['code'] == 200) {
        this.selectedPayablesNumber = res['result'];
      }
    })

    this.getSuppliersData();
    this.getCustomersData();
    this.getEmployeeData();
    this.getPaymentTypes();
  }
  selectedReceiptNumber: any;
  selectedPayablesNumber: any;

  ngOnInit() {

    this.creditNoteInformationForm = new FormGroup(this.creditNoteFormValidations);

    $(document).ready(function () {

      $("#purchase").click(function () {

        $("#salesReturns").hide();
        $("#purchaseReturns").show();

      });
      $("#sales").click(function () {
        $("#salesReturns").show();
        $("#purchaseReturns").hide();

      });
    });

  }



  selectedPaymentType: Object = undefined;

  saveButton: boolean = false;

  paymentTypes: any[] = [];

  getPaymentTypes() {
    this.supplierService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' },
  ];

  selectedStatus: any = { name: "Not Approved" };

  purchaseReturns = [

    { purchase: 'Damaged' },
    { purchase: 'Wrong Price & Wrong Discount' },
    { purchase: 'Unwanted' },
    { purchase: 'Shortly expiry' },
    { purchase: 'Non Movable' },
    { purchase: 'Slow Moving' },
    { purchase: 'Not Required Any More' },
    { purchase: 'Cash Refund' },
    { purchase: 'Cash Back' },
    { purchase: 'Late Delivered' },
    { purchase: 'Advance Payment' }
  ]
  salesReturn = [
    { sales: 'Wrong Price & Wrong Discount' },
    { sales: 'Shortly expiry' },
    { sales: 'Item Recalled' },
    { sales: 'Not Required Any More' },
    { sales: 'Damaged' },
    { sales: 'Cash Refund' },
    { sales: 'Cash Back' },
    { sales: 'Customer didn’t turn up' },
    { sales: 'Advance Payment' }
  ]

  creditNoteInformationForm: FormGroup;

  creditNoteFormValidations = {
    creditNoteNo: new FormControl(''),
    billId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    invoiceId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    remarks: new FormControl(''),
    selectedSupplier: new FormControl(''),
    selectedCustomer: new FormControl(''),
    creditDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.pattern(/[0-9]$/)]),
    returnType: new FormControl('', [Validators.required]),
    returnTypeReason: new FormControl('', [Validators.required]),
    approvedBy: new FormControl(''),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    selectedStatus: new FormControl('', [Validators.required]),
    approvedByEmp: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    paymentType: new FormControl('', [Validators.required]),
    approveDate: new FormControl(''),
    tax: new FormControl(''),
    discount: new FormControl('')
  }

  checkFormDisability() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {
      return (this.creditNoteInformationForm.get('creditDate').errors instanceof Object)
        || this.creditNoteInformationForm.get('amount').invalid
        || this.creditNoteInformationForm.get('amount').errors instanceof Object
        || this.creditNoteInformationForm.get('invoiceId').invalid
        || this.creditNoteInformationForm.get('invoiceId').errors instanceof Object
        || this.creditNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.creditNoteInformationForm.get('paymentType').errors instanceof Object
        || this.creditNoteInformationForm.get('selectedStatus').errors instanceof Object
    }
    else if (this.type1 == 'N' || this.type2 == 'N') {
      return (this.creditNoteInformationForm.get('creditDate').errors instanceof Object)
        || this.creditNoteInformationForm.get('amount').invalid
        || this.creditNoteInformationForm.get('amount').errors instanceof Object
        || this.creditNoteInformationForm.get('billId').invalid
        || this.creditNoteInformationForm.get('billId').errors instanceof Object
        || this.creditNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.creditNoteInformationForm.get('paymentType').errors instanceof Object
        || this.creditNoteInformationForm.get('selectedStatus').errors instanceof Object

    }

  }

  approvedBy: any;
  approvedEmpName: any;
  showApproveByDate = false;
  showPaymentStatus = false;
  taxAmt: number;
  amounts: number;
  discount: number;


  amountEntered(event) {
    this.amounts = event['target']['value'];
    if ((this.amounts != null && this.amounts != undefined)) {
      let amount = Number(this.amounts);
      this.netAmount = Number(amount.toFixed(2));
    }

  }

  taxEntered(event) {
    this.taxAmt = event['target']['value'];
    if ((this.taxAmt != null && this.taxAmt != undefined)) {
      let totalAmount = (Number(this.amounts) + Number(this.taxAmt));
      this.netAmount = Number(totalAmount.toFixed(2));
    }
  }


  onDiscountEntered(event) {
    this.discount = event['target']['value'];
    if ((this.discount != null && this.discount != undefined)) {
      let amt = this.amounts - ((this.discount / 100) * this.amounts) + Number(this.taxAmt);
      this.netAmount = Number(amt.toFixed(2));
    }
  }


  selectEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName']
  }

  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else {
      this.makePin = true;
    }
  }


  onSubmit() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {

      let payload = Object.assign({}, this.creditNoteInformationForm.value);
      payload['returnType'] = 'Purchase';
      payload['returnTypeReason'] = this.purchaseReturnType['purchase'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['supplierModel'] = this.selectedSupplier;
      payload['approvedByEmp'] = this.approvedEmpName;
      payload['status'] = this.selectedStatus;
      payload['approvedBy'] = { 'employeeId': localStorage.getItem('id') };
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['netAmount'] = this.netAmount;

      this.onSaveCreditNote(payload);

    }
    else if (this.type1 == 'N' || this.type2 == 'N') {

      let payload = Object.assign({}, this.creditNoteInformationForm.value);
      payload['returnType'] = 'Sales';
      payload['returnTypeReason'] = this.salesReturnType['sales'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['customerModel'] = this.selectedCustomer;
      payload['status'] = this.selectedStatus;
      payload['approvedBy'] = { 'employeeId': localStorage.getItem('id') };
      payload['approvedByEmp'] = this.approvedEmpName;
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['netAmount'] = this.netAmount;

      this.onSaveCreditNote(payload);
    }

  }

  suppliers: any[] = [];

  getSuppliersData() {
    this.creditNoteService.getRowDataFromServer().subscribe(
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

  customers: any[] = [];

  getCustomersData() {
    this.creditNoteService.getRowDataFromServerForCustomer().subscribe(
      getCustomerResponse => {
        if (getCustomerResponse instanceof Object) {
          if (getCustomerResponse['responseStatus']['code'] === 200) {
            this.customers = getCustomerResponse['result'];
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

  statusGrid = false;

  statusSelected(event) {
    this.statusGrid = true;
  }


  close() {
    this.statusGrid = false;
    this.selectedStatus = { name: "Not Approved" };
  }

  show: boolean;
  password() {
    this.show = !this.show;
  }

  makePin = true;

  savePin() {

    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
    this.showApproveByDate = true;
    this.showPaymentStatus = true;

  }


  employees: any[] = [];

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

  updateAccRecievables: any;
  savedCreditNote: any;

  onSaveCreditNote(creditNoteInformationForm: Object) {
    if (this.type1 == 'Y' || this.type1 == 'N' || this.type2 == 'Y' || this.type2 == 'N') {

      this.creditNoteInformationForm.get('creditDate').setErrors({ 'incorrect': true })
      this.spinnerService.show();
      this.creditNoteService.saveCreditNoteData(creditNoteInformationForm).subscribe(
        savedCreditNoteResponse => {
          if (savedCreditNoteResponse instanceof Object) {
            if (savedCreditNoteResponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.savedCreditNote = savedCreditNoteResponse['result'];

              this.updateAccRecievables = this.savedCreditNote['amount'];
              if (this.savedCreditNote['customerModel'] == null || this.savedCreditNote['customerModel'] == undefined) {

                let updateAaccPayablesObject = {
                  'totalAmountToBePaid': this.updateAccRecievables,
                  'paymentDate': this.savedCreditNote['creditDate'],
                  'source': this.savedCreditNote['creditNoteId'],
                  'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                  'paymentNumber': this.selectedPayablesNumber,
                  'selectedStatus': 'Not Approved',
                  'supplierModel': this.savedCreditNote['supplierModel'],
                  'createdUser': localStorage.getItem('id'),
                  'lastUpdateUser': localStorage.getItem('id'),
                  'selectedPaymentStatus': 'Pending',
                  'totalAmountPaid': 0,
                  'sourceType': 'Credit Note',
                  'invoiceNo': this.savedCreditNote['invoiceId'],
                  'sourceRef': this.savedCreditNote['creditNoteNo'],
                  'approvedDate': this.savedCreditNote['approvedDate'],
                  'approvedBy': { 'employeeId': localStorage.getItem('id') },
                  'supplierName': this.savedCreditNote['supplierModel'] != null && this.savedCreditNote['supplierModel'] != undefined ? this.savedCreditNote['supplierModel']['name'] : '',
                  'customerName': this.savedCreditNote['customerModel'] != null && this.savedCreditNote['customerModel'] != undefined ? this.savedCreditNote['customerModel']['customerName'] : '',
                  'activeS': 'Y'
                }
                this.creditNoteService.saveAccountPayables(updateAaccPayablesObject).subscribe(res => {

                })

              } else {
                let updateAccRecievablesObject = {
                  'amountToBeReceived': -1 * this.updateAccRecievables,
                  'amountReceived': 0,
                  'receiptDate': this.savedCreditNote['creditDate'],
                  'source': this.savedCreditNote['creditNoteId'],
                  'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                  'receiptNumber': this.selectedReceiptNumber,
                  'status': 'Not Approved',
                  'createdUser': localStorage.getItem('id'),
                  'lastUpdateUser': localStorage.getItem('id'),
                  'paymentStatus': 'Pending',
                  'activeS': 'Y',
                  'paymentTypeId': { 'paymentTypeId': 1 },
                  'sourceType': 'Credit Note',
                  'sourceRef': this.savedCreditNote['creditNoteNo'],
                  'approvedDate': this.savedCreditNote['approvedDate'],
                  'approvedBy': { 'employeeId': localStorage.getItem('id') },
                  'supplierName': this.savedCreditNote['supplierModel'] != null && this.savedCreditNote['supplierModel'] != undefined ? this.savedCreditNote['supplierModel']['name'] : '',
                  'customerName': this.savedCreditNote['customerModel'] != null && this.savedCreditNote['customerModel'] != undefined ? this.savedCreditNote['customerModel']['customerName'] : ''
                }
                this.creditNoteService.saveAccountReceivables(updateAccRecievablesObject).subscribe(response => {

                });
              }

              this.toasterService.success(savedCreditNoteResponse['message'], 'Success', {
                timeOut: 3000
              });

              this.netAmount = 0;
            }
            else {
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
      this.onResetCreditNote();
    }
  }

  onTypeChanged(event) {
    this.creditNoteInformationForm.patchValue({
      'creditDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': '',
      'approveDate': '',
    });
    if (this.type2 == 'N') {
      this.netAmount = 0;
      this.onResetCreditNote();
    } else if (this.type2 == 'Y') {
      this.netAmount = 0;
      this.onResetCreditNote();
    }
  }

  onResetCreditNote() {
    this.creditNoteInformationForm.reset();
    this.approvedBy = undefined;
    this.creditNoteInformationForm.patchValue({
      'creditDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approveDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.selectedStatus = { name: ' Not Approved' };
    this.billId = '',
      this.selectedSupplier = '',
      this.selectedCustomer = '',
      this.invoiceId = '',
      this.remarks = '',
      this.selectedSupplier = undefined;
    this.showApproveByDate = false;
    this.selectedCustomer = undefined;
    this.showApproveByDate = undefined;
    this.showPaymentStatus = undefined;
    this.creditNoteService.getCreditNoteNumber().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = CnNum['result'];
      }
    });
  }
}