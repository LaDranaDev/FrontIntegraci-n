import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComunesService } from 'src/app/services/comunes.service';
import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { GestionComprobantesService } from 'src/app/services/admin-contratos/gestion-comprobantes.service';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { IProductoResponse } from 'src/app/bean/iproducto.response.component';
import { GestionComprobantesRequest } from 'src/app/bean/gestion-comprobantes-request.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ProductoRequest } from 'src/app/bean/producto-request.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-comprobantes',
  templateUrl: './gestion-comprobantes.component.html',
  styleUrls: ['./gestion-comprobantes.component.css'],
})
export class GestionComprobantesComponent implements OnInit, OnDestroy {
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Bandera para determinar si se habilita el boton de guardar y exportar */
  banderaBtnGuardar: boolean = true;
  banderaBtnExportar: boolean = true;
  banderaBtnLimpiar: boolean = true;

  /**
   * @description Objeto que representa la lista de productos que se obtiene de la consulta de productos
   * @type {IProductoResponse[]}
   * @memberof GestionComprobantesComponent
   */
  listProductos: IProductoResponse[] = [];
  /**
   * @description Objeto para poder realizar la obtencion de
   * los datos del contrato
   * @type {DatosCuentaBeanComponent}
   * @memberOf GestionComprobantesComponent
   */
  /** Se inicializa el objeto que contendra los datos del contrato */
  datosContrato: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };
  /**
   * @description Número de contrato actual.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  numContratoSelect: String = '';
  /**
   * @description Nombre de usuario de la sesión actual.
   * Este usuario se tendria que sustituir por el de la sesion actual.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  usuarioActual: string | null = '';
  datos: any;

  /**
   * @description Objeto para guardar la configuración de los productos.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  objetoSaveRequest: GestionComprobantesRequest =
    new GestionComprobantesRequest();

  constructor(
    private globals: Globals,
    private service: GestionComprobantesService,
    private contratoService: ContratosService,
    public dialog: MatDialog,
    private serviceComun: ComunesService,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private router: Router
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
  }



  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();

    this.clickSuscliption = this.serviceComun.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 17) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.limpiar();
    this.datos = this.serviceComun.datosContrato;
    if (this.datos !== undefined) {
      this.datosContrato.numContrato = this.datos.numContrato;
      this.buscaConfiguracionContrato();
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  /**
   * Metodo para poder realizar la obtencion de la informacon
   * del contato del cliente
   */
  async consultaDatosContratoCliente() {
    try {
      if (this.datosContrato.bucCliente != '') {
        await this.contratoService
          .obtDatCta(this.datosContrato.bucCliente)
          .then(async (resp: any) => {
            if (resp.status == 'OK00000') {
              this.datosContrato.bucCliente = resp.result.bucCliente;
              this.datosContrato.cuentaEje = resp.result.cuentaEje;
              this.datosContrato.numContrato = resp.result.numContrato;
              this.datosContrato.razonSocial = resp.result.razonSocial;
              this.datosContrato.descEstatus = resp.result.descEstatus;
              this.datosContrato.idContrato = resp.result.idContrato;
              this.buscaConfiguracionContrato();
            } else {
              this.limpiar();
              this.open(
                this.translate.instant('modals.gestionComprobantes.info'),
                this.translate.instant('modals.gestionComprobantes.info.consulta.cliente.inexistente'),
                'error'
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          });
      }
    } catch (e) {
      this.open(
        this.translate.instant('modals.gestionComprobantes.error'),
        this.translate.instant('modals.gestionComprobantes.error.consulta.cliente'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo para consultar los datos del contrato.
   */
  private async buscaConfiguracionContrato() {
    try {
      await this.service
        .findConfiguracion(this.datosContrato.numContrato)
        .then(async (resp: any) => {
          if (resp.codError == 'OKC01') {
            this.listProductos = this.getLstProductos(resp.productos);
            if (this.listProductos.length == 0) {
              this.banderaHasRows = false;
              this.banderaBtnExportar = true;
              this.banderaBtnGuardar = true;
              this.banderaBtnLimpiar = true;
              this.open(
                this.translate.instant('gestion.comprobantes.msjERR03Titulo'),
                '',
                'error',
                this.translate.instant('gestion.comprobantes.msjERR03Codigo'),
              )
              if (this.datosContrato.descEstatus != 'ACTIVO') {
                this.disabledAllElements();
              }
            } else {
              this.banderaHasRows = true;
              this.banderaBtnExportar = false;
              this.banderaBtnGuardar = false;
              this.banderaBtnLimpiar = false;
              this.numContratoSelect = this.datosContrato.numContrato;
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.open(
        this.translate.instant('gestion.comprobantes.msjERR03Titulo'),
        '',
        'error',
        this.translate.instant('gestion.comprobantes.msjERR03Codigo'),
      )
      this.globals.loaderSubscripcion.emit(false);
    }
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
   * Metodo para poder obtener la lista de productos con formato
   * y poder pintarla en pantalla
   */
  getLstProductos(productos: any): any {
    let lstProductsRes: IProductoResponse[] = [];
    productos.forEach((producto: any) => {
      let product: IProductoResponse = {
        idContratoProducto: producto['idContratoProducto'],
        descProducto: producto['descProducto'],
        banderaComprobante: producto['banderaComprobante'],
        activa24x7: producto['activa24x7'],
        vis24x7: producto['vis24x7'],
      };
      lstProductsRes.push(product);
    });
    return lstProductsRes;
  }

  /**
   * Metodo para poder limpiar los datos del formulario
   * y dejarlo en estado inicial
   */
  cleanDatos() {
    this.limpiarEntregaBuzon();
    this.limpiaractiva24x7();
  }

  limpiarEntregaBuzon(){
    var lstInputs: any = document.querySelectorAll('input#entregaBuzonCliente');
    /** limpiar Entrega del buzon de cliente **/
    try{
      for (var i = 0; i < lstInputs.length; i++) {
        if(!lstInputs[i].disabled){
          lstInputs[i].checked = false;
          this.listProductos[i] ? this.listProductos[i].banderaComprobante = 'I' : null;
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  limpiaractiva24x7(){
    var activa24Inputs: any = document.querySelectorAll('input#activa24x7');
    /** limpiar Entrega del buzon de cliente **/
    try{
      for (var i = 0; i < activa24Inputs.length; i++) {
        if(!activa24Inputs[i].disabled){
          activa24Inputs[i].checked = false;
          this.listProductos[i] ? this.listProductos[i].activa24x7 = 'I' : null;
        }
    }
    }catch(e){
      console.log(e);
    }
  }

  /**
   * Metodo para poder guardar la configuracion de los productos
   */
  private async saveConfiguracion() {
    try {
      await this.service
        .saveConfiguracion(this.objetoSaveRequest)
        .then(async (resp: any) => {
          if (resp.error == 'OKG01') {
            this.open(
              this.translate.instant(
                'modals.gestionComprobantes.info.consulta.cliente.msjERR01Titulo'
              ),
              '',
              'info',
              this.translate.instant(
                'modals.gestionComprobantes.info.consulta.cliente.msjERR01Codigo'
              ),
              this.translate.instant(
                'modals.gestionComprobantes.info.consulta.cliente.msjERR01Sugerencia'
              )
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.open(
          this.translate.instant('gestion.comprobantes.msjERR02Titulo'),
          this.translate.instant('gestion.comprobantes.msjERR02Observacion'),
          'error',
          this.translate.instant('gestion.comprobantes.msjERR02Codigo'),
          ''        
      );
    }
  }

  /**
   * Metodo para poder guardar la configuracion de las productos
   */
  private guardaConfiguracion() {
    this.getRequestSaveConfiguracion(this.listProductos);
    this.saveConfiguracion();
  }

  /**
   * Metodo para crear el request de la operacion guardar configuración
   */
  getRequestSaveConfiguracion(productos: any) {
    let lstProductsReq: ProductoRequest[] = [];
    productos.forEach((producto: any) => {
      let productReq: ProductoRequest = new ProductoRequest();
      productReq.idContratoProducto = producto['idContratoProducto'];
      productReq.banderaComprobante = producto['banderaComprobante'];
      productReq.activa24x7 = producto['activa24x7'];
      lstProductsReq.push(productReq);
    });
    this.objetoSaveRequest.productos = lstProductsReq;
  }

  /**
   * Metodo para poder cambiar los valores del check EnviaBuzon en el lista de productos
   */
  onChangeEnviaBuzon(e: any, producto: any) {
    if (e.target.checked) {
      this.listProductos.forEach((product: any) => {
        if (product['idContratoProducto'] == producto['idContratoProducto']) {
          product['banderaComprobante'] = 'A';
        }
      });
    } else {
      this.listProductos.forEach((product: any) => {
        if (product['idContratoProducto'] == producto['idContratoProducto']) {
          product['banderaComprobante'] = 'I';
        }
      });
    }
  }

  /**
   * Metodo para poder cambiar los valores del check Activa24x7 en el lista de productos
   */
  onChangeActiva24x7(e: any, producto: any) {
    if (e.target.checked) {
      this.listProductos.forEach((product: any) => {
        if (product['idContratoProducto'] == producto['idContratoProducto']) {
          product['activa24x7'] = 'A';
        }
      });
    } else {
      this.listProductos.forEach((product: any) => {
        if (product['idContratoProducto'] == producto['idContratoProducto']) {
          product['activa24x7'] = 'I';
        }
      });
    }
  }

  /**Funcion que realiza el limpiado de los objetos */
  limpiar() {
    this.datosContrato = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    this.banderaHasRows = false;
    this.banderaBtnGuardar = true;
    this.banderaBtnExportar = true;
    this.banderaBtnExportar = true;
  }
  /**
   * Funcion que valida que solo se teclen numeros en los campos de la pantalla
   *
   * @param event Evento del teclado
   */
  soloNumeros(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Funcion que valida que solo se peguen numeros en los campso de la pantalla
   *
   * @param event Evento pegar
   */
  eventoPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModalExportacion() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.generateReporte(result);
      }
    });
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */
  generateReporte(tipoExportacion: string) {
    this.generarReporte(tipoExportacion)
  }

  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte excel o csv
   */
  private async generarReporte(tipo:string) {
    if(tipo == 'xlsx'){
      tipo = 'xls';
    }
    try {
      await this.service
        .exportarInformacionCatalogo(
          this.numContratoSelect,
          this.usuarioActual!,
          tipo
        )
        .then(async (result: any) => {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.open(
        this.translate.instant('modals.gestionComprobantes.error'),
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }
  /**
   * Funcion para abrir el modal de confirmacion
   */
  openModalConfGuardado() {
    let titulo = this.translate.instant('modals.gestionComprobantes.confirmacion');
    let contenido = this.translate.instant('modals.gestionComprobantes.confirmacion.guardado');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "confirm"), hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.guardaConfiguracion();
      }
    });
  }

  /** Funcion que deshabilita todos los elementos de la pantalla en caso de que el contrato no sea activo */
  disabledAllElements() {
    if (this.objetoSaveRequest.productos.length > 0) {
      var checkboxs: any = document.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < checkboxs.length; i++) {
        checkboxs[i].disable = true;
      }
    }
  }
}
