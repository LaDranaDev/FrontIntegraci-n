import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EsquemaComisionesService } from 'src/app/services/admin-contratos/esquema-comisiones.service';
import { LimpiaBusquedaService } from 'src/app/services/limpia-busqueda.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { Subscription, throwError } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { isDate } from 'date-fns';
import { ModalConfirmacionOkCancelComponent } from 'src/app/components/modals/modal-confirmacion-ok-cancel/modal-confirmacion-ok-cancel.component';

@Component({
    selector: 'app-esquema-de-comisiones',
    templateUrl: './esquema-de-comisiones.component.html',
    styleUrls: ['./esquema-de-comisiones.component.css']
})

export class EsquemaDeComisionesComponent implements OnInit {
    public activeLang = 'es';
    longitud: number = 6;
    banderaContrato: boolean = true;
    numContrato: string = '';
    criteriosComunes: any[] = [];
    rangos: any[] = [];
    configuracionesAnuales: any[] = [];
    rangosEspeciales: any[] = [];
    rangosComunes: any[] = [];
    divisas: any[] = [];
    especiales: any[] = [];
    criteriosEspeciales: any[] = [];
    divisasPrecios: any[] = [];
    productos: any[] = [];
    itemsRangos: any[] = [];
    itemsDivisas: any[] = [];
    esquemaForm: any;
    formEsquemaDivisas: any;
    clickSuscliption: Subscription | undefined;
    datos = {
        numContrato: '',
        bucCliente: '',
        descEstatus: '',
        nombreCompleto: '',
        personalidad: '',
        cuentaEje: '',
        idContrato: '',
        razonSocial: '',
    };
    configAnualidad: boolean = false;
    banderaHasRows: boolean = false;
    formConfigAnualidad: FormGroup;
    idCodigoCntr: string = '';
    subscriptions: Subscription[] = [];
    cobranzaId = '';
    cobroComisionId = '';
    productoPivote = '';
    usuarioActual: string | null = "";
    initConfig = true;
    itemSaved: any;

    constructor(
        private globals: Globals,
        public translate: TranslateService,
        private fb: FormBuilder,
        private service: EsquemaComisionesService,
        private limpiaBusqueda: LimpiaBusquedaService,
        private fc: FuncionesComunesComponent,
        public dialog: MatDialog,
        private comunService: ComunesService
    ) {
        //this.translate.setDefaultLang(this.activeLang);
        this.usuarioActual = JSON.parse((localStorage.getItem('perfilamiento') as string)).usuario;
    }

