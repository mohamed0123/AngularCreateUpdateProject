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
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-upload-download-tasks',
  templateUrl: './upload-download-tasks.component.html',
  styleUrls: ['./upload-download-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService,
    private notificationService: NotificationService) {
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
    this.fileUploadService.getAllTasks().subscribe(data => {
      this.allTasks = data;
      // console.log(this.allTasks);
    }, error => { console.log(error); });
  }


  drawMyChart() {
    this.fileUploadService.progressStatus().subscribe(
      (data) => {


        console.log(data);
        const extData = data.extStatus;
        const doneCount = extData.filter(e => e._id === 'Done') || [];
        const errorCount = extData.filter(e => e._id === 'error') || [];
        const insertedCount = extData.filter(e => e._id === 'inserted') || [];
        // extraction chart
        const datareturned = [this.getCount(doneCount), this.getCount(insertedCount), this.getCount(errorCount)];
        const id = 'myChart';
        this.drawChart(datareturned, id);


        const conStatus = data.conStatus;
        const doneConCount = conStatus.filter(e => e._id === 'Done') || [];
        const errorConCount = conStatus.filter(e => e._id === 'error') || [];
        const insertedConCount = conStatus.filter(e => e._id === 'unexecuted') || [];
        const inProgress = conStatus.filter(e => e._id === 'Waiting convert to hr') || [];
        // conversition chart
        const data1 = [this.getCount(doneConCount), this.getCount(insertedConCount) + this.getCount(inProgress), this.getCount(errorConCount)];
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
    }, 1200000);
  }


  drawChart(mydata, id) {

    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
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
              saveAs(data, event.body.userCreated.avatar);
              this.getAllTasks();
              this.drawMyChart();
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
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
    this.fileUploadService.exportInputStatusApi(
      this.selectedTasks
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath);
        },
        err => {
          alert('Problem while downloading the file.');
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
      dateFrom = this.form.value.dateFrom;
    }

    this.fileUploadService.exportResultsStatusApi(
      this.selectedTasks, dateTo, dateFrom
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath);
        },
        err => {
          alert('Problem while downloading the file.');
          console.error(err);
        }
      );
    }
    );
  }

  exportResultsStatus() {
    if (this.form.value.verticalOrHorizontal === 'ver') {
      this.exportResultsVertical();
    } else {
      this.exportResultsHorizontal();
    }
  }



  exportResultsHorizontal() {
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.dateFrom;
    }
    this.fileUploadService.exportResultsHorizontal(
      this.selectedTasks, dateTo, dateFrom
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath);
        },
        err => {
          alert('Problem while downloading the file.');
          console.error(err);
        }
      );
    }
    );
  }

  exportDiffStatus() {
    let dateTo = null;
    let dateFrom = null;
    if (this.form.value.withOrWithoutDate) {
      console.log(this.form.value.fromDate);
      console.log(this.form.value.toDate);
      dateTo = this.form.value.toDate;
      dateFrom = this.form.value.dateFrom;
    }
    this.fileUploadService.exportDiffStatusApi(
      this.selectedTasks, dateTo, dateFrom
    ).subscribe(filePath => {
      console.log('start downloading');
      console.log(filePath);
      this.fileUploadService.downloadFile(filePath).subscribe(
        data => {
          saveAs(data, filePath);
        },
        err => {
          alert('Problem while downloading the file.');
          console.error(err);
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
    this.fileUploadService.exportByUrl(
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
              saveAs(data, event.body.userCreated.avatar);
              this.getAllTasks();
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
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




  exportByVendor(): void {
    this.fileUploadService.exportByVendor(
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
              saveAs(data, event.body.userCreated.avatar);
              this.getAllTasks();
            },
            err => {
              alert('Problem while downloading the file.');
              console.error(err);
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
}
