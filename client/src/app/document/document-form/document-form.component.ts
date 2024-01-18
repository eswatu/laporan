import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DocumentService } from '../../_services/document.service';
import { Doc, Item } from '../../_models/document.interface';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.css',
  providers: [MessageService]
})
export class DocumentFormComponent implements OnInit {
  id : string;
  currentDoc = <Doc>{};
  // form
  doc : FormGroup;
  itemForm : FormGroup;
  headerIsEdited: boolean = false;
  headeriswaiting: boolean = false;

  bodyIsEdited: [boolean] = [false];
  bodyIsWaiting: boolean = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private docService:DocumentService, private msgService: MessageService) {
    }
    ngOnInit(){
      this.doc = this.formBuilder.group({
        dok_number: this.currentDoc.dok_number,
        dok_date: this.currentDoc.dok_date,
        dok_name: this.currentDoc.dok_name,
        dok_item: this.formBuilder.array([])
      });
      this.loadData();
      // track if header is changed
      this.doc.get('dok_number').statusChanges.subscribe(() =>  (this.doc.get('dok_number').dirty) ? this.headerIsEdited = true : this.headerIsEdited = false)
      this.doc.get('dok_date').statusChanges.subscribe(() => (this.doc.get('dok_date').dirty) ? this.headerIsEdited = true : this.headerIsEdited = false)
      this.doc.get('dok_name').statusChanges.subscribe(() => (this.doc.get('dok_name').dirty) ? this.headerIsEdited = true : this.headerIsEdited = false)
      // track if body is changed
      // this.doc.get('dok_item').statusChanges.subscribe(() => (this.doc.get('dok_item').dirty && this.doc.get('dok_item').valid) ? this.bodyIsEdited = true : this.bodyIsEdited = false)

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
      console.log("id ",this.id);
  }
  get dok_item() {
    return this.doc.controls['dok_item'] as FormArray;
  }
  get isEdit() {
    return this.id ? true : false;
  }
  isFormGroupChanged(index:number) {
    const fg = this.dok_item.at(index) as FormGroup;
    return fg.dirty && fg.valid;
  }
  grouphasId(index: number) {
    return this.currentDoc.dok_item[index]._id ? true : false;
  }
  revertHeader() {
    this.doc.patchValue({
      dok_number : this.currentDoc.dok_number,
      dok_name : this.currentDoc.dok_name,
      dok_date: new Date(this.currentDoc.dok_date)
    });
    this.msgService.add({severity: 'info', summary: 'Batal Ubah', detail: 'Header dikembalikan ke asal '});
    this.headerIsEdited = false;
  }
  submitItem(index: number) {
    this.bodyIsWaiting = true;
    const fg = this.dok_item.at(index) as FormGroup;
    const detil = <Item>{
        item_kode:fg.get('item_kode').value,
        item_catatan:fg.get('item_catatan').value,
        item_uraian:fg.get('item_uraian').value };                  
    if (this.currentDoc.dok_item[index]?._id) {
      detil._id = this.currentDoc.dok_item[index]._id;
      // update method
      this.docService.updateItem<Doc>(detil, this.currentDoc.id).subscribe(result => {
        this.dok_item.clear();
        console.log('mau lihat isinya ',result);
          // buat form baru, tambahkan data
          result.dok_item.forEach((value) => {
            this.newItem(value);
          })
          // store result
          this.currentDoc = result;
        }, error => console.log(error)
        , () => {
            this.msgService.add({severity: 'success', summary: 'Success', detail: 'Item berhasil diubah'});
            fg.markAsPristine();
          })
      } else {
        this.docService.createItem<Doc>(detil, this.currentDoc.id).subscribe(result => {
          this.dok_item.clear();
            // buat form baru, tambahkan data
            result.dok_item.forEach((value) => {
              this.newItem(value);
            })
            // store result
            this.currentDoc = result;
          }, error => console.log(error)
          ,  () => {
              this.msgService.add({severity: 'success', summary: 'Berhasil', detail: 'Item berhasil ditambahkan'});
              fg.markAsPristine();
            })
          }
          this.bodyIsWaiting = false;
  }
  revertItem(index: number) {
    const fg = this.dok_item.at(index)
    fg.patchValue({
      item_kode: this.currentDoc.dok_item[index].item_kode,
      item_uraian: this.currentDoc.dok_item[index].item_uraian,
      item_catatan: this.currentDoc.dok_item[index].item_catatan,
      item_files: this.currentDoc.dok_item[index].item_files,
    });
    this.msgService.add({severity: 'info', summary: 'Batal Ubah', detail: `Detil item ${index + 1} dikembalikan ke asal `});
    fg.markAsPristine();
  }
  submitHeader() {
    this.headeriswaiting = true;
    if (this.id) {
      // update currentDoc
      this.currentDoc.dok_name = this.doc.get('dok_name').value;
      this.currentDoc.dok_number = this.doc.get('dok_number').value;
      this.currentDoc.dok_date = this.doc.get('dok_date').value;

      this.docService.put<Doc>(this.currentDoc).subscribe(result => {
        this.currentDoc = result;
        this.headerIsEdited = false;
      }, error => console.log(error), () => {
        this.msgService.add({severity: 'success', summary: 'Success', detail: 'Header berhasil diubah'});
        this.headeriswaiting = false;
      });
    } else {
      this.docService.post<Doc>(this.doc.value).subscribe(result => {
        this.id = result.id;
        this.currentDoc = result;
        this.headerIsEdited = false;
      })
    }
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
    // console.log('dari form ', item);
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