    ngOnInit(): void {
        this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
            const { codeMenu } = resp;
            if (codeMenu === 13) {
                this.configAnualidad = false;
                this.datos = this.comunService.datosContrato;
                this.idCodigoCntr = this.datos.idContrato;
                this.numContrato = this.datos.numContrato;
                this.initForms();
                this.catalogos();
                this.configuracionEsquema();
                this.banderaContrato = false;
            }
        });
    }

    ngOnDestroy() {
        this.clickSuscliption?.unsubscribe();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    initForms() {
        this.esquemaForm = new FormGroup({
            esquema: new FormArray([])
        });

        this.formEsquemaDivisas = new FormGroup({
            divisa: new FormArray([])
        });

        this.formConfigAnualidad = this.fb.group({
            formArrayConfigAnualidad: this.fb.array([])
        });
    }

    guardaForms() {

        const dialogo = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('modals.catalogoDin.confirmacion'),
                this.translate.instant('esquemaDefault.advertencia'),
                'confirm',
                this.translate.instant('esquemaComisiones.msjWAR006Codigo'),
                this.translate.instant('esquemaComisiones.msjWAR006Observacion')
            ), 
            hasBackdrop: true
        });
        dialogo.afterClosed().subscribe(result => {
            if(result === 'ok'){
                let esquema = this.esquemaForm.value.esquema;
                let divisas = this.formEsquemaDivisas.value.divisa;
                let request: any = [];
                let requestDivisas: any = [];
                let rangosRequest: any = [];
                let rangosEditados = new Array(esquema.length);
                let rangosEditadosDivisas = new Array(divisas.length);
                let numeroElementos = esquema.length;
                let numeroElementosDivisas = divisas.length;
        
                /*Esquemas */
                for (let i = 0; i < numeroElementos; i++) {
                    rangosEditados[i] = [];
                    for (let j = 0; j < esquema[i].rangos.length; j++) {
                        const { posicion, precio = null, valor = null } = esquema[i].rangos[j];
                        if (precio != null && valor != null) {
                            rangosEditados[i].push({ posicion: posicion, precio, valor });
                        }
                    }
                }
        
                for (let index = 0; index < numeroElementos; index++) {
                    const { idProductoContrato, idCriterio, idRango, rangos } = esquema[index];
                    request.push({ idProductoContrato, idCriterio, idRango, rangos: rangosEditados[index] })
                }
                /**Divisas */
                for (let i = 0; i < numeroElementosDivisas; i++) {
                    rangosEditadosDivisas[i] = [];
                    for (let j = 0; j < divisas[i].rangos.length; j++) {
                        let { posicion, precio = '', valor = -1, enabled } = divisas[i].rangos[j];
                        if (!enabled.value) {
                            rangosEditadosDivisas[i].push({ posicion: j + 1, precio, valor });
                        }
                    }
                }

                let div: any[] = [];
                for (let i = 0; i < numeroElementosDivisas; i++) {
                    div.push({montoMxp:divisas[i].montoMxp, montoUsd:divisas[i].montoUsd});
                }

                for (let index = 0; index < numeroElementosDivisas; index++) {
                    const { idProductoContrato, idCriterio, idRango, rangos } = divisas[index];
                    requestDivisas.push({ idProductoContrato, idCriterio, idRango, rangos: rangosEditadosDivisas[index] })
                }

                let resultado = [...request];
                let guardar: boolean = false;
                let u: any[] = [];
                for (let i = 0; i < resultado.length; i++) {
                    for (let j = 0; j < resultado[i].rangos.length; j++) {
                        u.push({ precio: resultado[i].rangos[j].precio, valor: resultado[i].rangos[j].valor })
                    }
                }

                let o = u.findIndex(item => item.precio == '' || item.valor == '');
                let d = div.findIndex(item => item.montoMxp === '' || item.montoUsd === '');

                resultado.forEach((producto, ind) => {
                    producto.idProdCntrPc = producto.idProductoContrato;
                    producto.sinLimiteRango = producto.idRango;
                    producto.criterioCom = producto.idCriterio;
                    //fix to add one position
                    producto.rangos = producto.rangos.map((t: any, i: number) => {
                        if(producto.idRango > 0 && ind != 0){
                            t.posicion = t.posicion + 1
                        }
                        return t
                    });
                });
        
                const archivos = this.formEsquemaDivisas.get('divisa').controls?.map((archivo: any) => <any>{
                    idCntr: this.datos.idContrato,
                    idCriterio: archivo.value.idCriterio,
                    idProdCntr: archivo.value.idProductoContrato,
                    montoMxp: archivo.value.montoMxp,
                    montoUsd: archivo.value.montoUsd,
                    numDivisas: archivo.value.numDivisas
                });
        
                const datos = {
                    esquema: resultado,
                    archivos: archivos
                };
        
                (o < 0 && d < 0) ? this.guardaEsquema(this.numContrato, datos) : this.openMsg('Info', 'Debe ingresar al menos un limite por cada producto si deja los valores vacios de Comisión H2H.', 'info');
            }
        });
    }

    contrato($event: any) {
        this.itemsRangos = [];
        this.itemsDivisas = [];
        this.rangos = [];
        (this.esquemaForm.get('esquema') as FormArray).clear();
        (this.formEsquemaDivisas.get('divisa') as FormArray).clear()
        if ($event != '') {
            const { numContrato } = $event
            this.numContrato = numContrato;
            if (numContrato != 'undefined' || this.numContrato.length > 0) {
                this.catalogos();
                this.configuracionEsquema();
                this.banderaContrato = false;
            } else {
                this.banderaContrato = true;
            }
        }
    }

    rangosPrecios() {
        this.itemsRangos = [];
        this.rangos = [{ id: 0, descripcion: 'Rango' }];
        const items = 10;
        for (let index = 1; index <= items; index++) {
            this.itemsRangos.push({ titulo: 'Rango ' + index }, { titulo: 'Precio' })
            this.rangos.push({ id: index, descripcion: 'Rango ' + index });
        }
    }

    catalogos() {
        this.service.catalogos().then((result: any) => {
            this.criteriosComunes = result.criteriosComunes.filter((i: any) => i.idCatalogo < 5);
            this.criteriosEspeciales = result.criteriosComunes.filter((i: any) => i.idCatalogo > 4);

            this.divisas = result.divisas;
            this.divisasTitulo(this.divisas);

            this.rangosPrecios();
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    divisasTitulo(items: any) {
        for (let index = 1; index < items.length; index++) {
            this.itemsDivisas.push({ titulo: 'Divisa ' + index }, { titulo: 'Precio' });
        }
    }

    cambiaDivisa(e: any, producto: any, idxProducto: any) {
        (this.formEsquemaDivisas.get('divisa') as FormArray).clear()
        const opcionDivisa = e.target.value;
        const nuevaDivisa = this.fc.copiarArreglo(producto);

        for (let i = 0; i < nuevaDivisa.length; i++) {
            nuevaDivisa[i].enabled = (opcionDivisa != nuevaDivisa[i].id && opcionDivisa != 0) ? true : false;
        }
        this.especiales[idxProducto].idRango = opcionDivisa;
        this.especiales[idxProducto].rangos = nuevaDivisa;

        for (let index = 0; index < this.especiales.length; index++) {
            this.obtenerItemCriteriosEspeciales(this.especiales[index]);
        }
    }

    cambiaCriterio(e: any, criterios: any, idxProducto: any) {

        let formDivisas = this.formEsquemaDivisas.get('divisa').value;
        const opcionCriterio = e.target.value;

        for (let i = 0; i < formDivisas.length; i++) {
            formDivisas[i].idRango = 0;
            for (let j = 0; j < formDivisas[i].rangos.length; j++) {
                formDivisas[i].rangos[j].enabled = formDivisas[i].rangos[j].enabled.value
                formDivisas[i].rangos[j].clave = this.especiales[i].rangos[j].clave;
            }
        }

        formDivisas[idxProducto].idRango = 0;
        if (opcionCriterio == 6) {//por archivo generado
            formDivisas[idxProducto].habilitarCriterio = true;
            for (let j = 0; j < formDivisas[idxProducto].rangos.length; j++) {
                formDivisas[idxProducto].rangos[j].precio = '';
                formDivisas[idxProducto].rangos[j].enabled = (this.especiales[idxProducto].rangos[j].id == 1) ? false : true;
                formDivisas[idxProducto].rangos[j].clave = this.especiales[idxProducto].rangos[j].clave;
            }

        } else {
            formDivisas[idxProducto].habilitarCriterio = false;
            for (let j = 0; j < formDivisas[idxProducto].rangos.length; j++) {
                formDivisas[idxProducto].rangos[j].precio = '';
                formDivisas[idxProducto].rangos[j].enabled = false;
                formDivisas[idxProducto].rangos[j].clave = this.especiales[idxProducto].rangos[j].clave;
            }

        }

        (this.formEsquemaDivisas.get('divisa') as FormArray).clear()
        for (let i = 0; i < formDivisas.length; i++) {
            this.obtenerItemCriteriosEspeciales(formDivisas[i]);
        }

    }

    configuracionEsquema() {
        this.service.configuracioneEsquema(this.numContrato).then((result: any) => {
            this.cobranzaId = result?.cobranzaID;
            this.cobroComisionId = result?.cobroComisionID;
            this.productoPivote = result?.productoPivote;
            result?.esquema?.forEach((producto: any) => {
                producto.idProducto = producto.producto;
                producto.idProductoContrato = producto.idProdCntrPc;
                producto.nombreProducto = producto.descProducto;
                producto.idRango = producto.producto === 8 ? parseInt(producto.bandSinLimite) : producto.sinLimiteRango || 0;
                producto.idCriterio = producto.criterioCom;
                (producto.rangos || []).forEach((rango: any, idx: number) => {
                    rango.posicion = idx
                }
                );
            });
            const productos: any[] = result?.esquema?.filter(
                (p: any) => p.idProducto != this.cobranzaId && p.idProducto != this.cobroComisionId
            );
            const especiales: any[] = result?.esquema?.filter(
                (p: any) => p.idProducto == this.cobranzaId || p.idProducto == this.cobroComisionId
            );
            let numeroProductos = productos.length;
            let rangosEditados = new Array(numeroProductos);
            this.productos = productos;
            const rangos = this.rangos.filter(r => r.id > 0);
            for (let i = 0; i < numeroProductos; i++) {
                rangosEditados[i] = new Array(10);
                for (let j = 0; j < rangos.length; j++) {
                    let idProd = (productos[i].idProducto == 8 && productos[i].idRango == 0) ? rangos[j].id : rangos[j].id;
                    rangosEditados[i][j] = {
                        id: idProd,
                        // was added to match ids rangosInfo and rangosEditados
                        idToCompare: (productos[i].rangos[j].posicion + 1) + '_' + productos[i].idProductoContrato,
                        posicion: (productos[i].idProducto == 8 && productos[i].idRango == 0) ? j : j,
                        precio: null,
                        valor: null,
                        descripcion: 'Rango ' + (productos[i].idProducto == 8 && productos[i].idRango == 0) ? j : j,
                        bloquear: false
                    };
                }
            }

            let rangosInfo = [];
            for (let i = 0; i < numeroProductos; i++) {
                if (productos[i].rangos.length > 0) {
                    for (let j = 0; j < productos[i].rangos.length; j++) {
                        const rg = {
                            id: (productos[i].rangos[j].posicion + 1) + '_' + productos[i].idProductoContrato,
                            posicion: productos[i].rangos[j].posicion,
                            precio: productos[i].rangos[j].precio,
                            valor: productos[i].rangos[j].valor,
                            descripcion: null,
                            bloquear: false
                        }

                        rangosInfo.push(rg)
                    }
                }
            }

            let id: any;
            let precio: any;
            let valor: any;
            for (let k = 0; k < rangosInfo.length; k++) {
                id = rangosInfo[k].id;
                precio = rangosInfo[k].precio;
                valor = rangosInfo[k].valor;
                for (let i = 0; i < rangosEditados.length; i++) {
                    //here compare ids and assing values and prices
                    const rg = rangosEditados[i].find((t: { idToCompare: string; }) => t.idToCompare === id);
                    if (rg) {
                        rg.valor = valor;
                        rg.precio = precio;
                    }
                }
            }
            //this.productos = productos;
            this.especiales = especiales;
            const divisas = [... this.divisas];


            /** Rangos Divisas */
            const arr: string[] = divisas;
            arr.shift()
            const itemsDivisas = divisas.map((val: any) => {
                return { id: val.id, idRango: '', clave: val.clave, precio: '', enabled: false, habilitarCriterio: false }
            });

            /******************
             * Comunes
             *****************/
            let findH2H: any;
            findH2H = productos.findIndex((x: any) => x.idProducto == 8);

            for (let i = 0; i < productos.length; i++) {
                const { idProductoContrato, nombreProducto, idRango, idCriterio, rangos, idProducto } = productos[i];
                productos[i].deshabilitaSinL = false;
                productos[i].rangos = rangosEditados[i];
                productos[i].idCriterio = (idCriterio == null) ? 1 : idCriterio;
            }

            if (findH2H >= 0) {
                this.bloqueoTodosH2H();
                for (let i = 0; i < rangosEditados.length; i++) {
                    this.obtenerItemCriteriosComunes(productos[i])
                }
            } else {
                this.bloqueoTodos();
                for (let i = 0; i < productos.length; i++) {
                    this.obtenerItemCriteriosComunes(productos[i])
                }
            }
            /********************* 
             * Especiales 
             * ******************/
            const archivos: any = {};
            result?.archivos?.forEach((archivo: any) =>
                archivos[archivo.idProdCntr] = archivo
            );

            for (let i = 0; i < especiales.length; i++) {
                especiales[i].divisas = itemsDivisas;
                const { idRango, idCriterio, divisas, rangos, criterios } = especiales[i];
                //this.criteriosEspeciales = criterios;
                this.especiales[i].idCriterio = (idCriterio == null) ? criterios[0].id : idCriterio;

                for (let e = 0; e < rangos.length; e++) {
                    for (let t = 0; t < divisas.length; t++) {
                        if (divisas[t].id == rangos[e].posicion) {
                            divisas[t].idRango = rangos[e].id;
                            divisas[t].precio = rangos[e].precio || 0;
                        }
                    }
                }
                this.especiales[i].rangos = divisas;

                const idProdCntr = this.especiales[i].idProductoContrato;
                this.especiales[i].archivo = archivos[idProdCntr] || {
                    idCntr: this.datos.idContrato,
                    idProdCntr: idProdCntr,
                    idCriterio: this.criteriosEspeciales[0]?.idCatalogo,
                    montoMxp: 0,
                    montoUsd: 0,
                    numDivisas: 0
                }
                this.obtenerItemCriteriosEspeciales(this.especiales[i]);
            }
        }).catch(e => {
            console.log(e);
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );

    }

    obtenerItemCriteriosEspeciales(item: any) {
        this.formEsquemaDivisas.get('divisa').push(new FormGroup(
            {
                idProducto: new FormControl(item.idProducto),
                nombreProducto: new FormControl(item.nombreProducto),
                idProductoContrato: new FormControl(item.idProductoContrato),
                idRango: new FormControl({ value: item.idRango, disabled: item.habilitarCriterio }),
                rangos: new FormArray(this.loadRangosDivisas(item.rangos)),
                idCriterio: new FormControl(item.archivo.idCriterio),
                montoMxp: new FormControl(item.archivo.montoMxp),
                montoUsd: new FormControl(item.archivo.montoUsd),
                numDivisas: new FormControl(item.archivo.numDivisas),
            }
        ))
    }

    obtenerItemCriteriosComunes(item: any) {
        this.esquemaForm.get('esquema').push(new FormGroup(
            {
                deshabilitaSinL: new FormControl(item.deshabilitaSinL),
                idProducto: new FormControl(item.idProducto),
                idProductoContrato: new FormControl(item.idProductoContrato),
                nombreProducto: new FormControl(item.nombreProducto),
                idCriterio: new FormControl(item.idCriterio),
                idRango: new FormControl(Number(item.idRango)),
                rangos: new FormArray(this.loadRangos(item.rangos))
            }
        ))
    }

    loadRangos(item: any) {
        let controls = [];
        for (let i = 0; i < item.length; i++) {
            controls.push(new FormGroup({
                precio: new FormControl({ value: item[i].precio, disabled: item[i].bloquear }),
                valor: new FormControl({ value: item[i].valor, disabled: item[i].bloquear }),
                bloquear: new FormControl(item[i].bloquear),
                descripcion: new FormControl(item[i].descripcion),
                id: new FormControl(item[i].id),
                posicion: new FormControl(item[i].posicion),
            }))
        }
        return controls;
    }

    loadRangosDivisas(item: any) {
        let controls = [];
        for (let i in item) {
            controls.push(new FormGroup({
                precio: new FormControl({ value: item[i].precio, disabled: item[i].enabled }),
                clave: new FormControl({ value: item[i].clave, disabled: true }),
                enabled: new FormControl({ value: item[i].enabled }),
            }))
        }
        return controls;
    }

    track(item: any, index: number) {
        return index;
    }

    bloqueoRangos(item: any) {
        const { rangos, idProductoContrato: idProductoContratoV, idRango: nuevoIdRango, idProducto, idCriterio } = item.value;
        let idx = this.productos.findIndex((item: any) => item.idProductoContrato == idProductoContratoV);
        //this valitadion is to set value rango = 0 if firts item rango is > 0 (property disabled not work)
        if (this.productos[0].idRango > 0 && this.productos[0].idProducto != idProducto) {
            this.productos[idx].idRango = 0;
            this.esquemaForm.get('esquema').value[idx].idRango = '0';
            const inputValue: any = document.getElementById(`idRangoComun${idProducto}`);
            inputValue.value = '0';
            return;
        }
        //save values entered by user beacuse formGroup will it cleaned
        const saveEsquema = this.esquemaForm.get('esquema').value
        this.productos = saveEsquema;
        (this.esquemaForm.get('esquema') as FormArray).clear();
        //save value configurated here, because formGroup never saved, and assign value here this.productos[idx] = item.value
        this.productos[idx] = item.value;
        this.productos[idx].idRango = Number(nuevoIdRango);
        if (idProducto == 8 && nuevoIdRango > 0) {
            this.bloqueoTodosH2H();
            for (let i = 0; i < this.productos.length; i++) {
                this.obtenerItemCriteriosComunes(this.productos[i])
            }
        } else {
            /** Se valida si tiene h2h **/
            let findH2H: any;
            findH2H = this.productos.findIndex((x: any) => x.idProducto == 8);
            if (findH2H >= 0) {
                this.bloqueoGeneralH2H(item, idx);
            } else {
                this.bloqueoGeneral(item, idx);
            }
            /** Se obtienen criterios **/
            for (let i = 0; i < this.productos.length; i++) {
                this.obtenerItemCriteriosComunes(this.productos[i]);
            }
        }
    }

    habilitaRangos(value: any, producto: any, isFromPrice?: boolean) {
        /** Se obtiene indice por idProducto **/
        const { idProductoContrato: idProductoContratoV } = producto.value;
        let idx = this.productos.findIndex(
            (item: any) => item.idProductoContrato == idProductoContratoV
        );
        /** Se valida posicion y valor **/
        if (idx == 0 && (value != null && value != '' && value != undefined && value > 0) && producto.value.idRango == '0') {
            /** Se habilitan todos los rangos 1 **/
             /** filterSchemeRange VALIDATE IF ANY PRODUCT SCHEME DIFFERENT IDX 0 HAS  idRango > 0**/
            const filterSchemeRange = (this.esquemaForm.get('esquema').value as any[]).filter((p) => p.idRango > 0);
            for (let i = 1; i < this.productos.length; i++) {
                try {
                const l = filterSchemeRange.find((g) => g.idProducto === this.productos[i].idProducto)?.rangos
                this.productos[i].rangos = l ? l : this.productos[i].rangos
                /** Se inicializa rango por default **/
                if(this.productos[i].idRango <=0){
                    this.productos[i].idRango = '1';
                    for (let j = 0; j < this.productos[i].rangos.length; j++) {
                        /** Se limpian rangos **/
                        if (j == 0) {
                            this.productos[i].rangos[j].bloquear = false;
                            this.productos[i].rangos[j].valor = -1;
                        } else {
                            this.productos[i].rangos[j].bloquear = true;
                        }
                        //Validate if price has value and it doesn't bloqued else set price ''
                        this.productos[i].rangos[j].precio = this.productos[i].rangos[j].bloquear ? '' : this.productos[i].rangos[j].precio ? this.productos[i].rangos[j].precio : '';
                    }
                }
                } catch (error) {
                    console.log('err', error);
                }
                
            }
            isFromPrice ? this.productos[0].rangos[0].precio = value :this.productos[0].rangos[0].valor = value;
            (this.esquemaForm.get('esquema') as FormArray).clear();
            for (let i = 0; i < this.productos.length; i++) {
                this.obtenerItemCriteriosComunes(this.productos[i]);
            }
        }
    }

    bloqueoGeneral(item: any, idX: any) {
        /** Se declaran variables **/
        let itemV = item.value == undefined ? item : item.value;
        const { idProductoContrato, idRango } = itemV;
        const id = idX;
        /** Desbloqueamos de acuerdo a la configuracion */
        let rango = idRango;
        /** Se declaran variables **/

        if (idX != null && rango != null && itemV != null && idX == 0) {
            /** Se procede a limpiar el campo **/
            for (let i = 0; i < 10; i++) {
                this.productos[idX].rangos[i].bloquear = true;
                this.productos[idX].rangos[i].precio = '';
                this.productos[idX].rangos[i].valor = '';
            }
            /** Se llenan datos y se habilitan campos de acuerdo al rango seleccionado. **/
            let asigna = (rango > 0) ? rango : 1;
            for (let i = 0; i < asigna; i++) {
                this.productos[idX].rangos[i].bloquear = false;
                this.productos[idX].rangos[i].precio = (itemV.rangos[i].precio != null || itemV.rangos[i].precio != '') ? (rango == 0) ? '' : itemV.rangos[i].precio : '';
                this.productos[idX].rangos[i].valor = (i == rango - 1) ? -1 : '';
            }
            /** Se valida si el rango es 0. se bloquean todos los campos a excepción de la primer fila. **/
            if (idX == 0 && rango > 0) {
                for (let i = 1; i < this.productos.length; i++) {
                    this.productos[i].idRango = '0';
                    for (let j = 0; j < this.productos[i].rangos.length; j++) {
                        /** Se limpian los campos **/
                        this.productos[i].rangos[j].bloquear = true;
                        this.productos[i].rangos[j].precio = '';
                        this.productos[i].rangos[j].valor = '';
                    }
                }
            }
        } else {
            /** Se valida que es rango no sea cero **/
            if (this.productos[0].idRango > 0) {
                for (let i = 1; i < this.productos.length; i++) {
                    this.productos[i].idRango = '0';
                }
            } else {
                /** Se procede a limpiar el campo **/
                for (let i = 0; i < 10; i++) {
                    this.productos[idX].rangos[i].bloquear = true;
                    this.productos[idX].rangos[i].precio = '';
                    this.productos[idX].rangos[i].valor = '';
                }
                for (let i = 0; i < rango; i++) {
                    this.productos[idX].rangos[i].bloquear = false;
                    this.productos[idX].rangos[i].precio = (itemV.rangos[i].precio != null || itemV.rangos[i].precio != '') ? (rango == 0) ? '' : itemV.rangos[i].precio : '';
                    this.productos[idX].rangos[i].valor = (i == rango - 1) ? -1 : '';
                }
            }
        }
    }

    bloqueoGeneralH2H(item: any, idX: any) {
        /** Se declaran variables **/
        let itemV = item.value == undefined ? item : item.value;
        const { idProductoContrato, idRango } = itemV;
        const id = idX;
        let n = 0;
        let nFinal = 0;
        let final = 9;

        /** Desbloqueamos de acuerdo a la configuracion */
        let idRF = parseInt(this.productos[0].idRango);

        if (idX != null && idRF == 0 && id > 0) {
            for (let i = 0; i < this.productos.length; i++) {
                this.productos[i].deshabilitaSinL = false;
            }

            for (let j = 0; j < this.productos[id].rangos.length; j++) {
                /** Se obtiene posicion **/
                let posicion = parseInt(this.productos[id].idRango);
                if (posicion >= 0) {
                    /** Se Deshabilitan campos **/
                    while (nFinal <= final) {
                        this.productos[id].rangos[nFinal].bloquear = true;
                        nFinal++;
                    }
                    /** Se habilitan campos **/
                    let position = posicion == 0 ? 0 : posicion - 1;
                    if (posicion === 0){
                        this.productos[id].rangos[n].valor = '';
                        this.productos[id].rangos[n].precio = '';
                    }
                    if (position == 0 && posicion == 0) {
                        this.productos[id].rangos[n].valor = '';
                        this.productos[id].rangos[n].precio = '';
                    } else {
                        while (n <= position) {
                            if (this.productos[id].idProductoContrato == idProductoContrato) {
                                this.productos[id].rangos[n].bloquear = false;
                                //this.productos[id].rangos[n].valor = '';
                                this.productos[id].rangos[n].valor = this.productos[id].rangos[n].valor && this.productos[id].rangos[n].valor != -1 ? 
                                                                     this.productos[id].rangos[n].valor : 
                                                                     n == idRango - 1 ? -1 : '';
                                if (item.value.rangos[n].precio != null || item.value.rangos[n].precio != "") {
                                    this.productos[id].rangos[n].precio = item.value.rangos[n].precio;
                                } else {
                                    this.productos[id].rangos[n].precio = '';
                                }
                            }
                            n++;
                        }
                        /** Se limpia campos bloqueados **/
                        for (let z = 0; z <= final; z++) {
                            if (this.productos[id].rangos[z].bloquear == true) {
                                this.productos[id].rangos[z].valor = '';
                                this.productos[id].rangos[z].precio = '';
                            }
                        }
                    }
                }
                /** Se habilita sinLimite. **/
            }
            /** Se reinicia variables **/
            n = 0;
            nFinal = 0;
        } else {
            /** Se deshabilitan todos los productos excepto el primero  **/
            for (let i = 1; i < this.productos.length; i++) {
                this.productos[i].idRango = '0';
            }
        }

        /** valor por defecto **/
        if (id == 0) {
            /** Se limpia campos bloqueados **/
            for (let z = 0; z <= final; z++) {
                this.productos[id].rangos[z].bloquear = true;
                this.productos[id].rangos[z].valor = '';
                this.productos[id].rangos[z].precio = '';
            }
            /** Se inicializa en vacio **/
            this.productos[id].rangos[0].bloquear = false;
            this.productos[id].rangos[0].valor =  '';
            this.productos[id].rangos[0].precio = '';
        }

        //If the item changed has idRango 0 clean all ranges and values from that item
        if(itemV.idRango === 0){
            const ranges = this.productos[id].rangos.map((r: { valor: string; precio: string; }) => {
                r.valor = '';
                r.precio = '';
                return r
            })
            this.productos[id].rangos = ranges;
        }
    }

    bloqueoTodosH2H() {
        /** Desbloqueamos de acuerdo a la configuracion */
        let { idRango, rangos: rango } = this.productos[0];

        /** Se bloquean todos y se limpian valores **/
        let n = 0;
        let campos = 9;

        /** Se bloquean todos los campos **/
        for (let i = 0; i < this.productos.length; i++) {
            for (let index = 0; index < this.productos[i].rangos.length; index++) {
                this.productos[i].rangos[index].bloquear = true;
            }
        }

        //Se reasigna rango para el primer producto
        this.productos[0].idRango = idRango

        /** Se valida si el rango del primer producto es diferente al rango por default **/
        if (parseInt(idRango) > 0) {
            /** Se deshabilitan todos los productos excepto el primero  **/
            for (let i = 1; i < this.productos.length; i++) {
                this.productos[i].idRango = 0;
            }
            for (let i = 0; i < this.productos.length; i++) {
                for (let index = 0; index < this.productos[i].rangos.length; index++) {
                    this.productos[i].rangos[index].bloquear = true;
                    if (i > 0) {
                        this.productos[i].rangos[index].valor = '';
                        this.productos[i].rangos[index].precio = '';
                    }
                    n++;
                }
                n = 0;
            }
            /** Se asigna valor sin limite a rango agregado **/
            for (let j = 0; j < parseInt(this.productos[0].idRango); j++) {
                if (idRango != this.productos[0].rangos[j].id) {
                    this.productos[0].rangos[j].valor == -1 ? this.productos[0].rangos[j].valor = '' : this.productos[0].rangos[j].valor;
                    this.productos[0].rangos[j].bloquear = false;
                } else {
                    this.productos[0].rangos[j].bloquear = false;
                    //if exist value set value and no replace for ''
                    this.productos[0].rangos[j].valor = (j == parseInt(idRango) - 1) ? -1 : this.productos[0].rangos[j].valor || '';
                }
            }
            /** Se limpia campos con estatus bloqueado **/
            for (let z = 0; z < campos; z++) {
                if (this.productos[0].rangos[z].bloquear == true) {
                    this.productos[0].rangos[z].precio = '';
                    this.productos[0].rangos[z].valor = '';
                }
            }
        } else {
            for (let i = 0; i < this.productos.length; i++) {
                this.productos[i].idRango = i == 0 ? 0 : this.productos[i].idRango;
                for (let j = 0; j < this.productos[i].rangos.length; j++) {
                    this.productos[i].rangos[j].bloquear =
                        this.productos[i].rangos[j].posicion > parseInt(this.productos[i].idRango) ? true : false;

                        if(!this.productos[i].rangos[j].valor && !this.productos[i].rangos[j].precio){
                            this.productos[i].rangos[j].bloquear = true;

                        }
                }
            }
            /** Se limpia campos con estatus bloqueado **/
            for (let z = 0; z < campos; z++) {
                if (this.productos[0].rangos[z].bloquear == true) {
                    this.productos[0].rangos[z].precio = '';
                    this.productos[0].rangos[z].valor = '';
                }
            }
            rango[0].bloquear = false;
        }

        /** Se obtienes rangos **/
        this.cargarRangos();
        this.initConfig = false;
    }

    bloqueoTodos() {
        /** Se bloquean todos los campos **/
        for (let i = 0; i < this.productos.length; i++) {
            for (let index = 0; index < this.productos[i].rangos.length; index++) {
                if (this.productos[i].rangos[index].precio == null && this.productos[i].rangos[index].valor == null) {
                    this.productos[i].rangos[index].bloquear = true;
                    this.productos[i].rangos[index].precio = '';
                    this.productos[i].rangos[index].valor = '';
                }
            }
        }
        /** Habilita el primero **/
        if (this.productos[0].idRango == 0 && this.productos[0].rangos[0].precio == '' && this.productos[0].rangos[0].valor == '') {
            this.productos[0].rangos[0].bloquear = false;
        }
        /** Se obtienes rangos **/
        this.cargarRangos();
    }

    cargarRangos() {
        /** Se cargan rangos **/
        const initRange = this.productos[0].idRango;
        for (let i = 0; i < this.productos.length; i++) {
            let r = null;
            /** Se selecciona rango **/

            if (i == 0) {
                if (this.productos[i].rangos[0].valor == undefined || this.productos[i].rangos[0].valor == -1 || this.productos[i].rangos[0].valor == -1.0) {
                    r = this.productos[i].rangos.filter((c: any) => { return c.precio }).length;
                    this.productos[i].idRango = r != initRange ? initRange : `${r}`;
                } else {
                    r = 0;
                    this.productos[i].idRango = initRange ? initRange : `${r}`;
                }
            } else {
                r = this.productos[i].rangos.filter((c: any) => { return c.precio }).length;
                this.productos[i].idRango = `${r}`;
            }
        }
    }

    limpiar() {
        this.banderaContrato = true;
        this.limpiaBusqueda.vacia();
    }

    guardaEsquema(numContrato: any, request: any) {
        this.service.actualizaEsquema(numContrato, request).then((data: any) => {
            this.openMsg('Info', 'Se ha guardado con exito', 'info');
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    validaRango(valores: any, posicion: any, e: any, y: any) {
        const element = e.currentTarget as HTMLInputElement;
        let idx = posicion - 1;
        let o = valores.findIndex((item: any) => item.posicion == idx);
        if (o != -1) {
            let ultimoValor = valores[o].valor;
            let valorActual = element.value;
            if (valorActual <= ultimoValor) {
                element.value = '0.0'
                this.openMsg('Info', 'EL valor debe ser mayor al rango anterior', 'info');
            }
        }
    }

    descargarArchivoEsquema(tipoArchivo: any) {
        var body = {
            usuario: this.usuarioActual,
            numContrato: this.numContrato,
            formato: tipoArchivo
        }

        this.service.obtieneReporte(body).then(result =>
            this.fc.convertBase64ToDownloadFileInExport(result)
        ).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    descargarArchivoConfigAnual(tipoArchivo: any) {
        var body = {
            numCuenta: this.numContrato,
            formato: tipoArchivo,
            usuario: this.usuarioActual,
            idContrato: this.idCodigoCntr
        }
        this.service.obtieneReporteConfigAnual(body).then(result =>
            this.fc.convertBase64ToDownloadFileInExport(result)
        ).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    exportar() {
        const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
        dialogo.afterClosed().subscribe(result => {
            if (result) {
                this.configAnualidad ? this.descargarArchivoConfigAnual(result) : this.descargarArchivoEsquema(result);
            }
        });
    }

    numerico(event: KeyboardEvent) { this.fc.numberOnly(event); }

    /**
        * Metodo que limita los inputs segun la longitud dada.
    */
    maxLengthNumber(e: KeyboardEvent) {
        const element = e.currentTarget as HTMLInputElement
        const maxLength = Number(element.getAttribute("maxlength"));
        if (element.value.length == maxLength) {
            element.value.slice(0, maxLength)
            e.preventDefault();
            return;
        }
    }

    openMsg(titulo: String, contenido: String, type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso' | 'yesNo', code?: string) {
        const dialogo = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(titulo, contenido, type, code), hasBackdrop: true
        }
        );
    }

    obtenerConfiguracionAnual() {
        this.service.obtenerConfiguracionAnual(this.idCodigoCntr).then((resp: any) => {
            if (resp.codigoError === 'OKCC01') {
                this.banderaHasRows = true;
                this.configuracionesAnuales = resp.configuraciones;
                this.crearFormArrayConfigAnualidad();
            }
        }).catch(() => {
            this.dialog.open(ModalInfoComponent, {
                data: new ModalInfoBeanComponents(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    this.translate.instant('modal.msjERRGEN0001Sugerencia')
                ),
            });
        }).finally(() =>
            this.globals.loaderSubscripcion.emit(false)
        );
    }

    activarConfiguracion() {
        this.configAnualidad = !this.configAnualidad;
        if (this.configAnualidad) this.obtenerConfiguracionAnual();
    }

    actualizarFechaFPA(index: number, fecha: Date) {
        const fechaFPA = new Date(fecha);
        fechaFPA.setFullYear(fechaFPA.getFullYear() + 1);
        this.formArrayConfigAnualidad.at(index).get('fechaFPA')?.setValue(fechaFPA);
    }

    get formArrayConfigAnualidad() {
        return this.formConfigAnualidad.get('formArrayConfigAnualidad') as FormArray;
    }

    crearFormArrayConfigAnualidad() {
        this.configuracionesAnuales.forEach((configuracion: any, index: number) => {
            this.formArrayConfigAnualidad.push(this.crearFormGroupConfigAnualidad(configuracion));
        });

        this.formArrayConfigAnualidad.controls.forEach((control, index) => {
            this.subscriptions.push(
                control.get('fecha')!.valueChanges.subscribe(value => {
                    this.actualizarFechaFPA(index, value);
                })
            );
        });
    }

    crearFormGroupConfigAnualidad(configuracion: any): FormGroup {
        const partesFecha = configuracion.fecha.split('/');
        const fechaComoDate = new Date(+partesFecha[2], +partesFecha[1] - 1, +partesFecha[0]);

        const partesFechaFPA = configuracion.fechaFPA.split('/');
        const fechaFPAComoDate = new Date(+partesFechaFPA[2], +partesFechaFPA[1] - 1, +partesFechaFPA[0]);
        return this.fb.group({
            producto: [configuracion.producto],
            monto: [configuracion.monto],
            estatus: [configuracion.estatus === 'A'],
            numCuenta: [configuracion.numCuenta],
            fecha: [fechaComoDate],
            fechaFPA: [fechaFPAComoDate],

            idConfiguracion: [configuracion.idConfiguracion],
            idProducto: [configuracion.idProducto],
            idCuenta: [null]
        });
    }

    guardarConfigAnual() {
        const body: any[] = [];
        let validConfig = true;
        for (const group of this.formArrayConfigAnualidad.controls) {
            const configuracion = group.value;
            const fechaControl = configuracion.fecha;
            const fechaFPAControl = configuracion.fechaFPA;
            const estatus = configuracion.estatus;
            if (configuracion.monto || configuracion.numCuenta || new Date(fechaControl).getFullYear() || configuracion.estatus) {
                if (!configuracion.monto || !configuracion.numCuenta || !new Date(fechaControl).getFullYear()) {
                    const fieldMissing = !configuracion.monto ? this.translate.instant('pantalla.esquemaCobroComisionDef.monto') :
                        !configuracion.numCuenta ? this.translate.instant('pantalla.conveniosContratos.cuenta')
                            : this.translate.instant('pantalla.esquemaCobroComisionDef.fechaAnualidad').toLowerCase();
                    this.openMsg(
                        this.translate.instant('cobroComisiones.noAccount', {
                            fieldMissing,
                            nameProduct: configuracion.producto
                        }),
                        '',
                        'alert',
                        !configuracion.numCuenta ? 'ERRCOD02' : 'ERRCOD03'
                    );
                    validConfig = false;
                    break;
                }
            }
            body.push({
                ...configuracion,
                estatus: estatus ? 'A' : 'I',
                idCuenta: this.idCodigoCntr,
                fecha: this.formatDateToDDMMYYYY(fechaControl),
                fechaFPA: this.formatDateToDDMMYYYY(fechaFPAControl)
            })
        }
        if (!validConfig) return;
        const askSave = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('config.cobranza.guardarAnualidad'),
                '',
                'confirm',
            ),
        });
        askSave.afterClosed().subscribe((r) => {
            if (r === 'ok') {

                this.service.guardarConfiguracionAnual(body, this.idCodigoCntr).then((resp: any) => {
                    if (resp.codigoError === 'OKACTAC') {
                        this.dialog.open(ModalInfoComponent, {
                            data: new ModalInfoBeanComponents(
                                this.translate.instant('esquemaComisiones.modal.msjINF001Titulo'),
                                '',
                                'info',
                                this.translate.instant('config.cobranza.msjOKACTACCodigo'),
                                '',
                                this.translate.instant('config.cobranza.msjOKACTACObservacion'),
                            ),
                        });
                        /* this.obtenerConfiguracionAnual(); */
                    } else {
                        if (resp.codigoError === 'ERRORCTA') {
                            const stringAccount: string[] = [];
                            (resp.configuraciones as []).forEach((r: { producto: string, numCuenta: string }) => {
                                stringAccount.push(`${r.producto}: ${r.numCuenta}`);
                            })
                            this.openMsg(this.translate.instant('cobroComisiones.noValidAcount', {
                                cuentas: `${stringAccount.join(', ')}`
                            }), this.translate.instant('cobroComisiones.noValidAcountContent'), 'alert', 'ERVALCTA01')
                            return;
                        }
                        this.showMsgErrorAnualidad();
                    }
                }).catch(() => {
                    this.showMsgErrorAnualidad();
                }).finally(() => {
                    this.globals.loaderSubscripcion.emit(false);

                })
            }
        })

    }

    showMsgErrorAnualidad(): void {
        this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                '',
                'error',
                this.translate.instant('config.cobranza.msjERRDBCA02Codigo'),
                this.translate.instant('config.cobranza.msjERRDBCA02Observacion')
            ),
        });
    }

    formatDateToDDMMYYYY(dateString: string): string {
        const date = new Date(dateString);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async cleanForm(): Promise<void> {
        this.initForms();
        this.catalogos();
        this.obtenerConfiguracionAnual();
        this.configuracionEsquema();
    }
}
