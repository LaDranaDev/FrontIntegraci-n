import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';

import { ModalTipoCobroComponents } from 'src/app/bean/modal-tipo-cobro.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';

import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-subsidiaria',
  templateUrl: './modal-subsidiaria.component.html',
  styleUrls: ['./modal-subsidiaria.component.css'],
})
export class ModalSubsidiariaComponent implements OnInit {

  datos: any = {
    buc: '',
    idCuentaComision: '',
    razonSocial: '',
    alias: ''
  }

  public activeLang = 'es';
  page: number = 1;
  pageSize: number = 10;

  subsidiarias: any[] = [];
  dataOrdenante: any;
  listaOrdenantes: any[] = [];
  lengthCuenta: number = 11;
  lengthAlias: number = 30;
  lengthRazonSocial: number = 50;
  lengthBUC: number = 8;

  ordenante: boolean = false;
  modalH2H: boolean = false;
  subsidiaria: any;
  infoData: any[] = [];
  catalogoCuentasComision: any[] = [];
  catalogoCuentasOrdenantes: any[] = [];
  informacionBuc: any[] = [];
  razonSocial: string = '';
  alias: string = '';
  resultadoPeticion: any[] = [];
  listaPeticion = {};
  editar: boolean = false;
  idSubsidiaria: number = 0;
  buc: string = '100000666';
  operacionesTotales: any = 0;
  operacionesTotalesF: any = '';

  itemGlobalIndex(index: any) {
    return this.pageSize * (this.page - 1) + index;
  }
  onPageChange(pageNum: any) {
    return this.pageSize * (pageNum - 1);
  }

  formUnaCuenta: UntypedFormGroup;
  formConfirming: UntypedFormGroup;
  formProducto: UntypedFormGroup;
  formSubsidiaria: UntypedFormGroup;
  formComisionH2H: UntypedFormGroup;
  nuevaOrdenante: UntypedFormControl;


  get unaCuenta() {
    return this.formUnaCuenta.get('unaCuenta');
  }

  get confirming(): UntypedFormArray {
    return this.formConfirming.get('cuentaComision') as UntypedFormArray;
  }
  get producto(): UntypedFormArray {
    return this.formProducto.get('producto') as UntypedFormArray;
  }
  get operaciones(): UntypedFormArray {
    return this.formComisionH2H.get('operaciones') as UntypedFormArray;
  }

  constructor(
    public translate: TranslateService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalSubsidiariaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalTipoCobroComponents,
    private service: ContratosService,
    private fc: FuncionesComunesComponent,
    private globals: Globals
  ) {
    /*  this.formSubsidiaria.controls['razonSocial']?.disable(); */
    this.translate.setDefaultLang(this.activeLang);
  }

  createForm(): void {
    this.formConfirming = this.fb.group({
      cuentaComision: this.fb.array([]),
    });

    this.formProducto = this.fb.group({
      producto: this.fb.array([]),
    });

    this.formSubsidiaria = this.fb.group({
      buc: ['', [Validators.required]],
      idCuentaComision: ['', [Validators.required]],
      razonSocial: [{ value: '', disabled: true }, [Validators.required]],
      alias: ['', [Validators.required]],
    });

    this.formComisionH2H = this.fb.group({
      operaciones: this.fb.array([]),
    });

    this.nuevaOrdenante = this.fb.control('', Validators.required);

    this.formUnaCuenta = this.fb.group({
      unaCuenta: [
        '',
        [Validators.required, Validators.maxLength(11), Validators.minLength(11)],
      ],
    });
  }

  altaTipoDeCobro(request: any) {
    this.service.altaTipoDeCobro(request).then((data: any) => {
      if (data.code == 200) {
        data.result == null
          ? this.openMsg('Error', data.status, 'error')
          : this.openMsg('Info', data.result, 'info');
      }
    });
  }

  actualizaTipoDeCobro(
    numContrato: string,
    idTipoCobroCntr: number,
    request: any
  ) {
    this.service
      .actualizaTipoDeCobro(numContrato, idTipoCobroCntr, request)
      .then((data: any) => {
        if (data.result.code === "OK00000") {
          this.openMsg('Info', data.result.mensaje, 'info');
        } else {
          this.openMsg('Error', data.result.mensaje, 'error')
        }
      });
  }

