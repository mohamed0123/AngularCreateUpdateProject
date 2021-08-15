import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from 'src/app/shared/notification.service';
import { HtmlFeatureHandlingService } from 'src/app/shared/html-feature-handling.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  allFeatureNames  = [ 'PN' , 'DESC' , 'TAX_PATH' ]
  allUserTypes = ['REGEX' ,  'REPLACE' ,'REPLACE AFTER' ,'REPLACE BEFORE' ]
  allFlows  = [ 'HTML Extraction' , 'PDF Extraction' ]
  results = 'Click check to see the results'
  constructor(public dialogRef: MatDialogRef<ValidationComponent>,
    private notificationService: NotificationService, private service: HtmlFeatureHandlingService) { }

  ngOnInit() {
  }

  onFormSubmit() {

    this.service.validateChecker().subscribe(
        data => {
          debugger
          console.log(data)
          if (data.status === 'Done'){
            this.notificationService.success('Check Results Box');
            // this.onClose();
            this.results = data.extractedResults
          }
          else {
            console.log(data.errorMessage)
            this.notificationService.warn(data.errorMessage);
          }

          
        },
        error => {
          console.log(error)
          this.notificationService.warn(error.message);
        }

      );


  }

  onClose() {
    this.service.formValidation.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }

}
