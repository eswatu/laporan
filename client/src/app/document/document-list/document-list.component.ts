import { Component } from '@angular/core';
import { DocumentService } from '../../_services/document.service';
import { ApiResult } from '../../_services/base.service';
import { Doc } from '../../_models/document.interface';
import { DialogService } from "primeng/dynamicdialog";
import { DocumentFormComponent } from '../document-form/document-form.component';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
  providers: [DialogService]
})
export class DocumentListComponent {
  // pageevent
  first: number = 0;
  rows: number = 10;
  defaultPage: number = 0;
  defaultSize: number = 10;
  defaultFilterColumn: string = '';
  filterQuery: string = '';
  // document
  documents : Doc[];
constructor(private docService: DocumentService, private dialogservice: DialogService) {
  // this.documents = [
  //   { id:'asa111', dok_number: 1, dok_date: new Date(), dok_name: 'test1', dok_item: [{id: "1", item_kode: 'test1', item_uraian: "item 1", item_catatan: "sesuatu"}]},
  //   { id:'asa222', dok_number: 2, dok_date: new Date(), dok_name: 'test2', dok_item: [{id: "2", item_kode: 'test2', item_uraian: "item a", item_catatan: "sesuatu"}]},
  //   { id:'asa333', dok_number: 3, dok_date: new Date(), dok_name: 'test3', dok_item: [{id: "3", item_kode: 'test3', item_uraian: "item 1", item_catatan: "sesuatu"}]},
  //   { id:'asa444', dok_number: 4, dok_date: new Date(), dok_name: 'test4', dok_item: [{id: "4", item_kode: 'test4', item_uraian: "item a", item_catatan: "sesuatu"}]}
  // ]
}
ngOnInit() {
  this.loadData(null);
}
onPageChange(event: PageEvent) {
  this.first = event.first;
  this.rows = event.rows;
}
loadData(query: string) {
  var pageEvent : PageEvent = {
    first: this.first,
    page : this.defaultPage,
    rows : this.defaultSize,
    pageCount : 5    
  };
  if (query) {
    this.filterQuery = query;
  }
  this.getData(pageEvent);
}
getData(event: PageEvent) {
  var sortColumn = 'dok_number';
  var sortOrder = "asc";
  var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
  var filterQuery = (this.filterQuery) ? this.filterQuery : null;
  // use the service
  this.docService.getData<ApiResult<Doc>>(event.page, event.rows,
                      sortColumn, sortOrder, filterColumn, filterQuery).subscribe(result => {
                        this.documents = result.data;
                        console.log(result);
                      })
}
// untuk komponen lain
showForm() {
  const ref = this.dialogservice.open(DocumentFormComponent, {
    header: 'Input Form',
    width: '70%',
    // contentStyle: {"max-height": "500px", "overflow": "auto"},
  });
}

}
