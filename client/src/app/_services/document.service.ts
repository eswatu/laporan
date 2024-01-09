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
  override get<T>(id: number): Observable<T> {
    throw new Error('Method not implemented.');
  }
  override put<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  override post<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
    this.url = `${environment.baseUrl}/doc`;
  }
}
