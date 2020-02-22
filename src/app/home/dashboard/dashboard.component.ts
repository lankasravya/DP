import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import {
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../home.service';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [HomeService]
})
export class DashboardComponent implements OnInit {

  showhicharts=false;
  faChartPie = faChartPie;
   permissions: any[]=[];
   showMonthlySalesChart=true;

  constructor(private router: Router, private homeService: HomeService,private employeeService:EmployeeService) { 
    this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.permissions = employeeAccess["result"];
            if(this.permissions[67]['activeS'] === 'Y'){
               this.showMonthlySalesChart=true;
            }else{
               this.showMonthlySalesChart=false;
            }
          }
         }
      }
   });
    this.getData();
  }
  getData(){

    this.homeService.getMonthlySalesData().subscribe(
       res=>{
          this.chartOptions = {   
          chart : {
             type: 'column'
          },
          title : {
             text: 'Total Monthly Sales in last 12 months'     
          },
         
          xAxis : {
             type: 'category',
             labels: {
                rotation: -45,
                style: {
                   fontSize: '13px',
                   fontFamily: 'Verdana, sans-serif'
                }
             }
          },
          yAxis : {
             min: 0,
             title: {
                text: 'Sales in (Thousands)'
             }
          },
          
          tooltip : {
            /*  pointFormat: '<b>Sales in '+ new Date().getFullYear()+': {point.y:f} thousands</b>' */
            pointFormat: '<b>Sales: {point.y:f} thousands</b>'
          },
          credits : {
             enabled: false
          },
          series : [
             {
                name: 'Monthly sales',
                data:res['result'],
                dataLabels: {
                   enabled: true,
                   rotation: -90,
                   color: '#FFFFFF',
                   align: 'right',
                   //format: '{point.y:.1f}', // one decimal
                   y: 10, // 10 pixels down from the top
                   style: {
                      fontSize: '13px',
                      fontFamily: 'Verdana, sans-serif'
                   }
                }
             }
          ]
       };
       
       this.showhicharts=true;
       }
    )
 } 




 Highcharts = Highcharts;
chartOptions;

  ngOnInit() {
  }

}
