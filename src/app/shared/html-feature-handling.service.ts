import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class HtmlFeatureHandlingService {

  serviceUrl: string = 'http://10.0.0.142:8002/HtmlFeaturesHandlingApis/';

  constructor(private http: HttpClient) { }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    vendorCode: new FormControl('', Validators.required),
    featureName: new FormControl('', Validators.required),
    userType: new FormControl('', Validators.required),
    userKey: new FormControl('', Validators.required),
    userValue: new FormControl(''),
  });

  formValidation: FormGroup = new FormGroup({
    vendorCode: new FormControl('', Validators.required),
    featureName: new FormControl('', Validators.required),
    testValue: new FormControl('', Validators.required)
  });

  initializeFormValidationGroup() {
    this.formValidation.setValue({
      vendorCode: null,
      featureName: null,
      testValue: null,
    });
  }

  initializeFormGroup() {
    this.form.setValue({
      id: null,
      vendorCode: null,
      featureName: null,
      userType: null,
      userKey: null,
      userValue: null
    });
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  filterExactName(areasAll, val) {
    return areasAll.filter((ele) => {
      return ele.name == val
    })
  }


  insertOrUpdate(
    allFeatureNames,
    allUserTypes) {
      debugger
    let user = {
      id: this.form.value.id,
      vendorCode: this.form.value.vendorCode,
      userValue: this.form.value.userValue,
      userKey: this.form.value.userKey,
      // featureName: this.filterExactName(allFeatureNames, this.form.value.featureName)[0],
      // userType: this.filterExactName(allUserTypes, this.form.value.userType)[0],
      featureName: this.form.value.featureName,
      userType:  this.form.value.userType,
    }


    console.log(user)
    console.log(`${this.serviceUrl}create`)
    return this.http.post<any>(`${this.serviceUrl}create`, user).pipe(catchError(this.errorHandler));
  }


  validateChecker() {
    debugger
    let user = {
      vendorCode: this.formValidation.value.vendorCode,
      featureName: this.formValidation.value.featureName,
      testValue:  this.formValidation.value.testValue,
    }
    console.log(user)
    console.log(`${this.serviceUrl}executeFeatureHandling`)
    return this.http.post<any>(`${this.serviceUrl}executeFeatureHandling`, user).pipe(catchError(this.errorHandler));
  }

  getAll() {
    console.log(`${this.serviceUrl}all`)
    return this.http.get<any>(`${this.serviceUrl}all`).pipe(catchError(this.errorHandler));
  }

 

  deleteById(id): Observable<any> {
    console.log(`${this.serviceUrl}deleteById/${id}`)
    return this.http.delete(`${this.serviceUrl}deleteById/${id}`).pipe(catchError(this.errorHandler));
  }

  populateForm(row) {

    this.form.setValue({
      id: row.id,
      vendorCode: row.vendorCode,
      featureName: row.featureName ?row.featureName:'' ,
      userType: row.userType ? row.userType : '',
      userKey: row.userKey,
      userValue: row.userValue,
    })

  }
}
