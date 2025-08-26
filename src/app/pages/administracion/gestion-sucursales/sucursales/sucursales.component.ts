import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GestionSucursalesService } from 'src/app/services/administracion/gestion-sucursales.service';
import { Router } from '@angular/router';
import { AltaSucursal } from 'src/app/bean/alta-gestion-sucursal.component';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {
  id: any;
  sucursal: any;
  latitud: any;
  longitud: any;
  direccion: any;
  cp: any;
  activo: any;
  /**Para el alta de sucursales */
  objetoSaveUpdSucursal: AltaSucursal = new AltaSucursal();
  /** variable de control para saber si se realizo el submit del alta o modificacion */
  submittedSaveSucursal = false;
  /** variable del formulario de la sucursal*/
  formSucursal: UntypedFormGroup;
  /** Para obtener los datos de modificacion */
  datosSucursal: any;
  /** Bandera para mostrar titulos */
  bandEsAlta: boolean = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public service: GestionSucursalesService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService
  ) {
    /** Se inicializa el formulario para validar el Backend */
    this.formSucursal = this.formBuilder.group({
      sucursal: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      direccion: ['', Validators.required],
      cp: ['', Validators.required],
      activo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    /** Se obtiene el objeto guardado en el localstorage */
    this.getSucursalFromLocal();
  }

  /**
 * Metodo para poder realizar la obtencion del localstorage
 * y determinar si es una actualizacion o inserccion
 */
  getSucursalFromLocal() {
    /** Se obtiene el valor guardado del localstorage */
    this.datosSucursal = this.service.getSaveLocalStorage('dato');
    /** en caso de que exista un parametro guardado en el local accede al if si no accede al else */
    if (this.datosSucursal.id !== '' && this.datosSucursal.id !== undefined) {
      this.id = this.datosSucursal.id;
      this.sucursal = this.datosSucursal.sucursal;
      this.latitud = this.datosSucursal.latitud;
      this.longitud = this.datosSucursal.longitud;
      this.direccion = this.datosSucursal.direccion;
      this.cp = this.datosSucursal.cp;
      this.activo = this.datosSucursal.activo;
      this.bandEsAlta = false;
    } else {
      this.id = '';
      this.sucursal = '';
      this.latitud = '';
      this.longitud = '';
      this.direccion = '';
      this.cp = '';
      this.activo = '';
      this.bandEsAlta = true;
    }
  }

  get formControlSucursal() {
    return this.formSucursal.controls;
  }

  cleanDatos() {
    this.submittedSaveSucursal = false;
    /**Se limpia el formulario de busqueda */
    this.formSucursal.reset();
  }

  private fillObjectSaveUpdate() {
    this.objetoSaveUpdSucursal.id = this.id;
    this.objetoSaveUpdSucursal.sucursal = this.formSucursal.controls['sucursal'].value;
    this.objetoSaveUpdSucursal.latitud = this.formSucursal.controls['latitud'].value;
    this.objetoSaveUpdSucursal.longitud = this.formSucursal.controls['longitud'].value;
    this.objetoSaveUpdSucursal.direccion = this.formSucursal.controls['direccion'].value;
    this.objetoSaveUpdSucursal.cp = this.formSucursal.controls['cp'].value;
    this.objetoSaveUpdSucursal.activo = this.formSucursal.controls['activo'].value;
  }

  saveSucursal() {
    /** Se realiza el llenado del obejto */
    this.fillObjectSaveUpdate();
    /** Valida la completes de los campos */
    if (this.objetoSaveUpdSucursal.sucursal === '') {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.sucursal.vacio'),'alert',this.translate.instant('modals.sucursales.alerta.campo.sucursal.vacio.VAL001Codigo'));
      return;
    } else if (this.objetoSaveUpdSucursal.cp === '') {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.cp.vacio'),'alert',this.translate.instant('modals.sucursales.alerta.campo.cp.vacio.VAL003Codigo'));
      return;
    } else if (this.objetoSaveUpdSucursal.cp.length < 5) {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.cp.incorrecto'),'alert',this.translate.instant('modals.sucursales.alerta.campo.cp.vacio.VAL003Codigo'));
      return;
    } else if (this.objetoSaveUpdSucursal.direccion === '') {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.direccion.vacio'),'alert',this.translate.instant('modals.sucursales.alerta.campo.direccion.vacio.VAL002Codigo'));
      return;
    } else if (this.objetoSaveUpdSucursal.latitud === '') {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.latitud.vacio'),'alert',this.translate.instant('modals.sucursales.alerta.campo.latitud.vacio.VAL004Codigo'));
      return;
    } else if (this.objetoSaveUpdSucursal.longitud === 0) {
      this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.campo.longitud.vacio'),'alert',this.translate.instant('modals.sucursales.alerta.campo.longitud.vacio.VAL005Codigo'));
      return;
    }
    if (this.datosSucursal.id !== '' && this.datosSucursal.id !== undefined) {
      this.updateSucursalRequest();
    } else {
      this.objetoSaveUpdSucursal.activo = 'A';
      this.saveSucursalRequest();
    }
    this.router.navigate(['/moduloAdministracion/gestionSucursales']);
  }

  private async saveSucursalRequest() {
    try {
      await this.service.saveSucursal(this.objetoSaveUpdSucursal).then(
        async (result: any) => {
          this.formSucursal.reset();
          this.submittedSaveSucursal = false;
          if (result.error === 'OK00000') {
            this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.creacion'),'info',this.translate.instant('modals.sucursales.alerta.creacion.OKC0003Codigo'));
          } else {
            this.open(this.translate.instant('modals.sucursales.error'), this.translate.instant('modals.sucursales.error.creacion'),'error',this.translate.instant('modals.sucursales.error.creacion.ERRRC03Codigo'));
          }
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.formSucursal.reset();
      this.submittedSaveSucursal = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modals.sucursales.error'), this.translate.instant('modals.sucursales.error.creacion'),'error',this.translate.instant('modals.sucursales.error.creacion.ERRRC03Codigo'));
    }
  }

  private async updateSucursalRequest() {
    try {
      await this.service.updateSucursal(this.objetoSaveUpdSucursal).then(
        async (result: any) => {
          this.formSucursal.reset();
          this.submittedSaveSucursal = false;
          if (result.error === 'OK00000') {
            this.open(this.translate.instant('modals.sucursales.alerta'), this.translate.instant('modals.sucursales.alerta.modificacion'),'info',this.translate.instant('modals.sucursales.alerta.modificacion.OKC0004Codigo'));
          } else {
            this.open(this.translate.instant('modals.sucursales.error'), this.translate.instant('modals.sucursales.error.modificacion'),'error',this.translate.instant('modals.sucursales.error.modificacion.ERRRC04Codigo'));
          }
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.formSucursal.reset();
      this.submittedSaveSucursal = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modals.sucursales.error'), this.translate.instant('modals.sucursales.error.modificacion'),'error',this.translate.instant('modals.sucursales.error.modificacion.ERRRC04Codigo'));
    }
  }


  open(titulo: String, contenido: String, type?:any, errorCode?:string, sugerencia?:string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    }
    );
  }

  /**
 * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
 */
  onlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar numeros en el input text
   */
  pasteOnlyNumbers(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
  * Metodo que valida que se ingresen solo mayusculas, minusculas, numeros, espacios y puntos, en caso de que se quieran ingresar datos diferentes no se permitira
  */
  onlyAlphaNumberPointAndSpace(event: KeyboardEvent) {
    this.fc.alphaNumberPointAndSpaceOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas, numeros, espacios y puntos en el input text
   */
  pasteOnlyAlphaNumberPointAndSpace(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumberPointAndSpaceOnlyPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
 * Metodo que valida que se ingresen solo numero y puntos, en caso de que se quieran ingresar datos diferentes no se permitira
 */
  onlyNumbersAndPoint(event: KeyboardEvent) {
    this.fc.numberOnlyAndPoint(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar numeros y puntos en el input text
   */
  pasteOnlyNumbersAndPoint(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numbersAndPointForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }
}
