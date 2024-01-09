import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from "primeng/table";

const materials = [ TableModule, PaginatorModule

]

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class MaterialsDocumentModule { }
