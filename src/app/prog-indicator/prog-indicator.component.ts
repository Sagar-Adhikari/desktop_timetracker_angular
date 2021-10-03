import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-prog-indicator',
  templateUrl: './prog-indicator.component.html',
  styleUrls: ['./prog-indicator.component.css']
})
export class ProgIndicatorComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  diameter = 48;
  strokeWidth = 4;
  
  constructor() { }

  ngOnInit(): void {
  }

}
