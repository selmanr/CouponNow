import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DataService {
    private subject = new Subject<any>();
    private ownerSubject = new Subject<any>();
    private customerSubject = new Subject<any>();

    setLogin(status: boolean) {
        this.subject.next({ isLogin: status });
    }

    getLogin(): Observable<any> {
        return this.subject.asObservable();
    }

    setOwner (status: boolean) {
      this.ownerSubject.next({ customerType: status});
    }

    getOwnerStatus(): Observable<any> {
      return this.ownerSubject.asObservable();
    }

    setCustomer (status: boolean) {
      this.customerSubject.next({ isCustomer: status });
    }

    getCustomerStatus(): Observable<any> {
      return this.customerSubject.asObservable();
    }
}
