import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,     
  ],
  declarations: [
  ],
  exports: [
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
