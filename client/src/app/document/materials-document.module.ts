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
import { FileUploadModule } from 'primeng/fileupload';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { TabViewModule } from 'primeng/tabview';



const materials = [ TableModule,
  PaginatorModule,
  ButtonModule,
  InputTextModule,
  CalendarModule,
  ToastModule,
  InputTextareaModule,
  ConfirmDialogModule,
  DividerModule,
  FileUploadModule,
  CarouselModule,
  ImageModule,
  TabViewModule
]

@NgModule({
  imports: materials,
  exports: materials
})
export class MaterialsDocumentModule { }
