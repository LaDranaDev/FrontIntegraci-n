import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormArray,
  FormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ProductosContratoService } from 'src/app/services/admin-contratos/productos-contrato.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { MemoryService } from 'src/app/services/memory.service';
import { ValidarProductoCL } from './validaciones-productos.';
import { Subscription } from 'rxjs';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';
import { ModalProductosConfirmingComponent } from 'src/app/components/modals/modal-productos-confirming/modal-productos-confirming.component';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit, OnDestroy {
  @Output() valueChange = new EventEmitter();
  /** Lista de valores del estatus del contrato */
  lstEstatusContrato: any[] = [];
  /** Id del estatus default del contrato */
  idEstatusDef: any;
  /** Id del estatus default del contrato */
  idEstatusContratoDef: any;
  /** Datos de busqueda del cliente */
  datos = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
    idEstatus: 0,
  };
  /**Se inicializa componente*/
  datospersonales: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };
  estatus: any;
  /**
   * @description
   * @type {FormGroup}
   * @memberOf productos
   */
  productosForm!: UntypedFormGroup;
  tabla: any[] = [];
  canales: any[];
  productos: any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'asignado',
    'descripcion',
    'tipoCargo',
    'envioEmail',
    'vigencia',
    'numeroReintentos',
    'intervaloReintentos',
  ];
  sec: any[] = [];
  origen: any;
  issubmit: number = 0;
  closeTR: any;
  /**
   * @description Nombre de usuario de la sesión actual.
   * Este usuario se tendria que sustituir por el de la sesion actual.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  usuarioActual: string | null = '';
  isCancelStatusClient = false;
  firstLoadIsCancel = false;
  perfilamiento: any
  habilitarEdicionProductos: boolean = false;
  habilitarAltaBajaProductos: boolean = false;
  habilitarEstatusCntr: boolean = false;
  mostrarReintentos: boolean = false;
  accionPermitida: any;
  contratosConf: any;
  // Flags para determinar si entro a validar contratos confirming
  checkConfirming: boolean = false;
  bloquea: any
  idEstatusCancelado: any;

  constructor(
    private globals: Globals,
    private comunService: ComunesService,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private service: ProductosContratoService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private sanitized: DomSanitizer,
    private validateCL: ValidarProductoCL,
    private memory: MemoryService,
    public perfila: PerfilamientoService) {
    this.route.paramMap.subscribe((params) => {
      this.origen = JSON.parse(atob(params.get('register') || '{}'));
    });
    this.usuarioActual = localStorage.getItem('UserID');
    this.closeTR = this.sanitized.bypassSecurityTrustHtml(`</tr><tr>`);
  }
  clickSuscliption: Subscription | undefined;

  async ngOnInit(): Promise<void> {
    this.comunService.otro(true);
    if (this.origen) {
      this.inicio();
    }

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.inicio();
      }
    });
  }

  async inicio() {
    this.perfilamiento = this.comunService.getSaveLocalStorage('perfilamiento');
    const usu = {
      "usuario": this.perfilamiento.usuario,
      "diferenciador": this.perfilamiento.diferenciador,
      "perfil": this.perfilamiento.perfil,
    }

    const perfil = {
      'perfilamientoUsuario': usu,
      "url": "/contratos/habilitarAltaBajaProductos.do",
      "componente": "habilitarAltaBajaProductos"
    }
    const perfil2 = {
      'perfilamientoUsuario': usu,
      "url": "/contratos/mostrarReintentos.do",
      "componente": "mostrarReintentos"
    }
    const perfil3 = {
      'perfilamientoUsuario': usu,
      "url": "/contratos/habilitarEdicionProductos.do",
      "componente": "habilitarEdicionProductos"
    }

    await this.reviewAccion(perfil);
    if (this.accionPermitida) {
      this.habilitarAltaBajaProductos = true
      this.habilitarEstatusCntr = true
    }

    await this.reviewAccion(perfil2);
    if (this.accionPermitida) {
      this.mostrarReintentos = true
    }

    await this.reviewAccion(perfil3);
    if (this.accionPermitida) {
      this.habilitarEdicionProductos = true
    }
    this.initForm();
  }

  async reviewAccion(perfil: any) {
    try {
      await this.perfila.accion(perfil).then(
        async (result: any) => {
          if (result.message === 'La operacion es valida') {
            this.accionPermitida = true;
          } else {
            this.accionPermitida = false;
          }
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  async initForm() {
    await this.getEstatusContrato();
    this.productosForm = new UntypedFormGroup({
      periodoHabilitacion: new UntypedFormControl('', []),
      diasProgramarArchivos: new UntypedFormControl('', []),
      nemonico: new UntypedFormControl('', []),
      alias: new UntypedFormControl('', []),
      activaAlias: new UntypedFormControl('', []),
      bandCambioProd: new UntypedFormControl('', []),
      verificarCuentaBeneficiaria: new UntypedFormControl('', []),
      usarClabeParaEdoCta: new UntypedFormControl('', []),
      usarCifrasControl: new UntypedFormControl('', []),
      messagePartner: new UntypedFormControl('', []),
      tipoTransferencia: new UntypedFormControl('', []),
      bic: new UntypedFormControl('', []),
      bandEdicionProductos: new UntypedFormControl('', []),
      bandMostrarReintentos: new UntypedFormControl('', []),
      bandOperacionAlta: new UntypedFormControl('', []),
      canales: new UntypedFormArray([]),
      idCanalCore: new UntypedFormControl('', []),
      idCanalHub: new UntypedFormControl('', []),
      idCanalSwiftFin: new UntypedFormControl('', []),
      idCanalSwiftFile: new UntypedFormControl('', []),
      bandActCont: new UntypedFormControl('', []),
      backConfirming: new UntypedFormControl('', []),
    });

    if (this.origen) {
      this.datos = this.origen;
      this.valueChange.emit(this.datos);
      this.comunService.datos(this.datos);
    } else {
      this.datos = this.comunService.datosContrato;
    }

    this.datospersonales.bucCliente = this.datos.bucCliente;
    this.datospersonales.cuentaEje = this.datos.cuentaEje;
    this.datospersonales.numContrato = this.datos.numContrato;
    this.datospersonales.razonSocial = this.datos.razonSocial;
    this.datospersonales.descEstatus = this.datos.descEstatus;
    this.datospersonales.idContrato = this.datos.idContrato;

    for (let i = 1; i <= 365; i++) {
      this.sec.push(i);
    }

    if (this.datos !== null) {
      if (this.comunService.getBandAltaContrato()) {
        this.firstLoadIsCancel = this.origen.descEstatus === 'CANCELADO' ? true : false;
        this.asignaValoresForm(this.origen);
        this.idEstatusDef = this.origen.idEstatus;
        this.contratosConf = this.origen.contratosConf;
        this.idEstatusCancelado = this.origen.IdEstatusCancelado;
        if (this.idEstatusDef == this.idEstatusCancelado) {
          this.bloquea = true
        } else {
          this.bloquea = false
        }
        setTimeout(() => {
          var periodo: any = document.getElementById("periodoHabilitacion");
          periodo.value = 0;
        }, 1000);

      } else {
        this.memory.changeStatusMenu(true);
        await this.findProductos();
      }
    }

    if (this.firstLoadIsCancel) {
      this.validFirstLoad();
    }
    console.log(this.productosForm.controls['periodoHabilitacion'].value)
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  /** Funcion que busca la lista de productos del contrato */
  async findProductos() {
    try {
      let numContrato = this.datos.numContrato === null ? '0' : this.datos.numContrato;
      let buc = this.datos.bucCliente === null ? '0' : this.datos.bucCliente;
      await this.service
        .findProductos(numContrato, buc)
        .then(async (result: any) => {
          this.comunService.setSaveLocalStorage('valorActivo', result.productoPD);
          if (result.codError === 'OK00000') {
            this.firstLoadIsCancel = result.estatus === 'CANCELADO' ? true : false;
            this.asignaValoresForm(result);
            this.idEstatusDef = result.idEstatus
            this.contratosConf = result.contratosConf
            this.idEstatusCancelado = this.origen.IdEstatusCancelado;
            if (this.idEstatusDef == this.idEstatusCancelado) {
              this.bloquea = true
            } else {
              this.bloquea = false
            }
            this.globals.loaderSubscripcion.emit(false);

          }
        });
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.productos.error'),
        this.translate.instant('modals.productos.error.consulta'),
        'error'
      );
    }
  }

  /** Funcion que recupera la respuesta de los productos del contrato y la mapea a los datos de la pantalla
   *
   * @param result Datos de los productos del contrato
   */
  asignaValoresForm(result: any) {
    this.productosForm.patchValue({
      periodoHabilitacion: result.periodoHabilitacion,
      diasProgramarArchivos: result.diasProgramarArchivos,
      nemonico: result.nemonico,
      alias: result.alias,
      activaAlias: result.activaAlias,
      bandCambioProd: result.bandCambioProd == 'A' ? true : false,
      verificarCuentaBeneficiaria:
        result.verificarCuentaBeneficiaria == 'A' ? true : false,
      usarClabeParaEdoCta: result.usarClabeParaEdoCta == 'A' ? true : false,
      usarCifrasControl: result.usarCifrasControl == 'A' ? true : false,
      messagePartner: result.messagePartner,
      tipoTransferencia:
        result.tipoTransferencia == '' ? 'X' : result.tipoTransferencia,
      bic: result.bic,
      bandEdicionProductos: result.bandEdicionProductos == true ? 'A' : 'I',
      bandMostrarReintentos: result.bandMostrarReintentos == true ? 'A' : 'I',
      bandOperacionAlta: result.bandOperacionAlta == true ? 'A' : 'I',
      idCanalCore: result.idCanalCore,
      idCanalHub: result.idCanalHub,
      idCanalSwiftFin: result.idCanalSwiftFin,
      idCanalSwiftFile: result.idCanalSwiftFile,
      bandActCont: result.bandActCont,
      backConfirming: result.backConfirming,
    });
    this.canales = result.canales;
    this.getChkCanales();
    this.verifyNemonico();
    this.getLstProductos(result.productos);
    let chkIdCanalSwiftFin: boolean = this.getEstatusSeleccionCanal(
      this.productosForm.controls['idCanalSwiftFin'].value
    );
    let chkIdCanalSwiftFile: boolean = this.getEstatusSeleccionCanal(
      this.productosForm.controls['idCanalSwiftFile'].value
    );
    this.enableBIC(chkIdCanalSwiftFin, chkIdCanalSwiftFile);
    this.enableMessagePartner(chkIdCanalSwiftFin);
    this.enableTipoTransferencia(chkIdCanalSwiftFile);
    this.validStatusClient(this.datos.idEstatus);
  }
  /** Funcion para obtener el estatus de seleccion del canal
   *
   * @param idCanal Identificador del canal
   * @return Estatus de seleccion del canal
   */
  getEstatusSeleccionCanal(idCanal: any) {
    var estatusSeleccion: boolean = false;
    let canalesForm = this.productosForm.get('canales') as FormArray;
    canalesForm.controls.forEach((element, index) => {
      if (element.value['idCanal'] === idCanal) {
        estatusSeleccion = element.value['estadoSeleccion'];
      }
    });
    return estatusSeleccion;
  }

  /** Funcion que mapea los canales a un array de checkbox para tener el contro de los valores seleccionados */
  private getChkCanales() {
    const formArray = this.productosForm.get('canales') as UntypedFormArray;
    this.canales.forEach((canal) => {
      formArray.push(
        new UntypedFormGroup({
          descripcion: new UntypedFormControl(canal.descripcion),
          estadoCanal: new UntypedFormControl(
            canal.estadoCanal === 'A' ? true : false
          ),
          estadoSeleccion: new UntypedFormControl(
            this.productosForm.controls['idCanalCore'].value == canal.idCanal
              ? { value: canal.estadoSeleccion, disabled: true }
              : canal.estadoSeleccion === 'A'
                ? {
                  value: true,
                  disabled: this.isCancelStatusClient ? true : false,
                }
                : {
                  value: false,
                  disabled: this.isCancelStatusClient ? true : false,
                }
          ),
          idCanal: new UntypedFormControl(canal.idCanal),
          idCnt: new UntypedFormControl(canal.idCnt),
          nombre: new UntypedFormControl(canal.nombre),
        })
      );
    });
  }

  /** Funcion para definir la lista de productos
   *
   * @param products Lista del productos del contrato
   */
  getLstProductos(products: any) {
    this.productos = products;
    this.productos.forEach((p) => {
      if (p.asignado === 'S') {
        p.asignado = true;
      } else {
        p.asignado = false;
      }
      if (p.envioEmail === 'checked') {
        p.envioEmail = true;
      } else {
        p.envioEmail = false;
      }
      if (
        this.productosForm.controls['bandEdicionProductos'].value == 'A' &&
        (p.aplicaContratoConfirming === 'A' ||
          p.aplicaContratoProvConfirming === 'A')
      ) {
        p.aplicaContratoConfirming = 'S';
      } else {
        p.aplicaContratoConfirming = 'N';
      }
      if (p.aplicaTipoCargo == 'A' && (p.tipoCargo == '' || p.tipoCargo == '-')) {
        p.tipoCargo = 'D';
      }
      if (p.aplicaVigencia == 'A' && (p.vigencia <= 0 || p.vigencia == '')) {
        p.vigencia = 30;
      }
    });
    this.dataSource = new MatTableDataSource(this.productos);
  }

  /** Funcion para verificar el valor del campo nemonico, en caso de que no tenga valor, toma la razon social y la define */
  verifyNemonico() {
    var nemonico = this.productosForm.controls['nemonico'].value;
    if (nemonico == '') {
      var razonSocial = this.datos.razonSocial;
      this.productosForm.controls['nemonico'].setValue(
        razonSocial.substring(0, 4)
      );
    }
  }

  /** Funcion que limpiar los datos del formulario */
  cleanDatos() {
    var bandCambioProd: any = document.getElementById('bandCambioProd');
    var verificarCuentaBeneficiaria: any = document.getElementById(
      'verificarCuentaBeneficiaria'
    );
    var usarClabeParaEdoCta: any = document.getElementById(
      'usarClabeParaEdoCta'
    );
    var usarCifrasControl: any = document.getElementById('usarCifrasControl');
    var nemonico: any = document.getElementById('nemonico');
    var periodoHabilitacion: any = document.getElementById(
      'periodoHabilitacion'
    );

    if (bandCambioProd.checked) {
      bandCambioProd.checked = false;
    }
    if (verificarCuentaBeneficiaria.checked) {
      verificarCuentaBeneficiaria.checked = false;
    }
    if (usarClabeParaEdoCta.checked) {
      usarClabeParaEdoCta.checked = false;
    }
    if (usarCifrasControl.checked) {
      usarCifrasControl.checked = false;
    }
    if (nemonico.value !== '') {
      nemonico.value = '';
    }
    if (periodoHabilitacion.value !== '') {
      periodoHabilitacion.value = 0;
    }

    let array: any = [];
    this.canales.forEach((element, index): any => {
      let { descripcion, estadoCanal, idCanal, idCnt, nombre } = element;
      let estadoSeleccion =
        this.productosForm.controls['idCanalCore'].value == element.idCanal
          ? true
          : false;
      array = [
        ...array,
        { descripcion, estadoCanal, idCanal, idCnt, nombre, estadoSeleccion },
      ];
    });
    this.productosForm.controls['canales'].setValue(array);
    this.productosForm.controls['bic'].setValue('');
    this.productosForm.controls['bic'].disable();
    this.productosForm.controls['tipoTransferencia'].setValue('');
    this.productosForm.controls['tipoTransferencia'].disable();
    this.productosForm.controls['messagePartner'].setValue('');
    this.productosForm.controls['messagePartner'].disable();
    // formArray.controls.forEach
    this.dataSource.data.forEach((p) => {
      p.asignado = false;
      p.numeroReintentos = '';
      p.intervaloReintentos = '';
      p.envioEmail = false;
      p.tipoCargo = '';
      p.vigencia = '';
    });
  }

  /** Funcion que valida el contenido del campo message partner
   *
   * @param event Datos del input de message partner
   */
  validateMessagePartner(event: any) {
    var buc = event.target.value;
    var regex = /[^0-9]/gi;
    buc = buc.replace(regex, '');
    this.productosForm.controls['messagePartner'].setValue(buc);
    if (buc === '0') {
      this.productosForm.controls['messagePartner'].setValue('0');
    } else if (buc !== '') {
      buc = this.fillIzq(buc, 4);
      this.productosForm.controls['messagePartner'].setValue(buc);
    }
  }

  /** Funcion que rellena con ceros el contenido de un input
   *
   * @param buc Codigo del cliente
   * @param tamanio Tamanio del codigo
   */
  fillIzq(buc: any, tamanio: any) {
    var i;
    if (buc != '') {
      if (buc.length < tamanio) {
        for (i = buc.length; i < tamanio; i = buc.length) {
          buc = '0' + buc;
        }
      }
    }
    return buc;
  }

  /** Funcion para deshabilitar elementos
   *
   * @param idCanal Identificador del canal
   */
  eventDisableElementos(idCanal: any) {
    var idCanalSwiftFin: any =
      this.productosForm.controls['idCanalSwiftFin'].value;
    var idCanalSwiftFile: any =
      this.productosForm.controls['idCanalSwiftFile'].value;
    var chkIdCanalSwiftFin: any = document.getElementById(
      'canales' + idCanalSwiftFin
    );
    var chkIdCanalSwiftFile: any = document.getElementById(
      'canales' + idCanalSwiftFile
    );

    if (idCanalSwiftFin == idCanal) {
      this.enableBIC(chkIdCanalSwiftFin.checked, chkIdCanalSwiftFile.checked);
      this.enableMessagePartner(chkIdCanalSwiftFin.checked);
    }
    if (idCanalSwiftFile == idCanal) {
      this.enableBIC(chkIdCanalSwiftFin.checked, chkIdCanalSwiftFile.checked);
      this.enableTipoTransferencia(chkIdCanalSwiftFile.checked);
    }
  }

  /** Funcion para deshabilitar elemento bic
   *
   * @param canalSwiftFin Estado seleccionado del canal SwiftFin
   * @param canalSwiftFile Estado seleccionado del canal SwiftFile
   */
  enableBIC(canalSwiftFin: any, canalSwiftFile: any) {
    if (!canalSwiftFin && !canalSwiftFile) {
      this.productosForm.controls['bic'].setValue('');
      this.productosForm.controls['bic'].disable();
    } else if (canalSwiftFin || canalSwiftFile) {
      this.productosForm.controls['bic'].enable();
    }
  }

  /** Funcion para deshabilitar elemento message partner
   *
   * @param canalSwiftFin Estado seleccionado del canal SwiftFin
   */
  enableMessagePartner(canalSwiftFin: any) {
    if (!canalSwiftFin) {
      this.productosForm.controls['messagePartner'].setValue('');
      this.productosForm.controls['messagePartner'].disable();
    } else {
      this.productosForm.controls['messagePartner'].enable();
    }
  }

  /** Funcion para deshabilitar elemento tipo tranferencia
   *
   * @param canalSwiftFile Estado seleccionado del canal SwiftFin
   */
  enableTipoTransferencia(canalSwiftFile: any) {
    if (!canalSwiftFile) {
      this.productosForm.controls['tipoTransferencia'].setValue('');
      this.productosForm.controls['tipoTransferencia'].disable();
    } else {
      this.productosForm.controls['tipoTransferencia'].enable();
    }
  }


  // Obten los datos Confirming
  getConfirming() {
    let contratosConf: any;
    // Recorremos los datos
    this.dataSource.filteredData.map((item: any) => {

      // Recorremos los datos del Modal para obtener y asignar los contratos confirming
      Object.entries(this.contratosConf).forEach(function (entry) {
        if (Number(entry[0]) === Number(item.id)) {
          contratosConf = entry[1];
          if (contratosConf != undefined && contratosConf.length > 0) {
            const obj: any = contratosConf;
            console.log('Entro en ' + item.id);
            item.contratosConfirming = obj;
            contratosConf = [];
          }
        }
      });
    });
    // Retornamos el arreglo
    return this.dataSource.filteredData;
  }


  /** Funcion que guarda la lista de productos del contrato */
  async saveContrato() {
    if (this.datospersonales.idEstatus == this.idEstatusCancelado) {
      this.open(
        this.translate.instant('Error'),
        this.translate.instant('producto.dependenciErrorBack'),
        'error'
      );
      return;
    }
    if (this.datospersonales.idEstatus != null && this.datospersonales.idEstatus) {
      this.datos.idEstatus = Number(this.datospersonales.idEstatus);
      this.datos.descEstatus = this.datospersonales.descEstatus.toString();
    }
    const {
      nemonico,
      idCanalSwiftFile,
      idCanalSwiftFin,
      bic,
      messagePartner,
      tipoTransferencia,
      periodoHabilitacion,
      canales,
    } = this.productosForm.controls;

    const { numContrato, idContrato, descEstatus } = this.datos;
    let chkIdCanalSwiftFin: boolean = this.getEstatusSeleccionCanal(
      this.productosForm.controls['idCanalSwiftFin'].value
    );

    let chkIdCanalSwiftFile: boolean = this.getEstatusSeleccionCanal(
      this.productosForm.controls['idCanalSwiftFile'].value
    );

    // Llemos el arreglo y obtenemos los contratos confirming
    this.dataSource.filteredData = this.getConfirming();

    const datosObligatorios = {
      datosCliente: { numContrato, idContrato, descEstatus },
      datosForm: {
        idCanalSwiftFile,
        idCanalSwiftFin,
        bic,
        messagePartner,
        tipoTransferencia,
        periodoHabilitacion,
      },
      productos: this.dataSource.filteredData,
      chkIdCanalSwiftFin,
      chkIdCanalSwiftFile,
    };

    if (this.validateCL.validaNemonico(nemonico) === false) {
      return this.mostrarError(
        'Error',
        'pantalla.productos.admin.productos.nemonico.error',
        'error',
        'NEMO01'
      );
    }

    try {
      if (this.validateCL.longitudContratoValida(numContrato)) {
        const codigoValidacion = this.validateCL.validarCamposObligatorios(datosObligatorios, this.checkConfirming);
        this.checkConfirming = false;
        if (codigoValidacion === 'CTERR00') {
          if (numContrato === '0') {
            return this.mostrarError(
              'Error',
              'pantalla.productos.admin.productos.contrato.error'
            );
          } else {
            if (
              this.validateCL.validaReintentos(this.dataSource.filteredData)
            ) {
              const request = this.validateCL.armarRequest(
                this.productosForm.controls,
                this.datos,
                this.dataSource.filteredData,
                canales
              );

              const dialogo: any = this.openModalConfGuardado()

              return dialogo.afterClosed().subscribe(async (resp: string) => {

                if (resp !== '') {
                  try {
                    await this.service.guardarProductos(request).then(async (result: any) => {
                      if (result.codigo === 'OK00000' && !result.bandMostrarAdvertencia) {
                        this.open(
                          this.translate.instant('productos.msjCONT0000Titulo'),
                          this.translate.instant('productos.msjCONT0000Sugerencia'),
                          'info',
                          this.translate.instant('productos.msjCONT0000Codigo'),
                          this.translate.instant('productos.msjCONT0000Observacion')
                        );
                        this.reloadCurrentPage();
                      }
                      if (result.codigo !== 'OK00000') {
                        this.open(
                          this.translate.instant('ERROR'),
                          this.translate.instant(result.mensaje),
                          'error'
                        );
                      }
                      if (result.bandMostrarAdvertencia) {
                        this.open(
                          this.translate.instant('productos.msjCONT0000Titulo'),
                          this.translate.instant('admonContratos.msjCONT0000Sugerencia'),
                          'info',
                          this.translate.instant('admonContratos.msjCONT0000Codigo'),
                          this.translate.instant('admonContratos.msjCONT0000Observacion')
                        );
                      }
                      this.globals.loaderSubscripcion.emit(false);
                    });
                  } catch (error) {
                    this.open(
                      this.translate.instant('modals.productos.error'),
                      this.translate.instant('pantalla.productos.admin.productos.error.CTERR03'),
                      'error'
                    );
                    this.globals.loaderSubscripcion.emit(false);
                  }
                }
              });
            } else {
              return this.mostrarError(
                'Error', 'pantalla.productos.admin.productos.error.CONT0022', 'error'
              );
            }
          }
        } else {
          var error = 'Error';
          var sugerencia = '';
          if (codigoValidacion === 'CTERR11') {
            error = this.translate.instant(`pantalla.productos.admin.productos.title.${codigoValidacion}`);
            sugerencia = this.translate.instant(`pantalla.productos.admin.productos.sugerencia.${codigoValidacion}`);
          }
          return this.mostrarError(
            error, `pantalla.productos.admin.productos.error.${codigoValidacion}`, 'error',
            codigoValidacion, sugerencia
          );
        }
      } else {
        return this.mostrarError(
          'Error', 'pantalla.productos.admin.productos.contrato.error', 'error'
        );
      }

    } catch (error) {
      this.open(
        this.translate.instant('modals.productos.error'),
        this.translate.instant('pantalla.productos.admin.productos.error.CTERR03'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }


  /** Funcion que guarda la lista de productos del contrato */
  cancelContrato() { }

  /** Funcion para abrir el modal de exportacion */
  exportProductos() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.generateReporte(result);
      }
    });
  }

  /**
   * Funcion para poder realizar la peticion para el generar reporte
   */
  private async generateReporte(tipo: string) {
    if (tipo === 'xlsx') {
      tipo = 'xls';
    }
    try {
      await this.service
        .getReporte(this.datos.numContrato, this.usuarioActual, tipo)
        .then(async (result: any) => {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);

        });
    } catch (e) {
      this.open(
        this.translate.instant('general.INF001.titulo'),
        this.translate.instant('general.INF001.observacion'),
        'info',
        this.translate.instant('general.INF001.codigo'),
        this.translate.instant('general.INF001.sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);

    }
  }

  /**
   * Funcion para abrir el modal informacion
   *
   * @param titulo Titulo del mensaje
   * @param contenido Contenido del mensaje
   */
  open(
    titulo: string,
    contenido: string,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  /**
   * Funcion que valida que se ingresen solo mayusculas, minusculas y numeros, en caso de que se quieran ingresar datos diferentes no se permitira
   *
   * @param event Datos ingresador por teclado
   */
  onlyAlphaNumber(event: any) {
    this.fc.alphaNumberOnly(event);
  }

  /** Funcion que convierte el contenido de un input a Mayusculas
   *
   * @param obj Id del elemento
   */
  upperCase(obj: any) {
    var valor: any = document.getElementById(obj);
    valor.value = valor.value.toUpperCase();
  }

  /**
   * Funcion que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
   *
   * @param event Datos ingresador por teclado
   */
  onlyNumbers(event: any) {
    this.fc.numberOnly(event);
  }

  /** Funcion para deshabilitar los elementos del producto seleccionado
   *
   * @param event Datos ingresador por teclado
   * @param id Identificador del producto
   */
  enableParamProdSelect(event: any, id: any) {
    var tipoCargo: any = document.getElementById('tipoCargo' + id);
    var envioEmail: any = document.getElementById('envioEmail' + id);
    var vigencia: any = document.getElementById('vigencia' + id);
    var numeroReintentos: any = document.getElementById(
      'numeroReintentos' + id
    );
    var intervaloReintentos: any = document.getElementById(
      'intervaloReintentos' + id
    );
    if (event.target.checked) {
      if (tipoCargo != null) {
        tipoCargo.removeAttribute('disabled');
      }
      if (envioEmail != null) {
        envioEmail.removeAttribute('disabled');
      }
      if (vigencia != null) {
        vigencia.removeAttribute('disabled');
      }
      if (numeroReintentos != null) {
        numeroReintentos.removeAttribute('disabled');
      }
      if (intervaloReintentos != null) {
        intervaloReintentos.removeAttribute('disabled');
      }
    } else {
      if (tipoCargo != null) {
        tipoCargo.setAttribute('disabled', 'disabled');
      }
      if (envioEmail != null) {
        envioEmail.setAttribute('disabled', 'disabled');
      }
      if (vigencia != null) {
        vigencia.setAttribute('disabled', 'disabled');
      }
      if (numeroReintentos != null) {
        numeroReintentos.setAttribute('disabled', 'disabled');
      }
      if (intervaloReintentos != null) {
        intervaloReintentos.setAttribute('disabled', 'disabled');
      }
    }
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

  mostrarError(
    titulo: string,
    msj: string,
    type?: string,
    errorCode?: string,
    sugerencia?: string
  ) {
    return this.open(
      this.translate.instant(titulo),
      this.translate.instant(msj),
      type,
      errorCode,
      sugerencia
    );
  }

  openModalConfGuardado() {
    if (this.datospersonales.idEstatus === this.idEstatusCancelado && this.firstLoadIsCancel) {
      return;
    }
    let titulo = this.datospersonales.idEstatus != this.idEstatusCancelado ? this.translate.instant('modal.parametros.confirmacion') : '';
    let contenido =
      this.datospersonales.idEstatus != this.idEstatusCancelado
        ? this.translate.instant('modal.parametros.confirmacion.pregunta')
        : this.translate.instant('producto.cancelContrat');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true
    });

    return dialogo;

  }

  openModalConfGuardadoYN() {
    let titulo = this.translate.instant('modals.parametros.alerta');
    let contenido = this.translate.instant('modal.parametros.cancelar.pregunta');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'yesNo'), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((res) => {
      if (res.toLowerCase() === 'si') {
        this.cancelContrato();
      } else {
        return;
      }
    });
  }

  reloadCurrentPage() {
    this.ngOnInit();
    const element: any = document.querySelector('#productosContrato');
    element.scrollIntoView();
  }

  validStatusClient(status: number) {
    if (status == this.idEstatusCancelado) {
      this.productosForm.get('nemonico')?.disable();
      this.productosForm.get('alias')?.disable();
      this.productosForm.get('bandCambioProd')?.disable();
      this.productosForm.get('verificarCuentaBeneficiaria')?.disable();
      this.productosForm.get('usarClabeParaEdoCta')?.disable();
      this.productosForm.get('messagePartner')?.disable();
      this.productosForm.get('tipoTransferencia')?.disable();
      this.productosForm.get('bic')?.disable();
      this.productosForm.get('estadoSeleccion')?.disable();
      this.productosForm.get('usarCifrasControl')?.disable();
      this.isCancelStatusClient = true;
    } else if (!this.firstLoadIsCancel) {
      this.productosForm.get('nemonico')?.enable();
      this.productosForm.get('alias')?.enable();
      this.productosForm.get('bandCambioProd')?.enable();
      this.productosForm.get('verificarCuentaBeneficiaria')?.enable();
      this.productosForm.get('usarClabeParaEdoCta')?.enable();
      this.productosForm.get('messagePartner')?.enable();
      this.productosForm.get('tipoTransferencia')?.enable();
      this.productosForm.get('bic')?.enable();
      this.productosForm.get('estadoSeleccion')?.enable();
      this.productosForm.get('usarCifrasControl')?.enable();
    }
  }

  seleccion(e: any) {
    this.datospersonales.idEstatus = e.target.value;
    this.datospersonales.descEstatus = this.lstEstatusContrato.find(
      (s) => s.idCat === Number(e.target.value)
    ).descripcionCatalogo;
    this.validStatusClient(e.target.value);
  }
  /**
   * Metodo para obtener los datos del estatus del contrato
   */
  async getEstatusContrato() {
    try {
      await this.service.getEstatusContrato().then(async (resp: any) => {
        if (resp.codigo == 'OK00000') {
          this.lstEstatusContrato = resp.lstEstatusContrato;
          this.idEstatusContratoDef = resp.idEstatusContratoDef;
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch (e) {
      this.open(
        this.translate.instant('modals.altacontratos.error'),
        this.translate.instant('modals.altacontratos.error.estatus.contrato'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  validFirstLoad() {
    this.productosForm.disable();
  }

  /**
   * Vista de la Ventana Modal
   * 
   * @param id idContrato Confirming
   * @returns Ventana Modal
   */
  openModalSelect(id: string) {
    const index = this.dataSource.filteredData.findIndex(item => item.id === id)
    let contratosConf: any;
    // Recorremos los datos del Modal
    Object.entries(this.contratosConf).forEach(function (entry) {
      if (Number(entry[0]) === Number(id)) {
        contratosConf = entry[1];
      }
    });

    const obj: any = contratosConf;
    this.dataSource.filteredData[index].contratosConfirming = obj
    var contratosConfirmingList = this.dataSource.filteredData[index].contratosConfirming

    if (contratosConfirmingList.length === 0) {
      this.open(
        this.translate.instant('modal.productos.confirm.nodata'),
        this.translate.instant('modal.productos.confirm.noprod'),
        'error'
      );
      return;
    }

    const modalRefConfig = new MatDialogConfig();
    modalRefConfig.disableClose = true;
    modalRefConfig.autoFocus = false;
    modalRefConfig.width = '350px';
    modalRefConfig.height = '510px';
    modalRefConfig.data = {
      listaDatos: contratosConfirmingList,
      buc: this.datospersonales.bucCliente
    }
    var dialogo = this.dialog.open(ModalProductosConfirmingComponent, modalRefConfig);
    dialogo.afterClosed().subscribe((listSelect: any) => {
      let found = 0;
      if (listSelect !== undefined) {
        this.dataSource.filteredData[index].contratosConfirming = listSelect;
        listSelect.map((item: any) => {
          if (item.asignado === 'true' || item.status === 'A') {
            found++;
          }
        })
      }
      // Validamos para hacer un check a la opcion de confirming
      if (found > 0) {
        this.dataSource.filteredData[index].asignado = true;
        this.checkConfirming = true;
      } else {
        this.checkConfirming = false;
        this.dataSource.filteredData[index].asignado = false;
      }
      this.contratosConf[id.toString()] = listSelect;
    });
  }
}
