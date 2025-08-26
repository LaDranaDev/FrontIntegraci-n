import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentasGoService } from 'src/app/services/cuentaGo/cuentas-go.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';


@Component({
  selector: 'app-consulta-tarjetas',
  templateUrl: './consulta-tarjetas.component.html',
  styleUrls: ['./consulta-tarjetas.component.css']
})
export class ConsultaTarjetasComponent implements OnInit {
  /** Variable para Datos personales */
  datPersona: any = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
    idEstatus: '',
  };

  datRemesa: any = {
    tipRemesa: '',
    onlyRemesa: '',
    remesa: '',
    fEnvio: '',
    fRecepcion: '',
    fCancelada: '',
    centerId: ''
  }

  usuarioActual: string | null = '';
  consulta: boolean = false;
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page3: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  objPageable: IPaginationRequest;
  /** Variable para indicar en que pagina se encuentra */
  pageR: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPaginaR: number = 10;
  datWsTabla: any;
  banderaBtnExportar = false;
  returnedArray: any;
  // Valores que ocurren cuando se selecciona un check
  selKeyRemesa: any;
  selKeyNumCta: any;

  constructor(
    private router: Router,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private serviceGo: CuentasGoService,

  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.pageR,
      size: this.rowsPorPaginaR,
      ruta: ''
    }
  }

  ngOnInit(): void {
    this.consulta = true;
    this.banderaHasRows = true;
    var datSesionRemesa = JSON.parse(localStorage.getItem('datSesionRemesa') || "");
    var datContrato = localStorage.getItem('numContrato');
    this.datRemesa.onlyRemesa = datSesionRemesa.numRemesa;
    this.datRemesa.remesa = datContrato + datSesionRemesa.numRemesa;
    this.datRemesa.tipRemesa = datSesionRemesa.estadoRemesa;
    this.datRemesa.fEnvio = datSesionRemesa.fechaAltaRem;
    this.datRemesa.fRecepcion = datSesionRemesa.fechaRecepRem;
    this.datRemesa.fCancelada = datSesionRemesa.fechaBajaRem;
    this.datRemesa.centerId = datSesionRemesa.centroDistribucion;
    this.consul();
  }


  regresar() {
    this.router.navigate(['/administracionStockSuperCuentaGo/adminStockSuperCuentaGo']);
  }

  /**
   * Metodo para exportar los datos a XLSX, PDF, CSV
   */
  async exportar() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.initExportar(result);
      }
    });
  }
  async initExportar(tipoExportar : any) {
    const datosEnviar = {
      numRemesa: this.datRemesa.remesa,
      estatusTarjeta: this.datRemesa.tipRemesa,
      usuario: this.usuarioActual,
      formato: tipoExportar
    }
    this.serviceGo.exportarDetalleRemesa(datosEnviar).then((result: any) => {
      // Obtenemos los datos
      if (result.response.data) {
        /** Se manda la informacion para realizar la descarga del archivo */
        this.fc.convertBase64ToDownloadFileInExport(result.response);
        this.globals.loaderSubscripcion.emit(false);
        
      } else {
        if (result.code === '404') {
          this.openModalError('Error', result.message, 'error');
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.openModalError(
            'Error',
            this.translate.instant('modals.error.pdf'),
            'error'
          );
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    });
  }

  /**
  * Evento para el momento de seleccionar
  * una opcion del input type radio
  */
  onEventClickRadioButton(value: any, value2: any) {
    this.selKeyRemesa = value;
    this.selKeyNumCta = value2;
  }


  validarCheck() {
    var continua = true;
    if( this.selKeyRemesa ==='' || this.selKeyRemesa === undefined) {
      continua = false;
      this.openModalError(
        '', this.translate.instant('adminStock.mensaje.seleccionar'),
        'error'
      );
    }
    return continua;
  }

  async cancelar() {
    if(!this.validarCheck() ) {
      return;
    }
    const dialogo = this.dialog.open(
      ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('adminSuperGo.cancelar.tarjeta'), 
          this.translate.instant('adminSuperGo.cancelar.tarjeta.pregunta'),
          "yesNo"
        ), hasBackdrop: true
      }
    );
    dialogo.afterClosed().subscribe((result: string) => {
      if (result === 'si') {
        this.callCancelRemesa();
      }
    });
  }


  async callCancelRemesa() {
    const datosEnviar = this.getDatosEnviar();
    var mensaje = 'administracionStockSuperCuentaGo.mensaje.cancelar.tarjetaKO';
    var codError = 'Error';
    var tpError = 'error';
    try {
      await this.serviceGo.cancelTarjeta(datosEnviar).then((data)=>{
        if (data !== null) {
          if( data.responseCode === 'OK00000') {
            mensaje = 'administracionStockSuperCuentaGo.mensaje.cancelar.tarjetaOK';
            codError = 'Info';
            tpError = 'info';
          } else {
            // Si el mensaje de error es por cambio de Estatus
            if( data.responseCode === 'LME0002' && data.description !== undefined) {
              mensaje = data.description;
            }
            codError = 'Error';
            tpError = 'error';
          }
          this.openModalError(
            codError, this.translate.instant( mensaje ), tpError
          );
        }
      });
      
    } catch (error) {
      console.log("Ocurrio un error en la consulta de datos....");
    }
    this.globals.loaderSubscripcion.emit(false);
    
  }


  getDatosEnviar() {
    return {
      "numRemesa": this.datRemesa.remesa,
      "numTarjeta": this.selKeyRemesa,
      "centroDistribucion": this.selKeyNumCta
    }
  }

  onPageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.datWsTabla = this.returnedArray.slice(startItem, endItem);
  }

  async consul() {
    // Limpiamos los datos antes de hacer la consulta
    this.datWsTabla = [];
    this.banderaHasRows = false;
    let error = true;
    const datosEnviar = {
      "numeroRemesa": this.datRemesa.remesa,
      "estatusTarjeta": this.datRemesa.tipRemesa,
      "ctroDistribuicion": this.datRemesa.centerId
    }
    try {
      const response = await this.serviceGo.getDetalleRemesa(datosEnviar);
      if (response) {
        if(response.response === null) {
          this.openModalError(
            this.translate.instant('adminSuperGo.consulta.vacio.title'), 
            this.translate.instant('adminSuperGo.consulta.vacio'), 
            'info', 'WND001', '');
        } else {
          error = false;
          this.resultRequest(response);
        }
      }
    } catch (error) {
      this.openModalError(
        this.translate.instant('adminStock.mensaje.filtro.consulta.error'),
         '', 'warn', 'WND001', '' );
    }
    if( error ) {
      this.closeReturn();      
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  closeReturn() {
    // Colocamos un temporizados para retornar a la pagina anterior
    setTimeout(() => {
      this.regresar();
    }, 1000 );
  }

  resultRequest(result: any) {
    this.returnedArray = result.response;
    // Obtenemos el numero total de elementos
    this.totalElements = this.returnedArray.length;
    this.datWsTabla = this.returnedArray.slice(0, this.rowsPorPaginaR);
    // Esto va en la consulta
    this.consulta = true
    this.banderaHasRows = true;
  }


  /**
  * Abrir el modal de error 
  */
  openModalError(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    }
    );
  }
}
