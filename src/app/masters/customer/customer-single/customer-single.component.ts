import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DobValidator } from 'src/app/core/DOB Validator/dob-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-customer-single',
	templateUrl: './customer-single.component.html',
	styleUrls: ['./customer-single.component.scss'],
	providers: [CustomerService]
})

export class CustomerSingleComponent implements OnInit {

	recentCustomer: Object;

	constructor(private customerService: CustomerService,private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
	) {
		this.getCountries();
	}

	ngOnInit() {
		this.customerInformationForm = new FormGroup(this.customerInformationFormValidations);
	}

	selectedState: any;
	selectedCountry: any;
	selectedPharmacy: any;
	countries: any[] = [];
	customers: any[] = [];
	customer: any[] = [];
	states: any[] = [];
	selectedCustomer: Object;
	genders = [
		{ name: 'Male' },
		{ name: 'Female' }
	];
	selectedGender: any;

	customerInformationForm: FormGroup;
	customerInformationFormValidations = {
		customerName: new FormControl('', [Validators.required]),
		lastName: new FormControl(''),
		genderCode: new FormControl(''),
		phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
		dateOfBirth: new FormControl('', [Validators.required, DobValidator]),
		emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
		country: new FormControl('', [Validators.required]),
		state: new FormControl('', [Validators.required]),
		city: new FormControl(''),
		pinCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]),
		addressLine1: new FormControl(''),
		addressLine2: new FormControl(''),
		activeS: new FormControl('Y'),
		creditLimit: new FormControl('', Validators.pattern(/^[0-9]*$/)),
		creditDays: new FormControl('', Validators.pattern(/^[0-9]*$/)),
		discountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
		discountAmount: new FormControl('', Validators.pattern(/^[0-9]*$/)),
		organisation: new FormControl('')
	};


	/**
    * Grid Changes
    * End
    */

	getCountries() {
		this.customerService.getCountries().subscribe(
			getCountriesResponse => {
				if (getCountriesResponse instanceof Object) {
					if (getCountriesResponse['responseStatus']['code'] === 200) {
						this.countries = getCountriesResponse['result'];
					} else {
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

	getProvinces(country: Object) {
		this.customerService.getProvinces(country).subscribe(
			getProvincesResponse => {
				if (getProvincesResponse instanceof Object) {
					if (getProvincesResponse['responseStatus']['code'] === 200) {
						this.states = getProvincesResponse['result'];
					} else {
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


	reset() {
		this.customerInformationForm.reset();
		this.selectedState = undefined;
		this.selectedCountry = undefined;
		this.selectedGender = undefined;
	}

	saveCustomerFormChanges(customerInformationForm: Object) {
		this.customerInformationForm.get('dateOfBirth').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.customerService.saveCustomer(customerInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.customerInformationForm.reset();
						this.recentCustomer = saveFormResponse['result'];

						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});

						this.customerInformationForm.get('activeS').setValue('Y');
						this.selectedState = undefined;
						this.selectedCountry = undefined;
						this.selectedGender = undefined;
					} else {
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
			},error=>{
				this.spinnerService.hide();
				this.toasterService.error('Please contact administrator', 'Error Occurred', {
					timeOut: 3000
				});
			}
		);
	}
	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */

	onCustomerSubmit() {
		let payload = Object.assign({}, this.customerInformationForm.value);
		payload['country'] = this.selectedCountry;
		payload['state'] = this.selectedState;
		payload['pharmacyModel'] = this.selectedPharmacy;
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
		if (this.selectedGender instanceof Object) {
			payload['genderCode'] = this.selectedGender['name'] == 'Male' ? 'M' : 'F';
		}
		this.saveCustomerFormChanges(payload);
	}


	onCountrySelected(event: Event) {
		this.getProvinces(this.selectedCountry);
	}

	onStateSelected(event: Event) {
	}

	checkFormDisability() {
		return (this.customerInformationForm.get('customerName').errors instanceof Object)
			|| (this.customerInformationForm.get('dateOfBirth').errors instanceof Object)
			|| (this.customerInformationForm.get('dateOfBirth').invalid)
			|| (this.customerInformationForm.get('country').errors instanceof Object)
			|| (this.customerInformationForm.get('state').errors instanceof Object)
			|| (this.customerInformationForm.get('phoneNumber').errors instanceof Object)
			|| this.customerInformationForm.get('discountPercentage').invalid
			|| this.customerInformationForm.get('creditDays').invalid
	}

}