import { ComprobanteFormatoCDMXService } from 'src/app/services/monitoreo/comprobantes-formato-cdmx.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-comprobantes-formato-cdmx',
  templateUrl: './comprobantes-formato-cdmx.component.html',
  styleUrls: ['./comprobantes-formato-cdmx.component.css']
})
export class ComprobantesFormatoCdmxComponent implements OnInit, OnDestroy {
/** Lista de valores del tipo pago */
listaTipoPagoCmb: any;
/** Lista de valores del estatus*/
listaEstatusCmb: any;

/**
 * @description Formulario para la busqueda de comprobantes
 * @type {FormGroup}
 * @memberOf ComprobantesFormatoCdmxComponent
*/
comprobanteFormatoForm!: UntypedFormGroup;

/**
* @description fecha inicial
* @type {string}
* @memberOf ComprobantesFormatoCdmxComponent
*/
fechaInicial: Date = new Date();

/**
* @description fecha final
* @type {string}
* @memberOf ComprobantesFormatoCdmxComponent
*/
fechaFinal:  Date = new Date();
  clickSuscliption: Subscription | undefined;

constructor(
  private formBuilder: UntypedFormBuilder,
  public dialog: MatDialog,
  public gestionComprobantesService: ComprobanteFormatoCDMXService,
  private cd: ChangeDetectorRef,
  private globals: Globals,
  private fc: FuncionesComunesComponent,
  private router: Router,
  public datePipe: DatePipe,
  private translate: TranslateService,
  private comunService: ComunesService,

) {
  this.comprobanteFormatoForm = this.initializeForm();
}

 /**
  * Metodo para poder inicializar el formulario
  */
  private initializeForm() {
  return this.formBuilder.group({
    buc: [''],
    contrato: [''],
    cuentaCargo: [''],
    lineaCaptura: [''],
    nombreArchivo: [''],
    idEstatus: [''],
    tipOperacion:[''],
    tipo:[''],
    fechaInicial: [new Date()],
    fechaFinal: [new Date()],
    idReg: [''],
  })
}

ngOnInit(): void {
  this.gestionComprobantesService.removeSaveLocalStorage('comprobante');
  this.gestionComprobantesService.removeSaveLocalStorage('detalleOperacion');
  this.gestionComprobantesService.removeSaveLocalStorage('operacion');
  //Obtiene los valores de base para llenar al lista de los select
  this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
    const { codeMenu } = resp;
    if (codeMenu === 4) {
      this.eventClean();
      this.tipoPago();
      this.estatus();    }
  });
}

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }


//Obtiene los valores del select para el tipo de pago
tipoPago(){
  this.gestionComprobantesService.getListaSelect().then((result:any)=>{
    this.listaTipoPagoCmb = result.parametros.listaTipoPagoCmb
    this.globals.loaderSubscripcion.emit(false);
  })
}

//Obtiene los valores del select para el tipo de pago
estatus(){
  this.gestionComprobantesService.getListaSelect().then((result:any)=>{
    this.listaEstatusCmb = result.parametros.listaEstatusCmb
    this.globals.loaderSubscripcion.emit(false);
  })
}


/**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
eventClean() {
  /** Se reinicia el formulario de busqueda */
  this.comprobanteFormatoForm = this.initializeForm();
}

/**
 * @description evento para poder levantar el modal para
 * mostrar los mensajes de sucess o error
 * @param titulo indica si se ejecutara para error o success
 * @param contenido mensaje que se mostrara en el modal
*/

open(
  titulo: string,
  obser: string,
  type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
  errorCode?: string,
  sugerencia?: string
) {
  this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(
      titulo,
      obser,
      type,
      errorCode,
      sugerencia
    ), hasBackdrop: true
  });
}

/**
* @description evento que se ejecutara para solo permitir valores------------------------------------------------------------------------------------
* numericos
*/
eventOnKeyOnlyNumbers(event: any) {
  this.fc.validateKeyCode(event);
}

/**
* @param event Evento Disable
* @returns la respuesta del evento
*/
disableEvent(event:any) {
  event.preventDefault();
  return false;
}

/**
* Evento para al momento de realizar el pegado
* en cualquier input este evento no ocurra
*/
eventoOnPasteBlock(event: ClipboardEvent) {
  return false;
}

