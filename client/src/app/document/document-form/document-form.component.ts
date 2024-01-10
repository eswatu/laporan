import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DocumentService } from '../../_services/document.service';
import { Doc } from '../../_models/document.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.css'
})
export class DocumentFormComponent implements OnInit {
  id:number;
  currentDoc = <Doc>{};
  doc = this.formBuilder.group({
    dok_number: new FormControl(''),
    dok_date: new FormControl(''),
    dok_name: new FormControl(''),
    dok_item: this.formBuilder.array(
      [
    //     this.formBuilder.group({
    //   item_kode: new FormControl(''),
    //   item_uraian: new FormControl(''),
    //   item_catatan: new FormControl(''),
    //   item_files: this.formBuilder.array([this.formBuilder.group({
    //     file_name: new FormControl(''),
    //     file_keterangan: new FormControl(''),
    //   })])
    // })
  ]
    )
  });
  constructor(public formBuilder: FormBuilder, private route: ActivatedRoute,
    private docService:DocumentService) {
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => console.log(params));
  }
  loadData() {
    if (this.id) {
      this.docService.get<Doc>(this.id).subscribe(result => {
        this.currentDoc = result;
        console.log(result);
      })
    }
  }
  get dok_item() {
    return this.doc.get('dok_item') as FormArray;
  }
  newItem() {
    this.dok_item.push(this.formBuilder.group({
      item_kode: new FormControl(''),
      item_uraian: new FormControl(''),
      item_catatan: new FormControl(''),
      item_files: this.formBuilder.array([this.formBuilder.group({
        file_name: new FormControl(''),
        file_keterangan: new FormControl(''),
      })])
    }))
  }
  getitem_files(index:number) {
    return this.dok_item.at(index).get('item_files') as FormArray;
  }
  newFiles(item:number) {
    this.getitem_files(item).push(this.formBuilder.group({
      file_name: new FormControl(''),
      file_keterangan: new FormControl(''),
    }))
  }
  
}
