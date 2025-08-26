import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { GestionLayoutsService } from 'src/app/services/geestion-layouts/gestion-layouts.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';

@Component({
    selector: 'app-gestion-layouts',
    templateUrl: './gestion-layouts.component.html',
    styleUrls: ['./gestion-layouts.component.css'],
})
export class GestionLayoutsComponent implements OnInit {
    //Pagination
    paginator: IPaginationRequest;
    page: number = 0;
    /** Variable para indicar el total de elementos  */
    totalElements: number = 0;
    /** Variable para indicar el total de elementos que se mostraran por pagina */
    rowsPerPage: number = 20;
    /** Variables para mostrar las vinetas de ultimo y primero */
    showBoundaryLinks: boolean = true;
    showDirectionLinks: boolean = true;

    banderaHasRows: boolean = false;
    formSaveLayout: FormGroup;
    formSearchLayout: FormGroup;
    showConfigProds = false;
    title = this.translateService.instant('adminlayouts.admin.cat');
    isModify = false;
    clickSuscliption: Subscription | undefined;
    origins: any = [];
    listConf: any = [];
    layouts: any = [];
    layoutsSelected: number[] = [];
    changedProducts: { idLay: number, idProd: number, config: boolean }[] = [];
    selectedLayout: { activo: string, extension: string, formArchSalida: string, id: string, nombre: string, origen: string };

