import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LanguageViewModel } from 'src/models/LanguageViewModel';
import { TranslateRequest } from 'src/models/TranslateRequest';
import { TranslateViewModel } from 'src/models/TranslateViewModel';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) { }

  public translate(req: TranslateRequest): Observable<TranslateViewModel>{
    return this.http.post<TranslateViewModel>(`${environment.apiUrl}/api/translate`, req);
  }

  public languages(): Observable<Array<LanguageViewModel>>{
    return this.http.get<Array<LanguageViewModel>>(`${environment.apiUrl}/api/languages`);
  }
}
