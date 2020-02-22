import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { HomeService } from './home.service';
import * as Highcharts from 'highcharts';
import { YEAR } from 'ngx-bootstrap/chronos/units/constants';
import { EmployeeService } from '../masters/employee/shared/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  
  faChartPie = faChartPie;
   

  constructor(private router: Router, private homeService: HomeService,private employeeService:EmployeeService) {
  
   
  }
 





  ngOnInit() {
    $(document).ready(function(){
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
    })
  }

  navigateRoute(route: string) {
		
		this.router.navigate([`/stock/${route}`]);
		
	}

}
