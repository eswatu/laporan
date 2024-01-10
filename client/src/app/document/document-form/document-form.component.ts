import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DocumentService } from '../../_services/document.service';
import { Doc, Item } from '../../_models/document.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.css'
})
export class DocumentFormComponent implements OnInit {
  id : string;
  currentDoc = <Doc>{};
  // form
  doc : FormGroup = this.formBuilder.group({
    dok_number: new FormControl(),
    dok_date: new FormControl(),
    dok_name: new FormControl(),
    dok_item: this.formBuilder.array([])
  });
  itemForm : FormGroup = this.formBuilder.group({
    item_kode: [],
    item_uraian: [],
    item_catatan: [],
    item_files: this.formBuilder.array([]),
  });
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private docService:DocumentService) {
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // console.log(params['id']);
    });
    this.loadData();
  }
  loadData() {
    //get data from internet
    if (this.id) {
      this.docService.get<Doc>(this.id).subscribe(result => {
        // console.log(result);
        this.doc.patchValue({
          dok_number : result.dok_number,
          dok_name : result.dok_name,
          dok_date: new Date(result.dok_date)
        });
        result.dok_item.forEach(item => {
          this.newItem();
          this.dok_item.at(this.dok_item.length - 1).patchValue({
            item_kode: item.item_kode,
            item_uraian: item.item_uraian,
            item_catatan: item.item_catatan
          })
        });
        this.currentDoc = result;
      });
    }
  }
  get dok_item() {
    return this.doc.controls['dok_item'] as FormArray;
  }
  newItem() {
    this.dok_item.push(this.itemForm);
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
