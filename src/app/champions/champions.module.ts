import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChampionListComponent } from './champion-list/champion-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChampionListComponent
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ChampionListComponent]
})
export class ChampionsModule { }
