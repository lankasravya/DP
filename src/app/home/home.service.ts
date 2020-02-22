import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {

	
    constructor(private http:HttpClient){}

    urlRef = new Environment();


	getMonthlySalesData() {
		return this.http.get(`${this.urlRef.url}monthly/totalSales`)
	
	}

	
}