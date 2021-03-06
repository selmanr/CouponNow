import {Component, OnInit} from '@angular/core';
// import {AbstractControl, FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchedBusiness } from 'src/app/_models/searchedBusiness.model';
import { Campaign } from 'src/app/_models/campaign.model';
import { CampaginService } from 'src/app/_services/campagin.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { BusinessService } from 'src/app/_services/business.service';
import { Business } from 'src/app/_models/business.model';
import { CustomerService } from 'src/app/_services/customer.service';
import { MatSnackBar, MAT_DATEPICKER_VALIDATORS } from '@angular/material';
import { CampaignLoc } from 'src/app/_models/campaignLoc.model';


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})

export class CampaignComponent implements OnInit {

  gottemlocations = [];
  minDate = new Date();
  maxDate = new Date(2050, 0, 1);
  private mode = 'create';
  private campaignID: string;
  editCampaign: any;
  selectedFile: null;
  form: FormGroup;
  businessList: Business[] = [];
  image;
  selectedBusinessId: String = '';

  interests = [
    { name: 'Music' },
    { name: 'Art' },
    { name: 'Restaurants' },
    { name: 'Clothes' },
    { name: 'Bars' },
    { name: 'Books' }
  ];

  // locations: any = [
  //   {
  //   streetnum: '',
  //   streetname: '',
  //   city: '',
  //   postalcode: '',
  //   }
  // ];

  Selectedlocations: CampaignLoc[] = [];
  SelectedNames: String[] = [];
  SelectedCoords: Number[][] = [];


  campaign: Campaign = {
    _id: null,
    name: '',
    business: '',
    busId: '',
    ownerEmail: '',
    locNames: [''],
    location: {
      type: '',
      coordinates: []
    },
    tag: [],
    startDate:  '',
    endDate: '',
    maxQty: null,
    image: ''
  };

  constructor(public campaignService: CampaginService, public route: ActivatedRoute,
    public businessService: BusinessService, public router: Router, public customerInfo: CustomerService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl(null, {validators: [Validators.required]}),
      'business': new FormControl(null, {validators: [Validators.required]}),
      'location': new FormControl(null, {validators: [Validators.required]}),
      'tag': new FormControl(null, {validators: [Validators.required]}),
      'maxQty': new FormControl(null, {validators: [Validators.required, Validators.min(1)]}),
      'startDate': new FormControl(null, {validators: [Validators.required]}),
      'endDate': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required]})
    });

    this.form.get('business').valueChanges.subscribe(value => { // On Business Change factor
      const businessName = value;
      const businessId = '';
      // console.log('businessName: ' + businessName);
      this.gottemlocations = [];
      console.log(businessName);
      this.businessList.forEach(business => {
      if ( businessName === business.businessname ) {
        this.selectedBusinessId = business._id;
        business.locations.forEach(locations => {
          this.gottemlocations.push({'name': locations.streetname, 'longitude': locations.lon, 'latitude': locations.lat});
        });
        console.log(this.gottemlocations);
      }
    });
    });

    // this.form.get('location').valueChanges.subscribe(value => {
    //   let formLocations = [];
    //   this.gottemlocations.forEach(location => {
    //     value.forEach(gotLocations => {
    //       if ( location.name === gotLocations ) {
    //         console.log(location.longitude);
    //         console.log(location.latitude);
    //         console.log(location.name);
    //       }
    //     });
    //   });
    // });

    this.businessList = this.businessService.getBusinesslist();
    // console.log('businessList', this.businessList);

    // console.log(this.minDate);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('_id')) {
        // console.log(paramMap.get('_id'));
        this.mode = 'edit';
        this.campaignID = paramMap.get('_id');
        // console.log("getCampaign", this.campaignService.getCampaign(this.campaignID));
        this.editCampaign = this.campaignService.getCampaign(this.campaignID);
        // console.log(this.editCampaign);

        // this.campaign = {
        //   _id: this.editCampaign._id,
        //   name: this.editCampaign.name,
        //   business: this.editCampaign.business,
        //   busId: this.editCampaign.busId,
        //   ownerEmail: this.customerInfo.customerInfo.email,
        //   location: [this.editCampaign.location],
        //   tag: [this.editCampaign.tag],
        //   startDate: this.editCampaign.startDate,
        //   endDate: this.editCampaign.endDate,
        //   maxQty: this.editCampaign.maxQty,
        //   image: this.editCampaign.image
        // };

          this.form.setValue({
            'name': this.campaign.name,
            'business':  this.campaign.business,
            'location': [this.campaign.location],
            'tag': [this.campaign.tag],
            'maxQty': this.campaign.maxQty,
            'startDate': this.campaign.startDate,
            'endDate': this.campaign.endDate,
            'image': ''
          });
      } else {
        this.mode = 'create';
        this.campaignID = null;
      }
    });
  }

  public onChangeBusiness(event): void {
    // console.log('in event of');

  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();
    if( file.size < 1000000) {
      myReader.onloadend = (e) => {
        this.image = myReader.result;
        console.log('IMage Reader', myReader.result);
      };
      myReader.readAsDataURL(file);
    } else {
      this.snackBar.open('Image Too Big!!', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  onCreateCampaign() {
    if (this.image == null) {
      this.snackBar.open('Please Select a Coupon Image!!', 'Dismiss', {
        duration: 5000,
      });
      return;
    }
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.form.get('location').value.forEach(location => {
        this.gottemlocations.forEach(gotLocations => {
          if ( location === gotLocations.name ) {
            this.SelectedNames.push(gotLocations.name);
            this.SelectedCoords.push([gotLocations.longitude, gotLocations.latitude]);
          }
        });
      });

      console.log(this.SelectedCoords);

      this.campaign = {
        _id: '',
        name: this.form.value.name,
        business: this.form.value.business,
        busId: this.selectedBusinessId,
        ownerEmail: this.customerInfo.customerInfo.email,
        locNames: this.SelectedNames,
        location: {type: 'MultiPoint', coordinates: this.SelectedCoords},
        tag: this.form.value.tag,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        maxQty: this.form.value.maxQty,
        image: this.image
      };
      console.log('Oncreate', this.campaign);

      this.campaignService.onCreate(this.campaign);
    } else {
        this.campaignService.updateCampaign(this.campaign);
    }
    this.form.reset();
    this.router.navigate(['/ownerlanding']);
  }
}
