import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { CoreModule } from 'src/app/core/core.module';
import { Dashboard2Component } from './dashboard2/dashboard2.component';


@NgModule({
  declarations: [ 
  Dashboard2Component],
  imports: [
    CommonModule,
    ChartModule,
    CoreModule
  ],
  exports:[
     ]
})
export class HomeModule { }
