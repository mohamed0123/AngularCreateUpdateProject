import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from 'src/app/shared/notification.service';
import { HtmlFeatureHandlingService } from 'src/app/shared/html-feature-handling.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  allFeatureNames  = [ 'PN' , 'DESC' , 'TAX_PATH' ]
  allFlows  = [ 'HTML Extraction' , 'PDF Extraction' ]
  allUserTypes = ['REGEX' ,  'REPLACE' ,'REPLACE AFTER' ,'REPLACE BEFORE' ]
  constructor(public dialogRef: MatDialogRef<CreateComponent>,
    private notificationService: NotificationService, private service: HtmlFeatureHandlingService) { }

  ngOnInit() {
  }

  onFormSubmit() {

    this.service.insertOrUpdate().subscribe(
        data => {
          console.log(data)
          if (data.status === 'Done'){
            this.notificationService.success('Saved Successfully');
            this.onClose();
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
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }

}
