import { NgModule } from '@angular/core';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentRoutingModule } from './document-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialsDocumentModule } from './materials-document.module';



@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialsDocumentModule,
    DocumentRoutingModule
  ]
})
export class DocumentModule { }
