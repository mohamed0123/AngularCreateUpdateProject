import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlFeatureHandlerComponent } from './html-feature-handler.component';

describe('HtmlFeatureHandlerComponent', () => {
  let component: HtmlFeatureHandlerComponent;
  let fixture: ComponentFixture<HtmlFeatureHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlFeatureHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlFeatureHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
