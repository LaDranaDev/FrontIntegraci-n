import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from '../../services/comunes.service';

@Component({
  selector: 'app-operativa-header',
  templateUrl: './operativa-header.component.html',
  styleUrls: ['./operativa-header.component.css'],
})
export class OperativaHeaderComponent implements OnInit {
    /* Titulo de la  pantalla recibido como atributo */
    @Input() tituloPantalla: string | undefined;
    @Input() center: boolean | undefined;
    @Input() subtitle: string | undefined;
    /* Atributo para incluir la hora en la pantalla */
    horaHeader : string | undefined ;
    /* Atibuto para incluir la fecha en la pantalla */
    diaHeader : string | undefined ;
    showBandSPEI: boolean=false;
    showAlertas: boolean=false;

  constructor(public translate: TranslateService,private service: ComunesService) { }

  ngOnInit(): void {
    let date = new Date();
    let anio = date.getFullYear();
    let dia = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let month = date.getMonth();
    let hours = date.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let minutes = date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    this.horaHeader = (`${hours}:${minutes}`).toString() ; 
    this.diaHeader = (`${dia}/${(month+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}/${anio}`).toString();
    this.showAlertas= this.service.getSaveLocalStorage('showAlertas'); 
    this.showBandSPEI= this.service.getSaveLocalStorage('bandSPEI');
  }

}
