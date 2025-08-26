import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ArchivosBuzonResponse } from 'src/app/bean/archivos-buzon-response.component';
import { BusquedaBuzonRequest } from 'src/app/bean/busqueda-buzon-request.component';
import { FoldersBuzonResponse } from 'src/app/bean/folders-buzon-response.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConsultaBuzonService } from 'src/app/services/contingencia/consulta-buzon-service';

@Component({
  selector: 'app-consultar-buzon',
  templateUrl: './consultar-buzon.component.html',
  styleUrls: ['./consultar-buzon.component.css'],
})
export class ConsultarBuzonComponent implements OnInit, OnDestroy {
  /** variable de control para saber si se realizo el submit de la consulta a los buzones */
  submittedSearchBuzon = false;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /**
   * @description Formulario para la busqueda de buzones
   * @type {UntypedFormGroup}
   * @memberOf ConsultarBuzonComponent
   */
  formSearchBuzon: UntypedFormGroup = this.formBuilder.group({
    selectAplication: ['H2H'],
    rutaPrincipal: [''],
    rutaDetalle: [''],
    rutaAnterior: [''],
    rutaPadre: [''],
  });
  /**
   * Lista de folders de la consulta de buzon
   * @type {FoldersBuzonResponse[]}
   * @memberof ConsultarBuzonComponent
   */
  folders: FoldersBuzonResponse[] = [];
  /**
   * Lista de archivos de la consulta de buzon
   * @type {ArchivosBuzonResponse[]}
   * @memberof ConsultarBuzonComponent
   */
  archivos: ArchivosBuzonResponse[] = [];
  /**
   * Request de la consulta del buzon
   * @type {ArchivosBuzBusquedaBuzonRequestonResponse}
   * @memberof ConsultarBuzonComponent
   */
  busquedaBuzonReq: BusquedaBuzonRequest = new BusquedaBuzonRequest();
  /** Variable para identificar si se debe mostrar el boton Regresar*/
  banderaBtnRegresar: boolean = false;
  /** Variable para guardar el valor actual del folderPrincipal seleccionado de la busqueda del buzon*/
  rutaanterior: string = '';

