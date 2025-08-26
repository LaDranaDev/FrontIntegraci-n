import { Component, OnInit, AfterViewInit, OnChanges, DoCheck } from '@angular/core';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit, DoCheck{
  sinPermisos: any;

  constructor(
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
  ) { }
  ngOnInit(): void {
    this.sinPermisos = this.consultaTrackingArchivoService.getSaveLocalStorage('sinPermisos');
  }  

  ngOnChanges(){
    this.sinPermisos = this.consultaTrackingArchivoService.getSaveLocalStorage('sinPermisos');
  }

  ngDoCheck(){ 
    this.sinPermisos = this.consultaTrackingArchivoService.getSaveLocalStorage('sinPermisos');
  }

}
