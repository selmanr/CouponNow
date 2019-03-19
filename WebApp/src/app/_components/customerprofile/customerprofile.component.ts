import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/_services/customer.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss']
})
export class CustomerprofileComponent implements OnInit {

  private oldCustomerInfo: any = {
    email: '',
    firstname: '',
    lastname: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    couponRadius: ''
  };

  private customerInfo;

  constructor(public customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    this.oldCustomerInfo = this.customerService.getCustomerInfo();
    this.oldCustomerInfo.dateOfBirth = formatDate(this.oldCustomerInfo.dateOfBirth);

    this.customerInfo = { ...this.oldCustomerInfo};

  }

  onSubmit() {
    if (objectsAreDifferent(this.oldCustomerInfo, this.customerInfo)) {
      this.customerService.saveNewCustomerInfo({
        firstName: this.customerInfo.firstname,
        lastName: this.customerInfo.lastname,
        email: this.customerInfo.email,
        gender: this.customerInfo.gender,
        occupation: this.customerInfo.occupation,
        couponRadius: this.customerInfo.couponRadius
      }).subscribe(response => {
        console.log(response);
        this.customerService.updateCustomerInfo(this.customerInfo);
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
      });
    }
  }

}

function formatDate(serverDateFormat) {
  const dateOptions = {day: 'numeric', month: 'long', year: 'numeric'};

  return new Date(serverDateFormat)
    .toLocaleDateString('en-US', dateOptions);
}

function objectsAreDifferent(obj1, obj2) {
  let result = false;

  Object.keys(obj1).forEach(key => {
    if (obj1[key] !== obj2[key]) {
      result = true;
    }
  });

  return result;
}