  constructor(
    private globals: Globals,
    private formBuilder: UntypedFormBuilder,
    private service: ConsultaBuzonService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private fc: FuncionesComunesComponent,
    private router: Router,
    private comunService: ComunesService,
  ) {}

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 5) {
        this.formSearchBuzon = this.formBuilder.group({
          selectAplication: ['H2H'],
          rutaPrincipal: [''],
          rutaDetalle: [''],
          rutaAnterior: [''],
          rutaPadre: [''],
        });
        this.eventClean();
        this.banderaBtnRegresar = false;
      }
    });
  }
  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  /**
   * Metodo que se ejecutara al momento de dar
   * click en el boton de consultar
   */
  eventoConsultar() {
    let rutaDetalle = '';
    let rutaAnterior = '';
    let rutaPadre = this.rutaPrincipal;
    this.setValoresRutas(rutaDetalle, rutaAnterior, rutaPadre);
    this.consultaConfigBuzon();
  }

  /**
   * Metodo que se ejecutara al momento de dar
   * click en el boton de link del directorio
   */
  eventoConsultarHref(folder: FoldersBuzonResponse) {
    let rutaDetalle = folder.path + '/' + folder.folderPrincipal;
    let rutaAnterior = '';
    let rutaPadre = rutaDetalle;
    this.setValoresRutas(rutaDetalle, rutaAnterior, rutaPadre);
    this.consultaConfigBuzon();
  }

  /**
   * Metodo que se ejecutara al momento de dar
   * click en el boton de regresar
   */
  eventoRegresar() {
    let rutaDetalle = this.rutaDetalle;
    let rutaAnterior = '';
    if (this.folders.length > 0) {
      rutaAnterior = this.folders[0].path;
    } else {
      rutaAnterior = this.rutaDetalle;
    }
    let index = rutaAnterior.lastIndexOf('/');
    if (index == 0) {
      rutaAnterior = this.rutaPrincipal;
    } else {
      rutaAnterior = rutaAnterior.substring(0, rutaAnterior.lastIndexOf('/'));
    }
    let rutaPadre = rutaAnterior;
    this.setValoresRutas(rutaDetalle, rutaAnterior, rutaPadre);
    this.consultaConfigBuzon();
  }

  /**
   * Metodo que consulta la configuracion de rutas del buzon actual.
   */
  private async consultaConfigBuzon() {
    try {
      this.busquedaBuzonReq.aplicacion = this.selectAplication;
      this.busquedaBuzonReq.ruta = this.rutaPrincipal;
      this.busquedaBuzonReq.rutaDetalle = this.rutaDetalle;
      this.busquedaBuzonReq.rutaAnterior = this.rutaAnterior;
      await this.service
        .findConfigBuzon(this.busquedaBuzonReq)
        .then(async (resp: any) => {
          if (resp.error == 'OK00000') {
            if (this.rutaPadre != this.rutaPrincipal) {
              this.banderaBtnRegresar = true;
            } else {
              this.banderaBtnRegresar = false;
            }
            this.folders = this.getListFolders(resp.folders);
            this.archivos = this.getListArchivos(resp.archivos);
            this.banderaHasRows = true;
            this.globals.loaderSubscripcion.emit(false);
          } else {
            let mensaje: string = '';
            if (resp.message == 'No hay datos en el directorio') {
              mensaje = this.translate.instant('modals.consultarBuzon.error.consulta.nohay.datos');
            } else if (
              resp.message == 'No hay una ruta configurada para el buzón'
              ) {
                mensaje = this.translate.instant('modals.consultarBuzon.error.consulta.ruta.invalida');
              this.eventClean();
            } else {
              mensaje = this.translate.instant('modals.consultarBuzon.error.consulta');
              this.eventClean();
            }
            this.open(
              this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'),
              mensaje,
              'info',
              'ERNODAT01',
              ''
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        });
    } catch (e) {
      this.eventClean();
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'),
        this.translate.instant('modals.consultarBuzon.error.consulta'),
        'error',
        '',
        ''
      );
    }
  }

  /**
   * Metodo que obtiene la lista de folders de la consulta de buzon
   */
  getListFolders(folders: any): any {
    let listFolders: FoldersBuzonResponse[] = [];
    folders.forEach((item: any) => {
      let folder: FoldersBuzonResponse = {
        folderPrincipal: item['folderPrincipal'],
        path: item['path'],
      };
      listFolders.push(folder);
    });
    return listFolders;
  }

  /**
   * Metodo que obtiene la lista de archivos de la consulta de buzon
   */
  getListArchivos(archivos: any): any {
    let listArchivos: ArchivosBuzonResponse[] = [];
    archivos.forEach((item: any) => {
      let archivo: ArchivosBuzonResponse = {
        tamanio: item['tamanio'],
        permisos: item['permisos'],
        fecha: item['fecha'],
        nombre: item['nombre'],
        path: item['path'],
      };
      listArchivos.push(archivo);
    });
    return listArchivos;
  }

  /**
   * Metodo getter para la validacion de formulario
   * en la vista
   */
  get formControlSearchBuzon() {
    return this.formSearchBuzon.controls;
  }

  /**
   * Metodo que se ejecutara al realizar clcik
   * sobre el boton de clean
   */
  eventClean() {
    this.banderaHasRows = false;
    this.archivos = [];
    this.folders = [];
  }

  /**
   * Metodo que obtiene la aplicacion seleccionada
   */
  get selectAplication() {
    return this.formSearchBuzon.get('selectAplication')?.value;
  }

  /**
   * Metodo que obtiene la ruta principal de busqueda seleccionada
   */
  get rutaPrincipal() {
    return this.formSearchBuzon.get('rutaPrincipal')?.value;
  }

  /**
   * Metodo que obtiene la ruta detalle de busqueda seleccionada
   */
  get rutaDetalle() {
    return this.formSearchBuzon.get('rutaDetalle')?.value;
  }

  /**
   * Metodo que obtiene la ruta anterior de busqueda seleccionada
   */
  get rutaAnterior() {
    return this.formSearchBuzon.get('rutaAnterior')?.value;
  }
  /**
   * Metodo que obtiene la ruta padre de busqueda seleccionada
   */
  get rutaPadre() {
    return this.formSearchBuzon.get('rutaPadre')?.value;
  }

  /**
   * Metodo que define los valores de los inputs rutaDetalle y rutaAnterior
   */
  setValoresRutas(
    rutaDetalle: string,
    rutaAnterior: string,
    rutaPadre: string
  ) {
    this.formSearchBuzon.patchValue({
      rutaDetalle: rutaDetalle,
      rutaAnterior: rutaAnterior,
      rutaPadre: rutaPadre,
    });
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: String,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sug?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code, sug), hasBackdrop: true
    });
  }
}
