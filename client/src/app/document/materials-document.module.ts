import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';

const materials = [ TableModule, PaginatorModule, ButtonModule,

]

@NgModule({
  imports: materials,
  exports: materials
})
export class MaterialsDocumentModule { }
