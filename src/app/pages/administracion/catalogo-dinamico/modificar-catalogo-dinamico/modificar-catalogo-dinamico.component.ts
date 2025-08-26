import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { IConsultaCatalogo } from 'src/app/bean/iconsulta-catalogo-dinamico.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { CatalogoDinamicoService } from 'src/app/services/administracion/catalogo-dinamico.service';

@Component({
  selector: 'app-modificar-catalogo-dinamico',
  templateUrl: './modificar-catalogo-dinamico.component.html',
  styleUrls: ['./modificar-catalogo-dinamico.component.css'],
})
export class ModificarCatalogoDinamicoComponent implements OnInit {
  /** Variables para guardar la informacion del sub catalogo */
  valorDescrCatalogo: string = '';
  descripcionSubCatalogo: string = '';
  valorSubCatalogo: string = '';
  /** Propiedad para poder guardar o actualizar el subcatalogo */
  objSubCatalogo: IConsultaCatalogo;
  banderaShowButtonModificar: boolean = false;

  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarBuzonesComponent
   */
  formCatalogoDinamico: UntypedFormGroup;
  constructor(
    private fc: FuncionesComunesComponent,
    private formBuilder: UntypedFormBuilder,
    private catalogoDinamicoService: CatalogoDinamicoService,
    private router: Router,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    /** Se inicializa el formulario para validar el search */
    this.formCatalogoDinamico = this.formBuilder.group({
      descripcion: ['', Validators.required],
      valor: ['', Validators.required],
    });

    this.objSubCatalogo = {
      idReg: 0,
      idCat: 0,
      valor: '',
      descr: '',
      descr2: '',
      descr3: '',
      descr4: '',
      bandAct: '',
      bandModifica: '',
    };
  }

  /**
   * Metodo getter para utilziacion y validacion de formulario
   * en la vista
   */
  get formControlCatalogoDinamico() {
    return this.formCatalogoDinamico.controls;
  }

  /**
   * Inicializacion de componentes
   */
  async ngOnInit() {
    /** Se obtiene el objeto guardado en el localstorage */
    this.getOrCreateAltaSubCatalogoFromLocalStorage();
    /** Se llama el metodo que llenara los valores necesarios */
    this.setValuesFromLocalStorage();
    this.banderaShowButtonModificar =
      this.catalogoDinamicoService.isShowButtonModificar();
  }

  /**
   * @description Metodo para poder obtener el objeto de buzon
   * que se va a editar o inicializar el objeto alta de buzon
   */
  getOrCreateAltaSubCatalogoFromLocalStorage() {
    let objectLocalStorage =
      this.catalogoDinamicoService.getSaveLocalStorage('subcatalogo');
    this.valorDescrCatalogo = this.catalogoDinamicoService.getSaveLocalStorage(
      'descriopcionSelected'
    );

    if (objectLocalStorage.hasOwnProperty('idReg')) {
      this.objSubCatalogo =
        this.catalogoDinamicoService.getSaveLocalStorage('subcatalogo');
    } else {
      let idCatalogoSelected =
        this.catalogoDinamicoService.getSaveLocalStorage('idSelected');
      this.objSubCatalogo.idReg = 0;
      this.objSubCatalogo.idCat = Number(idCatalogoSelected);
      this.objSubCatalogo.valor = '';
      this.objSubCatalogo.descr = '';
      this.objSubCatalogo.descr2 = '';
      this.objSubCatalogo.descr3 = '';
      this.objSubCatalogo.descr4 = '';
      this.objSubCatalogo.bandAct = 'A';
      this.objSubCatalogo.bandModifica = '';
    }
  }

  /**
   * Metodo para llenar los valores necesarios
   * obtenidos desde el localstorage
   */
  setValuesFromLocalStorage() {
    this.valorSubCatalogo = this.objSubCatalogo.valor.trim();
    this.descripcionSubCatalogo = this.objSubCatalogo.descr.trim();
  }

  /**
   * @description Metodo que se ejecutara al momento de dar click en limpiar
   */
  cleanForm() {
    this.formCatalogoDinamico = this.initializeForm();
  }

  /**
   * @description Metodo para poder inicializar el formulario y regresar dicho
   * formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      descripcion: [''],
      valor: [''],
    });
  }

  /**
   * Metodo para regresar a la vista de consulta
   * de catalogos y sub catalogos
   */
  regresarToConsult() {
    this.catalogoDinamicoService.setSaveLocalStorage('regresa', true);
    this.router.navigate(['/moduloAdministracion', 'consultaCatalogoDinamico']);
  }

