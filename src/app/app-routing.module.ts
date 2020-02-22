import { OutstandingPurchaseInvoiceComponent } from './stock/purchase-invoice/outstanding-purchase-invoice/outstanding-purchase-invoice.component';
import { PendingPurchaseInvoiceComponent } from './stock/purchase-invoice/pending-purchase-invoice/pending-purchase-invoice.component';
import { FinanceDebitnoteGuard } from './authguards/finance-debitnote.guard';
import { FinanceCreditnoteGuard } from './authguards/finance-creditnote.guard';
import { FinanceAccountreceivablesGuard } from './authguards/finance-accountreceivables.guard';
import { FinanceAccountpayableGuard } from './authguards/finance-accountpayable.guard';
import { StockPurchaseReturnEntryGuard } from './authguards/stock-purchase-return-entry.guard';
import { StockStockEntryGuard } from './authguards/stock-stock-entry.guard';
import { StockPurchaseinvoiceSubmissionGuard } from './authguards/stock-purchaseinvoice-submission.guard';
import { StockPurchaseorderSummaryGuard } from './authguards/stock-purchaseorder-summary.guard';
import { StockQuotationSubmissionGuard } from './authguards/stock-quotation-submission.guard';
import { MasterGuard } from './authguards/master.guard';
import { SalesguardGuard } from './authguards/salesguard.guard';
import { EditstockComponent } from './stock/editstock/editstock.component';
import { ItemsSupplierComponent } from './masters/Items-Supplier/Items-Supplier.component';

