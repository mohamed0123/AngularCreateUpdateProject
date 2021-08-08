import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDownloadTasksComponent } from './upload-download-tasks.component';

describe('UploadDownloadTasksComponent', () => {
  let component: UploadDownloadTasksComponent;
  let fixture: ComponentFixture<UploadDownloadTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDownloadTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDownloadTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
