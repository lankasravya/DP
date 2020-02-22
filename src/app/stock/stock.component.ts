import { Component, OnInit } from '@angular/core';
import {
  faEnvelopeOpenText, faExternalLinkAlt, faEdit, faSignOutAlt, faShippingFast, faShoppingBasket, faFileInvoice,
  faStream, faUndo, faCashRegister
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { EmployeeService } from '../masters/employee/shared/employee.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  
})
export class StockComponent implements OnInit {

  faEnvelopeOpenText = faEnvelopeOpenText;
  faExternalLinkAlt = faExternalLinkAlt;
  faEdit = faEdit;
  faSignOutAlt = faSignOutAlt;
  faShippingFast = faShippingFast;
  faShoppingBasket = faShoppingBasket;
  faFileInvoice = faFileInvoice;
  faStream = faStream;
  faUndo = faUndo;
  faCashRegister = faCashRegister;
  constructor(private router: Router) {
    
  }

  suppliers: any;
 
  ngOnInit() {
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

     /*  $(".left-accordion-menu").click(function () {
        $("#chartsId").hide();
        $(".left-accordion-menu").show();
      });
      $(".stockClick").click(function () {
        $("#chartsId").show();
      }); */
      
    })
   
  
  }

  navigateRoute(route: string) {

    this.router.navigate([`/stock/${route}`]);

  }

}