    claveUsuario: string | null;
    origen: any = []
    perfilamiento: any;
    verEliminar: boolean = false;
    verEditar: boolean = false;
    verAgregar: boolean = false;
    verConfProd: boolean = false;
    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        public dialog: MatDialog,
        private serviceComun: ComunesService,
        private gestionLayoutsService: GestionLayoutsService,
        private globals: Globals,
        private fc: FuncionesComunesComponent,
        public perfila: PerfilamientoService,
    ) {
        this.inicio();
        this.claveUsuario = localStorage.getItem('UserID');
        this.paginator = {
            page: this.page,
            size: this.rowsPerPage,
            ruta: ''
        }
        this.origen = [
            {
                value: 'ECT ',
                descripcion: 'Estados de cuenta',
            },
            {
                value: 'CLT ',
                descripcion: 'Cliente',
            },
            {
                value: 'H2H ',
                descripcion: 'H2H',
            },
        ]

    }


    ngOnInit(): void {
        this.clickSuscliption = this.serviceComun.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 19) {
                this.initForms();
                this.showConfigProds = false;
                this.banderaHasRows = false;

            };
        });
    }

    async inicio() {
        /*this.perfilamiento = this.serviceComun.getSaveLocalStorage('perfilamiento');
                const usu = {
                    "usuario": this.perfilamiento.usuario,
                    "diferenciador": this.perfilamiento.diferenciador,
                    "perfil": this.perfilamiento.perfil,
                }
            
                const perfil = {
                  'perfilamientoUsuario': usu,
                  "url" : "/administracion/layouts/altaLayout.do",
                  "componente": "altaLayout"
                }
                const perfil2 = {
                  'perfilamientoUsuario': usu,
                  "url" : "/administracion/layouts/modificar.do",
                  "componente": "modificaLayouts"
                }
                const perfil3 = {
                  'perfilamientoUsuario': usu,
                  "url" : "/administracion/layouts/bajaLayouts.do",
                  "componente": "bajaLayouts"
                }
                const perfil4 = {
                    'perfilamientoUsuario': usu,
                    "url" : "/administracion/confProd/guardar.do",
                    "componente": "guardarProducto"
                  }

                try {
                    await this.perfila.accion(perfil).then(
                      async(result: any) => {
                    if(result.message === 'La operacion es valida'){*/
        this.verAgregar = true
        /*}
        await this.perfila.accion(perfil2).then( async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.verEditar = true
        /*}
        await this.perfila.accion(perfil3).then(async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.verEliminar = true
        /*}
        await this.perfila.accion(perfil4).then(async(result: any) => {
            if(result.message === 'La operacion es valida'){*/
        this.verConfProd = true
        /*}
        this.globals.loaderSubscripcion.emit(false);
      }
    )
  }
  )
}
)
}
)
}catch{
this.globals.loaderSubscripcion.emit(false);
this.open(this.translateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', '', 'error', '');
 
}*/
    }
    initForms(): void {
        this.formSaveLayout = this.fb.group({
            name: [''],
            origin: [''],
            active: [false],
            extension: [''],
            format: [''],
        });

        this.formSearchLayout = this.fb.group({
            nameSearch: [''],
        });
    }

    async getOrigins(idLayout: number) {
        try {
            this.origins = await this.gestionLayoutsService.getOriginCatalog(idLayout);
            this.globals.loaderSubscripcion.emit(false);
        } catch (error) {
            this.banderaHasRows = false;
            this.openGeneralError();
            this.globals.loaderSubscripcion.emit(false);
        }
    }

    async configProds(layout: any) {
        this.selectedLayout = layout;
        await this.getOrigins(+this.selectedLayout.id);
        this.title = this.translateService.instant(
            'administracion.config.prod.titulo'
        );
        this.showConfigProds = true;
    }

    saveConfigProds(): void {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('administracion.config.prod.guardar.titulo'),
                '',
                'confirm',
                '',
                this.translateService.instant('administracion.config.prod.guardar.conf')
            ),
            hasBackdrop: true
        }).afterClosed().subscribe((r) => {
            if (r === 'ok') {
                this.gestionLayoutsService.saveAvailableProducts({ listConf: this.changedProducts }).then((resp) => {
                    if (resp.codigo === 'OK00000') {
                        this.open(
                            this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                            this.translateService.instant(
                                'administracion.config.prod.guardar.exitoMensaje'
                            ),
                            '',
                            'info',
                            this.translateService.instant(
                                'administracion.config.prod.guardar.exitoCod'
                            )
                        );
                    } else if (resp.codigo === '500') {
                        this.openGeneralError();
                    }
                }).catch(() => {
                    this.openGeneralError();
                }).finally(() => {
                    this.globals.loaderSubscripcion.emit(false);
                });
            }
        });
    }

    back(): void {
        this.changedProducts = [];
        this.title = this.translateService.instant('adminlayouts.admin.cat');
        this.showConfigProds = false;
    }

    validateLayoutName(nameToValidate: string, isAdmon?: boolean): boolean {
        /** Variable para validar los caracteres en caso de eventos de copy paste en el nombre de layout  */
        let isValid = true;
        const regex_alfanumerico_special = /^[a-zA-ZÀ-ú0-9\u00d1& ]*$/g;
        if (!regex_alfanumerico_special.test(nameToValidate)) {
            isValid = false;
            this.open(
                this.translateService.instant('Error'),
                isAdmon ? this.translateService.instant('adminlayouts.error.caracteres') :
                    this.translateService.instant('adminlayouts.error.formato'),
                '',
                'error',
                this.translateService.instant('adminlayouts.error.codeVAL006')
            );
        }
        return isValid;
    }

    validateLayoutFormat(): boolean {
        let isValid = true;
        const regex_alfanumerico_special = /^[a-zA-ZÀ-ú0-9\u00d1,._]*$/g;
        if (!regex_alfanumerico_special.test(this.formSaveLayout.controls['format'].value)) {
            isValid = false;
            this.open(
                this.translateService.instant('Error'),
                this.translateService.instant('adminlayouts.error.formato.noValido'),
                '',
                'error',
                ''
            );
        }
        return isValid;
    }

    validationsSaveLayout(isModify?: boolean): void {
        switch (true) {
            case !this.formSaveLayout.get('name')?.value:
                this.open(
                    this.translateService.instant('Error'),
                    this.translateService.instant('adminlayouts.validacionVacio'),
                    '',
                    'error',
                    this.translateService.instant('modals.sucursales.alerta.campo.sucursal.vacio.VAL001Codigo')
                );
                break;
            case !this.validateLayoutName(this.formSaveLayout.controls['name'].value, true):
                break;
            case !this.validateLayoutFormat():
                break;
            default:
                this.saveLayout(isModify);
                break;
        }
    }

    saveLayout(isModify?: boolean): void {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                isModify
                    ? this.translateService.instant('adminlayouts.actualizarMsg')
                    : this.translateService.instant('adminlayouts.altaMsg'),
                '',
                'confirm',
                '',
                isModify
                    ? this.translateService.instant('adminlayouts.confirmUpdate')
                    : this.translateService.instant('adminlayouts.confirmAlta')
            ),
            hasBackdrop: true
        }).afterClosed().subscribe((r) => {
            if (r === 'ok') {
                isModify ? this.updateLayout() : this.saveNewLayout();
            }
        });
    }

    saveNewLayout() {
        const body = {
            nombre: this.formSaveLayout.controls['name'].value,
            origen: this.formSaveLayout.controls['origin'].value,
            bandActivo: this.formSaveLayout.controls['active'].value,
            extension: this.formSaveLayout.controls['extension'].value,
            formato: this.formSaveLayout.controls['format'].value
        }

        this.gestionLayoutsService.saveLayout(body).then((resp) => {
            if (resp.codigo === 'OK00000') {
                this.open(
                    this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                    this.translateService.instant('adminlayouts.exitoGuardar', {
                        layoutName: body.nombre,
                    }),
                    '',
                    'info',
                    ''
                ).afterClosed().subscribe(() => {
                    this.formSaveLayout.reset();
                    this.formSaveLayout.get('origin')?.setValue('');
                    this.isModify = false;
                    this.page = 0;
                    this.searchAll();
                });
            } else if (resp.codigo === 'LAYOUT0002') {
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translateService.instant('modals.Error'),
                        '',
                        'error',
                        this.translateService.instant('adminlayouts.error.codeLAYOUT0002'),
                        this.translateService.instant('adminlayouts.error.registro', {
                            layout: body.nombre,
                            extension: body.extension || ''
                        }),
                    ),
                });
            } else if (resp.codigo === '500') {
                this.openGeneralError();
            }
        }).catch(() => {
            this.openGeneralError();
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    updateLayout() {
        const body = {
            id: this.layoutsSelected[0],
            nombre: this.formSaveLayout.controls['name'].value,
            origen: this.formSaveLayout.controls['origin'].value,
            bandActivo: this.formSaveLayout.controls['active'].value,
            extension: this.formSaveLayout.controls['extension'].value,
            formato: this.formSaveLayout.controls['format'].value
        }

        this.gestionLayoutsService.updateLayout(body).then((resp) => {
            if (resp.codigo === 'OK00000') {
                this.open(
                    this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                    this.translateService.instant('adminlayouts.exitoModificar'),
                    '',
                    'info',
                    ''
                ).afterClosed().subscribe(() => {
                    this.formSaveLayout.reset();
                    this.formSaveLayout.get('origin')?.setValue('');
                    this.isModify = false;
                    this.page = 0;
                    this.searchAll();
                });
            } else if (resp.codigo === 'LAYOUT0003') {
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translateService.instant('modals.Error'),
                        '',
                        'error',
                        this.translateService.instant('adminlayouts.error.codeLAYOUT0003'),
                        this.translateService.instant('adminlayouts.error.origen', {
                            layout: body.nombre,
                            extension: body.extension
                        }),
                    ),
                });
            } else if (resp.codigo === '500') {
                this.openGeneralError();
            }
        }).catch(() => {
            this.openGeneralError();
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    searchLayouts($event?: any): void {
        if ($event) {
            this.layoutsSelected = [];
            this.page = 0;
        }

        !this.formSearchLayout.controls['nameSearch'].value ? this.searchAll() : this.searchByName();
    }

    limpiar() {
        this.initForms();
    }
    searchAll() {
        this.gestionLayoutsService.getAllLayouts(this.fillObjectPag(this.page, this.rowsPerPage)).then((resp => {
            if (resp.content.length > 0) {
                this.totalElements = resp.totalElements;
                this.layouts = resp.content;
                this.banderaHasRows = true;
            } else {
                this.banderaHasRows = false;
                this.open(
                    this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                    this.translateService.instant('administracion.general.nohaydatos'),
                    '',
                    'info',
                    ''
                );
            }
        })).catch(() => {
            this.banderaHasRows = false;
            this.openGeneralError();
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    searchByName() {
        if (!this.validateLayoutName(this.formSearchLayout.controls['nameSearch'].value)) {
            return;
        }

        const layoutName = this.formSearchLayout.controls['nameSearch'].value;
        this.gestionLayoutsService.getLayoutByName(layoutName.toUpperCase(), this.fillObjectPag(this.page, this.rowsPerPage)).then((resp => {
            if (resp.content.length > 0) {
                this.totalElements = resp.totalElements;
                this.layouts = resp.content;
                this.banderaHasRows = true;
            } else {
                this.banderaHasRows = false;
                this.open(
                    this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                    this.translateService.instant('administracion.general.nohaydatos'),
                    '',
                    'info',
                    ''
                );
            }
        })).catch(() => {
            this.openGeneralError();
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    async onPageChanged(event: any) {
        this.page = event.page - 1;
        this.searchLayouts();
    }

    private fillObjectPag(numPage: number, totalItemsPage: number) {
        this.paginator.page = numPage, this.paginator.size = totalItemsPage;
        return this.paginator;
    }

    confirmEreaseLayout(): void {
        if (!this.validLayoutsSelected()) return;

        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('adminlayouts.inactivarMsg'),
                '',
                'confirm',
                '',
                this.translateService.instant('adminlayouts.confirmBaja')
            ),
            hasBackdrop: true
        }).afterClosed().subscribe((r) => {
            if (r === 'ok') {
                this.gestionLayoutsService.deleteLayouts({ idsBaja: this.layoutsSelected }).then((resp) => {
                    if (resp.codigo === 'OK00000') {
                        this.open(
                            this.translateService.instant('mensaje.crearBuzon.aviso.title'),
                            this.translateService.instant('adminlayouts.inactivarMsgExito'),
                            '',
                            'info',
                            ''
                        ).afterClosed().subscribe(() => {
                            this.page = 0;
                            this.layoutsSelected = [];
                            this.searchAll();
                        });
                    } else if (resp.codigo === '500') {
                        this.openGeneralError();
                    }
                }).catch(() => {
                    this.openGeneralError();
                }).finally(() => {
                    this.globals.loaderSubscripcion.emit(false);
                });
            }
        });
    }

    eventItemSelected(event: any, idLayout: number): void {
        this.initForms();
        if (event.currentTarget.checked) {
            if (!this.layoutsSelected.includes(idLayout)) {
                this.layoutsSelected.push(idLayout);
            }
        } else {
            this.layoutsSelected = this.layoutsSelected.filter((value) => value !== idLayout);
        }
    }

    eventProductSelected(event: any, producto: any): void {
        (this.changedProducts.findIndex(p => p.idProd === producto.idLay) !== -1) ?
            this.changedProducts = this.changedProducts.filter((value) => value.idProd !== producto.idLay) :
            this.changedProducts.push({ idLay: +this.selectedLayout.id, idProd: producto.idLay, config: !producto.config });
    }

    async modifyLayout() {
        if (!this.validLayoutsSelected(true)) return;
        const layoutToModify = this.layouts.find(
            (l: { id: number; }) => +l.id === this.layoutsSelected[0]
        );

        this.formSaveLayout.patchValue({
            name: layoutToModify?.nombre,
            origin: layoutToModify?.origen,
            active: layoutToModify?.activo === 'A',
            extension: layoutToModify?.extension,
            format: layoutToModify?.formArchSalida,
        });

        this.isModify = true;
    }

    validLayoutsSelected(isModify?: boolean): boolean {
        if (this.layoutsSelected.length <= 0) {
            this.open(
                this.translateService.instant('modals.catalogoDin.alerta'),
                this.translateService.instant('adminlayouts.validacionBaja'),
                '',
                'alert',
                ''
            );
            return false;
        }
        if (isModify && this.layoutsSelected.length > 1) {
            this.open(
                this.translateService.instant('modals.catalogoDin.alerta'),
                this.translateService.instant('adminlayouts.validacionActual'),
                '',
                'alert',
                ''
            );
            return false;
        }
        return true;
    }

    export() {
        const body = {
            'nombre': this.formSearchLayout.controls['nameSearch'].value
        }
        this.gestionLayoutsService.getFile(body, this.claveUsuario).then((resp) => {
            this.fc.convertBase64ToDownloadFileInExport(resp);
        }).catch(() => {
            this.banderaHasRows = false;
            this.openGeneralError();
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    open(
        titulo: String,
        contenido: String,
        sugerencia: string,
        type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
        code?: string
    ) {
        return this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                titulo,
                sugerencia,
                type,
                code,
                contenido
            ),
            hasBackdrop: true
        });
    }

    openGeneralError() {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('modal.msjERRGEN0001Titulo'),
                this.translateService.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translateService.instant('modal.msjERRGEN0001Codigo'),
                this.translateService.instant('modal.msjERRGEN0001Sugerencia')
            ),
        });
    }
}
