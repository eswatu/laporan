import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";

const materials = [ TableModule,
  PaginatorModule,
  ButtonModule,
  InputTextModule,
  CalendarModule

]

@NgModule({
  imports: materials,
  exports: materials
})
export class MaterialsDocumentModule { }
