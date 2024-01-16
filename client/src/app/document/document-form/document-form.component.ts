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
  doc : FormGroup;
  itemForm : FormGroup;
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private docService:DocumentService) {
      this.doc = this.formBuilder.group({
        dok_number: new FormControl(),
        dok_date: new FormControl(),
        dok_name: new FormControl(),
        dok_item: this.formBuilder.array([])
      });
      
    }
    ngOnInit(){
      this.loadData();
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
              this.newItem(value);
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
  newFormGroup(): FormGroup {
    return this.formBuilder.group({
      item_kode: new FormControl(),
      item_uraian: new FormControl(),
      item_catatan: new FormControl(),
      item_files: this.formBuilder.array([]),
    });
  }
  newItem(item: Item = null) {

    const myform = this.newFormGroup();
    myform.patchValue(item);
    console.log('dari form ', item);
    const formArrays = this.dok_item as FormArray;
    formArrays.push(myform);
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