  configuracionTipoDeCobro(
    tipoCobroAnterior: any,
    numContrato: any,
    idTipoCobroCntr: any,
    request: any
  ) {
    if (tipoCobroAnterior === null) {
      request.numContrato = numContrato;
      this.altaTipoDeCobro(request);
    } else {
      const { idTipoCobro, productos, cuentasConfirming, cuentaComision } =
        request;
      let opcionData =
        idTipoCobro == 1
          ? { cuentaComision }
          : idTipoCobro == 2
            ? { cuentaComision, cuentasConfirming }
            : { cuentaComision, productos };
      this.actualizaTipoDeCobro(numContrato, idTipoCobroCntr, opcionData);
    }
    this.dialogRef.close();
    this.globals.loaderSubscripcion.emit(false);
  }

  guardaUnaCuenta() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modals.cierre.productos.confirmacion'),
        '¿Está seguro que desea realizar la operación?',
        'confirm',
        '',
        ''),
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        const formUnaCuenta = this.formUnaCuenta;
        if (formUnaCuenta.invalid) {
          this.openMsg('Error', 'Los campos son requeridos', 'error');
          formUnaCuenta.markAllAsTouched();
          return;
        }
        const { data, voBo, opcion: opcionCobroNuevo, numContrato } = this.data;
        const { idTipoCobro, idTipoCobroCntr } = data;
        const dataRequest = {
          idTipoCobro: opcionCobroNuevo,
          cuentaComision: formUnaCuenta.value['unaCuenta'],
          voBo,
        };
        this.configuracionTipoDeCobro(
          idTipoCobro,
          numContrato,
          idTipoCobroCntr,
          dataRequest
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  guardaConfirming() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modals.cierre.productos.confirmacion'),
        '¿Está seguro que desea realizar la operación?',
        'confirm',
        '',
        ''),
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        if (this.formConfirming.invalid) {
          this.formConfirming.markAllAsTouched();
          this.openMsg('Error', 'Los campos son requeridos');
          return;
        }

        const { data, voBo, opcion: opcionCobroNuevo, numContrato } = this.data;
        const { idTipoCobro, idTipoCobroCntr, cuentaComision, cuentasConfirming } =
          data;
        let dataModf = this.filtroDatosModificados(
          cuentasConfirming,
          this.confirming.value,
          'idCntrConfirming'
        );
        let { dataActualizado, dataActualizadoCtaCargo } = dataModf;

        const sinModificar: any[] = [];
        this.formConfirming.value.cuentaComision.map((val: any) => {
          if (val.idCntrConfirming > 0) {
            sinModificar.push({
              idCntrConfirming: val.idCntrConfirming,
              cuentaComision: val.cuentaComision,
            });
          }
        });

        const dataRequest = {
          idTipoCobro: opcionCobroNuevo,
          cuentaComision:
            dataActualizadoCtaCargo.length == 0
              ? cuentaComision
              : dataActualizadoCtaCargo[0].cuentaComision,
          voBo,
          cuentasConfirming: idTipoCobro == null ? sinModificar : dataActualizado,
        };

        this.configuracionTipoDeCobro(
          idTipoCobro,
          numContrato,
          idTipoCobroCntr,
          dataRequest
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  guardaProducto() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modals.cierre.productos.confirmacion'),
        '¿Está seguro que desea realizar la operación?',
        'confirm',
        '',
        ''),
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        if (this.formProducto.invalid) {
          this.formConfirming.markAllAsTouched();
          this.openMsg('Error', 'Los campos son requeridos', 'error');
          return;
        }
        const { data, voBo, opcion: opcionCobroNuevo, numContrato } = this.data;
        const { idTipoCobro, idTipoCobroCntr, cuentaComision, productos } = data;
        let dataModf = this.filtroDatosModificados(
          productos,
          this.producto.value,
          'idCntrProducto'
        );
        let { dataActualizado, dataActualizadoCtaCargo } = dataModf;

        const sinModificar: any[] = [];
        this.formProducto.value.producto.map((val: any) => {
          if (val.idCntrProducto > 0) {
            sinModificar.push({
              idCntrProducto: val.idCntrProducto,
              cuentaComision: val.cuentaComision,
            });
          }
        });

        const dataRequest = {
          idTipoCobro: opcionCobroNuevo,
          cuentaComision:
            dataActualizadoCtaCargo.length == 0
              ? cuentaComision
              : dataActualizadoCtaCargo[0].cuentaComision,
          voBo,
          productos: idTipoCobro == null ? sinModificar : dataActualizado,
        };

        this.configuracionTipoDeCobro(
          idTipoCobro,
          numContrato,
          idTipoCobroCntr,
          dataRequest
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  agregarOrdenante(ordenante: any) {
    if (this.nuevaOrdenante.invalid) {
      this.nuevaOrdenante.markAllAsTouched();
      let msg: string = '';
      msg =
        this.catalogoCuentasOrdenantes == null ||
          this.catalogoCuentasOrdenantes.length == 0
          ? 'No existen cuentas ordenantes para asignar.'
          : 'Selecciona una cuenta ordenante.';
      this.openMsg('Info', msg, 'info');
      return;
    }
    if (this.catalogoCuentasOrdenantes.length > 0) {
      this.catalogoCuentasOrdenantes = this.catalogoCuentasOrdenantes.filter(
        (item) => item.idCuenta !== ordenante.value.idCuenta
      );
      if (
        this.listaOrdenantes.findIndex(
          (item: any) => item.idCuenta === ordenante.value.idCuenta
        ) < 0
      ) {
        this.listaOrdenantes.push(ordenante.value);
      }
      this.nuevaOrdenante.setValue('');
    } else {
      this.openMsg('Info', 'No hay cuentas por asignar.', 'info');
    }
  }

  borrarOrdenante(ordenante: any) {
    const { idCuenta, numCuenta, titular } = ordenante;
    if (this.catalogoCuentasOrdenantes == null) {
      this.catalogoCuentasOrdenantes = [{ idCuenta, numCuenta, titular }];
    } else if (
      this.catalogoCuentasOrdenantes.findIndex(
        (item) => item.idCuenta === idCuenta
      ) < 0
    ) {
      this.catalogoCuentasOrdenantes.push({ idCuenta, numCuenta, titular });
    }
    this.listaOrdenantes = this.listaOrdenantes.filter(
      (item: any) => item.idCuenta !== ordenante.idCuenta
    );
    this.nuevaOrdenante.setValue('');
  }

  guardarOrdenante() {
    let idsCtas = this.listaOrdenantes.map((item: any) => {
      return { idCuenta: item.idCuenta };
    });
    let request = { cuentasSubsidiarias: idsCtas };
    this.service
      .guardaOrdenantes(
        this.data.numContrato,
        this.dataOrdenante.idSubsidiaria,
        request
      )
      .then((data: any) => {
        if (data.code == 200) {
          this.openMsg('Info', 'Se ha guardado correctamente', 'info');
          this.regresar();
        }
      });
    this.globals.loaderSubscripcion.emit(false);
  }

  filtroDatosModificados(dataOriginal: any, dataModificado: any, id: string) {
    let hash: any = {};
    let array = dataModificado.filter((o: any) =>
      hash[o[id]] ? false : (hash[o[id]] = true)
    );
    let dataActualizado: any = [];
    let dataActualizadoCtaCargo: any = [];

    array.map((val: any) => {
      if (val[id] > 0) {
        id == 'idCntrProducto'
          ? dataActualizado.push({
            idCntrProducto: val[id],
            cuentaComision: val.cuentaComision,
          })
          : dataActualizado.push({
            idCntrConfirming: val[id],
            cuentaComision: val.cuentaComision,
          });
      } else {
        dataActualizadoCtaCargo.push({ cuentaComision: val.cuentaComision });
      }
    });
    return { dataActualizado, dataActualizadoCtaCargo };
  }
  obtenerItemConfirming(item: any): UntypedFormGroup {
    return this.fb.group({
      cuentaComision: [
        this.data.isClean ? '' : item.cuentaComision,
        [Validators.required, Validators.minLength(11)],
      ],
      activo: this.data.isClean ? false : [item.activo],
      contratoConfirming: this.data.isClean ? '' : [item.contratoConfirming],
      idCntrConfirming: [this.data.isClean ? '' : item.idCntrConfirming],
    });
  }
  obtenerItemProductos(item: any): UntypedFormGroup {
    return this.fb.group({
      cuentaComision: this.data.isClean ? '' : [
        item.cuentaComision,
        [Validators.required, Validators.minLength(11)],
      ],
      cveProducto: [item.cveProducto],
      idProducto: [item.idProducto],
      idCntrProducto: [item.idCntrProducto],
      descripcion: [item.descripcion],
    });
  }

  ngOnInit(): void {
    this.createForm();
    const { opcion, data } = this.data;
    const { cuentasConfirming, productos, cuentaComision } = data;

    this.catalogosCuentasComisiones();
    this.catalogosCuentasOrdenantes();
    this.operacionesLibres();
    this.globals.loaderSubscripcion.emit(false);
    switch (opcion) {
      case 1:
        this.formUnaCuenta.controls['unaCuenta'].setValue(this.data.isClean ? '' : cuentaComision);
        break;
      case 2:
        let rest = cuentasConfirming.findIndex(
          (item: any) =>
            item.idCntrConfirming == 0 && item.contratoConfirming == ''
        );
        if (rest == -1) {
          cuentasConfirming.unshift({
            activo: false,
            contratoConfirming: '',
            cuentaComision: cuentaComision,
            idCntrConfirming: 0,
          });
        }
        cuentasConfirming.forEach((element: any) => {
          this.confirming.push(this.obtenerItemConfirming(element));
        });
        break;
      case 3:
        let prod = productos.findIndex(
          (item: any) => item.idProducto == 0 && item.cveProducto == ''
        );
        if (prod == -1) {
          productos.unshift({
            cuentaComision: cuentaComision,
            cveProducto: '',
            descripcion: 'Cuenta de Cargo',
            idCntrProducto: 0,
            idProducto: 0,
          });
        }
        productos.forEach((element: any) => {
          this.producto.push(this.obtenerItemProductos(element));
        });
        break;
      case 4:
        this.consultaSubsidiarias();
        break;
      default:
        break;
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  /**Agrega una subsidiara y aparte si es nuevo la opcion de tipo de cobro da de alta en caso contrario la actualiza*/
  agregarSubsidiaria() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modals.cierre.productos.confirmacion'),
        '¿Está seguro que desea realizar la operación?',
        'confirm',
        '',
        ''),
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        const { buc, idCuentaComision, razonSocial, alias } =
          this.formSubsidiaria.getRawValue();
        let msg: any = '';
        if (
          this.formSubsidiaria.invalid &&
          (razonSocial == '' || razonSocial == null)
        ) {
          if (
            buc == '' &&
            idCuentaComision == '' &&
            razonSocial == '' &&
            alias == ''
          ) {
            msg = 'Los campos son requeridos.';
          } else if (buc == '' || buc == null) {
            msg = 'Es requerido el buc';
          } else if (idCuentaComision == '' || idCuentaComision == null) {
            let msgVacio = 'No existen cuentas comisión para asignar.';
            let msgSinSeleccionar = 'Selecciona una cuenta comisión.';
            msg =
              this.catalogoCuentasComision == null
                ? msgVacio
                : this.catalogoCuentasComision.length > 0
                  ? msgSinSeleccionar
                  : msgVacio;
          } else if (razonSocial == '' || razonSocial == null) {
            msg =
              'Se requiere la razon social para esto es necesario dar Tabulador al campo buc.';
          } else if (alias == '' || alias == null) {
            msg = 'Es requerido el alias.';
          } else {
            msg = 'Los campos son requeridos.';
          }
          this.openMsg('Error', msg, 'error');
          return;
        }

        let parametros = this.formSubsidiaria.getRawValue();
        parametros.numContrato = this.data.numContrato;
        if (this.editar) {
          this.service
            .actualizaSubsidiaria(
              this.data.numContrato,
              this.idSubsidiaria,
              parametros
            )
            .then((data: any) => {
              if (data.code == 200) {
                if (data.errors.length > 0) {
                  this.openMsg('Error', data.status, 'error');
                } else {
                  this.subsidiarias = data.result || [];
                  this.catalogosCuentasComisiones();
                  this.formSubsidiaria.controls['idCuentaComision'].setValue('');
                }
                this.globals.loaderSubscripcion.emit(false);
                this.openMsg('Info', "Se actualizo con exito la subsidiaria", 'info');
              }
            });
        } else {
          const req = {
            'buc': parametros.buc,
            'idCuentaComision': parametros.idCuentaComision,
            'razonSocial': parametros.razonSocial,
            'alias': parametros.alias,
            'numContrato': parametros.numContrato
          };
          this.service.guardaSubsidiaria(parametros).then((data: any) => {
            if (data.code == 200) {
              if (data.errors.length > 0) {
                this.openMsg('Error', data.status, 'error');
                this.globals.loaderSubscripcion.emit(false);
              } else {
                this.subsidiarias = data.result || [];
                this.catalogosCuentasComisiones();
                this.formSubsidiaria.controls['idCuentaComision'].setValue('');
                this.globals.loaderSubscripcion.emit(false);
                this.openMsg('Exitoso', 'La Subsidiaria fue almacenada con exito', 'confirm');
              }
            }
          });
        }
        this.limpiar();
      }
    });
  }

  eliminarBuc(idSubsidiaria: number) {
    this.service
      .eliminaBUC(this.data.numContrato, idSubsidiaria)
      .then((data: any) => {
        if (data.code == 200) {
          this.openMsg('Info', data.result, 'info');
          this.catalogosCuentasComisiones();
          this.consultaSubsidiarias();
          this.limpiar();
        }
      });
    this.globals.loaderSubscripcion.emit(false);
  }

  editarBuc(item: any) {
    this.editar = true;
    this.idSubsidiaria = item.idSubsidiaria;
    this.formSubsidiaria.controls['buc'].setValue(item.buc);
    this.formSubsidiaria.controls['razonSocial'].setValue(item.razonSocial);
    this.formSubsidiaria.controls['alias'].setValue(item.alias);

    if (this.catalogoCuentasComision == null) {
      this.catalogoCuentasComision = [
        {
          idCuenta: item.idCuentaComision,
          numCuenta: item.cuentaComision,
          titular: item.titularCuenta,
        },
      ];
    } else if (
      this.catalogoCuentasComision.findIndex(
        (item) => item.idCuenta === item.idCuentaComision
      ) < 0
    ) {
      this.catalogoCuentasComision.push({
        idCuenta: item.idCuentaComision,
        numCuenta: item.cuentaComision,
        titular: item.titularCuenta,
      });
    }
    this.formSubsidiaria.controls['idCuentaComision'].setValue(
      item.idCuentaComision
    );
  }

  informacionBUC() {
    const { buc, idCuentaComision, razonSocial, alias } =
      this.formSubsidiaria.getRawValue();
    this.service.informacionBUC({ 'buc': String(buc) }).then((data: any) => {
      if (data.codError === "0" && data.msgError === "Consulta Exitosa") {
        this.informacionBuc = data;
        this.formSubsidiaria.patchValue({
          razonSocial: data.razonSocial + " " + data.apellidoPaterno + " " + data.apellidoMaterno,
        });
      } else {
        this.buc = "";
        const ui = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(
            'Error',
            'El BUC informado no existe',
            'error',
            '',
            ''
          ),
          hasBackdrop: true,
          width: '40em',
          maxWidth: '47em'
        });
        ui;
        this.formSubsidiaria.patchValue({
          razonSocial: "",
        });
      }
    });
    this.globals.loaderSubscripcion.emit(false);
  }

  catalogosCuentasComisiones() {
    this.service
      .catalogoCuentasComision(this.data.numContrato)
      .then((data: any) => {
        if (data.code == 200) {
          this.catalogoCuentasComision = data.result;
        }
      });
  }

  catalogosCuentasOrdenantes() {
    this.service
      .catalogoCuentasOrdenantes(this.data.numContrato)
      .then((data: any) => {
        if (data.code == 200) {
          this.catalogoCuentasOrdenantes = data.result;
        }
      });
  }

  consultaSubsidiarias() {
    this.service
      .consultaSubsidiarias(this.data.numContrato)
      .then((data: any) => {
        if (data.code == 200) {
          this.subsidiarias = data.result || [];
          this.operaciones.setValue([]);
          this.formComisionH2H.reset();
          this.operaciones.clear();
          let opTotal = this.operacionesTotales;
          for (let i = 0; i < this.subsidiarias.length; i++) {
            let element = this.subsidiarias[i];
            element.operacionesLibres =
              opTotal == 0
                ? 'Sin operaciones libres'
                : opTotal == -1
                  ? 'Sin Limite'
                  : element.operacionesLibres;
            element.operacionesLibres = opTotal > 0 && element.operacionesLibres == -1 ? 0: element.operacionesLibres
            this.operaciones.push(this.obtenerItemOperaciones(element));
          }
        }
      });
  }

  limpiar() {
    this.formSubsidiaria.reset();
    this.formSubsidiaria.controls['idCuentaComision'].setValue('');
    this.nuevaOrdenante.setValue('');
    this.catalogosCuentasComisiones();
    this.consultaSubsidiarias();
    this.globals.loaderSubscripcion.emit(false);
  }

  cancelar() {
    this.dialogRef.close();
  }

  openModal(data: any) {
    this.ordenante = true;
    this.dataOrdenante = data;
    this.listaOrdenantes = [...this.dataOrdenante.cuentasSubsidiarias];
  }

  operacionesLibres() {
    this.service.operacionesLibres(this.data.numContrato).then((data: any) => {
      if (data.code == 200) {
        this.operacionesTotales = parseInt(data.result.valor);
        this.operacionesTotalesF =
          data.result.valor == 0
            ? 'Sin operaciones libres'
            : data.result.valor == -1
              ? 'Sin Limite'
              : data.result.valor;
      }
    });
    this.globals.loaderSubscripcion.emit(false);
  }

  obtenerItemOperaciones(item: any): UntypedFormGroup {
    return this.fb.group({
      alias: [item.alias],
      buc: [item.buc],
      razonSocial: [item.razonSocial],
      cuentaComision: [item.cuentaComision],
      idSubsidiaria: [item.idSubsidiaria],
      operacionesLibres: [item.operacionesLibres],
      porcentajeComiH2H: [item.porcentajeComiH2H],
    });
  }

  guardarOperacionLibre() {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translate.instant('modals.cierre.productos.confirmacion'),
        '¿Está seguro que desea realizar la operación?',
        'confirm',
        '',
        ''),
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        const operaciones = this.formComisionH2H.value.operaciones;
        let operacionL = 0;
        let porcentaje = 0;
        //validacion
        let y = [];
        let allProductsPercentSum = 0;
        let totalOpeAccum = 0;
        for (let index = 0; index < operaciones.length; index++) {
          let { idSubsidiaria, operacionesLibres, porcentajeComiH2H } =
          operaciones[index];
          allProductsPercentSum = allProductsPercentSum + Number(porcentajeComiH2H);
          if(allProductsPercentSum != 100 && operaciones.length === index + 1){
            this.openMsg(
              this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
              '',
              'alert',
              '',
              this.translate.instant('cobroComisiones.errorPorcentaje')
            )
            throw 'La suma de los porcentajes de comisión debe ser igual a 100%'
          }
          totalOpeAccum = totalOpeAccum + Number(operacionesLibres);
          if(this.operacionesTotales != totalOpeAccum && operaciones.length === index + 1){
            this.openMsg(
              this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
              '',
              'alert',
              '',
              this.translate.instant('cobroComisiones.errorOpeLibres')
            )
            throw 'La suma de las operaciones libres tiene que ser igual a las operaciones ingresadas'
          }
          if (operacionesLibres == 'Sin operaciones libres') {
            operacionesLibres = 0;
            y.push({ idSubsidiaria, operacionesLibres: 0, porcentajeComiH2H });
          } else if (operacionesLibres == 'Sin Limite') {
            operacionesLibres = -1;
            y.push({ idSubsidiaria, operacionesLibres: -1, porcentajeComiH2H });
          } else {
            operacionesLibres = operacionesLibres;
            operacionL += parseInt(operacionesLibres);
            porcentaje += parseInt(porcentajeComiH2H);
            y.push({ idSubsidiaria, operacionesLibres, porcentajeComiH2H });
          }
        }
        this.service
          .guardaPorcentajes(this.data.numContrato, y)
          .then((data: any) => {
            if (data.code == 200) {
              this.openMsg('Info', 'Se guardaron los cambios de forma exitosa.', 'info');
              this.regresarSubsidiaria();
            } else {
              this.openMsg('Error', data.result.mensaje, 'error');
            }
          });
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  regresar() {
    this.catalogosCuentasOrdenantes();
    this.listaOrdenantes = [];
    this.ordenante = false;
    this.consultaSubsidiarias();
    this.globals.loaderSubscripcion.emit(false);
  }

  regresarSubsidiaria() {
    this.modalH2H = false;
    this.ordenante = false;
  }

  /**
   * Congifguracion H2H
   */
  comisionH2H() {
    this.ordenante = false;
    this.modalH2H = true;
    this.limpiar();
  }

  /**
   * Metodo que limita los inputs segun la longitud dada.
   */
  maxLengthNumber(e: KeyboardEvent) {
    const element = e.currentTarget as HTMLInputElement;
    const maxLength = Number(element.getAttribute('maxlength'));
    if (element.value.length == maxLength) {
      element.value.slice(0, maxLength);
      e.preventDefault();
      return;
    }
  }

  numerico(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }
  alphaNumberSpace(event: KeyboardEvent) {
    this.fc.alphaNumberSpace(event);
  }

  openMsg(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
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
      ),
      hasBackdrop: true,
      width: '40%'
    });
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  dropHandler(event: Event) {
    event.preventDefault()
  }
  
  dragOver(event: Event) {
    event.preventDefault()
  }
}
