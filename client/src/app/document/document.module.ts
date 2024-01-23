import { NgModule } from '@angular/core';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentRoutingModule } from './document-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialsDocumentModule } from './materials-document.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentFileFormComponent } from './document-file-form/document-file-form.component';



@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentFormComponent,
    DocumentFileFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsDocumentModule,
    DocumentRoutingModule
  ]
})
export class DocumentModule { }
