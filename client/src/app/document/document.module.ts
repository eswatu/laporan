import { NgModule } from '@angular/core';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentRoutingModule } from './document-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialsDocumentModule } from './materials-document.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentFormComponent
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
