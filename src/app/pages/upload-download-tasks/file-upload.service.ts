import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) { }

  addUser(name: string, profileImage: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('avatar', profileImage);

    return this.http.post('http://localhost:8990/create-user/', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }
  downloadFile(localUrl) {
    // return this.http.post('http://localhost:8990/download/', { file: localUrl }, {
    //   responseType: "blob",
    //   headers: new HttpHeaders().append("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    // }
    // )

    return this.http.post('http://localhost:8990/download/', { file: localUrl }, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });

  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  getAllTasks(): Observable<any> {
    return this.http.post('http://localhost:8990/get-all-tasks/', {} ).pipe(
      catchError(this.errorMgmt)
    );
  }

  progressStatus(): Observable<any> {
    return this.http.post('http://localhost:8990/get-progress-status/', {} ).pipe(
      catchError(this.errorMgmt)
    );
  }

  exportInputStatusApi( selectedTasks: string[],dateTo, dateFrom ): Observable<any> {
    console.log(selectedTasks);
    return this.http.post('http://localhost:8990/export-input-status/', {tasks : selectedTasks , dateTo, dateFrom } ).pipe(
      catchError(this.errorMgmt)
    );
  }
  exportResultsStatusApi( selectedTasks: string[] , dateTo: Date, dateFrom: Date,verticalOrHorizontal): Observable<any> {
    console.log(selectedTasks);
    return this.http.post('http://localhost:8990/export-results-status/', {tasks : selectedTasks , dateTo , dateFrom,verticalOrHorizontal } ).pipe(
      catchError(this.errorMgmt)
    );
  }

  exportDiffStatusApi( selectedTasks: string[] , dateTo: Date, dateFrom: Date): Observable<any> {
    console.log(selectedTasks);
    return this.http.post('http://localhost:8990/export-diff-status/', {tasks : selectedTasks} ).pipe(
      catchError(this.errorMgmt)
    );
  }

  exportResultsHorizontal( selectedTasks: string[] , dateTo: Date, dateFrom: Date): Observable<any> {
    console.log(selectedTasks);
    return this.http.post('http://localhost:8990/export-res_hor-status/', {tasks : selectedTasks} ).pipe(
      catchError(this.errorMgmt)
    );
  }

  exportByUrl(name: string, profileImage: File, selectedTasks, dateTo, dateFrom , verticalOrHorizontal): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('avatar', profileImage);
    formData.append('tasks', selectedTasks);
    formData.append('dateTo', dateTo);
    formData.append('dateFrom', dateFrom);
    formData.append('verticalOrHorizontal', verticalOrHorizontal);

    return this.http.post('http://localhost:8990/export-by-url/', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  exportByVendor(name: string, profileImage: File , selectedTasks, dateTo, dateFrom , verticalOrHorizontal): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('avatar', profileImage);
    formData.append('tasks', selectedTasks);
    formData.append('dateTo', dateTo);
    formData.append('dateFrom', dateFrom);
    formData.append('verticalOrHorizontal', verticalOrHorizontal);
    
    return this.http.post('http://localhost:8990/export-by-vendor/', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

}
