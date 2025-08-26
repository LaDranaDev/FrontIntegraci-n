import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Globals } from '../../bean/globals-bean.component';
import { ComunesService } from '../../services/comunes.service';
import { FuncionesComunesComponent } from '../funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  //styleUrls: ['./busqueda-cliente.component.css']
})
export class BusquedaClienteComponent implements OnInit, OnChanges {
  /**Se inicializa componente*/
  datospersonales: any = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
    idEstatus: '',
  };
  @Output() valueChange = new EventEmitter();
  @Input() data: any;
  @Input() blocked: any;
  bloqueado: any;
  blockedForm: boolean = true;
  /** Lista de valores del estatus del contrato */
  lstEstatusContrato: any;
  /** Id del estatus default del contrato */
  idEstatusDef: any;
  /** Id del estatus default del contrato */
  idEstatusContratoDef: any;

  constructor(
    private globals: Globals,
    private service: ComunesService,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    public dialog: MatDialog,
    public comunesService: ComunesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.comunesService.datosContrato
    ? (this.data = this.comunesService.datosContrato)
    : null;
    if (this.data !== undefined) {
      this.datospersonales.bucCliente = this.data.bucCliente;
      this.datospersonales.cuentaEje = this.data.cuentaEje;
      this.datospersonales.numContrato = this.data.numContrato;
      this.datospersonales.razonSocial = this.data.razonSocial;
      this.datospersonales.descEstatus = this.data.descEstatus;
      this.datospersonales.idContrato = this.data.idContrato;
      this.datospersonales.idEstatus = this.data.idEstatus;
      this.idEstatusDef = this.data.idEstatus;
      this.bloqueado = true;
    } else {
      this.bloqueado = false;
      this.getEstatusContrato();
    }
    if (this.data === '') {
      this.bloqueado = false;
      this.getEstatusContrato();
    }
    if (this.data === '') {
      this.bloqueado = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (
        this.data !== undefined &&
        this.data !== '' &&
        (typeof this.data === 'string' || this.data instanceof String)
      ) {
        this.datospersonales.bucCliente = this.data;
        this.consultaDatosCliente();
        this.bloqueado = true;
      } else {
        this.bloqueado = false;
      }
    }

    if (changes['blocked']) {
      if (
        this.blocked !== undefined &&
        this.blocked !== '' &&
        this.blocked === false
      ) {
        this.bloqueado = false;
        this.blockedForm = false;
      } else {
        this.bloqueado = true;
        this.blockedForm = true;
      }
    }
  }
  /**Funcion: realiza la consulta de la informacion del cliente */
  consultaDatosCliente() {
    if (this.datospersonales.bucCliente != '') {
      this.service
        .consultaInformacionCliente(this.datospersonales.bucCliente)
        .then((resp: any) => {
          if (resp.codError == 'OK00000') {
            this.datospersonales.bucCliente = resp.bucCliente;
            this.datospersonales.cuentaEje = resp.cuentaEje;
            this.datospersonales.numContrato = resp.numContrato;
            this.datospersonales.razonSocial = resp.razonSocial;
            this.datospersonales.descEstatus = resp.descEstatus;
            this.datospersonales.idContrato = resp.idContrato;
            this.datospersonales.idEstatus = resp.idEstatus;
            //localStorage.setItem('bucClient', resp.bucCliente);
            this.globals.loaderSubscripcion.emit(false);
            this.valueChange.emit(this.datospersonales);
            this.service.datosContratoObtenido(true);
            this.service.otro(true);
            this.service.datos(this.datospersonales);
          } else {
            this.limpiar();
            this.globals.loaderSubscripcion.emit(false);
          }
        });
    } else {
      alert('Favor de ingresar un número de cliente');
      this.limpiar();
    }
  }
  /**Funcion que realiza el limpiado de los objetos */
  limpiar() {
    this.datospersonales = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    //localStorage.removeItem('bucClient');
  }

  /**
   * Metodo para solo ingrese numeros
   * en el input de numero de contrato
   */
  eventOnlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
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
      ),
      hasBackdrop: true 
    });
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
          this.idEstatusDef = resp.idEstatusContratoDef;
          await this.globals.loaderSubscripcion.emit(false);
        }
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
  async getEstatusContrato2() {
    try {
      await this.service.getEstatusContrato().then(async (resp: any) => {
        if (resp.codigo == 'OK00000') {
          this.lstEstatusContrato = resp.lstEstatusContrato;
          this.idEstatusContratoDef = resp.idEstatusContratoDef;
          await this.globals.loaderSubscripcion.emit(false);
        }
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
}
