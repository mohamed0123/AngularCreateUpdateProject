import { Component, OnInit, EventEmitter, Input, Output, OnChanges, AfterViewInit } from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocompelete-multiselection-tasks',
  templateUrl: './autocompelete-multiselection-tasks.component.html',
  styleUrls: ['./autocompelete-multiselection-tasks.component.css']
})
export class AutocompeleteMultiselectionTasksComponent implements OnInit, OnChanges , AfterViewInit {


  @Input() allTasks: string[];
  @Output() selectedTasks = new EventEmitter<string[]>();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  // fruits: string[] = ['Lemon'];
  sTasks: string[] = [];
  // allTasks: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (this.allTasks) {
      if (this.allTasks.length > 0) {
        console.log(this.allTasks);
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
          startWith(null),
          map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTasks.slice()));
      }
    }
    if (this.sTasks) {
      this.selectedTasks.emit(this.sTasks);
    }
  }

  constructor() {

    // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
    //     startWith(null),
    //     map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTasks.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.sTasks.push(value.trim());
        this.selectedTasks.emit(this.sTasks);
      }
      console.log(this.sTasks);
      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.sTasks.indexOf(fruit);

    if (index >= 0) {
      this.sTasks.splice(index, 1);
      this.selectedTasks.emit(this.sTasks);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.sTasks.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTasks.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
  }
  ngAfterViewInit(): void {
    // document.getElementById('mat-form-field-label-1').style.color = 'black';
  }
}
