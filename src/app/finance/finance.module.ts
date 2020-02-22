
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './../app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { SharedModule } from '../shared/SharedModule';
import { FinanceChartComponent } from './finance-chart/finance-chart.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  declarations: [FinanceComponent, CreditNoteComponent, PaymentsComponent, ReceiptsComponent, FinanceChartComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    NgSelectModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ]
})
export class FinanceModule { }
