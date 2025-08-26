import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ConsultasBicService } from 'src/app/services/administracion/consultas-bic.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';


@Component({
  selector: 'app-consulta-bic',
  templateUrl: './consulta-bic.component.html',
  styleUrls: ['./consulta-bic.component.css']
})
export class ConsultaBicComponent implements OnInit, OnDestroy {

  bicBusqueda: string = '';
  descBusqueda: string = '';
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  consultaBicForm!: FormGroup;
  /**
  * Datos para llenar la tabla de paises
  */
  tabla: any[] = [];
  /** Objeto de paises para inicializar busqueda */
  bic = {
    codigoTransfer: "",
    nombre: "",
    catalogo: "BIC"
  }
  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable: IPaginationRequest;

  clickSuscliption: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    /** */
    public consultasBicService: ConsultasBicService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService
  ) {
    this.consultaBicForm = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      bic: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }

  ngOnInit(): void {
    /**Nos trae todos los Backends enlistados */
    //this.getConsultasBic(this.fillObjectPag(this.page, this.rowsPorPagina));
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 11) {
        this.reloadPage();
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  reloadPage() {
    this.onClickClean()
    this.bic = {
      codigoTransfer: "",
      nombre: "",
      catalogo: "BIC"
    }
    this.getConsultasBic(this.fillObjectPag(this.page, this.rowsPorPagina));

  }


  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
  */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */

  private async getConsultasBic(objPaginacion: IPaginationRequest) {
    this.page = 0

    try {
      await this.consultasBicService.getListaBics(this.bic, objPaginacion).then(
        async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        '',
        this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
        'info',
        '',
        '',
      );
    }
  }

  resultRequest(result: any) {
    this.tabla = result.content;
    this.totalElements = result.totalElements;
    this.banderaHasRows = true;
    if (this.totalElements === 0){
      this.open(
        '',
        this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
        'info',
        'ERR003',
        '',
      );
    }
    if (result.totalElements === 0) {
      this.banderaBtnExportar = true;
    } else {
      this.banderaBtnExportar = false;
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true 
    }
    );
  }

  onClickClean() {
    /**Se limpia el formulario de busqueda */
    this.page=0;
    this.consultaBicForm.reset()
  }

  searchProductos() {
    this.bic.codigoTransfer = this.bicBusqueda;
    this.bic.nombre = this.descBusqueda;
    this.page = 0
    /**Nos trae todos los Backends enlistados */
    this.getConsultasBic(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  get formControlSearch() {
    return this.consultaBicForm.controls;
  }

  onPageChanged(event: any) {
    this.page = event.page - 1;
    this.getConsultasBic(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte excel o csv
  */
  async exportBicXls() {

    this.bic.codigoTransfer = this.bicBusqueda;
    this.bic.nombre = this.descBusqueda;

    try {
      await this.consultasBicService.exportBicXls(this.bic).then(
        async (result: any) => {
          const { listaArchivosConverted } = result;
          const { srcfile, nameFile } = listaArchivosConverted[0];

          const auxText = nameFile.split('.')

          const dataConvert = {
            data: srcfile,
            type: auxText[1],
            name: nameFile
          }
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(dataConvert);
          this.globals.loaderSubscripcion.emit(false);
        }
      );
    } catch (e) {
      this.open(this.translate.instant('modals.moduloAdministracion.consultasBics.error'), this.translate.instant('modals.error.exportacion'), 'error');
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
 * Metodo que valida que se ingresen solo mayusculas, minusculas, numeros y comas, en caso de que se quieran ingresar datos diferentes no se permitira
 */
  onlyAlphaNumberAndComa(event: KeyboardEvent) {
    this.fc.alphaNumberAndComaOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas, numeros y comas en el input text
   */
  pasteOnlyAlphaNumberAndComa(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumberAndComaOnlyPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
  * Metodo que valida que se ingresen solo mayusculas, minusculas y numeros, en caso de que se quieran ingresar datos diferentes no se permitira
  */
  onlyAlphaNumber(event: KeyboardEvent) {
    this.fc.alphaNumberOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas y numeros en el input text
   */
  pasteOnlyAlphaNumber(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

}
