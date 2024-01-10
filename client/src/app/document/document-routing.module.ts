import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFormComponent } from './document-form/document-form.component';

const routes: Routes = [
  {path: '', component: DocumentListComponent},
  {path: 'detil', component: DocumentFormComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
