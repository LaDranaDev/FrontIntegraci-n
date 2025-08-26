import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AltaBackend } from 'src/app/bean/alta-gestion-backend.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { GestionBackendService } from 'src/app/services/administracion/gestion-backend.service';
import { Router } from '@angular/router';
import { IPaginationRequest } from '../../../contingencia/request/pagination-request.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { BackendRespuesta } from 'src/app/interface/backendRespuesta.interface';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit {


  listaProtocolo: any;
  result: any;
  datos: any;
  submittedBackend = false;
  formBackend: UntypedFormGroup;
  objetoObtener: any;
  // numLetPuntoComaDiagonal: RegExp = /^[a-zA-ZÀ-ú0-9\u00d1,.&\n \t ]*$/g
  numLetPuntoComaDiagonal: RegExp = new RegExp('^[a-zA-ZÀ-ú0-9\u00d1& .,\/]*$');
  ipRegex: RegExp = /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;

  tabla: BackendRespuesta[] = [];

  backend = {
    idBack: "",
    nombre: "",
    dirIp: "",
    idProtocol: 0,
    bandActivo: 0
  }

  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPageable: IPaginationRequest;

  /**Para el alta Backend */
  objetoSaveUpdBackend: AltaBackend = new AltaBackend();
  /** variable de control para saber si se realizo el submit del alta o modificacion */
  submittedSaveBackend = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public gestionBackendService: GestionBackendService,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    /** Se inicializa el formulario para validar el Backend */
    this.formBackend = this.formBuilder.group({
      nameBackend: ['', Validators.required],
      protocol: ['', Validators.required],
      address: ['', Validators.required],
      active: true,
      back: [''],
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }

  back: any
  active: any = 1
  ngOnInit(): void {

    this.back = this.gestionBackendService.getSaveLocalStorage('backend');
    this.getEstatus()
    if (this.back !== null) {
      this.resultRequest(this.back);
    }
  }

  get formControlBackend() {
    return this.formBackend.controls;
  }

  onClickClean() {
    this.submittedBackend = false;
    /**Se limpia el formulario de busqueda */
    this.formBackend.reset();
  }

  regresarToConsult() {

    this.gestionBackendService.setSaveLocalStorage('backend', null);
    this.router.navigate(['/moduloAdministracion', 'gestionBackends']);
  }

  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true
    }
    );
  }

  private fillObjectSaveUpdate() {
    this.objetoSaveUpdBackend.nombre = this.formBackend.controls['nameBackend'].value;
    this.objetoSaveUpdBackend.dirIp = this.formBackend.controls['address'].value;
    this.objetoSaveUpdBackend.idProtocol = this.formBackend.controls['protocol'].value;
  }
  valorG: any
  guardarCatalogo() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant(
          'administracion.general.tituloConfirmacion'
        ),
        this.translate
        .instant('administracion.general.mensajeConfirmacion'),
        'confirm'
      ), hasBackdrop: true
    });

    dialogo.afterClosed().subscribe((result) => {
      if(result){
        this.fillObjectSaveUpdate();

        if (this.validar(this.formBackend.controls)) {
          this.submittedSaveBackend = true;
          /** Se realiza el llenado del obejto */
          var acti = this.formBackend.value.active
          this.valorG = 0
          if (acti == true) {
            this.valorG = 1
          }
          /** Se llama el metodo que realiza el registro del catalogo */
          const backEnvio = {
            "nombre": this.formBackend.value.nameBackend,
            "dirIp": this.formBackend.value.address,
            "idProtocol": this.formBackend.value.protocol,
            "bandActivo": this.valorG
          }
          this.saveCatalogoRequest(backEnvio);

          this.router.navigate(['/moduloAdministracion/gestionBackends']);
        }
      }
    });

  }

  private async saveCatalogoRequest(envio: any) {
    try {
      await this.gestionBackendService.saveBackend(envio).then(
        async (result: any) => {
          this.formBackend.reset();
          this.submittedSaveBackend = false;
          /** Se obtiene el listado nuevo */
          // this.getConsultaListCatalogos();
          this.open(this.translate.instant('modals.catalogoDin.alerta'), result['message'], 'aviso');

          this.gestionBackendService.setSaveLocalStorage('backend', null);
        }
      )
    } catch (e) {
      this.formBackend.reset();
      this.submittedSaveBackend = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant('administracion.gestionCanales.ERGC011.Observacion'),
        'error');
    }
  }

  check: any
  cambio(event: any) {
    this.check = event.target.checked;
    if (this.check === true) {
      this.objetoSaveUpdBackend.bandActivo = 1;
    } else {
      this.objetoSaveUpdBackend.bandActivo = 0;
    }
  }
  valor: any
  putBackend() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant(
          'administracion.general.tituloConfirmacion'
        ),
        this.translate
        .instant('administracion.general.mensajeConfirmacion'),
        'confirm'
      ), hasBackdrop: true
    });

    dialogo.afterClosed().subscribe((result) => {
      if(result){
        if (this.validar(this.formBackend.controls)) {

          var acti = this.formBackend.value.active

          if (acti === true) {
            this.valor = 1
          } else {
            this.valor = 0
          }
          const backEnv = {
            "nombre": this.formBackend.value.nameBackend,
            "dirIp": this.formBackend.value.address,
            "idProtocol": this.formBackend.value.protocol,
            "bandActivo": this.valor,
            "idBack": this.formBackend.value.back
          }
          try {
            this.gestionBackendService.putBackend(backEnv).then(
              async (result: any) => {
                this.formBackend.reset();
                this.submittedSaveBackend = false;
                this.open(this.translate.instant('modals.catalogoDin.alerta'), result['message'], 'aviso');

                this.gestionBackendService.setSaveLocalStorage('backend', null);
                this.router.navigate(['/moduloAdministracion', 'gestionBackends']);
              }
            )
          } catch (e) {
            this.formBackend.reset();
            this.submittedSaveBackend = false;
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              'Error',
              this.translate.instant('administracion.gestionCanales.ERGC011.Observacion'),
              'error');          }
        }
      }
    });
  }

  private async getEstatus() {
    try {
      await this.gestionBackendService.getListaProtocolo().then(
        async (result: any) => {
          this.listaProtocolo = result;
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      /** Se establece el page en el 0 */
      this.globals.loaderSubscripcion.emit(false);
      this.open("Error", this.translate.instant('modals.backend.error.consulta'), 'error', 'ERR000');
    }
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

  resultRequest(result: any) {
    this.formBackend.patchValue({
      back: result.idBack,
      nameBackend: result.nombre,
      address: result.dirIp,
      protocol: result.idProtocol,
      active: result.bandActivo,
    })
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */

  disableEvent(event: any) {
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
   * Evento para poder validar que el campo solo
   * se puedan ingresar numeros y puntos
   */
  ip(event: KeyboardEvent) {
    this.fc.numberOnlyAndPoint(event);
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto,
   */
  nombre(event: KeyboardEvent) {
    this.fc.nombre(event);
  }


  validar(formData: any) {


    const nombre = formData.nameBackend.value

    const banderaNombre = this.numLetPuntoComaDiagonal.test(nombre)

    const ip = formData.address.value;

    const banderaIP = this.ipRegex.test(ip)


    if (nombre == '') {
      this.open(this.translate.instant('modals.catalogoDin.alerta'), this.translate.instant('modals.backend.vacio.nameBack'), 'aviso');
      return false;
    }
    if (ip == "") {
      this.open(this.translate.instant('modals.catalogoDin.alerta'), this.translate.instant('modals.backend.vacio.ip'), 'aviso');
      return false;
    }
    if (formData.protocol.value == "") {
      this.open(this.translate.instant('modals.catalogoDin.alerta'), this.translate.instant('modals.backend.vacio.proto'), 'aviso');
      return false;
    }
    if (!banderaNombre) {
      this.open(this.translate.instant('modals.catalogoDin.error'), this.translate.instant('modals.backend.error.nameBack'), 'aviso');
      return false;
    }
    if (!banderaIP) {
      this.open(this.translate.instant('modals.catalogoDin.error'), this.translate.instant('modals.backend.error.ip'), 'aviso');
      return false;
    }
    return true
  }

  validaKey(event: any) {
    return this.fc.validaKey(event, event.target.id)
  }

}
