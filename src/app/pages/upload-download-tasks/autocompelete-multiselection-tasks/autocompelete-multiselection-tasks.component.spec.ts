import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompeleteMultiselectionTasksComponent } from './autocompelete-multiselection-tasks.component';

describe('AutocompeleteMultiselectionTasksComponent', () => {
  let component: AutocompeleteMultiselectionTasksComponent;
  let fixture: ComponentFixture<AutocompeleteMultiselectionTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompeleteMultiselectionTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompeleteMultiselectionTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
