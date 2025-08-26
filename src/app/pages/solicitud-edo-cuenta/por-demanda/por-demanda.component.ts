import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import {DatosContratoRequest, EstadoCuentarequest} from 'src/app/bean/sol-edo-cuenta-demanda.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import {SolicitudEdoCuentaServiceService} from 'src/app/services/solicitud-edo-cuenta/solicitud-edo-cuenta.service.service';


@Component({
  selector: 'app-por-demanda',
  templateUrl: './por-demanda.component.html',
  styleUrls: ['./por-demanda.component.css']
})
export class PorDemandaComponent implements OnInit{
  idLayout: any;
constructor(private fc: FuncionesComunesComponent,public dialog: MatDialog, private translate: TranslateService,
  private comun: ComunesService,private globals: Globals, private solicitudEdoCuentaServiceService: SolicitudEdoCuentaServiceService) { 
  this.datosDemandaRequest = new DatosContratoRequest();
  this.estadoCuentarequest = new EstadoCuentarequest();
}

ST_CONTRATO_FOLIO       : String = "hdnContratoFolio";
FOLIO_ENC               : String = "folioEnc";
ACTIVA_CTA              :String = "ACTIVA_SOLEDOCTA";

hayDiferentesdivisas    : number;
incAnulaciones          : boolean = false;
dividirXDivisa          : boolean = false;
archivoOp               : string;
tipoFormato             : string;
selectEstadoCuenta      : string;
listaItems              : any[] = [];
listFormatArchivo       : any[] = [];
listFrecuencias         : any[] = [];
datosDemandaRequest     : DatosContratoRequest;
estadoCuentarequest     : EstadoCuentarequest;
numFrec                 : number;
banderaBtn              : boolean = false; 
vistaTipoRecpcion       : string;
checkRad                : boolean = false;
codigoMsj               : String;    
porDemanda              : string;

/**
	 * Constantes definidas por el usuario que no estan sus valores en tabla de
	 * base datos
	 */
tipoRecepcion           : any[] = ["C", "P"];
/** constante para valor intradia **/
INTRADIA                : number = 2;
/** constante para valor intradia **/
CONSOLIDADO             : number = 3;

clickSuscliption: Subscription | undefined;
lstEstatusContrato: any[] = [];
  /** Id del estatus default del contrato */
  idEstatusDef: any;
  /** Id del estatus default del contrato */
  idEstatusContratoDef: any;

ngOnInit(): void {

  this.clickSuscliption = this.comun.clickAtion.subscribe(async (resp: any) => {
    const { codeMenu } = resp;
    if (codeMenu === 1) {
      this.limpiar();
      this.getEstatusContrato();
    }
  });
}

async buscarBuc(){
   if(this.validarCampoCliente() == true){
    try {

      await this.solicitudEdoCuentaServiceService.findContratoByBuc(this.datosDemandaRequest.codigoCliente).then(
        async (resp: any) => {  
        if(resp.codError == "OK00000"){
          this.datosDemandaRequest.numContrato      = resp.numContrato;
          this.datosDemandaRequest.razonSocial      = resp.razonSocial;
          this.datosDemandaRequest.cuentaEje        = resp.cuentaEje;
          this.datosDemandaRequest.idContrato       = resp.idContrato;
          this.datosDemandaRequest.statusContrato   = resp.idEstatus;
          this.idEstatusContratoDef                 = resp.idEstatus;
          this.banderaBtn = true;
          let idContrato: number  = + this.datosDemandaRequest.idContrato;
          this.getCuentasOrdenantes(idContrato);
          this.getFormatosArchivo();
          this.getDatosFrecuencias(idContrato);
          this.getConfEstadoCuenta(idContrato);
          this.getIndicador(idContrato);
          this.globals.loaderSubscripcion.emit(false);
        }else {          
          this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('contingencia.msjERR007Titulo'),
                this.translate.instant('contingencia.msjERR007Sugerencia'),
                'info',
                this.translate.instant('admonContratos.msjCONT0011Codigo'),
                this.translate.instant('contingencia.msjERR007Observacion')
            ),
        });
          this.globals.loaderSubscripcion.emit(false);
          this.limpiar();
        }
      }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
            this.globals.loaderSubscripcion.emit(false);
        });
  
    } catch (error) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Sugerencia')
        ),
    });
      this.globals.loaderSubscripcion.emit(false);
    }
  }
}

async getCuentasOrdenantes(idContrato : number){
  await this.solicitudEdoCuentaServiceService.getCuentasOrdenantes(idContrato,this.numFrec).then ( async (resp: any) => { 
    if(resp.status === "200"){
      this.listaItems = resp.result;
      this.hayDiferentesdivisas = resp.result.length;
    }
  });
}

