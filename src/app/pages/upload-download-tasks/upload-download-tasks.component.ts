import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from './file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/notification.service';
import { saveAs } from 'file-saver';
import { ChartType, ChartDataSets, Chart } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { ChangeDetectionStrategy , ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-upload-download-tasks',
  templateUrl: './upload-download-tasks.component.html',
  styleUrls: ['./upload-download-tasks.component.css']
  // ,changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDownloadTasksComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  myInterval: any;
  form: FormGroup;
  progress = 0;
  selectedTasks: string[];
  title = 'angular8chartjs';
  canvas: any;
  ctx: any;
  allTasks: string[];
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  loading: boolean = false;
  statusList:string[] = ["Done" , "Error"]
  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService,
    private notificationService: NotificationService,private cdRef:ChangeDetectorRef) {
    this.form = this.fb.group({
      name: [''],
      avatar: [null],
      verticalOrHorizontal: '',
      fromDate: new Date(),
      toDate: new Date(),
      withOrWithoutDate: false
    });
  }

  onSelectTask(selectedTasksInner: string[]) {
    if (selectedTasksInner) {
      this.selectedTasks = selectedTasksInner;
    }
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    if (this.myInterval) {
      clearInterval(this.myInterval);
    }
  }


  getCount(list) {
    if (list.length > 0) {
      return list[0].count;
    } else {
      return 0;
    }
  }

  getAllTasks() {
    this.loading = true;
    this.fileUploadService.getAllTasks().subscribe(data => {
      this.allTasks = data;
      // console.log(this.allTasks);
      this.loading = false;
    }, error => { 
      this.loading = false;
      console.log(error); 
    });
  }


  drawMyChart() {
    this.fileUploadService.progressStatus().subscribe(
      (data) => {


        console.log(data);
        const extData = data.extStatus;
        const doneCount = extData.filter(e => e._id === 'Done') || [];
        const errorCount = extData.filter(e => e._id === 'Error') || [];
        const insertedCount = extData.filter(e => !this.statusList.includes( e._id) ) || [];
        // extraction chart
        const datareturned = [this.getCount(doneCount), this.getCount(insertedCount), this.getCount(errorCount)];
        const id = 'myChart';
        this.drawChart(datareturned, id);


        const conStatus = data.conStatus;
        const doneConCount = conStatus.filter(e => e._id === 'Done') || [];
        const errorConCount = conStatus.filter(e => e._id === 'Error') || [];
        // const insertedConCount = conStatus.filter(e => e._id === 'unexecuted') || [];
        const inProgress = conStatus.filter(e => !this.statusList.includes( e._id)) || [];
        // conversition chart
        const data1 = [this.getCount(doneConCount), this.getCount(inProgress), this.getCount(errorConCount)];
        const id1 = 'myChart2';
        this.drawChart(data1, id1);

      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {

    this.getAllTasks();

    this.drawMyChart();
    this.myInterval = setInterval(() => {
      this.drawMyChart();
    }, 2400000);
  }


  drawChart(mydata, id) {

    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    const myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['Done', 'In Progress', 'Error'],

        datasets: [{
          label: '# of Votes',

          data: mydata,
          backgroundColor: [

            '#47b39c', // 'green',
            '#FFC154', // 'yellow',
            '#EC6B56'//  'red',
          ],
          borderWidth: 1
        }]
      },
      options: {
        
        responsive: false,
        // display: true,
        legend: {
          position: 'right',
          labels: {
            fontColor: '#000000',
            // fontSize: 18
          }
        }
      }
    });
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity();
  }

  submitUser() {
    this.loading = true;
    this.fileUploadService.addUser(
      this.form.value.name,
      this.form.value.avatar
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.notificationService.success('Task Successfully Created');
          // this.downloadFunc(event.body.userCreated.avatar)
          console.log('start downloading');
          
          this.fileUploadService.downloadFile(event.body.userCreated.avatar).subscribe(
            data => {
              saveAs(data, event.body.userCreated.avatar.replace(/^.*[\\\/]/, ''));
              this.getAllTasks();
              this.drawMyChart();
              this.loading = false;
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
              this.loading = false;
            }
          );
          setTimeout(() => {
            this.progress = 0;
          }, 1500);

      }

    },
      error => {
        console.log(error);
        this.notificationService.warn(error);
      }

    );
  }

  downloadFunc(filePath) {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', filePath);
    anchor.setAttribute('download', '');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.parentNode.removeChild(anchor);
  }

  exportInputStatus() {
    this.loading = true;
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.fromDate;
    }
    this.fileUploadService.exportInputStatusApi(
      this.selectedTasks, dateTo, dateFrom 
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath.replace(/^.*[\\\/]/, ''));
          this.loading = false;
        },
        err => {
          alert('Problem while downloading the file.');
          this.loading = false;
          console.error(err);
        }
      );
    }
    );
  }


  exportResultsVertical() {
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.fromDate;
    }
    let verticalOrHorizontal ;
    if(this.form.value.verticalOrHorizontal === 'ver'){
      verticalOrHorizontal = "vertical";
    }else{
      verticalOrHorizontal = "horizontal";
    }
    this.loading = true;
    this.fileUploadService.exportResultsStatusApi(
      this.selectedTasks, dateTo, dateFrom,verticalOrHorizontal
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath.replace(/^.*[\\\/]/, ''));
          this.loading = false;
        },
        err => {
          alert('Problem while downloading the file.');
          console.error(err);
          this.loading = false;
        }
      );
    }
    );
  }

  exportResultsStatus() {
   
      this.exportResultsVertical();
   
  }


  exportDiffStatus() {
    let dateTo = null;
    this.loading = true;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.fromDate;
    }
    this.fileUploadService.exportDiffStatusApi(
      this.selectedTasks, dateTo, dateFrom
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath.replace(/^.*[\\\/]/, ''));
          this.loading = false;
        },
        err => {
          alert('Problem while downloading the file.');
          console.error(err);
          this.loading = false;
        }
      );
    }
    );
  }

  ngAfterViewInit(): void {
    // document.getElementById('mat-form-field-label-1').style.color = 'azure';
    // document.querySelectorAll('label').forEach(e => e.style.color = 'black');

  }


  exportByUrl(): void {
    this.loading = true;
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.fromDate;
    }
    let verticalOrHorizontal ;
    if(this.form.value.verticalOrHorizontal === 'ver'){
      verticalOrHorizontal = "vertical";
    }else{
      verticalOrHorizontal = "horizontal";
    }
    

    if(!this.form.value.avatar){
      this.notificationService.warn("Please Choose your XLSX file with header (`URL`)")
      this.loading = false;
      return ;
    }

    this.fileUploadService.exportByUrl(
      this.form.value.name,
      this.form.value.avatar,this.selectedTasks, dateTo, dateFrom , verticalOrHorizontal
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.notificationService.success('Done');
          // this.downloadFunc(event.body.userCreated.avatar)
          console.log('start downloading');
          this.fileUploadService.downloadFile(event.body.userCreated.avatar).subscribe(
            data => {
              debugger
              saveAs(data, event.body.userCreated.avatar.replace(/^.*[\\\/]/, ''));
              this.getAllTasks();
              this.loading = false;
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
              this.loading = false;
            }
          );
          setTimeout(() => {
            this.progress = 0;
          }, 1500);

      }

    },
      error => {
        console.log(error);
        this.loading = false;
        this.notificationService.warn(error);
      }

    );
  }

  exportByVendor(): void {
    debugger
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.fromDate;
    }
    let verticalOrHorizontal ;
    if(this.form.value.verticalOrHorizontal === 'ver'){
      verticalOrHorizontal = "vertical";
    }else{
      verticalOrHorizontal = "horizontal";
    }

    console.log(this.form.value.avatar)
    if(!this.form.value.avatar){
      this.loading = false;
      this.notificationService.warn("Please Choose your XLSX file with header (`Vendor`)")
      return ;
    }
    debugger
    this.loading = true;
    this.fileUploadService.exportByVendor(
      this.form.value.name,
      this.form.value.avatar,
      this.selectedTasks, dateTo, dateFrom , verticalOrHorizontal
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.notificationService.success('Done');
          // this.downloadFunc(event.body.userCreated.avatar)
          console.log('start downloading');
          this.fileUploadService.downloadFile(event.body.userCreated.avatar).subscribe(
            data => {
              saveAs(data, event.body.userCreated.avatar.replace(/^.*[\\\/]/, ''));
              this.getAllTasks();
              this.loading = false;
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
              this.loading = false;
            }
          );
          setTimeout(() => {
            this.progress = 0;
          }, 1500);

      }

    },
      error => {
        console.log(error);
        this.loading = false;
        this.notificationService.warn(error);
      }

    );
  }
}
