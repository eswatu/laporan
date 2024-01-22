import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DividerModule } from 'primeng/divider';


const materials = [ TableModule,
  PaginatorModule,
  ButtonModule,
  InputTextModule,
  CalendarModule,
  ToastModule,
  InputTextareaModule,
  ConfirmDialogModule,
  DividerModule
]

@NgModule({
  imports: materials,
  exports: materials
})
export class MaterialsDocumentModule { }
