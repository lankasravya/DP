import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable()
export class SupplierQuotationsService {
	urlRef = new Environment();

	constructor(private http: HttpClient) { }

	getreceivedpendingquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedpendingquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getreceivedapprovedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedapprovedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getreceivedrejectedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedrejectedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestapprovedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestapprovedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestpendingquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestpendingquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestrejectedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestrejectedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	saverequestapprovedquotation(quotationModel) {
		return this.http.post(`${this.urlRef.url}save/requestapprovedquotation`, quotationModel);
	}

	saverequestrejectedquotation(quotationModel) {
		return this.http.post(`${this.urlRef.url}save/requestrejectedquotation`, quotationModel);
	}

	generatequotationno(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}generatequotationno?pharmacyId=${pharmacyId}`);
	}

	getactiveitemsdata() {
		return this.http.get(`${this.urlRef.url}item/getactiveitemsdata`);
	}

	getsentquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getsentquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getpendingquotationitems() {
		return this.http.get(`${this.urlRef.url}getpendingquotationitems`);
	}

	approvedquotationitem(quotationModel) {
		return this.http.put(`${this.urlRef.url}update/approvedquotationitem`, quotationModel);
	}

	rejectedquotationitem(quotationModel) {
		return this.http.put(`${this.urlRef.url}update/rejectedquotationitem`, quotationModel);
	}

	getapprovedquotationitems() {
		return this.http.get(`${this.urlRef.url}getapprovedquotationitems`);
	}

	getrejectedquotationitems() {
		return this.http.get(`${this.urlRef.url}getrejectedquotationitems`);
	}

}