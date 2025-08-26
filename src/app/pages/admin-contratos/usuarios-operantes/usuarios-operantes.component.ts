import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { UsuarioOperanteService } from 'src/app/services/admin-contratos/usuario-operantes.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';

@Component({
    selector: 'app-usuarios-operantes',
    templateUrl: './usuarios-operantes.component.html',
    styleUrls: ['./usuarios-operantes.component.css']
})
export class UsuariosOperantesComponent implements OnInit {
    paginator: IPaginationRequest;
    page: number = 0;
    /** Variable para indicar el total de elementos  */
    totalElements: number = 0;
    /** Variable para indicar el total de elementos que se mostraran por pagina */
    rowsPerPage: number = 30;
    /** Variables para mostrar las vinetas de ultimo y primero */
    showBoundaryLinks: boolean = true;
    showDirectionLinks: boolean = true;

    clickSuscliption: Subscription | undefined;
    dataContract: DatosCuentaBeanComponent;
    mostrarTablaCliente = false;
    mostrarTablaRoles = false;
    clienteSeleccionado: any;

    columnasTablaUsuarios: string[] = ['sel', 'codigoCliente', 'nombre', 'bloqueante', 'descripcion'];
    datosTablaUsuarios: any[] = [];
    returnedArray: any[] = [];
    columnasTablaRoles: string[] = ['sel', 'descripcionCatalogo'];
    datosTablaRoles: RolesElement[] = [];
    usuariosList: any = [];
    usuariosShowList: any = [];

    formAdmonUsuarios: FormGroup;
    formUsuario: FormGroup;
    perfSelected: any;
    ELEMENT_DATA_ROLES: RolesElement[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private comunes: ComunesService,
        public dialog: MatDialog,
        private serviceComun: ComunesService,
        private translateService: TranslateService,
        private globals: Globals,
        private usuarioOperanteService: UsuarioOperanteService,
        private fc: FuncionesComunesComponent,
    ) { }

