import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { NotificacionesModel } from 'src/app/interface/gestionNotificaciones.interface';
import { GestionNotificacionesService } from 'src/app/services/administracion/gestion-notificaciones.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { IPaginationRequest } from '../gestion-alarma/request/i-pagination-request';

interface Receivers {
  idDestinatario: number;
  idNotificacion: number;
  email: string;
}

@Component({
  selector: 'app-gestion-notificaciones',
  templateUrl: './gestion-notificaciones.component.html',
  styleUrls: ['./gestion-notificaciones.component.css'],
})
export class GestionNotificacionesComponent implements OnInit {
  searchForm: FormGroup;
  editAddForm: FormGroup;
  notificationsArr: any[] = [];
  isEditAdd = false;
  notificationToEdit: any | undefined;
  catTypeDest: { value: string; label: string }[];
  catTypeNoti: { value: string; label: string }[];
  title: string;
  subtitle: string;
  isModifyDeleteDest = false;
  receiversNotifySelected: Receivers[] = [];
  clickSuscliption: Subscription | undefined;
  tabla: any;
  totalElements: any;
  banderaHasRows: boolean = false;
  rowsPorPagina = 20;
  showBoundaryLinks5: boolean = true;
  showDirectionLinks5: boolean = true;
  page: number = 0;
  objPagination: IPaginationRequest;
  constructor(
    private fb: FormBuilder,
    private gestionNotificacionesService: GestionNotificacionesService,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private comunService: ComunesService,
  ) {
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina
    }
  }

  async ngOnInit() {
    this.loadPage();
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 4) {
        this.title ='gestionNotificaciones.tite';
        this.catTypeDest = this.gestionNotificacionesService.catDestType;
        this.catTypeNoti = this.gestionNotificacionesService.catNotiType;
        this.searchForm = this.fb.group({
          name: [''],
          templateKey: [''],
        });
        this.createFormEditAdd();
        this.getNotifications();
        this.cancelADestModifyAdd(0);
        this.cancelAddEdit();
      }
    });
  }

  async getNotifications() {
    this.page = 0
    try {
      await this.gestionNotificacionesService.getNotification('', '', this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        async (result: any) => {
          this.resultRequest(result)
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (error) {
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  labelNotificationDestinationType(
    notificationId: string | null,
    destinationType?: string
  ): String {
    let labelTypeNotiDest: string = '';
    if (notificationId) {
      labelTypeNotiDest =
        notificationId === 'N'
          ? this.translateService.instant(
            'administracion.notificaciones.Notificacion.valor'
          )
          : this.translateService.instant(
            'administracion.notificaciones.Alarma.valor'
          );
    } else if (destinationType) {
      labelTypeNotiDest =
        destinationType == 'A'
          ? this.translateService.instant(
            'administracion.notificaciones.Ambos.valor'
          )
          : destinationType == 'C'
            ? this.translateService.instant(
              'administracion.notificaciones.Clientes.valor'
            )
            : this.translateService.instant(
              'administracion.notificaciones.ACentral.valor'
            );
    }
    return labelTypeNotiDest;
  }

  editAddNotification(notificationSelected?: any): void {
    this.savePage();
    if (notificationSelected) {
      this.notificationToEdit = notificationSelected;
      this.title ='gestionNotificaciones.titeEdit';
      
      this.editAddForm.patchValue({
        idNotificacion: notificationSelected.idNoti,
        tipoNotificacion: notificationSelected.tipoNoti,
        nombreNotificacion: notificationSelected.nombreNoti,
        claveTemplate: notificationSelected.clveTmpl,
        mensaje: notificationSelected.mensaje,
        asunto: notificationSelected.asunto,
        activo: notificationSelected.bandActivo === 1 ? true : false,
        tipoDestino: notificationSelected.tipoDest,
        destinatarios: null,
      });
    } else {
      this.title ='gestionNotificaciones.titeAgregar';
      this.subtitle = 'gestionNotificaciones.agregarSubtite'
      this.createFormEditAdd();
    }
    this.isEditAdd = true;
  }

  async saveEditNotification(): Promise<void> {
    if (!this.validForm()) return;

    if (this.editAddForm.controls['nombreNotificacion'].value) {
      if (!this.validateNotificationName(this.editAddForm.controls['nombreNotificacion'].value)) {
        return;
      }
    }

    if (this.editAddForm.controls['claveTemplate'].value) {
      if (!this.validateNotificationTemplateKey(this.editAddForm.controls['claveTemplate'].value)) {
        return;
      }
    }

    const dialog = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant(
          'administracion.general.tituloConfirmacion'
        ),
        '',
        'confirm',
        '',
        this.translateService.instant(
          'administracion.general.mensajeConfirmacion'
        )
      ),
      hasBackdrop: true
    });
    dialog.afterClosed().subscribe(async (r) => {
      if (r === 'ok') {
        try {
          const getFormValue = this.editAddForm.value;
          const requestAdd = {
            tipoNotificacion: getFormValue.tipoNotificacion,
            nombreNotificacion: getFormValue.nombreNotificacion,
            claveTemplate: getFormValue.claveTemplate,
            mensaje: getFormValue.mensaje,
            asunto: getFormValue.asunto,
            activo: getFormValue.activo ? 1 : 0,
            tipoDestino: getFormValue.tipoDestino,
          };

          const requestEdit = {
            ...this.editAddForm.value,
            activo: this.editAddForm.value.activo == true ? '1' : '0',
          };
          this.notificationToEdit?.idNoti
            ? (requestEdit.idNoti = String(this.editAddForm.value.idNotificacion))
            : delete requestEdit.idNoti;
          const modifyAddNoti = this.notificationToEdit?.idNoti ? ((await this.gestionNotificacionesService.editNotify(requestEdit)) as { codError: string })
            : ((await this.gestionNotificacionesService.addNotify(
              requestAdd
            )) as { codError: string });
          if (modifyAddNoti.codError === '200') {
            this.open(
              this.translateService.instant('mensaje.crearBuzon.aviso.title'),
              '',
              'info',
              this.translateService.instant(
                'administracion.notificaciones00000.code'
              ),
              this.notificationToEdit?.idNoti
                ? this.translateService.instant(
                  'administracion.notificaciones00000.contenidoModify'
                )
                : this.translateService.instant(
                  'administracion.notificaciones00000.contenido'
                )
            );
            this.savePage();
            await this.getNotifications();
          }
          var text = this.translateService.instant('yaExiste') + ' ' + requestAdd.nombreNotificacion + ' ' + this.translateService.instant('sigue');
          if (modifyAddNoti.codError === 'NOTIFICACIONES9999') {
            this.open(
              'Error',
              '',
              'error',
              'NOTIFICACIONES9999',
              text
            );
            this.globals.loaderSubscripcion.emit(false);
          }
          this.cancelAddEdit();
          this.globals.loaderSubscripcion.next(false);
        } catch (error) {
          this.globals.loaderSubscripcion.next(false);
        }
      }
    });
  }

  createFormEditAdd() {
    this.editAddForm = this.fb.group({
      idNoti: [''],
      idNotificacion: [''],
      tipoNotificacion: [''], //N O A,
      nombreNotificacion: [''],
      claveTemplate: [''],
      mensaje: [''],
      asunto: [''],
      activo: [true],
      tipoDestino: [''],
    });
  }

  cancelAddEdit(): void {
    this.isEditAdd = false;
    this.notificationToEdit = undefined;
    this.title ='gestionNotificaciones.tite';
    this.createFormEditAdd();
  }

  async modifyDeleteDest(notifySelected?: NotificacionesModel) {
    this.savePage();
    this.receiversNotifySelected = [];
    this.title = 'gestionNotificaciones.titeDestinatarios'
    const getDest = (await this.gestionNotificacionesService.getReceiver(
      String(notifySelected?.idNoti)
    )) as {
      destinatarioDTOs: Receivers[];
    };
    this.receiversNotifySelected = getDest.destinatarioDTOs;
    this.notificationToEdit = notifySelected;
    this.isModifyDeleteDest = true;
    this.globals.loaderSubscripcion.next(false);
  }

  async deleteReceiver(destInfo: Receivers): Promise<void> {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant(
          'pantallas.vigenciaBuzones.eliminarRegistro'
        ),
        '',
        'confirm',
        '',
        this.translateService.instant(
          'administracion.notificaciones.eliminarRegistro'
        )
      ),
      hasBackdrop: true
    });
    dialogo.afterClosed().subscribe(async (resp) => {
      if (resp === 'ok') {
        try {
          const deleteReceiver =
            (await this.gestionNotificacionesService.deleteReceiver(
              destInfo
            )) as { msgError: string };
          if (deleteReceiver.msgError === 'DELETE') {
            this.open(
              this.translateService.instant('mensaje.crearBuzon.aviso.title'),
              '',
              'info',
              'BAJDEST0000',
              this.translateService.instant(
                'administracion.notificaciones.registroEliminado'
              )
            );
            await this.modifyDeleteDest(this.notificationToEdit);
          }
          this.globals.loaderSubscripcion.next(false);
        } catch (error) {
          this.globals.loaderSubscripcion.next(false);
        }
      }
    });
  }

  cancelADestModifyAdd(valor?:any): void {
    if(valor === 0){
      return
    }

    const name = this.searchForm.value.name;
    const ketTemp = this.searchForm.value.templateKey;
    if (name === '' && ketTemp === '') {
      this.gestionNotificacionesService.getNotification('', '', this.fillObjectPag(this.page - 1, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result)
          this.globals.loaderSubscripcion.emit(false);
        })
    } else {
      this.gestionNotificacionesService.getNotification(name ? name : '', ketTemp ? ketTemp : '', this.fillObjectPag(0, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result)
          this.globals.loaderSubscripcion.emit(false);
        })
    }
    this.isModifyDeleteDest = false;
    this.receiversNotifySelected = [];
    this.title ='gestionNotificaciones.tite';
  }

  openModifyModalAddEmail(destInfo?: Receivers): void {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      disableClose: true,
      data: new ModalInfoBeanComponents(
        '',
        '',
        'confirm',
        '',
        this.translateService.instant(
          'administracion.notificaciones.ingreseCorreo'
        ),
        false,
        {
          email: destInfo?.email ? destInfo?.email : '',
          isNew: destInfo?.idDestinatario ? false : true,
        },
      ),
      hasBackdrop: true
    });
    dialogo.afterClosed().subscribe(async (resp) => {
      if (resp.email) {
        try {
          const requetsUpdateAddEmail = {
            idDestinatario: destInfo?.idDestinatario
              ? destInfo?.idDestinatario
              : null,
            idNotificacion: this.notificationToEdit?.idNoti
              ? this.notificationToEdit?.idNoti
              : destInfo?.idNotificacion,
            email: resp.email,
          };
          const updateEmailReceiver =
            (await this.gestionNotificacionesService.editAddReceiver(
              requetsUpdateAddEmail
            )) as { codError: string };
          if (updateEmailReceiver) {
            //TODO: AGREGAR MENSAJES DE CONFIRMACIÓN
            if (updateEmailReceiver.codError === '200') {
              this.open(
                this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                '',
                'info',
                this.translateService.instant(
                  'administracion.notificaciones00000.code'
                ),
                !destInfo?.idDestinatario
                  ? this.translateService.instant(
                    'administracion.notificaciones00000.contenidoAltDestinatario'
                  )
                  : this.translateService.instant(
                    'administracion.notificaciones00000.contenidoModiDestinatario'
                  )
              );
              await this.modifyDeleteDest(this.notificationToEdit);
            }
            var text = this.translateService.instant('yaExiste1') + ' ' + resp.email + ' ' + this.translateService.instant('sigue1');
            if (updateEmailReceiver.codError === 'NOTIFICACIONES9999') {
              this.open(
                'Error',
                '',
                'error',
                'NOTIFICACIONES9999',
                text
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        } catch (error) {
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    });
  }

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
      ),
      hasBackdrop: true
    });
  }

  validaKeyNotify(e: any, campo: string) {
    let key;
    let specialKeys;
    let spaceKey;
    let letrasEspeciales;
    window.event ? (key = e.keyCode) : (key = e.which);
    specialKeys =
      !window.event && (e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)
        ? true
        : false;
    letrasEspeciales =
      key == 241 ||
        key == 209 ||
        key == 193 ||
        key == 201 ||
        key == 205 ||
        key == 211 ||
        key == 218 ||
        key == 225 ||
        key == 233 ||
        key == 237 ||
        key == 243 ||
        key == 250
        ? true
        : false;
    spaceKey = campo == '${nombreNoti}' && key == 32 ? true : false;

    return (
      (key >= 48 && key <= 57) ||
      (key > 64 && key < 91) ||
      (key > 96 && key < 123) ||
      key == 8 ||
      letrasEspeciales ||
      specialKeys ||
      spaceKey
    );
  }

  validaMsjAsunto(e: any) {
    var key;
    var specialKeys;
    var letrasEspeciales;

    window.event ? (key = e.keyCode) : (key = e.which);
    specialKeys =
      !window.event && (e.keyCode == 46 || (e.keyCode >= 37 && e.keyCode <= 40))
        ? true
        : false;
    letrasEspeciales =
      key == 241 ||
        key == 209 ||
        key == 193 ||
        key == 201 ||
        key == 205 ||
        key == 211 ||
        key == 218 ||
        key == 225 ||
        key == 233 ||
        key == 237 ||
        key == 243 ||
        key == 250
        ? true
        : false;

    return (
      key == 8 ||
      (key >= 32 && key <= 38) ||
      (key >= 42 && key <= 59) ||
      key == 61 ||
      key == 63 ||
      (key > 64 && key < 91) ||
      key == 95 ||
      (key > 96 && key <= 125) ||
      key == 161 ||
      key == 191 ||
      letrasEspeciales ||
      specialKeys
    );
  }

  configuraMaxLength(Event:any, Object:any, MaxLen:any)
	{
		var resp = true;
		var originalCadena = Object.value;

		var key;
		if(window.event){
			//IE
             key = Event.keyCode;
        }else{
        	//mozilla
        	key = Event.which;
		}
		//identifica la comilla simple
		if(key == 39){
		  resp = false;
		} else {


			
			
				if((key >= 48 && key <= 57) || (key>= 97 && key <=122 )||
				   (key >= 65 && key <= 90)||(key==225) || (key== 233) || (key== 237)||
				   (key == 243) || (key==250) || (key==193) || (key== 201) || (key==205)||
				   (key == 211) || (key==218) || (key==241) ||(key==209) || (key >= 32 && key <= 38)||
				   (key >= 40 && key <= 47) || (key==58) || (key == 59) || (key==61) || (key==63)||
				   (key==161) || (key==191)|| (key==91) || (key==93) || (key==95) || (key==123) ||
				   (key==124) || (key==125) || key == 8){
					
					if(originalCadena.length > MaxLen){
						Object.value = originalCadena.substring(0, MaxLen);
					}
				   		//Caracteres Validos
				   		//numeros 48-57,
						//minusculas a-z -> 97-122 
						//mayusculas A-Z -> 65-90,
						//acentos minusculas a,e,i,o,u -> 225,233,237,243,250
						//acentos mayusculas A,E,I,O,U -> 193,201,205,211,218					
						//letras �,� ->241,209
						//Caracteres Especiales espacio,!,Comillas,#,$,%,& -> 32,33,34,35,36,37,38
						//Caracteres Especiales (,),*,+,coma,-,punto,/,:,; -> 40,41,42,43,44,45,46,47,58,59
						//Caracteres Especiales =,?,�,� -> 61,63,161,191
						//Caracteres Especiales [,],_,{,|,} -> 91,93,95,123,124,125,
						//teclas especialas Backspace -> 8
				   }else{
				        resp = false;
				   }
			
		}
		return resp;
	}


  validForm(): boolean {
    const formValue = this.editAddForm.value;

    if (!formValue.nombreNotificacion) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.protocolos.nombre'
        )
      );
      return false;
    }
    if (!formValue.claveTemplate) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.notificaciones.clavesTemplate'
        )
      );
      return false;
    }
    if (!formValue.asunto) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.notificaciones.asunto'
        )
      );
      return false;
    }
    if (!formValue.mensaje) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.notificaciones.mensaje'
        )
      );
      return false;
    }
    if (!formValue.tipoNotificacion) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.notificaciones.tipoNotificacion'
        )
      );
      return false;
    }
    if (!formValue.tipoDestino) {
      this.noValueFieldForm(
        this.translateService.instant(
          'administracion.notificaciones.tipoDestinatario'
        )
      );
      return false;
    }
    return true;
  }

  noValueFieldForm(field: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant('modals.Error'),
        '',
        'error',
        'VAL001',
        this.translateService.instant(
          'administracion.notificaciones.msjVAL001Observacion',
          { field }
        )
      ),
    });
  }

  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPagination.page = numPage;
    this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  validateNotificationName(field: string): boolean {
    let isValid = true;
    const alfanumerico_space = /^[a-zA-ZÀ-ú0-9\u00d1 ]*$/g;

    if (!alfanumerico_space.test(field)) {
      isValid = false;
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translateService.instant('modals.Error'),
          '',
          'error',
          '',
          this.translateService.instant('adminnotificaciones.error.nombre.noValido'),
        ),
      });
    }
    return isValid;
  }

  validateNotificationTemplateKey(field: string): boolean {
    let isValid = true;
    const alfanumerico_space = /^[a-zA-ZÀ-ú0-9\u00d1 ]*$/g;

    if (!alfanumerico_space.test(field)) {
      isValid = false;
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translateService.instant('modals.Error'),
          '',
          'error',
          '',
          this.translateService.instant('adminnotificaciones.error.clave.noValido'),
        ),
      });
    }
    return isValid;
  }


  async searchByFilter() {
    if (this.searchForm.controls['name'].value) {
      if (!this.validateNotificationName(this.searchForm.controls['name'].value)) {
        return;
      }
    }

    if (this.searchForm.controls['templateKey'].value) {
      if (!this.validateNotificationTemplateKey(this.searchForm.controls['templateKey'].value)) {
        return;
      }
    }

    this.page = 0
    this.notificationsArr = [];
    const name = this.searchForm.value.name;
    const ketTemp = this.searchForm.value.templateKey;
    try {
      if (name === '' && ketTemp === '') {
        await this.gestionNotificacionesService.getNotification('', '', this.fillObjectPag(this.page, this.rowsPorPagina)).then(
          async (result: any) => {
            this.resultRequest(result)
            this.globals.loaderSubscripcion.emit(false);
          })
      } else {
        await this.gestionNotificacionesService.getNotification(name ? name : '', ketTemp ? ketTemp : '', this.fillObjectPag(this.page, this.rowsPorPagina)).then(
          async (result: any) => {
            this.resultRequest(result)
            this.globals.loaderSubscripcion.emit(false);
          })
      }
    } catch (error) {
      this.open(
        this.translateService.instant('mensaje.crearBuzon.aviso.title'),
        '',
        'error',
        '',
        this.translateService.instant(
          'modals.moduloAdministracion.consultasBics.error.consulta'
        )
      );
      this.globals.loaderSubscripcion.next(false);
    }
  }

  resultRequest(result: any) {
    this.tabla = []
    this.tabla = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
      this.open(
        this.translateService.instant('mensaje.crearBuzon.aviso.title'),
        '',
        'info',
        '',
        this.translateService.instant(
          'modals.sinRegistro'
        )
      );
    }
  }

  loadPage() {

    const page = sessionStorage.getItem('gestionNotificacion');
    if (page) {
      this.page = JSON.parse(page);
      sessionStorage.removeItem('gestionNotificacion');
    }
  }
  savePage() {
    sessionStorage.setItem('gestionNotificacion', JSON.stringify(this.page));
  }

  onPageChanged(event: any) {
    var i = event.page-1
    if(i === -1){
      return
    }
    const name = this.searchForm.value.name;
    const ketTemp = this.searchForm.value.templateKey;
    if (name === '' && ketTemp === '') {
      this.gestionNotificacionesService.getNotification('', '', this.fillObjectPag(event.page - 1, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result)
          this.globals.loaderSubscripcion.emit(false);
        })
    } else {
      this.gestionNotificacionesService.getNotification(name ? name : '', ketTemp ? ketTemp : '', this.fillObjectPag(event.page - 1, this.rowsPorPagina)).then(
        (result: any) => {
          this.resultRequest(result)
          this.globals.loaderSubscripcion.emit(false);
        })
    }
  }

  async exportReport(): Promise<void> {
    try {
      await this.gestionNotificacionesService.exportNotify().then(
        async (result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);

          } else {
            this.openModalError(
              'Error',
              this.translateService.instant('EDA'),
              'error'
            );
            this.globals.loaderSubscripcion.emit(false);
          }

        }
      );
    } catch (e) {
      this.open(
        '',
        '',
        'error',
        '',
        this.translateService.instant('ED')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }
  cleanForm() {
    this.searchForm.reset();
  }
  openModalError(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code),
    });
  }
}
