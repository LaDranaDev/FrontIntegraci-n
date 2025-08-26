import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { IComprobantesFormatoCdmx } from 'src/app/interface/comprobantesFormatoCDMX.interface';
import { ComprobanteFormatoCDMXService } from 'src/app/services/monitoreo/comprobantes-formato-cdmx.service';

@Component({
  selector: 'app-detalle-operacion-formato-cdmx',
  templateUrl: './detalle-operacion-formato-cdmx.component.html',
  styleUrls: ['./detalle-operacion-formato-cdmx.component.css']
})

export class DetalleOperacionFormatoCdmxComponent implements OnInit {
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;

  detalleOperacion: any;
  datosDetalleOperacion: IComprobantesFormatoCdmx;
  comprobante: any;
  conceptoValor: any;

  /**
   * @description Formulario para la busqueda de comprobantes
   * @type {FormGroup}
   * @memberOf ComprobantesFormatoCdmxComponent
  */
  comprobanteFormatoForm!: UntypedFormGroup;

  constructor(
    public comprobanteService: ComprobanteFormatoCDMXService,
    private globals: Globals,
    public gestionComprobantesService: ComprobanteFormatoCDMXService,
    public dialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.consultar();
  }

  async consultar() {
    this.detalleOperacion = this.gestionComprobantesService.getSaveLocalStorage('detalleOperacion');
    try {
      await this.gestionComprobantesService.consultaDetalle(this.detalleOperacion).then(
        async (result: any) => {
          if (result.parametros.detalleOperacionDTO) {
            this.comprobante = result.parametros.detalleOperacionDTO;
            this.findConceptoValor();
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
            } else {
              this.open('Error',
                this.translate.instant('ErrC'), 'error');
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', this.translate.instant('ErrC'), 'error');
    }
  }

  async findConceptoValor() {
    try {
      let lineaCaptura = this.comprobante.lineaCaptura;
      lineaCaptura = lineaCaptura.substring(0,2);
      await this.gestionComprobantesService.obtieneValor(lineaCaptura).then(
        async (result: any) => {
          if (result.conceptoValor !== null) {
            this.conceptoValor = result.conceptoValor;
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
            } else {
              this.conceptoValor = '';
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', this.translate.instant('ErrC'), 'error');
    }
  }

  open(titulo: string, contenido: string, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    }
    );
  }

  regresar() {
    /** Se hace el redirect a la vista de alta */
    this.router.navigate(['/monitoreo/consultaOperacionFormatoCDMX']);
  }

  verHistorial() {
    this.gestionComprobantesService.setSaveLocalStorage('operacion', this.detalleOperacion);
    this.router.navigate(['/monitoreo/historialOperacionFormatoCDMX']);
  }

}
