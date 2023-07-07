import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { Paises } from '../interfaces/paises.interface';
import { DetallePais } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _base_url: string = 'https://restcountries.com/v3.1/';
  private _regions: string[] = ['Europe', 'Americas', 'Africa', 'Oceania', 'Asia'];

  get regiones(){
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<Paises[]>{
    const url = `${this._base_url}region/${region}?fields=cca3,name`;
    return this.http.get<Paises[]>(url);
  }

  getCountryByCode(code: string): Observable<DetallePais[] | null>{
    if (!code) {
      return of(null);
    }
    const url = `${this._base_url}alpha/${code}`;
    return this.http.get<DetallePais[]>(url);
  }

  getCountriesNameBorders(code: string): Observable<Paises>{
    const url = `${this._base_url}alpha/${code}/?fields=cca3,name`;
    return this.http.get<Paises>(url);
  }

  resolvePromiseForBorders(codes: string[]): Observable<Paises[]>{
    if (!codes) {
      return of([]);
    }
    
    const promisesBorders: Observable<Paises>[] = [];
    codes.forEach(code =>{
      const promise = this.getCountriesNameBorders(code);
      promisesBorders.push(promise);
    });

    return combineLatest(promisesBorders);
  }
}
