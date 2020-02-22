import { Component, OnInit } from '@angular/core';
import { EditManufacturerService } from './shared/edit-manufacturer.service';
import { ManufacturerService } from '../shared/manufacturer.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss'],
  providers: [EditManufacturerService, ManufacturerService]
})

export class EditManufacturerComponent implements OnInit {

  constructor(private manufacturerService: ManufacturerService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

    this.manufacturerGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.manufacturerGridOptions.rowSelection = 'single';
    this.manufacturerGridOptions.columnDefs = this.columnDefs;
    this.getCountries();
    this.getManufacturerData();
  }

  ngOnInit() {
    this.manufacturerInformationForm = new FormGroup(this.manufacturerInformationFormValidations);
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editManufactGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });
      $(".mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editManufactGrid").show();
      });
      $(".mu-adduser-cancels").click(function () {
        $("#common-grid").show();
        $("#editManufactGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").css("display", "block");
      });
      $(".mu-adduser-save").click(function () {
        $("#hospital-Information").css("display", "none");
      });
      $(".mu-adduser-cancels").click(function () {
        $("#hospital-Information").css("display", "none");
      });
    });
  }


	/**
	 * Grid Changes
	 * Start
	 */

  key;
  manufacturerGridOptions: GridOptions;
  showGrid: boolean = true;


  resetGrid() {
    this.getManufacturerData()
  }

  reset() {
    this.manufacturerInformationForm.reset();
    this.manufacturerInformationForm.controls.activeS.setValue('Y');
  }


  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    { headerName: 'Manufacturer Name', field: 'name', sortable: true, resizable: true, filter: true },
    { headerName: 'License', field: 'licence', sortable: true, resizable: true, filter: true },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Email', field: 'emailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Fax', field: 'fax', sortable: true, resizable: true, filter: true },
    { headerName: 'Pin Code', field: 'zipCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 2', field: 'addressLine2', sortable: true, resizable: true, filter: true },
    { headerName: 'City', field: 'cityName', sortable: true, resizable: true, filter: true },
    { headerName: 'Country', field: 'countryId.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State', field: 'provinceId.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'Website URL', field: 'website', sortable: true, resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person First Name', field: 'contactPersonFirstName', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person Middle Name', field: 'contactPersonMiddleName', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person Last Name', field: 'contactPersonLastName', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person Email', field: 'contactPersonEmail', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person Phone', field: 'contactPersonPhoneNumber', sortable: true, resizable: true, filter: true }
  ];

  editGrid() {
    this.onManufacturerSelected(this.manufacturerGridOptions.api.getSelectedRows()[0].manufacturerId);
  }

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.manufacturerGridOptions.api.setQuickFilter($event.target.value);
    if (this.manufacturerGridOptions.api.getDisplayedRowCount() == 0) {
      this.manufacturerGridOptions.api.showNoRowsOverlay();
    } else {
      this.manufacturerGridOptions.api.hideOverlay();
    }
  }

	/**
	 * Grid Changes
	 * End
	 */

	/**
	 *
	 * Form Changes
	 * Start
	 */


  showForm: boolean = false;
  manufacturers: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  selectedState: any;
  selectedCountry: any;

  name: string = "";

  selectedManufacturer: Object = {};
  manufacturerInformationForm: FormGroup;

  manufacturerInformationFormValidations = {
    manufacturerId: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    licence: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    countryId: new FormControl([], [Validators.required]),
    provinceId: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
    cityName: new FormControl(''),
    activeS: new FormControl('Y'),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    contactPersonMiddleName: new FormControl(''),
    contactPersonLastName: new FormControl('', [Validators.required]),
    contactPersonEmail: new FormControl('', Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)),
    contactPersonPhoneNumber: new FormControl('', Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)),
    website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)])
  };


  onSubmit() {
    let payload = Object.assign({}, this.manufacturerInformationForm.value);
    payload['countryId'] = this.selectedCountry;
    payload['provinceId'] = this.selectedState;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.updateManufacturer(payload);
  }

  onManufacturerSelected(manufacturerId: string) {
    this.selectedManufacturer = this.manufacturers.find(manufacturer => manufacturer['manufacturerId'] === manufacturerId);
    this.manufacturerService.getProvinces(this.selectedManufacturer['countryId']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let manufacturerFormValues: Object = {
              manufacturerId: this.selectedManufacturer['manufacturerId'],
              name: this.selectedManufacturer['name'],
              licence: this.selectedManufacturer['licence'],
              phoneNumber: this.selectedManufacturer['phoneNumber'],
              emailId: this.selectedManufacturer['emailId'],
              addressLine1: this.selectedManufacturer['addressLine1'],
              countryId: this.selectedManufacturer['countryId'],
              provinceId: this.selectedManufacturer['provinceId'],
              addressLine2: this.selectedManufacturer['addressLine2'],
              activeS: this.selectedManufacturer['activeS'],
              fax: this.selectedManufacturer['fax'],
              cityName: this.selectedManufacturer['cityName'],
              zipCode: this.selectedManufacturer['zipCode'],
              contactPersonFirstName: this.selectedManufacturer['contactPersonFirstName'],
              contactPersonMiddleName: this.selectedManufacturer['contactPersonMiddleName'],
              contactPersonLastName: this.selectedManufacturer['contactPersonLastName'],
              contactPersonEmail: this.selectedManufacturer['contactPersonEmail'],
              contactPersonPhoneNumber: this.selectedManufacturer['contactPersonPhoneNumber'],
              website: this.selectedManufacturer['website']
            }
            this.selectedCountry = this.selectedManufacturer['countryId'];
            this.getProvinces(this.selectedCountry);
            this.selectedState = this.selectedManufacturer['provinceId'];
            this.manufacturerInformationForm.setValue(manufacturerFormValues);
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
    )
  }

  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCountry);
  }

  checkFormDisability() {
    return (this.manufacturerInformationForm.get('name').errors instanceof Object)
      || (this.manufacturerInformationForm.get('licence').errors instanceof Object)
      || (this.manufacturerInformationForm.get('contactPersonFirstName').errors instanceof Object)
      || (this.manufacturerInformationForm.get('contactPersonLastName').errors instanceof Object)
      || (this.manufacturerInformationForm.get('addressLine1').errors instanceof Object)
      || (this.manufacturerInformationForm.get('phoneNumber').errors instanceof Object)
      || (this.manufacturerInformationForm.get('contactPersonPhoneNumber').errors instanceof Object)
      || this.manufacturerInformationForm.get('emailId').invalid
      || this.manufacturerInformationForm.get('phoneNumber').invalid
      || this.manufacturerInformationForm.get('website').invalid
      || this.manufacturerInformationForm.get('contactPersonEmail').invalid
      || (this.manufacturerInformationForm.get('zipCode').errors instanceof Object)
      || this.manufacturerInformationForm.get('zipCode').invalid
      || this.manufacturerInformationForm.get('contactPersonPhoneNumber').invalid
  }
  rowData = [];

  getManufacturerData() {
    this.showGrid = true;
    this.manufacturerService.getRowDataFromServer().subscribe(
      getManufacturerDataResponse => {
        if (getManufacturerDataResponse instanceof Object) {
          if (getManufacturerDataResponse['responseStatus']['code'] === 200) {
            this.rowData = getManufacturerDataResponse['result'];
            this.manufacturers = this.rowData;
            for (let i = 0; i < this.manufacturers.length; i++) {
              if (this.manufacturers[i].activeS == 'Y') {
                this.manufacturers[i].Status = 'Active'
              }
              else if (this.manufacturers[i].activeS == 'N') {
                this.manufacturers[i].Status = 'DeActive'
              }
            }
            this.showGrid = true;
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

  getCountries() {
    this.manufacturerService.getCountries().subscribe(
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
    this.manufacturerService.getProvinces(country).subscribe(
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

  updateManufacturer(manufacturerInformationForm: Object) {
    this.manufacturerInformationForm.get('name').setErrors({ 'incorrect': true })
    let temp = [];
    temp.push(manufacturerInformationForm);
    this.spinnerService.show();
    this.manufacturerService.updateRowData(temp).subscribe(
      updateManufacturerResponse => {
        if (updateManufacturerResponse instanceof Object) {
          if (updateManufacturerResponse['responseStatus']['code'] === 200) {
            this.manufacturerInformationForm.reset();
            this.spinnerService.hide();
            this.manufacturerInformationForm.controls.activeS.setValue('Y');
            this.toasterService.success(updateManufacturerResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedCountry = undefined;
            this.selectedState = undefined;
            this.showGrid = true;
            this.key = null;
            this.getManufacturerData();
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
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 3000
        });
      }
    );
  }

  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.manufacturerService.getManufacturerByName(this.key).subscribe(manufacturerRes => {
        if (manufacturerRes["responseStatus"]["code"] === 200) {
          this.rowData = manufacturerRes['result'];
          if (this.rowData.length == 0) {
            this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show", {
              timeOut: 3000
            })
          }
        }
      },
        error => {
          this.rowData = [];
          this.toasterService.error("Please contact administrator",
            "Error Occurred",
            {
              timeOut: 3000
            });
        })
    }
    else {
      this.getManufacturerData();
    }
  }
}
