import { NgModule } from '@angular/core';
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";


const materials = [MenubarModule,ButtonModule]

@NgModule({
  imports: materials,
  exports: materials
})
export class MaterialModule { }
