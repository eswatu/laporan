import { Inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})

export class DocumentService extends BaseService {
  url;
  getData<ApiResult>(pageIndex: number, pageSize: number,
          sortColumn: string, sortorder: string,
          filterColumn: string, filterQuery: string): Observable<ApiResult> {
            var params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString())
            .set('sortColumn', sortColumn)
            .set('sortOrder', sortorder);
            if (filterQuery) {
              params = params.set('filterColumn', filterColumn)
                            .set('filterQuery', filterQuery);
                          }
            return this.http.get<ApiResult>(this.url, {params});
  }
  get<Doc>(id: string): Observable<Doc> {
    let myurl = this.url + id;
    return this.http.get<Doc>(myurl);
  }
  post<Doc>(doc: Doc): Observable<Doc> {
    return this.http.post<Doc>(this.url, doc);
  }
  put<Doc>(doc: any): Observable<Doc> {
    let myurl = this.url + doc.id;
    return this.http.put<Doc>(myurl, doc);
  }
  createItem<Item>(item: any): Observable<Item> {
    let myurl = this.url + 'item/' + item.id;
    return this.http.post<Item>(myurl, item);
  }
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
    this.url = `${environment.baseUrl}/doc/`;
  }
}
