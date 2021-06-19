import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }


  public exportAsExcelFile(excelFileName: string): void {
    let json = []


    document.querySelectorAll('mat-header-row').forEach(
      r => {
        let row = []
        r.querySelectorAll('mat-header-cell').forEach(e => {
          let cell = <HTMLElement>e
          row.push(cell.innerText)
        })

        json.push(row.slice(1))
      }
    )

    document.querySelectorAll('mat-row').forEach(
      r => {
        let row = []
        r.querySelectorAll('mat-cell').forEach(e => {
          let cell = <HTMLElement>e
          row.push(cell.innerText)
        })

        json.push(row.slice(1))
      }
    )


    json = json;


    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { skipHeader: true });
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
