import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IConsultaParametros } from 'src/app/bean/iconsulta-parametros.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';

import { parametrosService } from 'src/app/services/contingencia/parametros.service';
import { IPaginationRequest } from '../request/pagination-request.component';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css'],
})
export class ParametrosComponent implements OnInit, OnDestroy {
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 20;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para identificar si se muestra la sección de actualizacion en pantalla*/
  banderaShowPanelActualizacion: boolean = true;
  /** Variable para indicar posicion baja **/
  low = 0;
  /** Variable para indicar posicion media **/
  medium = 45;
  /** Variable para indicar posicion alta **/
  heigth = 90;

  /**
   * Atributo que representa la lista de parametros
   * @type {IConsultaParametro[]}
   * @memberof ParametrosComponent
   */
  listParametros: IConsultaParametros[] = [];

  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;

  constructor(
    private router: Router,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    public parametrosService: parametrosService,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: 0,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }


  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    //this.initForm();
    const altaGuardo = this.parametrosService.getSaveLocalStorage('guardoAltaParametro');
    const updateGuardo = this.parametrosService.getSaveLocalStorage('guardoUpdateParametro');
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 6) {
        this.initForm();
      }
    });

    if (altaGuardo === true) {
      this.open(
        this.translate.instant('parametros.editarINF0001.titulo'),
        this.translate.instant('parametros.editarINF0001.observacion'),
        'info',
        this.translate.instant('parametros.editarINF0001.codigo'),
        this.translate.instant('parametros.editarINF0001.sugerencia'),
      );

      this.parametrosService.setSaveLocalStorage('guardoAltaParametro', false);
    }
    if (updateGuardo === true) {
      this.open(
        this.translate.instant('parametros.edita.msgINFO0002titulo'),
        this.translate.instant('parametros.edita.msgINFO0002observacion'),
        'info',
        this.translate.instant('parametros.edita.msgINFO0002codigo'),
        this.translate.instant('parametros.edita.msgINFO0002sugerencia'),
      );
      this.parametrosService.setSaveLocalStorage('guardoUpdateParametro', false);
    }
  }

  initForm() {
    if (this.comunService.clickMenu) {
      this.banderaShowPanelActualizacion = true;
      this.banderaHasRows = false;
    } else {
      if (this.parametrosService.isShowParametros() === true) {
        this.getConsultaListParametros(this.objPageable);
      } else {
        this.totalElements = 0;
        this.listParametros = [];
        if (this.totalElements > 0) {
          this.banderaHasRows = true;
        } else {
          this.banderaHasRows = false;
        }
      }
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    (this.objPageable.page = numPage), (this.objPageable.size = totalItemsPage);
    return this.objPageable;
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */
  private async getConsultaListParametros(objPaginacion: IPaginationRequest) {
    this.comunService.clickMenu = false;
    try {
      await this.parametrosService
        .getistParametros(objPaginacion)
        .then(async (result: any) => {
          if (result.content != null) {
            this.banderaShowPanelActualizacion = false;
            this.processResultRequest(result);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('parametrosBD.PBD0000.titulo'),
              this.translate.instant('parametrosBD.PBD0003.observacion'),
              'error',
              this.translate.instant('parametrosBD.PBD0003.codigo')
            );
          }
        });
    } catch (e) {
      this.listParametros = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('parametrosBD.PBD0000.titulo'),
        this.translate.instant('parametrosBD.PBD0003.observacion'),
        'error',
        this.translate.instant('parametrosBD.PBD0003.codigo')
      );
    }
  }

  /**
   * @description Metodo para poder procesar el result de la peticion de busquedas
   *
   * @param result objeto o arreglo que contiene la informacion del result
   * de las peticiones de busqueda
   */
  private processResultRequest(result: any) {
    this.listParametros = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf ConsultarBuzonesComponent
   */
  async onPageChanged(event: any) {
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    await this.getConsultaListParametros(
      this.fillObjectPag(this.page, this.rowsPorPagina)
    );
  }

  /**
   * Metodo para poder realizar la edicion
   * del parametro
   */
  editParametro(objParam: IConsultaParametros) {
    /** Se registra el buzon a editar en el localstorage */
    this.parametrosService.setSaveLocalStorage('parametro', objParam);
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/contingencia', 'editarParametro']);
  }

  /**
   * Metodo para pode realizar el alta
   * del parametro
   */
  altaParametro() {
    if (
      this.parametrosService.validatePropertyExisteInLocalStorage('parametro')
    ) {
      this.parametrosService.removeSaveLocalStorage('parametro');
    }
    this.router.navigate(['/contingencia', 'editarParametro']);
  }

  /**
   * Funcion que muestra en pantalla la lista de parametros registrados en el catalogo
   */
  showParametros() {
    let titulo = this.translate.instant('modals.parametros.confirmacion');
    let contenido = this.translate.instant('modals.parametros.confirmacion.contenido');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.parametrosService.setShowParametros(true);
        this.page = 0;
        this.getConsultaListParametros(
          this.fillObjectPag(this.page, this.rowsPorPagina)
        );
      }
    });
  }

  async actualiza(paginacion: any) {
    try {
      await this.parametrosService
        .getistParametros(paginacion)
        .then(async (result: any) => {
          if (result.content != null) {
            this.banderaShowPanelActualizacion = true;
            this.open(
              this.translate.instant('parametrosBD.PBD0001.titulo'),
              this.translate.instant('parametrosBD.PBD0001.descripcion'),
              'info',
              this.translate.instant('parametrosBD.PBD0001.codigo'),
              this.translate.instant('parametrosBD.PBD0001.sugerencia'),
            );

            this.parametrosService.setShowParametros(false);
            this.ngOnInit();
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('parametrosBD.PBD0003.titulo'),
              this.translate.instant('parametrosBD.PBD0003.observacion'),
              'error',
              this.translate.instant('parametrosBD.PBD0003.codigo')
            );
          }
        });
    } catch (e) {
      this.listParametros = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('parametrosBD.PBD0003.titulo'),
        this.translate.instant('parametrosBD.PBD0003.observacion'),
        'error',
        this.translate.instant('parametrosBD.PBD0003.codigo')
      );
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
    contenido: string,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }
}