/**
* @description Metodo para poder crear la fecha maxima
*/
getMinDate() {
  let fecha = this.datePipe.transform(Date.now(), 'DD/MM/YYYY') || '';
  /** Se obtiene el arreglo de las partes de la fecha */
  let partsDate = fecha.split('/');
  /** Se crea la variable de fecha y se crea la fecha maxima */
  const date = new Date();
  date.setDate(Number(partsDate[0]));
  date.setMonth((Number(partsDate[1]) - 1) + 6);
  date.setFullYear(Number(partsDate[2]) - 1);
  /** Se regresa la fecha maxima con formato de fecha */
  return date;
}

/**
* Atributo que contiene la configuracion del calendario
* @type {Partial<BsDatepickerConfig>}
* @memberof ArchivosConsultaComponent
*/
datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
  dateInputFormat: 'DD/MM/YYYY',
  containerClass: 'theme-red',
  showWeekNumbers: false,
  adaptivePosition: true
});;

/**
 * Funcion para que la fecha no sea mayor a la actual
 */
fechaNoMayorA90Dias(){
  var dateIni = this.comprobanteFormatoForm.get('fechaInicio')?.value;
  var fechaSeleccionadaIni = formatDate(dateIni, 'DD/MM/YYYY', 'es-MX');
  var numDias = '90';
  if(fechaSeleccionadaIni > numDias){
    this.open('Error',
    this.translate.instant('ErrFec'),
    'error', 'VALFEC00');
  }else{
    //Aquí va la página
  }
}

/**
* Metodo para poder realizar la modificacion
* del banco
*/
async consultaFormato() {
  try {
    if (!this.validar()) {
      return;
    }
    let comprobanteData = this.comprobanteFormatoForm.value;
    comprobanteData.fechaInicial = formatDate(comprobanteData.fechaInicial, 'dd/MM/yyyy', 'en-MX');
    comprobanteData.fechaFinal = formatDate(comprobanteData.fechaFinal, 'dd/MM/yyyy', 'en-MX');
    comprobanteData.tipo = comprobanteData.tipo.trim();

    await this.gestionComprobantesService.getBusquedaComprobantes(comprobanteData).then(async (result: any) => {
      if (result.code) {
        
        this.globals.loaderSubscripcion.emit(false);
        this.open('Error', result.message,'error', result.code);
        this.eventClean();
      } else if (result.listaOperaciones != null) {
        /** Se registra el protocolo a editar en el localstorage */
        this.gestionComprobantesService.setSaveLocalStorage('comprobante', comprobanteData);
        /** Se hace el redirect a la vista de alta */
        this.router.navigate(['/monitoreo/consultaOperacionFormatoCDMX']);
      } else {
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
          this.translate.instant('consulta.vacia'),
          'info');
        this.eventClean();
      }
      });
  } catch (e) {
    this.globals.loaderSubscripcion.emit(false);
    this.open(this.translate.instant('modal.mscompCdmxTitulo'),this.translate.instant('modal.mscompCdmxObservacion'),'error',this.translate.instant('modal.mscompCdmxCodigo'),this.translate.instant('modal.mscompCdmxSugerencia'));
  }
}

/**
 * @description Evento para solo permitir valores del alphabeto,numeros,
 * punto, espacio y /
 * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
 * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
 * (keycode >= 48 && keycode <= 57) => numeros
 * (keycode) == 46 => point
 * (keycode) == 32 => espacio
 * (keycode) == 44 => coma
 * (keycode == 47) => /
 */
onlyAlphabeticAndNumbersAndSomeCaracEsp(event:KeyboardEvent){
  var charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
      || charCode == 46 || charCode == 32 || charCode == 44 || (charCode == 47)){
      return true;
  }else{
      event.preventDefault();
      return false;
  }
}

validar() {
  const comprobanteData =  this.comprobanteFormatoForm.value;

  const fechaIncial = comprobanteData.fechaInicial;
  const fechaFinal = comprobanteData.fechaFinal;

  if (fechaIncial > fechaFinal) {
    this.open(this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
    this.translate.instant('pantalla.graficaBuzon.validacion.fechas.Observacion'),
    'alert');
    return false;
  }

  return true;
}

}
