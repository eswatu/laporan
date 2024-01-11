import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  });
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private docService:DocumentService) {
    }
    ngOnInit(){
      this.loadData();
      for (let index = 0; index < this.dok_item.length; index++) {
        const element = this.dok_item.controls[index] as FormGroup;
        const item = this.currentDoc.dok_item[index];
        element.patchValue({
          item_kode: item.item_kode,
          item_uraian: item.item_uraian,
          item_catatan: item.item_catatan
        });
      };
    }
    loadData() {
      //get data from internet
      this.route.queryParams.subscribe(params => {
        this.id = params['id'];
        // console.log(params['id']);
        if (this.id) {
          this.docService.get<Doc>(this.id).subscribe(result => {
            // console.log(result);
            this.doc.patchValue({
              dok_number : result.dok_number,
              dok_name : result.dok_name,
              dok_date: new Date(result.dok_date)
            });
            // buat form baru, tambahkan data
            result.dok_item.forEach((value) => {
              this.newItem();
            })
            // store result
            this.currentDoc = result;
          });
        }
      });
  }
  get dok_item() {
    return this.doc.controls['dok_item'] as FormArray;
  }
  newItem(item: Item = null) {
    const newFg = this.newForm();
    console.log('dari form ', item);
    this.dok_item.push(newFg);
    if (item != null) {
      newFg.patchValue({
        item_kode: item.item_kode,
        item_uraian: item.item_uraian,
        item_catatan: item.item_catatan,
        item_files: item.item_files
      });
    }
  }
  newForm(): FormGroup {
    return this.formBuilder.group({
      item_kode: [],
      item_uraian: [],
      item_catatan: [],
      item_files: [],
    });
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
