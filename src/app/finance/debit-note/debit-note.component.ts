import { Component, OnInit, Input } from '@angular/core';
import { DebitNoteService } from './shared/debit-note.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss'],
  providers: [DebitNoteService, SupplierService, CustomerService, EmployeeService]
})

export class DebitNoteComponent implements OnInit {
  debitNoteNo: any;
  debitDate: string;
  amount: string;
  @Input() invoiceId: any;
  remarks: string;
  selectedSupplier: any;
  selectedCustomer: any;
  billId: any;
  selectedPaymentNumber: any;

  constructor(private customerService: CustomerService, private employeeService: EmployeeService, private supplierService: SupplierService, private debitNoteService: DebitNoteService, private datePipe: DatePipe, private toasterService: ToastrService
    , private spinnerService: Ng4LoadingSpinnerService) {

    this.debitNoteService.getDebitNoteNumber().subscribe(debitNoteNum => {
      if (debitNoteNum['responseStatus']['code'] == 200) {
        this.debitNoteNo = debitNoteNum['result'];
      }
    });

    this.debitNoteService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });

    this.debitNoteService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });


    this.getSuppliersData();
    this.getCustomersData();
    this.getEmployeeData();
    this.getPaymentTypes();
  }

  selectedReceiptNumber: any;
  ngOnInit() {
    this.debitNoteInformationForm = new FormGroup(this.debitNoteFormValidations);

    $(document).ready(function () {
      $("#purchase").click(function () {
        $("#salesReturns").hide();
        $("#purchaseReturns").show();
      });
      $("#sales").click(function () {
        $("#salesReturns").show();
        $("#purchaseReturns").hide();
      });
      $("#debitInputSupplier").change(function () {
        $('#itemSearchModal').modal('show');
      });
    });
  }

  selectedPaymentType: Object = undefined;
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
  ]
  selectedStatus: any = { name: "Not Approved" };
  purchaseReturns = [
    { purchase: 'Damaged' },
    { purchase: 'Wrong Price & Wrong Discount' },
    { purchase: 'Unwanted' },
    { purchase: 'Shortly expiry' },
    { purchase: 'Non Movable' },
    { purchase: 'Slow Moving' },
    { purchase: 'Cash refund' },
    { purchase: 'Cash Back' },
    { purchase: 'Not Required Any More' },
    { purchase: 'Late Delivered' },
    { purchase: 'Advance Payment' }
  ];

  salesReturn = [
    { sales: 'Wrong Price & Wrong Discount' },
    { sales: 'Shortly expiry' },
    { sales: 'Item Recalled' },
    { sales: 'Not Required Any More' },
    { sales: 'Damaged' },
    { sales: 'Cash refund' },
    { sales: 'Cash Back' },
    { sales: 'Customer didn’t turn up' },
    { sales: 'Advance Payment' }
  ]

  debitNoteInformationForm: FormGroup;

  debitNoteFormValidations = {
    debitNoteNo: new FormControl(''),
    debitDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.pattern(/[0-9]$/)]),
    returnType: new FormControl('', [Validators.required]),
    returnTypeReason: new FormControl('', [Validators.required]),
    selectedSupplier: new FormControl(''),
    selectedCustomer: new FormControl(''),
    billId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    invoiceId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    remarks: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    approvedByEmp: new FormControl(''),
    selectedStatus: new FormControl(''),
    paymentType: new FormControl('', [Validators.required]),
    tax: new FormControl(''),
    discount: new FormControl('')
  }

  checkFormDisability() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {
      return (this.debitNoteInformationForm.get('debitDate').errors instanceof Object)
        || this.debitNoteInformationForm.get('amount').invalid
        || this.debitNoteInformationForm.get('amount').errors instanceof Object
        || this.debitNoteInformationForm.get('invoiceId').invalid
        || this.debitNoteInformationForm.get('invoiceId').errors instanceof Object
        || this.debitNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.debitNoteInformationForm.get('paymentType').errors instanceof Object
        || this.debitNoteInformationForm.get('selectedStatus').errors instanceof Object
    }
    else if (this.type1 == 'N' || this.type2 == 'N') {
      return (this.debitNoteInformationForm.get('debitDate').errors instanceof Object)
        || this.debitNoteInformationForm.get('amount').invalid
        || this.debitNoteInformationForm.get('amount').errors instanceof Object
        || this.debitNoteInformationForm.get('billId').invalid
        || this.debitNoteInformationForm.get('billId').errors instanceof Object
        || this.debitNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.debitNoteInformationForm.get('paymentType').errors instanceof Object
        || this.debitNoteInformationForm.get('selectedStatus').errors instanceof Object
    }

  }
  approvedBy: any;
  taxAmt: number;
  amounts: number;
  netAmount: number = 0;
  discount: number = 0;

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
      let taxAmount = (Number(this.amounts) + Number(this.taxAmt));
      this.netAmount = Number(taxAmount.toFixed(2));
    }
  }


  onDiscountEntered(event) {
    this.discount = event['target']['value'];
    if ((this.discount != null && this.discount != undefined)) {
      let totalAmount = this.amounts - ((this.discount / 100) * this.amounts) + Number(this.taxAmt);
      this.netAmount = Number(totalAmount.toFixed(2));
    }
  }



  onSubmit() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {

      let payload = Object.assign({}, this.debitNoteInformationForm.value);
      payload['returnType'] = 'Purchase'
      payload['returnTypeReason'] = this.purchaseReturnType['purchase'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['supplierModel'] = this.selectedSupplier;
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['approvedBy'] = this.approvedBy != null && this.approvedBy != undefined ? this.approvedBy : { 'employeeId': localStorage.getItem('id') };
      payload['netAmount'] = this.netAmount;

      this.onSaveDebitNote(payload);
    } else if (this.type1 == 'N' || this.type2 == 'N') {
      let payload = Object.assign({}, this.debitNoteInformationForm.value);
      payload['returnType'] = 'Sales'
      payload['returnTypeReason'] = this.salesReturnType['sales'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['customerModel'] = this.selectedCustomer;
      payload['approvedBy'] = this.approvedBy != null && this.approvedBy != undefined ? this.approvedBy : { 'employeeId': localStorage.getItem('id') };
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['netAmount'] = this.netAmount;

      this.onSaveDebitNote(payload);
    }
  }

  statusGrid = false;
  showApproveByDate = false;
  showPaymentStatus = false;

  statusSelected(event) {
    this.selectedStatus = event['name'];
    this.statusGrid = true;
  }

  show: boolean;
  password() {
    this.show = !this.show;
  }

  close() {
    this.statusGrid = false;
    this.selectedStatus = { name: "Not Approved" };
  }

  savePin() {
    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
    this.showApproveByDate = true;
    this.showPaymentStatus = true;
    this.selectedEmployee = undefined;
  }
  makePin = true;

  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else { this.makePin = true }
  }

  approvedEmpName: any;
  selectedEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName'];
  }

  suppliers: any[] = [];

  getSuppliersData() {
    this.debitNoteService.getRowDataFromServer().subscribe(
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


  onTypeChange(event) {
    if (this.type1 == 'N') {
      this.netAmount = 0;
      this.onResetDebitNote();

    } else if (this.type1 == 'Y') {
      this.netAmount = 0;
      this.onResetDebitNote();
    }
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
  customers: any[] = [];

  getCustomersData() {
    this.debitNoteService.getRowDataFromServerForCustomer().subscribe(
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


  type1: string = 'Y';
  type2: string = 'N';
  purchaseReturnType: any;
  salesReturnType: any;
  pharmacyId: number = 1;
  savedDebitNote: any;
  updatePayablesAmt: any;

  onSaveDebitNote(debitNoteInformationForm: Object) {
    if (this.type1 == 'Y' || this.type1 == 'N' || this.type2 == 'Y' || this.type2 == 'N') {

      this.debitNoteInformationForm.get('debitDate').setErrors({ 'incorrect': true })
      this.spinnerService.show();
      this.debitNoteService.saveDebitNoteData(debitNoteInformationForm).subscribe(
        savedDeditNoteResponse => {
          if (savedDeditNoteResponse instanceof Object) {
            if (savedDeditNoteResponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.savedDebitNote = savedDeditNoteResponse['result'];
              this.updatePayablesAmt = -1 * this.savedDebitNote['amount'];

              if (this.savedDebitNote['supplierModel'] != null || this.savedDebitNote['supplierModel'] != undefined) {
   
                let accountPayablesObject = {
                  'paymentNumber': this.selectedPaymentNumber,
                  'paymentDate': this.savedDebitNote['debitDate'],
                  'supplierModel': this.savedDebitNote['supplierModel'],
                  'selectedStatus': 'Not Approved',
                  'createdUser': localStorage.getItem('id'),
                  'lastUpdateUser': localStorage.getItem('id'),
                  'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                  'selectedPaymentStatus': 'Pending',
                  'totalAmountPaid': 0,
                  'activeS': 'Y',
                  'invoiceNo': this.savedDebitNote['invoiceId'],
                  'source': this.savedDebitNote['debitNoteId'],
                  'sourceRef': this.savedDebitNote['debitNoteNo'],
                  'sourceType': 'Debit Note',
                  'totalAmountToBePaid': this.updatePayablesAmt,
                  'supplierName': this.savedDebitNote['supplierModel'] != null && this.savedDebitNote['supplierModel'] != undefined ? this.savedDebitNote['supplierModel']['name'] : '',
                  'customerName': this.savedDebitNote['customerModel'] != null && this.savedDebitNote['customerModel'] != undefined ? this.savedDebitNote['customerModel']['customerName'] : ''
                }
              
                this.debitNoteService.saveAccountPayables(accountPayablesObject).subscribe(Response => {

                })
              } else {
                let updateAccRecievablesObject = {
                  'amountToBeReceived': -1 * this.updatePayablesAmt,
                  'amountReceived': 0,
                  'receiptDate': this.savedDebitNote['debitDate'],
                  'source': this.savedDebitNote['debitNoteId'],
                  'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                  'receiptNumber': this.selectedReceiptNumber,
                  'status': 'Not Approved',
                  'createdUser': localStorage.getItem('id'),
                  'lastUpdateUser': localStorage.getItem('id'),
                  'paymentStatus': 'Pending',
                  'paymentTypeId': { 'paymentTypeId': 1 },
                  'sourceType': 'Debit Note',
                  'activeS': 'Y',
                  'sourceRef': this.savedDebitNote['debitNoteNo'],
                  'approvedDate': this.savedDebitNote['debitDate'],
                  'approvedBy': { 'employeeId': localStorage.getItem('id') },
                  'supplierName': this.savedDebitNote['supplierModel'] != null && this.savedDebitNote['supplierModel'] != undefined ? this.savedDebitNote['supplierModel']['name'] : '',
                  'customerName': this.savedDebitNote['customerModel'] != null && this.savedDebitNote['customerModel'] != undefined ? this.savedDebitNote['customerModel']['customerName'] : ''
                }

                this.debitNoteService.saveAccountReceivables(updateAccRecievablesObject).subscribe(response => {

                });
              }


              this.toasterService.success(savedDeditNoteResponse['message'], 'Success', {
                timeOut: 3000
              });
              this.netAmount = 0;
              this.debitNoteInformationForm.patchValue({
                'debitDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
              })
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
      this.onResetDebitNote();
      this.approvedBy = undefined;
    }
  }

  onResetDebitNote() {
    this.debitNoteInformationForm.reset();
    this.debitNoteInformationForm.patchValue({
      'debitDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });

    this.selectedStatus = { name: "Not Approved" };
    this.billId = '',
      this.selectedSupplier = '',
      this.selectedCustomer = '',
      this.amount = '',
      this.invoiceId = '',
      this.remarks = '',
      this.selectedSupplier = undefined;
    this.approvedEmpName = undefined;
    this.selectedCustomer = undefined;
    this.showApproveByDate = undefined;
    this.showPaymentStatus = undefined;
    this.debitNoteService.getDebitNoteNumber().subscribe(debitNoteNum => {
      if (debitNoteNum['responseStatus']['code'] == 200) {
        this.debitNoteNo = debitNoteNum['result'];
      }
    });

  }

}
