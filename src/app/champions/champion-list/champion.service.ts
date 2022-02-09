import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Champion } from '../champion.model';
@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private championsUrl = 'api/champions/';
  constructor(private http: HttpClient) {
   }

  getChampions(): Observable<Champion[]> {
    return this.http.get<Champion[]>(this.championsUrl).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  createChampion(champion: Champion): Observable<Champion> {
    return this.http.post<Champion>(this.championsUrl, champion).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  updateChampion(champion: Champion): Observable<any> {
    return this.http.put(this.championsUrl + champion.id, champion);
  }

  deleteChampion(id: number): Observable<any> {
    return this.http.delete(this.championsUrl + id);
  }
}