async getEstatusContrato() {
  try {
    await this.comun.getEstatusContrato().then(async (resp: any) => {
      if (resp.codigo == 'OK00000') {
        this.lstEstatusContrato = resp.lstEstatusContrato;
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  } catch (e) {
    this.open(
      this.translate.instant('modals.altacontratos.error'),
      this.translate.instant('modals.altacontratos.error.estatus.contrato'),
      'error'
    );
    this.globals.loaderSubscripcion.emit(false);
  }
}

async getFormatosArchivo(){
  await this.solicitudEdoCuentaServiceService.getFormatosArchivo().then( async (resp: any) => { 
    if(resp.status === "200"){
      this.listFormatArchivo = resp.result;
    }
  }).catch(() => {
    this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Sugerencia')
        ),
    });
    this.globals.loaderSubscripcion.emit(false);
});
}

async getDatosFrecuencias(idContrato : number){
  await this.solicitudEdoCuentaServiceService.getDatosFrecuencias(idContrato,this.numFrec).then( async (resp: any) => { 
    if(resp.status === "200"){
      this.listFrecuencias = resp.result;
      this.porDemanda = this.listFrecuencias.find((t: { description: any; }) => t.description == "POR DEMANDA").description;
    }else{
      this.limpiar();
      this.mostrarialog('solicitudEstadosCuenta.msjERR00S3Titulo','solicitudEstadosCuenta.msjERR00S3Sugerencia','info',
          'solicitudEstadosCuenta.msjERR00S3Codigo','solicitudEstadosCuenta.msjERR00S3Observacion');
    }
  });
}

ngOnDestroy() {
  this.clickSuscliption?.unsubscribe();
}

getConfEstadoCuenta(idContrato : number){
  this.codigoMsj="";
  this.dividirXDivisa = false;
  this.solicitudEdoCuentaServiceService.getConfEstadoCuenta(idContrato,this.numFrec).then( (resp: any) => { 
    this.tipoFormato = resp.tipoFormato.idCatalogo;
    this.idLayout = resp.recibirArchivoPorConsolidadoOCuenta.idCatalogo
    if( ( resp.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo === this.tipoRecepcion[0])  || ( resp.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo === 'D')){
      this.archivoOp = 'C';
      if(resp.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo === 'D'){
        this.dividirXDivisa = true;
      }
    }
    if(  resp.recibirArchivoPorConsolidadoOCuenta.descripcionCatalogo === this.tipoRecepcion[1]){
      this.archivoOp = 'P';
    }

    if(this.archivoOp == '' ||  resp.recibirArchivoPorConsolidadoOCuenta==""){
      this.codigoMsj="ERR00S7";
    }

    this.globals.loaderSubscripcion.emit(false);

    if(resp.banderaProdEdoCtaActivo !== "" && resp.banderaProdEdoCtaActivo === "N"){
      this.codigoMsj="INF00014";
      this.controladorMensajes();
		}
		if(resp.banderaProductoEdoCuenta !== '' && resp.banderaProductoEdoCuenta === "N"){
      this.codigoMsj="INF00013";
      this.controladorMensajes();
      this.limpiar();
      return false;
		}
    return true;
  });
}

async getIndicador( idContrato : number){
  await this.solicitudEdoCuentaServiceService.getIndicador(this.datosDemandaRequest.numContrato,idContrato,this.numFrec).then( async (resp: any) => {
    if(resp.indicador !== '' && resp.indicador === 'A'){
      this.incAnulaciones = true;
    }else{
      this.incAnulaciones = false;
    }
  });
}

generarEstado(){
  if(this.porDemanda){
    /** se genera estado **/
    try{
      if(this.controladorMensajes()==true){
        this.estadoCuentarequest.idContrato = this.datosDemandaRequest.idContrato;
        this.estadoCuentarequest.idFrecuencia ="2";
        this.estadoCuentarequest.numContrato=this.datosDemandaRequest.numContrato;
        this.estadoCuentarequest.cuentas = this.listaItems;
        this.estadoCuentarequest.idLayout =  this.idLayout;
        this.solicitudEdoCuentaServiceService.generarEstadoCuenta(this.estadoCuentarequest).then((resp: any) => {
          console.log("ERROR:" + resp.message);
          this.globals.loaderSubscripcion.emit(false);
          if(resp.message === "CEC00C1"){
            this.mostrarialog('solicitudEstadosCuenta.msjERR00S3Titulo','solicitudEstadosCuenta.msjERR00S3Sugerencia','info',
            'solicitudEstadosCuenta.msjERR00S3Codigo','solicitudEstadosCuenta.msjERR00S3Observacion');
          }
          if(resp.codigo === "CEC00I1"){
            this.mostrarialog('solicitudEstadosCuenta.msjINFO00S1Titulo','solicitudEstadosCuenta.msjINFO00S1Sugerencia','info',
            'solicitudEstadosCuenta.msjINFO00S1Codigo','solicitudEstadosCuenta.msjINFO00S1Observacion');
          }
          if(resp.message==="ERR00S3"){
            this.mostrarialog('solicitudEstadosCuenta.msjERR00S3Titulo','solicitudEstadosCuenta.msjERR00S3Sugerencia','info',
            'solicitudEstadosCuenta.msjERR00S3Codigo','solicitudEstadosCuenta.msjERR00S3Observacion');
          }
          if(resp.message==="ERR00S4"){
            this.mostrarialog('solicitudEstadosCuenta.msjERROOS4Titulo','solicitudEstadosCuenta.msjERROOS4Sugerencia','info',
              'solicitudEstadosCuenta.msjERROOS4Codigo','solicitudEstadosCuenta.msjERROOS4Observacion');
          }
          if(resp.code === "ERR00S5"){
            this.showMsjNoEnvioEstoCuenta();
          }
        });    
      this.limpiar();
      }
    }catch(e){
      this.showMsjNoEnvioEstoCuenta();
      this.globals.loaderSubscripcion.emit(false);
    }
  }else{
    this.open(
      this.translate.instant('solicitudEstadosCuenta.msjERR00S3Titulo'),//titulo
      this.translate.instant('solicitudEstadosCuenta.msjERR00S3Observacion'), //descrip
      'alert',
      'ERR00S3',//code
      '' //sugrencia
    );
  }
}

