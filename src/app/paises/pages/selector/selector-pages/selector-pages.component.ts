import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PaisesService } from '../../../services/paises.service';
import { Paises } from '../../../interfaces/paises.interface';
import { map, switchMap, tap } from 'rxjs';
import { DetallePais } from '../../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  //Selectores
  regiones: string[] = [];
  paises: Paises[] = [];
  fronteras: Paises[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private paisesServices: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;
    this.cambioRegion();
  }

  cambioRegion(){
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.cargando = true;
          this.fronteras = [];
          this.miFormulario.get('pais')?.reset('');
        }),
        switchMap(region => this.paisesServices.getCountriesByRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cambioPais();
        this.cargando = false;
      })
  }

  cambioPais(){
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(code => {
          this.cargando = true;
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap(code => this.paisesServices.getCountryByCode(code)),
        map(pais => {
          var borders: string[] = [];
          pais?.forEach(element =>{
            borders = element?.borders
          })
          return borders;
        }),
        switchMap(borders => this.paisesServices.resolvePromiseForBorders(borders))
      )
      .subscribe(fronterasResult => {
        this.fronteras = fronterasResult;
        this.cargando = false;
      })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