import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StockComponent } from './stock/stock.component';
import { RequestNewQuotationComponent } from './stock/request-new-quotation/request-new-quotation.component';
import { PendingRequestQuotationComponent } from './stock/pending-request-quotation/pending-request-quotation.component';
import { OutstandingQuotationsComponent } from './stock/outstanding-quotations/outstanding-quotations.component';
import { SupplierQuotationsComponent } from './stock/supplier-quotations/supplier-quotations.component';
import { PurchaseInvoiceComponent } from './stock/purchase-invoice/purchase-invoice.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { MastersComponent } from './masters/masters.component';
import { ItemsComponent } from './masters/items/items.component';
import { HospitalComponent } from './masters/hospital/hospital.component';
import { PharmacyComponent } from './masters/pharmacy/pharmacy.component';
import { ProviderComponent } from './masters/provider/provider.component';
import { ManufacturerComponent } from './masters/manufacturer/manufacturer.component';
import { InsuranceComponent } from './masters/insurance/insurance.component';
import { TermsAndConditionsComponent } from './masters/terms-and-conditions/terms-and-conditions.component';
import { EmployeeComponent } from './masters/employee/employee.component';
import { SalesComponent } from './sales/sales.component';
import { SalesBillingComponent } from './sales/sales-billing/sales-billing.component';
import { SalesReturnsComponent } from './sales/sales-returns/sales-returns.component';
import { ReportsComponent } from './reports/reports.component';
import { SupplierComponent } from './masters/supplier/supplier.component';
import { CustomerComponent } from './masters/customer/customer.component';
import { MembershipsComponent } from './masters/membership/membership.component';
import { NewStockComponent } from './stock/new-stock/new-stock.component';
import { PaymentsComponent } from './finance/payments/payments.component';
import { PurchaseReturnsComponent } from './stock/purchase-returns/purchase-returns.component';
import { ReceiptsComponent } from './finance/receipts/receipts.component';
import { OutstandingPurchaseOrderComponent } from './stock/purchase-order/outstanding-purchase-order/outstanding-purchase-order.component';
import { PendingPurchaseOrderComponent } from './stock/purchase-order/pending-purchase-order/pending-purchase-order.component';
import { NewPurchaseOrderComponent } from './stock/purchase-order/new-purchase-order/new-purchase-order.component';
import { FinanceComponent } from './finance/finance.component';
import { CreditNoteComponent } from './finance/credit-note/credit-note.component';
import { DebitNoteComponent } from './finance/debit-note/debit-note.component';
import { StockAdjustmentComponent } from './stock/stock-adjustment/stock-adjustment.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SalesChartComponent } from './sales/sales-chart/sales-chart.component';
import { StockChartComponent } from './stock/stock-chart/stock-chart.component';
import { FinanceChartComponent } from './finance/finance-chart/finance-chart.component';
import { StockGuard } from './authguards/stock.guard';
import { ReportsGuard } from './authguards/reports.guard';
import { FinanceGuard } from './authguards/finance.guard';
import { Dashboard2Component } from './home/dashboard2/dashboard2.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'stock',
    component: StockComponent,
    data: { title: 'Stock' },
    canActivate: [StockGuard],
    children: [
      { path: '', redirectTo: 'stockChart', pathMatch: 'full' },
      { path: 'stockChart', component: StockChartComponent },
      {

        path: 'requestnewquotations',
        component: RequestNewQuotationComponent,
        data: { title: 'Quotations' },
        canActivate: [StockQuotationSubmissionGuard]
      },
      {
        path: 'pendingrequestquotations',
        component: PendingRequestQuotationComponent,
        data: { title: 'Quotations' }
      },
      {
        path: 'outstandingquotations',
        component: OutstandingQuotationsComponent,
        data: { title: 'Quotations' }
      },
      {
        path: 'supplierquotations',
        component: SupplierQuotationsComponent,
        data: { title: 'Quotations' }
      },
      {
        path: 'newpurchaseorder',
        component: NewPurchaseOrderComponent,
        data: { title: 'PurchaseOrder' },
        canActivate: [StockPurchaseorderSummaryGuard]
      },
      {
        path: 'pendingpurchaseorder',
        component: PendingPurchaseOrderComponent,
        data: { title: 'PurchaseOrder' }
      },
      {
        path: 'outstandingpurchaseorder',
        component: OutstandingPurchaseOrderComponent,
        data: { title: 'PurchaseOrder' }
      },
      {
        path: 'purchaseorderinvoice',
        component: PurchaseInvoiceComponent,
        data: { title: 'PurchaseOrderInvoice' },
        canActivate: [StockPurchaseinvoiceSubmissionGuard]
      },
      {
        path: 'pendingpurchaseinvoice',
        component: PendingPurchaseInvoiceComponent,
        data: { title: 'PurchaseInvoice' }
      },
      {
        path: 'outstandingpurchaseinoice',
        component: OutstandingPurchaseInvoiceComponent,
        data: { title: 'PurchaseInvoice' }
      },
      {
        path: 'newstock',
        component: NewStockComponent,
        data: { title: 'newstock' },
        canActivate: [StockStockEntryGuard]
      },
      {
        path: 'editstock',
        component: EditstockComponent,
        data: { title: 'editstock' }
      },
      {
        path: 'stockadjustment',
        component: StockAdjustmentComponent,
        data: { title: 'stockadjustment' }
      },
      {
        path: 'purchasereturns',
        component: PurchaseReturnsComponent,
        data: { title: 'purchasereturns' },
        canActivate: [StockPurchaseReturnEntryGuard]
      },
    ]
  },
  {
    path: 'master',
    component: MastersComponent,
    data: { title: 'Master' },
    canActivate: [MasterGuard],
    children: [
      {
        path: 'items',
        component: ItemsComponent,
        data: { title: 'Item' }

      },
      {
        path: 'hospital',
        component: HospitalComponent,
        data: { title: 'Hospital' }

      },
      {
        path: 'pharmacy',
        component: PharmacyComponent,
        data: { title: 'Pharmacy' }

      },
      {
        path: 'provider',
        component: ProviderComponent,
        data: { title: 'Provider' }
      },
      {
        path: 'supplier',
        component: SupplierComponent,
        data: { title: 'Supplier' }
      },
      {
        path: 'itemsuppliers',
        component: ItemsSupplierComponent,
        data: { title: 'ItemSuppliers' }
      },
      {
        path: 'manufacturer',
        component: ManufacturerComponent,
        data: { title: 'Manufacturer' }
      },
      {
        path: 'insurance',
        component: InsuranceComponent,
        data: { title: 'Insurance' }
      },
      {
        path: 'companyTerms',
        component: TermsAndConditionsComponent,
        data: { title: 'CompanyTerms' }
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        data: { title: 'Employee' }
      },
      {
        path: 'customer',
        component: CustomerComponent,
        data: { title: 'Customer' }
      },
      {
        path: 'membership',
        component: MembershipsComponent,
        data: { title: 'Membership' }
      }
    ]
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'Sales' },
    canActivate: [SalesguardGuard],
    children: [
      { path: '', redirectTo: 'salesChart', pathMatch: 'full' },
      { path: 'salesChart', component: SalesChartComponent },
      {
        path: 'salesbilling',
        component: SalesBillingComponent,
        data: { title: 'Sales - Billing' }
      },
      {
        path: 'salesreturns',
        component: SalesReturnsComponent,
        data: { title: 'Sales - Retunrs' }
      },
    ]
  },

  {
    path: 'finance',
    component: FinanceComponent,
    data: { title: 'Finance' },
    canActivate: [FinanceGuard],
    children: [
      { path: '', redirectTo: 'financeChart', pathMatch: 'full' },
      { path: 'financeChart', component: FinanceChartComponent },
      {
        path: 'creditnote',
        component: CreditNoteComponent,
        data: { title: 'Finance - Credit' },
        canActivate: [FinanceCreditnoteGuard]
      },
      {
        path: 'debitnote',
        component: DebitNoteComponent,
        data: { title: 'Finance - Debit' },
        canActivate: [FinanceDebitnoteGuard]
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: { title: 'payments' },
        canActivate: [FinanceAccountpayableGuard]
      },
      {
        path: 'receipts',
        component: ReceiptsComponent,
        data: { title: 'receipts' },
        canActivate: [FinanceAccountreceivablesGuard]
      },
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'home' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Home - Dashboard' },

      },
      {
        path: 'checklist',
        component: ChecklistComponent,
        data:{title:'checklists'}
       },
       {
         path: 'notifications',
         component: NotificationsComponent,
         data:{title:'notifications'}
       }
    ]
  },
 
  {
    path: 'reports',
    component: ReportsComponent,
    data: { title: 'Reports' },
    canActivate: [ReportsGuard]
  },
  
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(
  routes,
  {
    preloadingStrategy: PreloadAllModules,
    useHash: true,
    enableTracing: true
  }
);
