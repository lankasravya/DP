import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import {
  faChartLine,
  faFilePdf,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import { ReportService } from './shared/report.service';
import { Environment } from '../core/environment';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { stringify } from 'querystring';
import { EmployeeService } from '../masters/employee/shared/employee.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  urlRef = new Environment();
  reportURI;
  reportData;
  reportGroups = [];
  reportDetails;
  faChartLine = faChartLine;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  singleReportData;
  reportCode;
  columnDefs = [];
  rowData = [];
  PdfRes;
  reportForm: FormGroup;
  selectedInputParameter;
  blob: Blob;
  selectedReportData: Object = {};
  setJson = {};
  setValue;
  supplierDataPMC: [];
  itemDataPMC: [];
  doctorsDataSCL: [];
  manufacturerDataSCL: [];
  supplierDataPID: [];
  InvoiceDtDataPID: [];
  invoiceNoDataPID: [];
  supplierDataPOL: [];
  manufacturerDataPOL: [];
  invoiceDateDataPOL: [];
  billDateDataSCL: [];
  manufacturerDataPBPD: [];
  suppliersPODPOData: [];
  supplierDataPBPD: [];
  suppliersPIRData: [];
  invoiceDtPIRData: [];
  customerSBPDData: [];
  billDtDataSBPD: [];
  doctorsDataDBL: [];
  manufacturersDataDBL: [];
  typesDataSRD: any;
  locationDataSRAD: [];
  manufacturerDataSPS: [];
  itemNamesDataSPS: [];
  billCodeDataSRBB: [];
  supplierSBMLData: [];
  batchNoPDBNData: [];
  suppliersPDBNData: [];
  itemsPDPNData: [];
  suppliersPRLData: [];
  paymentTypesPRLData: [];
  itemsDataSMPD: [];
  itemsCodesDataSMPD: [];
  PurOrdNoDataPDPO: [];
  CreditNoteNoDataCN: [];
  ReceiptNoDataAR: [];
  customersARData : [];
  paymentNosDataAP: [];
  suppliersAPData : [];
  debiitNosData: [];
  billCodeDataSRETURN: [];
  salesReurnNosDataSRETURN: [];
  invoiceNumbersDataPID: [];
  grnNoDataPR: [];
  suppliersDataPR: [];
  invoiceNoDataPR: [];
  totalCard: any = 0;
  totalCash: any = 0;
  totalCredit: any = 0;
  totalCheque: any = 0;
  totalInsurance: any = 0;
  totalUPI: any = 0;
  totalVat:any=0;
  totalMPesa: any = 0;
  totalAmount:any = 0 ;
  showTotals = false;
  //paymentStatusAPData:[];
  paymentStatusAPData=["Paid","Partially Paid","Pending","Over Paid"];

  //Reports access variables
  permissions: any[] = [];
  showMasters = true;
  showSales = true;
  showStock = true;
  showPurchase = true;
  showFinance = true;
  constructor(private reportService: ReportService, private sanitizer: DomSanitizer, private employeeService: EmployeeService,
    private spinnerservice: Ng4LoadingSpinnerService) {
    this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.permissions = employeeAccess["result"];
            if (this.permissions[27]['activeS'] === 'Y') {
              this.showMasters = true;
            } else {
              this.showMasters = false;
            }
            if (this.permissions[28]['activeS'] === 'Y' || this.permissions[29]['activeS'] === 'Y' ||
              this.permissions[30]['activeS'] === 'Y' || this.permissions[31]['activeS'] === 'Y' ||
              this.permissions[32]['activeS'] === 'Y' || this.permissions[33]['activeS'] === 'Y' ||
              this.permissions[34]['activeS'] === 'Y' || this.permissions[35]['activeS'] === 'Y' ||
              this.permissions[36]['activeS'] === 'Y' || this.permissions[37]['activeS'] === 'Y' ||
              this.permissions[38]['activeS'] === 'Y') {
              this.showStock = true;


            } else {
              this.showStock = false
            }
            if (this.permissions[39]['activeS'] === 'Y' || this.permissions[40]['activeS'] === 'Y' ||
              this.permissions[41]['activeS'] === 'Y' || this.permissions[42]['activeS'] === 'Y' ||
              this.permissions[43]['activeS'] === 'Y' || this.permissions[44]['activeS'] === 'Y' ||
              this.permissions[45]['activeS'] === 'Y' || this.permissions[46]['activeS'] === 'Y' ||
              this.permissions[47]['activeS'] === 'Y' || this.permissions[66]['activeS'] === 'Y') {
              this.showSales = true;
            } else {
              this.showSales = false;
            }
            if (this.permissions[48]['activeS'] === 'Y' || this.permissions[49]['activeS'] === 'Y' ||
              this.permissions[50]['activeS'] === 'Y' || this.permissions[51]['activeS'] === 'Y' ||
              this.permissions[52]['activeS'] === 'Y' || this.permissions[53]['activeS'] === 'Y' ||
              this.permissions[54]['activeS'] === 'Y' || this.permissions[55]['activeS'] === 'Y' ||
              this.permissions[56]['activeS'] === 'Y' || this.permissions[57]['activeS'] === 'Y' ||
              this.permissions[58]['activeS'] === 'Y') {
              this.showPurchase = true;
            } else {
              this.showPurchase = false;
            }
            if (this.permissions[59]['activeS'] === 'Y' || this.permissions[60]['activeS'] === 'Y' ||
              this.permissions[61]['activeS'] === 'Y' || this.permissions[62]['activeS'] === 'Y' ||
              this.permissions[63]['activeS'] === 'Y' || this.permissions[64]['activeS'] === 'Y' ||
              this.permissions[65]['activeS'] === 'Y') {
              this.showFinance = true;
            } else {
              this.showFinance = false;
            }
          }
        }
      }
    })

    this.showMasterReports();
  }

  display = false;
  disable = true;
  display_grid = false;
  display_form = false;
  show_report_tabs = true;
  inputParameter;
  ngOnInit() {
    this.reportForm = new FormGroup({

    })
    $(document).ready(function () {
      $('.left-menu ul li').click(function () {
        $('.left-menu ul li').removeClass('active');
        $('.no-childern').removeClass('active');
        $(this).addClass('active');
      });
      $('.no-childern').click(function () {
        $('.no-childern').removeClass('active');
        $('.left-menu ul li').removeClass('active');
        $(this).addClass('active');
      });

      $('.reports-wrap a').click(function (e) {
        e.preventDefault();
        $('.reports-wrap').hide();
        $('.edit-single').show();
      });

      $('.edit-single .btn-primary, .edit-single .btn-secondary').click(function (e) {
        e.preventDefault();
        $('.reports-wrap').show();
        $('.edit-single').hide();
      });

    })
  }

  showMasterReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if (obj['reportCode'] === "SUPPLIER_LIST"&& this.permissions[27]['activeS'] === 'Y') {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showSalesReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "SUPPLIER_WISE_SALES" && this.permissions[39]['activeS'] === 'Y') ||
          (obj['reportCode'] === "DUMMY_BILL_LIST" && this.permissions[40]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_CANCELLATION_LIST" && this.permissions[66]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MANUFACTURER_WISE_SALES" && this.permissions[41]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_REGISTER_DETAILS" && this.permissions[42]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_BY_PRODUCT_SUMMARY" && this.permissions[43]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_REGISTER_AREAWISE_DETAILS" && this.permissions[44]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_BY_PRODUCT_DETAILS" && this.permissions[45]['activeS'] === 'Y') ||
          (obj['reportCode'] === "QUOTATION_REPORT" && this.permissions[46]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_RECEIPT" && this.permissions[47]['activeS'] === 'Y')) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showStockReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "FAST_MOVING_PRODUCT_DETAILS" && this.permissions[28]['activeS'] === 'Y') ||
          (obj['reportCode'] === "EXCESS_STOCK_REPORT" && this.permissions[29]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CONSOLIDATED_STOCK_LIST" && this.permissions[30]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MINIMUM_STOCK_DETAILS" && this.permissions[31]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SUPPLIER_BY_MFR_LIST" && this.permissions[32]['activeS'] === 'Y') ||
          (obj['reportCode'] === "OUT_OF_STOCK_LIST" && this.permissions[33]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SLOW MOVING PRODUCT DETAILS" && this.permissions[34]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_CONSUMPTION_INVENTORY_REPORT" && this.permissions[35]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALE_PRICE_VALUE_FOR_CURRENT_STOCK" && this.permissions[36]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_PRICE_VALUE_FOR_CURRENT_STOCK" && this.permissions[37]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CURRENT_STOCK_WITH_SALES_PRICE_AND_MARGIN" && this.permissions[38]['activeS'] === 'Y')) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showPurchaseReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "PURCHASE_INVOICE_DETAILS" && this.permissions[48]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_MARGIN" && this.permissions[49]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PRODUCT_OFFER_LIST " && this.permissions[50]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_BY_PRODUCT_DETAILS" && this.permissions[51]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_ORDER_SUMMARY" && this.permissions[52]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_REGISTER_LIST" && this.permissions[53]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_DETAILS_BATCHNO" && this.permissions[54]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_INVOICE_REPORT" && this.permissions[55]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_DETAILS_ITEM" && this.permissions[56]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MARGIN_COMPARISON" && this.permissions[57]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_ORDER_DETAILS" && this.permissions[58]['activeS'] === 'Y')) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showFinanceReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "DEBIT_NOTE" && this.permissions[59]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ACCOUNT_PAYABLES" && this.permissions[60]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CREDIT_NOTE" && this.permissions[61]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ACCOUNT_RECEIVABLES" && this.permissions[62]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_RETURN" && this.permissions[63]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_RETURNS" && this.permissions[64]['activeS'] === 'Y') ||
          (obj['reportCode'] === "GENERAL_LEDGER_ENTRIES_REPORT" && this.permissions[65]['activeS'] === 'Y')||
          (obj['reportCode'] === "SALES_PROFIT_ATTRIBUTION")) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  getReport() {
    this.resetFields();
    this.display_form = false;
    this.display_grid = true;
    this.show_report_tabs = false;
    if (this.reportDetails['inputParameters'] != "" && this.reportURI != undefined) {
      this.spinnerservice.show();
      this.reportService.getReportDataByInputParams(this.reportURI).subscribe((res) => {
        this.rowData = res['result'];
        if (this.setJson['ReportCode'] == "SALES_REGISTER_DETAILS") {
          this.showTotals = true;
          this.rowData.forEach(obj => {
            if (obj.TYPE == "CARD") {
              this.totalCard = (this.totalCard + obj['AMOUNT']);
            }
            else if (obj.TYPE == "CASH") {
              this.totalCash = (this.totalCash + obj['AMOUNT']);
            }
            else if (obj.TYPE == "CHEQUE") {
              this.totalCheque = (this.totalCheque + obj['AMOUNT']);
            }
            else if (obj.TYPE == "CREDIT") {
              this.totalCredit = (this.totalCredit + obj['AMOUNT']);
            }
            else if (obj.TYPE == "INSURANCE") {
              this.totalInsurance = (this.totalInsurance + obj['AMOUNT']);
            }
            else if (obj.TYPE == "M-PESA") {
              this.totalMPesa = (this.totalMPesa + obj['AMOUNT']);
            }
            else if (obj.TYPE == "UPI") {
              this.totalUPI = (this.totalUPI + obj['AMOUNT']);
            }
            this.totalVat=(this.totalVat+obj['VAT_AMT']);
          });
          this.totalCard = this.totalCard.toFixed(2);
          this.totalCash = this.totalCash.toFixed(2);
          this.totalCheque = this.totalCheque.toFixed(2);
          this.totalCredit = this.totalCredit.toFixed(2);
          this.totalInsurance = this.totalInsurance.toFixed(2);
          this.totalMPesa = this.totalMPesa.toFixed(2);
          this.totalUPI = this.totalUPI.toFixed(2);
          this.totalVat=this.totalVat.toFixed(2);
          this.totalAmount=(parseFloat(this.totalCard)+parseFloat(this.totalCash)+parseFloat(this.totalCheque)+parseFloat(this.totalCredit)+parseFloat(this.totalInsurance)+parseFloat(this.totalMPesa)+parseFloat(this.totalUPI)+parseFloat(this.totalVat));
          this.totalAmount= this.totalAmount.toFixed(2);
        } else {
          this.showTotals = false;
        }
        this.spinnerservice.hide();
      });


      for (let i of JSON.parse(this.reportDetails['reportHeader'])) {
        this.columnDefs.push({
          headerName: i.displayName,
          field: i.columnName,
          sortable: true,
          filter: true,
          editable: true
        })
      }
    } else {
      this.spinnerservice.show();
      this.reportService.getReportData(encodeURI(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }))).subscribe((res) => {
        this.rowData = res['result'];
        this.spinnerservice.hide();
      });

      for (let i of JSON.parse(this.reportDetails['reportHeader'])) {
        this.columnDefs.push({
          headerName: i.displayName,
          field: i.columnName,
          sortable: true,
          filter: true,
          editable: true
        })
      }
    }

  }

  //Purchase Invoice Details
  onSupplierPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPIDBySearch(searchTerm).subscribe((res) => {
      this.supplierDataPID = res['result'];
    });
  }
  onInvoiceNoPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceNosPIDBySearch(searchTerm).subscribe((res) => {
      this.invoiceNoDataPID = res['result'];
    });
  };
  onInvoiceDtPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceDtPIDBySearch(searchTerm).subscribe((res) => {
      this.InvoiceDtDataPID = res['result'];
    });
  }
  getAllInvoiceNumbersInPID() {
    this.reportService.getAllInvoiceNumbersPID().subscribe((res) => {
      this.invoiceNumbersDataPID = res['result'];
    });
  }
  onInvoiceNumbersPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceNumbersPIDBySearch(searchTerm).subscribe((res) => {
      this.invoiceNumbersDataPID = res['result'];
    });
  }

  //Purchase Margin Comparison

  onSupplierPMCKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPMCBySearch(searchTerm).subscribe((res) => {
      this.supplierDataPMC = res['result'];
    });
  }

  onItemPMCKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getItemsPMCBySearch(searchTerm).subscribe((res) => {
      this.itemDataPMC = res['result'];
    });

  }
  //Purchase Invoice Report

  onSupplierPIRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPIRBySearch(searchTerm).subscribe((res) => {
      this.suppliersPIRData = res['result'];
    });
  }
  onInvoiceDtPIRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceDtPIRBySearch(searchTerm).subscribe((res) => {
      this.invoiceDtPIRData = res['result'];
    });
  }

  //Sales By Product Details
  onCustomerNameSBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getCustomersSBPDBySearch(searchTerm).subscribe((res) => {
      this.customerSBPDData = res['result'];
    });
  }

  onBillDateSBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getBillDatesSBPDBySearch(searchTerm).subscribe((res) => {
      this.billDtDataSBPD = res['result'];
    });
  }

  paymentType: any;
  supplierName: any;
  invoiceNo: any;
  itemName: any;
  manufacturerName: any;
  doctorName: any;
  customerName: any;
  location: any;
  billCode: any;
  batchNo: any;
  itemCode: any;
  PurNo: any;
  creditNoteNo: any;
  receiptNo: any;
  debitNumber: any;
  paymentNumber: any;
  salesReturnNo: any;
  grnNo: any;
  paymentStatus:any;

  onSelectField(event, columnName, selectedOption) {
    if (selectedOption == undefined)
      selectedOption = event['target']['value'];
    this.setJson[columnName] = selectedOption;
    this.disable = false;
    this.setJson['ReportCode'] = this.reportDetails['reportCode'];
    var encoded = encodeURI(JSON.stringify(this.setJson));
    this.reportURI = encoded;

  }


  resetFields() {
    this.paymentType = undefined;
    this.supplierName = undefined;
    this.invoiceNo = undefined;
    this.itemName = undefined;
    this.manufacturerName = undefined;
    this.doctorName = undefined;
    this.customerName = undefined;
    this.location = undefined;
    this.billCode = undefined;
    this.batchNo = undefined;
    this.itemCode = undefined;
    this.PurNo = undefined;
    this.creditNoteNo = undefined;
    this.receiptNo = undefined;
    this.debitNumber = undefined;
    this.paymentNumber = undefined;
    this.salesReturnNo = undefined;
    this.grnNo = undefined;
this.paymentStatus = undefined;
  }

  //Purchase Invoice Details

  getAllSuppliersInPID() {
    this.reportService.getAllSuppliersPID().subscribe((res) => {
      this.supplierDataPID = res['result'];
    });
  }
  getAllInvoiceNoInPID() {
    this.reportService.getAllInvoiceNosPID().subscribe((res) => {
      this.invoiceNoDataPID = res['result'];
    });
  }
  getAllInvoiceDtInPID() {
    this.reportService.getAllInvoiceDtPID().subscribe((res) => {
      this.InvoiceDtDataPID = res['result'];
    });
  }

  //Purchase Margin Comparison

  getAllItemsInPMC() {
    this.reportService.getAllItemsPMC().subscribe((res) => {
      this.itemDataPMC = res['result'];
    });
  }
  getAllSuppliersInPMC() {
    this.reportService.getAllSuppliersPMC().subscribe((res) => {
      this.supplierDataPMC = res['result'];
    });
  }
  //Product Offer List

  getAllSuppliersInPOL() {
    this.reportService.getAllSuppliersPOL().subscribe((res) => {
      this.supplierDataPOL = res['result'];
    });
  }
  onSupplierPOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPOLBySearch(searchTerm).subscribe((res) => {
      this.supplierDataPOL = res['result'];
    });
  }
  getAllManufacturerInPOL() {
    this.reportService.getAllManufacturersPOL().subscribe((res) => {
      this.manufacturerDataPOL = res['result'];
    });
  }
  onManufacturerPOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getManufacturerPOLBySearch(searchTerm).subscribe((res) => {
      this.manufacturerDataPOL = res['result'];
    });
  }
  getAllInvoiceDateInPOL() {
    this.reportService.getAllInvoiceDatesPOL().subscribe((res) => {
      this.invoiceDateDataPOL = res['result'];
    });
  }
  onInvoiceDatePOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceDatePOLBySearch(searchTerm).subscribe((res) => {
      this.invoiceDateDataPOL = res['result'];
    });
  }
  //Sales Cancellation List 

  getAllManufacturerInSCL() {
    this.reportService.getAllManufacturersSCL().subscribe((res) => {
      this.manufacturerDataSCL = res['result'];
    });
  }
  onManufacturerSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getManufacturersclBySearch(searchTerm).subscribe((res) => {
      this.manufacturerDataSCL = res['result'];
    });
  }
  getAllDoctorssInSCL() {
    this.reportService.getAllDoctorsSCL().subscribe((res) => {
      this.doctorsDataSCL = res['result'];
    });
  }
  onDoctorsSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getDoctorssclBySearch(searchTerm).subscribe((res) => {
      this.doctorsDataSCL = res['result'];
    });
  }
  getAllBillDatesInSCL() {
    this.reportService.getAllBillDatesSCL().subscribe((res) => {
      this.billDateDataSCL = res['result'];
    });
  }
  onBillDateSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getBillDatesclBySearch(searchTerm).subscribe((res) => {
      this.billDateDataSCL = res['result'];
    });
  }

  //Purchase By Product Details

  getAllManufacturerInPBPD() {
    this.reportService.getAllManufacturersPBPD().subscribe((res) => {
      this.manufacturerDataPBPD = res['result'];
    });
  }
  onManufacturerPBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getManufacturersPBPDBySearch(searchTerm).subscribe((res) => {
      this.manufacturerDataPBPD = res['result'];
    });
  }
  getAllSuppliersInPBPD() {
    this.reportService.getAllSuppliersPBPD().subscribe((res) => {
      this.supplierDataPBPD = res['result'];
    });
  }
  onSupplierPBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPBPDBySearch(searchTerm).subscribe((res) => {
      this.supplierDataPBPD = res['result'];
    });
  }

  //Supplier By Manufacturer List
  onSupplierNameSBMLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersSBMLBySearch(searchTerm).subscribe((res) => {
      this.supplierSBMLData = res['result'];
    });
  }

  getAllSupplierNamesSBML() {
    this.reportService.getAllSuppliersSBML().subscribe((res) => {
      this.supplierSBMLData = res['result'];
    });
  }
  //Purchase Invoice Report
  getAllSuppliersInPIR() {
    this.reportService.getAllSuppliersPIR().subscribe((res) => {
      this.suppliersPIRData = res['result'];
    });
  }
  getAllInvoiceDtInPIR() {
    this.reportService.getAllInvoiceDtPIR().subscribe((res) => {
      this.invoiceDtPIRData = res['result'];
    });
  }

  //Sales By Product Details
  getAllCustomerNamesSBPD() {
    this.reportService.getAllCustomersSBPD().subscribe((res) => {
      this.customerSBPDData = res['result'];
    });
  }
  getAllBillDatesSBPD() {
    this.reportService.getAllBillDatesSBPD().subscribe((res) => {
      this.billDtDataSBPD = res['result'];
    });
  }
  //Dummy Bill List
  getAllDoctorssInDBL() {
    this.reportService.getAllDoctorsDBL().subscribe((res) => {
      this.doctorsDataDBL = res['result'];
    });
  }
  onDoctorsDBLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getDoctorsdblBySearch(searchTerm).subscribe((res) => {
      this.doctorsDataDBL = res['result'];
    });
  }
  getAllManufacturerInDBL() {
    this.reportService.getAllManufacturersDBL().subscribe((res) => {
      this.manufacturersDataDBL = res['result'];
    });
  }
  onManufacturerDBLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getManufacturerdblBySearch(searchTerm).subscribe((res) => {
      this.manufacturersDataDBL = res['result'];
    });
  }
  //Sales Register Details 
  getAllTypeInSRD() {
    this.reportService.getAllTypesSRD().subscribe((res) => {
      this.typesDataSRD = res['result'];
    });
  }
  ontypeSRDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getTypesrdBySearch(searchTerm).subscribe((res) => {
      this.typesDataSRD = res['result'];
    });
  }
  //Sales Register AreaWise Details
  getAllLocationInSRAD() {
    this.reportService.getAllLocationsSRAD().subscribe((res) => {
      this.locationDataSRAD = res['result'];
    });

  }
  onlocationSRADKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getLocationsradBySearch(searchTerm).subscribe((res) => {
      this.locationDataSRAD = res['result'];
    });
  }

  //Sales By Product Summary

  getAllItemNamesInSPS() {
    this.reportService.getAllitemsSPS().subscribe((res) => {
      this.itemNamesDataSPS = res['result'];
    });
  }
  onItemNameSPSKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getItemNamespsBySearch(searchTerm).subscribe((res) => {
      this.itemNamesDataSPS = res['result'];
    });
  }
  getAllManufacturerInSPS() {
    this.reportService.getAllmanufacturersSPS().subscribe((res) => {
      this.manufacturerDataSPS = res['result'];
    });
  }
  onManufacturerSPSKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getManufacturerspsBySearch(searchTerm).subscribe((res) => {
      this.manufacturerDataSPS = res['result'];
    });
  }
  //Sales Report By Bill Id
  getAllBillCodeInSRBB() {
    this.reportService.getAllBillCodesSRBB().subscribe((res) => {
      this.billCodeDataSRBB = res['result'];
    });
  }
  onBillCodeSRBBKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getBillCodesrbbBySearch(searchTerm).subscribe((res) => {
      this.billCodeDataSRBB = res['result'];
    });
  }
  //Purchase Returns
  getAllGRNNOInPR() {
    this.reportService.getAllGRNNosPR().subscribe((res) => {
      this.grnNoDataPR = res['result'];
    });
  }
  onGRNNoPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getGRNNosPRBySearch(searchTerm).subscribe((res) => {
      this.grnNoDataPR = res['result'];
    });
  }
  getAllSuppliersInPR() {
    this.reportService.getAllSuppliersPR().subscribe((res) => {
      this.suppliersDataPR = res['result'];
    });
  }
  onSupplierPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPRBySearch(searchTerm).subscribe((res) => {
      this.suppliersDataPR = res['result'];
    });
  }
  getAllInvoiceNoInPR() {
    this.reportService.getAllInvoiceNoPR().subscribe((res) => {
      this.invoiceNoDataPR = res['result'];
    });
  }
  onInvoiceNoPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getInvoiceNoPRBySearch(searchTerm).subscribe((res) => {
      this.invoiceNoDataPR = res['result'];
    });
  }

  //Sales Return
  onBillCodeSRETURNKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getBillCodesrbbBySearch(searchTerm).subscribe((res) => {
      this.billCodeDataSRETURN = res['result'];
    });
  }
  getAllBillCodeInSRETURN() {
    this.reportService.getAllBillCodesSRBB().subscribe((res) => {
      this.billCodeDataSRETURN = res['result'];
    });
  }

  onSRETURNNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSrNosrBySearch(searchTerm).subscribe((res) => {
      this.salesReurnNosDataSRETURN = res['result'];
    });
  }
  getAllsalesReturnNosInSRETURN() {
    this.reportService.getAllRNosSR().subscribe((res) => {
      this.salesReurnNosDataSRETURN = res['result'];
    });
  }

  //Purchase Order Details By Purchase Order No
  getAllPurNoInPDPO() {
    this.reportService.getAllPurNoPDPO().subscribe((res) => {
      this.PurOrdNoDataPDPO = res['result'];
    });
  }
  onPurNOKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPurNoPDPOBySearch(searchTerm).subscribe((res) => {
      this.PurOrdNoDataPDPO = res['result'];
    });
  }
  onSupplierNamePODPOKeyEnter(event){
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPDPOBySearch(searchTerm).subscribe((res) => {
      this.suppliersPODPOData = res['result'];
    });
  }
  getAllSuppliersPODPO(){
    
      this.reportService.getAllSupplersPDPO().subscribe((res) => {
        this.suppliersPODPOData = res['result'];
      });
  }

  //Debit Note

  onDebitNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getDebitNosBySearch(searchTerm).subscribe((res) => {
      this.debiitNosData = res['result'];
    });
  }
  getAllDebitNos() {
    this.reportService.getDebitNos().subscribe((res) => {
      this.debiitNosData = res['result'];
    });
  }

  //Account payables

  onPaymentNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPaymentNosBySearch(searchTerm).subscribe((res) => {
      this.paymentNosDataAP = res['result'];
    });
  }

  getAllPaymentNosAP() {
    this.reportService.getPaymentNos().subscribe((res) => {
      this.paymentNosDataAP = res['result'];
    });
  }

  onSupplierNameAPKeyEnter(event){
    let searchTerm = event['target']['value'];
    this.reportService.getSupplierNamesBySearchInAP(searchTerm).subscribe((res) => {
      this.suppliersAPData = res['result'];
    });
  }
  getAllSupplierNamesAP(){
    this.reportService.getSupplierNamesInAP().subscribe((res) => {
      this.suppliersAPData = res['result'];
    });
  }
  // onPaymentStatusAPKeyEnter(event){
  //   let searchTerm = event['target']['value'];
  //   this.reportService.getSupplierNamesBySearchInAP(searchTerm).subscribe((res) => {
  //     this.paymentStatusAPData = res['result'];
  //   });
  // }
  // getAllPaymentStatusAP(){
  //   this.reportService.getSupplierNamesInAP().subscribe((res) => {
  //     this.paymentStatusAPData = res['result'];
  //   });
  // }
  //Credit Note
  getAllCreditNoteNoCN() {
    this.reportService.getAllCreditNoteNoCN().subscribe((res) => {
      this.CreditNoteNoDataCN = res['result'];
    });
  }
  onCreditNoteNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getCreditNoteNoCNBySearch(searchTerm).subscribe((res) => {
      this.CreditNoteNoDataCN = res['result'];
    });
  }
  //Account Receivables
  getAllReceiptNoAR() {
    this.reportService.getAllReceiptNoAR().subscribe((res) => {
      this.ReceiptNoDataAR = res['result'];
    });
  }
  onReceiptNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getReceiptNoARBySearch(searchTerm).subscribe((res) => {
      this.ReceiptNoDataAR = res['result'];
    });
  }
  onCustomerNameARKeyEnter(event){
    let searchTerm = event['target']['value'];
    this.reportService.getCustomerNamesARBySearch(searchTerm).subscribe((res) => {
      this.customersARData = res['result'];
    });
  }
  getAllCustomerNamesAR(){
    this.reportService.getAllCustomerNamesAR().subscribe((res) => {
      this.customersARData = res['result'];
    });
  }
  //Purchase Details By Batch No
  onBatchNoPDBNKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getbatchNoPDBNBySearch(searchTerm).subscribe((res) => {
      this.batchNoPDBNData = res['result'];
    });
  }

  getAllBatchNoPDBN() {
    this.reportService.getAllBatchNoPDBN().subscribe((res) => {
      this.batchNoPDBNData = res['result'];
    });
  }
  onSupplierNamePDBNKeyEnter() {
    let searchTerm = event['target']['value'];
    this.reportService.getsuppliersPDBNBySearch(searchTerm).subscribe((res) => {
      this.suppliersPDBNData = res['result'];
    });
  }
  getAllSuppliersPDBN() {
    this.reportService.getAllsuppliersPDBN().subscribe((res) => {
      this.suppliersPDBNData = res['result'];
    });
  }
  //Purchase Details By Product Name
  onItemNamePDPNKeyEnter() {
    let searchTerm = event['target']['value'];
    this.reportService.getItemsPDPNBySearch(searchTerm).subscribe((res) => {
      this.itemsPDPNData = res['result'];
    });
  }
  getAllSuppliersPDPN() {
    this.reportService.getAllItemsPDPN().subscribe((res) => {
      this.itemsPDPNData = res['result'];
    });
  }
  //Purchase Register List
  onSupplierNamePRLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSuppliersPRLBySearch(searchTerm).subscribe((res) => {
      this.suppliersPRLData = res['result'];
    });
  }
  getAllSuppliersPRL() {
    this.reportService.getAllSuppliersPRL().subscribe((res) => {
      this.suppliersPRLData = res['result'];
    });
  }
  onPayTypePRLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPayTypePRLBySearch(searchTerm).subscribe((res) => {
      this.paymentTypesPRLData = res['result'];
    });
  }
  getAllPayTypesPRL() {
    this.reportService.getAllPayTypesPRL().subscribe((res) => {
      this.paymentTypesPRLData = res['result'];
    });
  }

  //Slow Moving Product Details
  getAllItemNamesSMPD() {
    this.reportService.getAllItemNamesSMPD().subscribe((res) => {
      this.itemsDataSMPD = res['result'];
    });
  }
  onItemNameSMPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getItemNameSMPDBySearch(searchTerm).subscribe((res) => {
      this.itemsDataSMPD = res['result'];
    });
  }
  getAllItemCodesSMPD() {
    this.reportService.getItemCodesSMPD().subscribe((res) => {
      this.itemsCodesDataSMPD = res['result'];
    });
  }
  onItemCodeSMPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getItemCodesSMPDBySearch(searchTerm).subscribe((res) => {
      this.itemsCodesDataSMPD = res['result'];
    });
  }

  loadReport(reportId) {
    this.resetFields();
    this.reportCode = reportId;
    this.display = true;
    this.display_grid = false;
    this.display_form = true;
    this.show_report_tabs = false;
    this.reportDetails = this.reportData.find(report => report['reportId'] == reportId);
    if (this.reportDetails['inputParameters'] != "") {
      this.inputParameter = JSON.parse(this.reportDetails['inputParameters']);
      if (this.inputParameter.length == 0) {
        this.display_form = false;
        this.display_grid = true;
      }
    }
    else {
      this.disable = false;
    }
  }
  close() {
    this.reportGroups = [];
    this.showMasterReports();
    this.singleReportData = [];
    this.inputParameter = 0;
    this.display = false;
    this.disable = true;
    this.display_grid = false;
    this.display_form = false;
    this.show_report_tabs = true;
    this.columnDefs = [];
    this.reportURI = "";
    this.setJson = {};
  }
  close_grid() {
    this.rowData = [];
    this.display = true;
    this.disable = true;
    this.display_grid = false;
    this.display_form = true;
    this.columnDefs = [];
    this.reportURI = "";
    this.setJson = {};
    this.showTotals = false;
    this.totalCard = 0;
    this.totalCash = 0;
    this.totalCheque = 0;
    this.totalInsurance = 0;
    this.totalCredit = 0;
    this.totalMPesa = 0;
    this.totalUPI = 0;
    this.totalVat=0;
    this.totalAmount = 0 ;
  }
  downloadPdf() {
    if (this.reportDetails['inputParameters'] != "" && this.reportURI != undefined) {
      this.reportURI = this.reportURI;
    } else {
      this.reportURI = encodeURI(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }));
    }
    this.spinnerservice.show();
    this.reportService.downloadPdfFile(this.reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.reportDetails['reportName'] == "SALES RECEIPT") {
        link.download = this.setJson['BILL_CODE'] + '.pdf';
      } else {
        link.download = this.reportDetails['reportName'] + '.pdf';
      }
      link.click();
      this.spinnerservice.hide();
    })
  }
  downloadExcel() {
    if (this.reportDetails['inputParameters'] != "" && this.reportURI != undefined) {
      this.reportURI = this.reportURI;
    } else {
      this.reportURI = encodeURI(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }));
    }
    this.spinnerservice.show();
    this.reportService.downloadExcelFile(this.reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.reportDetails['reportName'] == "SALES RECEIPT") {
        link.download = this.setJson['BILL_CODE'] + '.xlsx';
      } else {
        link.download = this.reportDetails['reportName'] + '.xlsx';
      }
      link.click();
      this.spinnerservice.hide();
    })

  }
}