    ngOnInit(): void {
        this.dataContract = this.comunes.datosContrato;
        let afterFirtsLoad = false;
        this.clickSuscliption = this.serviceComun.clickAtion.subscribe(async (resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 4) {
                this.initForms();
                if(!afterFirtsLoad){
                    afterFirtsLoad = true;
                    this.buscarClientes();
                    this.mostrarTablaCliente=true;
                }
            }
        });
    }

    ngAfterViewInit() {
        if (this.dataContract.descEstatus !== 'ACTIVO') {
            this.formAdmonUsuarios.disable();
            this.formUsuario.disable();
        } else {
            this.formAdmonUsuarios.enable();
            this.formAdmonUsuarios.controls['nombre'].disable();
            this.formUsuario.enable();
        }

        this.bloquear();
    }

    /**
        * @description Función para iniciar los dos forms a usar
    */
    initForms() {
        this.formAdmonUsuarios = this.formBuilder.group({
            bucCliente: ['', [Validators.required, Validators.minLength(8)]],
            bloqueado: [false, [Validators.required]],
            nombre: [{ value: '', disabled: true }],
            descripcion: [{ value: '', disabled: true }],
        });

        this.formUsuario = this.formBuilder.group({
            usuario: [''],
        });
    }

    /** Funcionalidad para apartado Administración de Usuarios */

    /**
        * @description Función para hablitar o deshabilitar el campo descripoción según el checkbox Bloqueado
    */
    bloquear() {
        !this.formAdmonUsuarios.get('bloqueado')?.value ?
            this.formAdmonUsuarios.get('descripcion')?.disable() :
            this.formAdmonUsuarios.get('descripcion')?.enable();
    }

    /**
        * @description Función para Registrar a un Usuario
    */
    registrarAdmonUsuarios() {
        if (this.formAdmonUsuarios.valid) {
            const modalConfirm = this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modal.parametros.confirmacion'),
                    '',
                    'confirm',
                    'CNF000',
                    this.translateService.instant('modal.parametros.confirmacion.pregunta')
                ),
            });
            modalConfirm.afterClosed().subscribe(async (r) => {
                if (r === 'ok') {
                    const body = {
                        'contrato': this.dataContract.numContrato,
                        'buc': this.formAdmonUsuarios.controls['bucCliente'].value,
                        'rol': '',
                        'nombreOp': this.formAdmonUsuarios.controls['nombre'].value,
                        'personalidad': ''              
                    }
                    try {
                        const responseS = await this.usuarioOperanteService.guardarUsuarioOperante(body) as { code: string };
                        if (responseS.code === 'ERRCLTA') {
                            this.dialog.open(ModalInfoComponent, {
                                data: new ModalInfoBeanComponents(
                                    this.translateService.instant('usuarioOperante.msjERR012Titulo'),
                                    '',
                                    'error',
                                    this.translateService.instant('usuarioOperante.msjERR012Codigo'),
                                    this.translateService.instant('usuarioOperante.msjERR012Observacion')
                                ),
                            });
                        }
                        this.globals.loaderSubscripcion.emit(false);
                    } catch (error) {
                        this.dialog.open(ModalInfoComponent, {
                            data: new ModalInfoBeanComponents(
                                this.translateService.instant('modal.msjERRGEN0001Titulo'),
                                this.translateService.instant('modal.msjERRGEN0001Observacion'),
                                'error',
                                this.translateService.instant('modal.msjERRGEN0001Codigo'),
                                this.translateService.instant('modal.msjERRGEN0001Sugerencia')
                            ),
                        });
                        this.globals.loaderSubscripcion.emit(false);
                    }
                }
            })

        } else {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modals.usuarioOperantes.infoIncompleta'),
                    this.translateService.instant('modals.usuarioOperantes.obligatorio'),
                    'alert',
                    this.translateService.instant('modals.usuarioOperantes.codigo'),
                    this.translateService.instant('modals.usuarioOperantes.campos'),
                ),
            });
        }
    }

    /**
        * @description Función para recuperar los datos del Código de cliente ingresado
    */
    recuperarDatosCodCliente() {
        if (this.formAdmonUsuarios.controls['bucCliente'].value.length === 8) {
            this.usuarioOperanteService.recuperarDatosDeBucODH1({ 'buc': String(this.formAdmonUsuarios.controls['bucCliente'].value) }).then((resp => {
                if (resp != null && resp.personalidad != "Party") {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents(
                            this.translateService.instant('modals.inexistente.usuarioOperantes.titulo.err003'),
                            this.translateService.instant('modals.inexistente.usuarioOperantes.descripcion.err003'),
                            'error',
                            this.translateService.instant('modals.inexistente.usuarioOperantes.codigo.err003'),
                            this.translateService.instant('modals.inexistente.usuarioOperantes.sugerencia.err003')
                        ),
                    });
                    return;
                }

                if (resp.buc) {
                    let name = resp.razonSocial + " " + resp.apellidoPaterno + " " + resp.apellidoMaterno;
                    this.formAdmonUsuarios.controls['nombre'].setValue(name);
                } else {
                    this.limpiarAdmonUsuarios();
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents(
                            this.translateService.instant('modals.inexistente.usuarioOperantes.titulo'),
                            this.translateService.instant('modals.inexistente.usuarioOperantes.descripcion'),
                            'error',
                            this.translateService.instant('modals.inexistente.usuarioOperantes.codigo'),
                            this.translateService.instant('modals.inexistente.usuarioOperantes.sugerencia')
                        ),
                    });
                }
            }))
                .catch(() => {
                    this.dialog.open(ModalInfoComponent, {
                        data: new ModalInfoBeanComponents(
                            this.translateService.instant('modal.msjERRGEN0001Titulo'),
                            this.translateService.instant('modal.msjERRGEN0001Observacion'),
                            'error',
                            this.translateService.instant('modal.msjERRGEN0001Codigo'),
                            this.translateService.instant('modal.msjERRGEN0001Sugerencia')
                        ),
                    });
                }).finally(() => {
                    this.globals.loaderSubscripcion.emit(false);
                });
        }
    }

    /**
        * @description Función para Limpiar el formulario de Administración de Usuarios
    */
    limpiarAdmonUsuarios() {
        this.formAdmonUsuarios.reset();
        this.formAdmonUsuarios.get('bucCliente')?.enable();
        this.bloquear();
    }

    /* Fin Funcionalidad para apartado Administración de Usuarios **/


    /** Funcionalidad para apartado Usuario a Consultar */

    /**
        * @description Función para buscar el codigo de cliente ingresado 
    */
    buscarUsuario() {
        let usr = this.formUsuario.controls['usuario'].value as string;
        if(usr.length < 8){
            usr = usr.padStart(8, '0');
            this.formUsuario.controls['usuario'].setValue(usr);
        }
        this.returnedArray = usr ? this.datosTablaUsuarios.filter((u) => u.buc === usr): this.datosTablaUsuarios;
        if(this.returnedArray.length <= 0){
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modals.noEfectuada.usuarioOperantes.titulo'),
                    this.translateService.instant('modals.noEfectuada.usuarioOperantes.descripcion'),
                    'info',
                    this.translateService.instant('modals.noEfectuada.usuarioOperantes.codigo'),
                    ''
                ),
            });
            this.mostrarTablaCliente = false;
            this.datosTablaRoles = [];
        }
    }

    /* Fin Funcionalidad para apartado Usuario a Consultar **/


    /** Funcionalidad para Tabla de Usuarios */

    /**
        * @description si el parámetro es verdadero quiere decir que se cargaran los datos con el 
        * código del cliente con el que se ingresó a la pantalla; si el parámetro esta 
        * vacío, entonces se buscará de acuerdo al campo Código de cliente al presionar la tecla TAB
        * @param buscarPorForm determina cual BUC se usará para la llamada al servicio
    */
    buscarClientes(campoForm?: number) {
        this.page = 0;
        if (campoForm && String(campoForm).length !== 8) return;

        this.clienteSeleccionado = null;
        const body = {
            'cuenta': this.dataContract.numContrato ? String(this.dataContract.numContrato) : String(campoForm),
            'buc': campoForm ? String(campoForm) : String(this.dataContract.bucCliente),
            'calidadParticipacion': '',
            'edoDeLaRelacion': '',
            'codigoDeRellamada': ''
        }
        this.usuarioOperanteService.consultaODH3(body).then((resp => {
            if (resp.content.length > 0) {
                this.totalElements = resp.totalElements;
                this.datosTablaUsuarios = resp.content;
                this.returnedArray = this.datosTablaUsuarios.slice(0, this.rowsPerPage)
                this.mostrarTablaCliente = true;

                this.obtenerElementoDeLista(this.datosTablaUsuarios, campoForm);

            } else {
                console.info('No se encontro informacion de usuarios operantes en el contrato');
            }
        })).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modal.msjERRGEN0001Titulo'),
                    this.translateService.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translateService.instant('modal.msjERRGEN0001Codigo'),
                    this.translateService.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() => {
            this.globals.loaderSubscripcion.emit(false);
        });
    }

    obtenerElementoDeLista(datosTablaUsuarios: any, campoForm?: number) {

        if (campoForm !== undefined || campoForm) {

            let listaUsuariosEncontrados = [];

            for (var datosUsuarios in datosTablaUsuarios) {

                if (datosTablaUsuarios[datosUsuarios].buc === campoForm) {

                    listaUsuariosEncontrados.push(datosTablaUsuarios[datosUsuarios]);

                }

            }

            if (listaUsuariosEncontrados.length > 0) {

                this.totalElements = listaUsuariosEncontrados.length;
                this.datosTablaUsuarios = listaUsuariosEncontrados;

            } else {

                this.mostarModalUsuarioNoEsOperante();

            }

        }

    }

    mostarModalUsuarioNoEsOperante() {

        this.mostrarTablaCliente = false;
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('modals.noEfectuada.usuarioOperantes.titulo'),
                this.translateService.instant('modals.noEfectuada.usuarioOperantes.descripcion'),
                'info',
                this.translateService.instant('modals.noEfectuada.usuarioOperantes.codigo'),
                ''
            ),
        });

    }

    /**
        * @description Función para mostrar mensaje en caso de no seleccionar registro en la tabla
    */
    enviarDatosForm(cliente: any) {
        this.clienteSeleccionado = cliente;
        this.formAdmonUsuarios.setValue({
            'bucCliente': this.clienteSeleccionado.buc,
            'bloqueado': this.clienteSeleccionado.bloqueado ? true : false,
            'nombre': this.clienteSeleccionado.nombreCliente,
            'descripcion': this.clienteSeleccionado.descripcion,
        });
        this.formAdmonUsuarios.get('bucCliente')?.disable();
        this.formAdmonUsuarios.get('bloqueado')?.value ? this.formAdmonUsuarios.get('descripcion')?.enable(): this.formAdmonUsuarios.get('descripcion')?.disable();
    }

    /**
        * @description Función para mostrar mensaje en caso de no seleccionar registro en la tabla
    */
    verificarClienteSeleccionado(): boolean {
        let estaSeleccionado = true;
        if (!this.clienteSeleccionado) {
            estaSeleccionado = false;
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modals.noSeleccion.usuarioOperantes.titulo'),
                    this.translateService.instant('modals.noSeleccion.usuarioOperantes.descripcion'),
                    'alert',
                    this.translateService.instant('modals.noSeleccion.usuarioOperantes.codigo'),
                    this.translateService.instant('modals.noSeleccion.usuarioOperantes.sugerencia'),
                ),
            });
        }

        return estaSeleccionado;
    }

    /**
        * @description Función para llamar a servicio y eliminar el cliente seleccionado
    */
    eliminarRegistro() {
        if (this.verificarClienteSeleccionado()) {
            const deleteAsk = this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modal.msjERRGEN0001Titulo'),
                    this.translateService.instant('modal.msjERRGEN0001Observacion'),
                    'confirm',
                    this.translateService.instant('modal.msjERRGEN0001Codigo'),
                    this.translateService.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
            deleteAsk.afterClosed().subscribe((t) => {
                if(t == 'ok'){
                    this.deleteUser();
                }
            })
           
        }
    }

    async deleteUser(): Promise<void> {
        const body = {
            'contrato': this.dataContract.numContrato,
            'buc': this.clienteSeleccionado.buc,
            'id': this.clienteSeleccionado.id,
            'idMotivoBaja': '',
            'bloqueado': this.clienteSeleccionado.bloqueado ? true : false,
            'rol': '',
            'descripcion': this.clienteSeleccionado.descripcion,
            'nombreOp': this.formAdmonUsuarios.controls['nombre'].value,
            'personalidad': '',
        }

        try {
            const respoDelete = await this.usuarioOperanteService.eliminarUsuarioOperante(body);
            
            if(respoDelete.error == "200"){
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translateService.instant('notificaciones.contrato.msjINF006Titulo'),
                        '',
                        'info',
                        'INF006',
                        this.translateService.instant('notificaciones.tracking.msjINF006Observacion')
                    ),
                });
                this.buscarClientes(); 
            }else{
                this.generalErrorMsg();
            }
            
        } catch (error) {
            this.generalErrorMsg();
           
        }
    }

    generalErrorMsg(): void{
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('modal.msjERRGEN0001Titulo'),
                this.translateService.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translateService.instant('modal.msjERRGEN0001Codigo'),
                this.translateService.instant('modal.msjERRGEN0001Sugerencia')
            ),
        });
        this.globals.loaderSubscripcion.emit(false)
    }
    /**
        * @description Función para llamar a servicio y modificar el cliente seleccionado
    */
    modificarRegistro() {
        if (this.verificarClienteSeleccionado()) {
            const body = {
                'contrato': this.formAdmonUsuarios.controls['bucCliente'].value,
                'buc': this.clienteSeleccionado.buc,
                'id': this.clienteSeleccionado.id,
                'bloqueado': this.formAdmonUsuarios.controls['bloqueado'].value,
                'rol': this.clienteSeleccionado.rol ? this.clienteSeleccionado.rol: '' ,
                'descripcion': this.formAdmonUsuarios.controls['descripcion'].value,
                'nombreOp': this.formAdmonUsuarios.controls['nombre'].value,
                'personalidad': '',
            }
            const openConfirm = this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translateService.instant('modals.parametros.confirmacion'),
                    '',
                    'confirm',
                    '',
                    this.translateService.instant('modal.parametros.confirmacion.pregunta')
                ),
            })
            openConfirm.afterClosed().subscribe(async (r) => {
                if(r === 'ok'){
                    await this.modifyUserOpe(body);
                }
            })
        }
    }

    /**
        * @description Función para mostrar la tabla de los perfiles
    */
    async editarPerfilRegistro(): Promise<void> {
        if (this.verificarClienteSeleccionado()) {
            try {
                const getRoles = await this.usuarioOperanteService.getRolPerfil({buc: this.clienteSeleccionado.buc, contrato: this.dataContract.numContrato}) as [];
                if(getRoles.length > 0){
                    this.datosTablaRoles = getRoles;
                }
                this.globals.loaderSubscripcion.emit(false)
            } catch (error) {
                this.globals.loaderSubscripcion.emit(false)
            }
            this.mostrarTablaCliente = false;
            this.mostrarTablaRoles = true;
        }
    }

    onPageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.datosTablaUsuarios.slice(startItem, endItem);

    }

    showResultQuery(datosTablaUsuarios: any, inicio: boolean) {

        this.usuariosList = datosTablaUsuarios;

        if (inicio) {

            this.page = 0;
            this.usuariosShowList = this.usuariosList ? this.usuariosList.slice(0, this.rowsPerPage) : [];

        } else {

            const startItem = (this.page - 1) * this.rowsPerPage;
            const endItem = this.page * this.rowsPerPage;
            this.usuariosShowList = this.usuariosList.slice(startItem, endItem);

        }

    }

    regresar() {
        this.mostrarTablaCliente = true;
        this.mostrarTablaRoles = false;
    }

    async getReport(): Promise<void>{
        try {
            
            const getRep = await this.usuarioOperanteService.exportReport({buc: this.dataContract.bucCliente,cuenta: this.dataContract.numContrato});
            if (getRep.data) {
                /** Se manda la informacion para realizar la descarga del archivo */
                this.fc.convertBase64ToDownloadFileInExport(getRep);
                this.globals.loaderSubscripcion.emit(false);
            }

            this.globals.loaderSubscripcion.emit(false);
        } catch (error) {
            this.globals.loaderSubscripcion.emit(false);
        }
    }

    async getReportPerfil(): Promise<void>{
        try {
            const getRepPerf = await this.usuarioOperanteService.exportReportPerfil({buc: this.dataContract.bucCliente, contrato: this.dataContract.numContrato,
                bucOp:this.clienteSeleccionado.buc,nombreOp:this.clienteSeleccionado.nombreCliente });
            if (getRepPerf.data) {
                /** Se manda la informacion para realizar la descarga del archivo */
                this.fc.convertBase64ToDownloadFileInExport(getRepPerf);
                this.globals.loaderSubscripcion.emit(false);
            }
        } catch (error) {
            this.globals.loaderSubscripcion.emit(false);
        }
    }

    async modifyUserOpe(request: any): Promise<void>{
        try {
            const respModify = await this.usuarioOperanteService.modificarUsuarioOperante(request);
            if(respModify){
                this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                        this.translateService.instant('parametros.contrato.msjINF004Titulo'),
                        this.translateService.instant('parametros.contrato.msjINF004Observacion'),
                        'info',
                        '',
                        ''
                    ),
                });
            }
            this.globals.loaderSubscripcion.emit(false);
        } catch (error) {
            this.globals.loaderSubscripcion.emit(false);
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

    savePerrfil(): void{
        const openConfirmSavePerf = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('modals.parametros.confirmacion'),
                '',
                'confirm',
                '',
                this.translateService.instant('modal.parametros.confirmacion.pregunta')
            ),
        });

        openConfirmSavePerf.afterClosed().subscribe(async (o) => {
            if (o === 'ok') {
                try {
                    const rq = {
                            "buc": this.clienteSeleccionado.buc as string,
                            "contrato": this.dataContract.numContrato as string,
                            "roles":[this.perfSelected.valor] as string[]
                    }
                    const savePerf = await this.usuarioOperanteService.editOperantUser(rq);
                    console.info(savePerf);
                    if(savePerf){
                        console.log('ok -' +savePerf.codError + '-'+ (savePerf.codError=='OK002')+'-'+(savePerf.codError=='OK001'));
                        if( savePerf.codError=='OK001' || savePerf.codError=='OK002'){
                          this.dialog.open(ModalInfoComponent, {
                            data: new ModalInfoBeanComponents(
                                this.translateService.instant('usuarioOperantes.guardarPerfilTitle'),
                                this.translateService.instant('usuarioOperantes.guardarPerfilObservación'),
                                'info',
                                '',
                                ''
                            ),
                          });
                        }else{
                            this.dialog.open(ModalInfoComponent, {
                                data: new ModalInfoBeanComponents(
                                    this.translateService.instant('notificaciones.contrato.msjINF006Titulo'),
                                    '',
                                    'error',
                                    'ERR01',
                                    'Error al realiza la modificacion del perfil'
                                ),
                            });
                        }
                        this.globals.loaderSubscripcion.emit(false)
                    }else{
                        this.generalErrorMsg();
                        
                    }
                } catch (error) {
                   
                    this.generalErrorMsg();
                }
            }
        });
    }


    optionPerfilSelected(elementSelected: any): void{
        this.perfSelected = elementSelected;
    }
    /** Fin Funcionalidad para Tabla de Usuarios */

}

export interface RolesElement {
    "idCatalogo": string,
    "descripcionCatalogo": string,
    "estatusActivo": string,
    "estatusFinal": string,
    "valor": string
}