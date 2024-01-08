import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'document', loadChildren: () => import('./document/document.module').then(m => m.DocumentModule)},
  {path: '**', redirectTo: 'document'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
