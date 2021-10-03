import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatGridListModule, MatGridTile } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    // NgxMatSelectSearchModule

  ],
  exports: [
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    // NgxMatSelectSearchModule
  ],
})
export class MaterialModule {}
