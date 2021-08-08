import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatMenuModule } from '@angular/material/menu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatConfirmDialogComponent } from './pages/helper/mat-confirm-dialog/mat-confirm-dialog.component';
import { MaterialModule } from './material/material/material.module';
import { ExcelService } from './helper/excel.service';
import { DatePipe } from '@angular/common';

import { HtmlFeatureHandlerComponent } from './pages/html-feature-handler/html-feature-handler.component';

import { CreateComponent } from './pages/html-feature-handler/create/create.component';
import { EditComponent } from './pages/html-feature-handler/edit/edit.component';
import { ValidationComponent } from './pages/html-feature-handler/validation/validation.component';
import { UploadDownloadTasksComponent } from './pages/upload-download-tasks/upload-download-tasks.component';
import { AutocompeleteMultiselectionTasksComponent } from './pages/upload-download-tasks/autocompelete-multiselection-tasks/autocompelete-multiselection-tasks.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    routingComponents,
    MatConfirmDialogComponent,
    HtmlFeatureHandlerComponent,
    EditComponent,
    CreateComponent,
    ValidationComponent,
    UploadDownloadTasksComponent,
    AutocompeleteMultiselectionTasksComponent,
  ],
  imports: [
    BrowserModule,
    MatChipsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    HttpClientModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatSelectModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MaterialModule,
    MatMenuModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [MatDatepickerModule, ExcelService, DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [CreateComponent, ValidationComponent, MatConfirmDialogComponent]
})
export class AppModule { }