showMsjNoEnvioEstoCuenta(){
  this.mostrarialog('solicitudEstadosCuenta.msjERR00S5Titulo','solicitudEstadosCuenta.msjERR00S5Sugerencia','error',
        'solicitudEstadosCuenta.msjERR00S5Codigo','solicitudEstadosCuenta.msjERR00S5Observacion');
}

validarCampoCliente(){
  if(this.datosDemandaRequest.codigoCliente.length!==8){
    this.mostrarialog('planCalidad.msjINF004Titulo','planCalidad.msjINF004Sugerencia','error',
    'planCalidad.msjINF004Codigo','planCalidad.msjINF004Observacion');
    this.limpiar();
    return false;
  }
  if(this.datosDemandaRequest.codigoCliente===""){
    this.mostrarialog('planCalidad.msjINF003Titulo','planCalidad.msjINF003Sugerencia','error',
        'planCalidad.msjINF003Codigo','planCalidad.msjINF003Observacion');
    this.limpiar();
    return false;
  }
  return true;
}

controladorMensajes(){
  switch (this.codigoMsj) {
    case "INF00014":
      this.mostrarialog('configuracionEstadosCuenta.msjINF00014Titulo','configuracionEstadosCuenta.msjINF00014Sugerencia','info',
      'configuracionEstadosCuenta.msjINF00014Codigo','configuracionEstadosCuenta.msjINF00014Observacion');
      return false;
    case "INF00013":
      this.mostrarialog('configuracionEstadosCuenta.msjINF00013Titulo','configuracionEstadosCuenta.msjINF00013Observacion','alert',
        'configuracionEstadosCuenta.msjINF00013Codigo','configuracionEstadosCuenta.msjINF00013Sugerencia');
        return false;
    case "ERR00S7":
       this.mostrarialog('solicitudEstadosCuenta.msjERR00S7Titulo','solicitudEstadosCuenta.msjERR00S7Sugerencia	','info',
         'solicitudEstadosCuenta.msjERR00S7Codigo','solicitudEstadosCuenta.msjERR00S7Observacion');
        return false;
    default:
      return true;
  }
}

limpiar(){
  this.checkRad                            = false;
  this.hayDiferentesdivisas                = 0;
  this.INTRADIA                            = 2;
  this.CONSOLIDADO                         = 3;
  this.tipoFormato                         = "";
  this.vistaTipoRecpcion                   = "";
  this.listaItems                          = [];
  this.listFormatArchivo                   = [];
  this.listFrecuencias                     = [];
  this.archivoOp                           = "P";
  this.incAnulaciones                      = false;
  this.dividirXDivisa                      = false;
  this.selectEstadoCuenta                  = "0";
  this.estadoCuentarequest                 = new EstadoCuentarequest();
  this.datosDemandaRequest.codigoCliente   = "";
  this.datosDemandaRequest.cuentaEje       = ""; 
  this.datosDemandaRequest.numContrato     = "";
  this.datosDemandaRequest.razonSocial     = "";
  this.datosDemandaRequest.statusContrato  = "IN";
  this.banderaBtn                          = false;
  this.numFrec                             = 2;
  this.codigoMsj                           = "";
  this.idEstatusContratoDef                = "";
}

mostrarialog(titulo:string, sugerencia :string, tipo : string, codigo:string, observacion:string){
  this.open(
    this.translate.instant(titulo),
    this.translate.instant(sugerencia),
    tipo,
    this.translate.instant(codigo),
    this.translate.instant(observacion)
  );
}

/**
* @description evento que se ejecutara para solo permitir valores
* numericos
*/
eventOnKeyOnlyNumbers(event: any) {
  this.fc.validateKeyCode(event);
}

/**
  * @description evento para poder levantar el modal para mostrar los mensajes de sucess o error
  * @param titulo indica si se ejecutara para error o success
  * @param contenido mensaje que se mostrara en el modal
  */
open(titulo: String, contenido: String, type?:any, errorCode?:string, sugerencia?:string) {
  const dialogo = this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia)
  }
  );
}

}
