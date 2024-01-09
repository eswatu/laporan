import { Component } from '@angular/core';
import { DocumentService } from '../../_services/document.service';
import { ApiResult } from '../../_services/base.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  // pageevent
  first: number = 0;
  rows: number = 10;
  defaultPage: number = 0;
  defaultSize:number = 10;
  defaultFilterColumn: string = '';
  filterQuery: string = '';
  // document
  documents : Document[];
constructor(private docService: DocumentService) {

}
ngOnInit() {
  
}
onPageChange(event: PageEvent) {
  this.first = event.first;
  this.rows = event.rows;
}
loadData(query: string) {
  var pageEvent : PageEvent = {
    page : this.defaultPage,
    rows : this.defaultSize,    
  };
  if (query) {
    this.filterQuery = query;
  }
}
getData(event: PageEvent) {
  var sortColumn = 'dok_number';
  var sortOrder = "asc";
  var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
  var filterQuery = (this.filterQuery) ? this.filterQuery : null;
  // use the service
  this.docService.getData<ApiResult<Document>>(event.page, event.rows,
                      sortColumn, sortOrder, filterColumn, filterQuery)
}
}