  /**
   * Metodo para poder realizar el guardado
   * del subcatalogo o actualizacion
   */
  saveOrUpdateSubCatalogo() {
    /** Se valida que tengan algun valor los campos Descripcion y Valor */
    if (this.formCatalogoDinamico.controls['descripcion'].value == '') {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.descripcion.vacia'),
        'info'
      );
      return;
    }
    if (this.formCatalogoDinamico.controls['valor'].value == '') {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.valor.vacio'),
        'info'
      );
      return;
    }
    /** Se llama el metodo que llenara el objeto a guardar o actualizar */
    if (this.fillObjectToSaveOrUpdate()) {
      if (this.objSubCatalogo.idReg > 0) {
        this.updateSubCatalogo();
      } else {
        this.saveSubCatalogo();
      }
    } else {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.valor.vacio'),
        'info'
      );
    }
  }
  /**
   * Metodo para llenar el objeto que se esta
   * modificando o guardando
   */
  fillObjectToSaveOrUpdate() {
    this.objSubCatalogo.descr =
      this.formCatalogoDinamico.controls['descripcion'].value;
    this.objSubCatalogo.valor =
      this.formCatalogoDinamico.controls['valor'].value;
    var d = this.objSubCatalogo.descr;
    var v = this.objSubCatalogo.valor;
    if (v.trimStart() == '') {
      this.objSubCatalogo.valor = '';
      this.formCatalogoDinamico.controls['valor'].reset();
      if (d.trimStart() == '') {
        this.objSubCatalogo.descr = '';
        this.formCatalogoDinamico.controls['descripcion'].reset();
        return false;
      }
      return false;
    }
    if (d.trimStart() == '') {
      this.objSubCatalogo.descr = '';
      this.formCatalogoDinamico.controls['descripcion'].reset();
      if (v.trimStart() == '') {
        this.objSubCatalogo.valor = '';
        this.formCatalogoDinamico.controls['valor'].reset();
        return false;
      }
      return false;
    }
    return true;
  }

  /**
   * Metodo para realizar el guardado del
   * subcatalogo
   */
  private async saveSubCatalogo() {
    try {
      var v = this.objSubCatalogo.valor;
      var d = this.objSubCatalogo.descr;
      this.objSubCatalogo.valor = v.trimStart();
      this.objSubCatalogo.descr = d.trimStart();
      await this.catalogoDinamicoService
        .saveInformacionSubCatalogo(this.objSubCatalogo)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.catalogoDin.info'),
            this.translate.instant('modals.catalogoDin.info.guardado.regicata'),
            'info'
          );
          /** Se hace el redirect a la vista de alta */
          this.regresarToConsult();
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.guardado.regicata'),
        'error'
      );
    }
  }

  /**
   * Metodo para realizar la actualizacion
   * del subcatalogo
   */
  private async updateSubCatalogo() {
    try {
      var v = this.objSubCatalogo.valor;
      var d = this.objSubCatalogo.descr;
      this.objSubCatalogo.valor = v.trimStart();
      this.objSubCatalogo.descr = d.trimStart();
      await this.catalogoDinamicoService
        .updateInformacionSubCatalogo(
          this.objSubCatalogo.idReg,
          this.objSubCatalogo
        )
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'),
            this.translate.instant('modals.catalogoDin.info.actualizacion.regicata'),
            'info'
          );
          /** Se hace el redirect a la vista de alta */
          this.regresarToConsult();
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.actualizacion.regicata'),
        'error'
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
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true 
    });
  }

  /**
   * Funcion para validar el contenido de los inputs
   *
   * @param event Contenido del input
   * @param opcion Opcion de validacion
   */
  validateContenidoRegex(event: any, opcion: string, input: any) {
    let valor = event.target.value;
    if (opcion == 'D') {
      valor = valor.replace(/[+\!\¡%@$;#~\^\'\"°¨|¬,]/gi, '');
    } else {
      valor = valor.replace(/[^A-Za-z0-9\-\_ :\.?\[\]\}\{<>&%\(\)=\|\/]/gi, '');
    }
    return (event.target.value = valor);
  }

  eveValidateTexto(event: KeyboardEvent) {
    this.fc.texto(event);
  }
  eveValidateTexto2(event: KeyboardEvent) {
    this.fc.texto2(event);
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  eventoPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.textoCopy(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  eventoPaste2(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.textoCopy2(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }
}
