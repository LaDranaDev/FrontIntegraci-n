import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { CuentasOrdenantesService } from 'src/app/services/admin-contratos/cuentas-ordenantes.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Component({
  selector: 'app-cuentas-ordenantes',
  templateUrl: './cuentas-ordenantes.component.html',
  // styleUrls: ['./cuentas-ordenantes.component.css']
})
export class CuentasOrdenantesComponent implements OnInit {
  dataContract: DatosCuentaBeanComponent;
  clickSuscliption: Subscription | undefined;
  ctasList: any = [];
  ctasShowList: any = []
  page: number = 0;
  rowsPorPagina: number = 10;
  nombreArchivo: string = "";
  archivoSelec: any = null;
  totalRegistros: number = 0;
  objPageable: IPaginationRequest;
  usuarioActual: string | null = '';
  listaCuentas: {};

  formSaveCta: UntypedFormGroup = this.fb.group({
    cuenta: [''],
    bic: [''],
    estatus: new FormControl(
      { value: '', disabled: true },
    ),
    titular: [''],
    terceros: [false],
  });

  formSearchCta: UntypedFormGroup = this.fb.group({
    cuenta: [''],
  });

  banderaTerceros: string = "";
  ctaDtoTemp: any;
  constructor(
    private commonService: ComunesService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private globals: Globals,
    private fb: FormBuilder,
    private fc: FuncionesComunesComponent,
    private ctaOrdService: CuentasOrdenantesService,
  ) {
    // Obtenemos los datos del usuario
    this.usuarioActual = localStorage.getItem('UserID');
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
    }
  }

  ngOnInit(): void {
    this.dataContract = this.commonService.datosContrato;

    this.clickSuscliption = this.commonService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.consultaQuery(true);
      }
    });
  }

  /**
  * Metodo para consulta de datos
  */
  async consultaQuery(inicio: boolean) {
    this.listaCuentas = {};
    try {
      if (inicio) {
        this.page = 0;
      }
      await this.ctaOrdService.consultaCuentas(
        { hdnContratoFolio: this.dataContract.numContrato },
        this.fillObjectPag(this.page, this.rowsPorPagina)
      ).then(
        async (resp: any) => {
          this.listaCuentas = resp.listaCuentas;
          this.totalRegistros = resp.respuesta.totalElements;
        });
      this.showResultQuery(this.listaCuentas, inicio);
      this.limpiarSeleccion();
    } catch (error) {
      console.log(error);
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  open(
    titulo: String,
    contenido: String,
    type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code: string,
    sugerencia: string
  ) {
    this.dialog.open(ModalInfoComponent, {
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


  onPageChanged(event: any) {
    this.page = event.page;
    this.showResultQuery(this.listaCuentas, false);
  }

  showResultQuery(listaCuentas: any, inicio: boolean) {
    this.ctasList = listaCuentas;
    if (inicio) {
      this.page = 0
      this.ctasShowList = this.ctasList ? this.ctasList.slice(0, this.rowsPorPagina) : [];
    } else {

      const startItem = (this.page - 1) * this.rowsPorPagina;
      const endItem = this.page * this.rowsPorPagina;
      this.ctasShowList = this.ctasList.slice(startItem, endItem);
    }
  }

  selCta(event: any) {
    const { checked, value } = event.target
    this.ctasShowList.find((item: any) => {
      if (item.idContratoCuenta === parseInt(value)) {
        item.selection = checked
      }
    })

  }

  /**
* @descripcion Metodo para poder generar y regresar el objeto con la paginacion
*
* @param numPage valor para indicar el numero de la pagina
* @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
*/
  fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }


  limpiarSeleccion() {
    this.ctasShowList.map((item: any) => {
      item.selection = false;
      return item;
    });
  }

  async readArchivo(fileEvent: any) {
    this.archivoSelec = fileEvent.target.files[0];
    this.nombreArchivo = this.archivoSelec.name;
  }

  async buscarContrato() {
    this.page = 0;
    const { cuenta } = this.formSearchCta.value
    const { numContrato } = this.dataContract;

    if (!this.validarLongitud(cuenta)) {
      return this.cleanAll()
    };

    const payload = {
      txtCuentaBuscar: cuenta,
      txtBic: "",
      hdnContratoFolio: numContrato,
      folioEnc: numContrato
    };

    const response = await this.ctaOrdService.consultaCuentas(payload, this.fillObjectPag(this.page, this.rowsPorPagina))
    const { codError, listaCuentas } = response;
    // Validamos que existan datos
    if (response.respuesta != undefined || response.respuesta != null) {
      this.totalRegistros = response.respuesta.totalElements;
    }

    this.globals.loaderSubscripcion.emit(false);

    if (codError) {
      this.mostrarMsj(codError, false)
    }
    this.listaCuentas = listaCuentas ? listaCuentas : [];

    return this.showResultQuery(this.listaCuentas, true);

  }

  limpiarAdminCtaOperantes() {
    this.formSaveCta.patchValue({
      cuenta: '',
      bic: '',
      estatus: '',
      titular: '',
      terceros: false,
    });
  }

  limpiarCtaConsulta() {
    this.formSearchCta.patchValue({
      cuenta: '',
    });
  }

  validaCta(cuenta: string): boolean {
    if (cuenta.length === 11) {
      return true
    } else {
      this.open(
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Titulo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Observacion'),
        'alert',
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Codigo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Sugerencia'),
      );
      return false;
    }

  }

  agregaValor() {
    const { terceros } = this.formSaveCta.value

    if (terceros) {
      this.banderaTerceros = "2";
    } else {
      this.banderaTerceros = "1";
    }
  }

  async ValidarDatosCuenta() {
    const { cuenta, bic, estatus, titular } = this.formSaveCta.value;
    const { numContrato, idContrato, bucCliente } = this.dataContract;

    try {
      if (!this.validarLongitud(cuenta) || !this.validaCta(cuenta) || !this.validaBic(bic)) {
        return this.cleanAll()
      }
      this.agregaValor();

      const request = {
        txtBic: bic,
        codigoCliente: bucCliente,
        chkTerceros: this.banderaTerceros,
        idContrato,
        txtCuenta: cuenta,
        txtEstatus: estatus,
        txtTitularCuenta: titular,
        folioEnc: numContrato,
        hdnContratoFolio: numContrato
      }
      const response = await this.ctaOrdService.validaCuenta(request);
      const { codError, cuentaDto } = response;
      this.globals.loaderSubscripcion.emit(false);
      if (response) {
        if (codError && codError != 'B4130000') {
          this.mostrarMsj(codError, true);
        } else {
          this.ctaDtoTemp = cuentaDto;
          this.formSaveCta.patchValue({
            cuenta: cuentaDto.numCuenta ? cuentaDto.numCuenta : "",
            bic: cuentaDto.bic ? cuentaDto.bic : "",
            estatus: cuentaDto.statusCuenta ? cuentaDto.statusCuenta : "NO BLOQUEADA",
            titular: cuentaDto.titular ? cuentaDto.titular : "",
            terceros: cuentaDto.terceros ? cuentaDto.terceros : "",
          });
        }
        return
      }

    } catch (error) {

    }
    this.globals.loaderSubscripcion.emit(false);
  }

  validarLongitud(cuenta: string) {
    if (cuenta.length === 0 || cuenta.length === 11) {
      return true;
    } else {
      this.open(
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Titulo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjERR008Observacion'),
        'alert',
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Codigo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Sugerencia')
      );
      return false;
    }
  }

  validarLongitudAlta(cuenta: string) {
    if (cuenta.length === 11) {
      return true;
    } else {
      this.open(
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Titulo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjERR008Observacion'),
        'alert',
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Codigo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00013Sugerencia')
      );
      return false;
    }
  }

  validaBic(bic: string) {
    if (bic !== '') {
      if (bic.length === 11 || bic.length === 8) {
        return true;
      } else {
        this.open(
          this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Titulo'),
          this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Observacion'),
          'alert',
          this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Codigo'),
          this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Sugerencia')
        );
        return false;
      }
    } else {
      return true;
    }
  }

  cleanAll() {
    this.limpiarSeleccion()
    this.limpiarCtaConsulta()
    return this.limpiarAdminCtaOperantes();
  }

  limpiarFile() {
    this.archivoSelec = null;
    this.nombreArchivo = '';
  }

  async guardarMasivo() {
    const {
      idContrato,
      bucCliente,
      numContrato,
    }: any = this.dataContract
    if (this.nombreArchivo.includes('xls')) {
      // const response = await this.ctaOrdService.altaMasiva()
      const formDataArchivo: FormData = new FormData();
      formDataArchivo.append('archivo', this.archivoSelec);
      formDataArchivo.append('idContrato', idContrato);
      formDataArchivo.append('codigoCliente', bucCliente);
      formDataArchivo.append('hdnContratoFolio', numContrato);
      formDataArchivo.append('folioEnc', numContrato);

      return this.openConfirmYN('subirArchivo', this.translateService.instant('modals.parametros.confirmacion'), this.translateService.instant('modals.parametros.confirmacion.contenido'), formDataArchivo);

    } else {
      return this.open(
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00023Titulo'),
        `${this.translateService.instant('pantalla.cuentasOrdenantes.archivo')} [xls, xlsx]`,
        'alert',
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00023Codigo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00023Sugerencia')
      );
    }
  }


  exportData(): void {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(async (result) => {
      if (result) {
        const { numContrato, idContrato } = this.dataContract
        const { cuenta } = this.formSearchCta.value
        const type = result.includes('xls') ? 'excel' : result;
        const request = {
          txtCuentaBuscar: cuenta,
          hdnContratoFolio: numContrato,
          exportarCuenta: true,
          idContrato,
          formato: type
        };

        try {
          const response = await this.ctaOrdService.exportFile(
            request, this.usuarioActual
          );
          if (response) {
            this.fc.convertBase64ToDownloadFileInExport(response);
          }
        } catch (error) {
          this.open(
            this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Titulo'),
            this.translateService.instant('EE'),
            'error',
            this.translateService.instant('pantalla.cuentasOrdenantes.msjMSJ00029Codigo'),
            ''
          );
        }
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  async saveCtaData() {
    const { cuenta, bic, estatus, titular } = this.formSaveCta.value;
    const { numContrato, idContrato, bucCliente } = this.dataContract;

    try {
      if (!this.validarLongitudAlta(cuenta) || !this.validaBic(bic)) {
        return false;
      }

      this.agregaValor();
      const request = {
        txtBic: bic,
        codigoCliente: bucCliente,
        chkTerceros: this.banderaTerceros,
        idContrato,
        txtCuenta: cuenta,
        txtEstatus: estatus,
        txtIdInterbancaria: this.ctaDtoTemp.bandIntercambiaria,
        txtIdPersonalidad: this.ctaDtoTemp.bandPersonalidad,
        txtTitularCuenta: titular,
        txtBicOrigi: this.ctaDtoTemp.bic,
        folioEnc: numContrato,
        hdnContratoFolio: numContrato
      }


      return this.openConfirmYN('alta', this.translateService.instant('modals.parametros.confirmacion'), this.translateService.instant('modals.parametros.confirmacion.contenido'), request);

    } catch (error) {

    }
  }

  async deleteData() {
    let txtId = ",";
    let txtId_cta = ",";
    this.ctasShowList.map((item: any) => {
      if (item.selection) {
        txtId += `${item.idContratoCuenta},`;
        txtId_cta += `${item.numCuenta},`;
        return item;
      }
    });

    if (txtId !== ",") {
      const { numContrato, idContrato } = this.dataContract
      const request = {
        txtCuentaBuscar: "",
        folioEnc: numContrato,
        hdnContratoFolio: numContrato,
        txtId,
        txtId_cta,
        idContrato
      };

      return this.openConfirmYN('eliminacion', this.translateService.instant('pantalla.cuentasOrdenantes.eliminarRegistro'), '', request);

    } else {
      return this.open(
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00012Titulo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00012Observacion'),
        'alert',
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00012Codigo'),
        this.translateService.instant('pantalla.cuentasOrdenantes.msjINF00012Sugerencia')
      );

    }



  }

  openConfirmYN(serviceName: string, titulo: string, contenido: string, request: any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', this.translateService.instant('cuentas.ordenantes.msjCNF00001Codigo')),
    });
    dialogo.afterClosed().subscribe(async (result) => {
      if (result === 'ok') {
        let response: any = {};
        let codError = null;
        let errorObtenido = false;
        try {
          if (serviceName === 'alta') {
            response = await this.ctaOrdService.validaCuentaContrato(request);
            this.ctaDtoTemp = null;
          }
          if (serviceName === 'eliminacion') {
            response = await this.ctaOrdService.eliminarCuentas(request);
          }
          if (serviceName === 'subirArchivo') {
            response = await this.ctaOrdService.altaMasiva(request);
            this.limpiarFile();
          }
          this.consultaQuery(true);
        } catch (error) {
          console.log("Regreso el error: " + error);
          // Capturmos el error que ocurra en alguna operacion
          errorObtenido = true;
        }
        if (errorObtenido) {
          this.open(
            "",
            this.translateService.instant("Ocurrio un error al realizar la operacin"),
            "error", "", "");
        } else {
          this.globals.loaderSubscripcion.emit(false);
          this.showResultQuery(response.listaCuentas, true);
          codError = response.codError;

          if (codError === 'RESULTA1') {
            var cadena = response.resultadoCarga.split(',');
            var mensaje = cadena[0] + "\n";
            mensaje += cadena[1] + "\n";
            mensaje += cadena[2] + "\n";
            mensaje += cadena[3] + "\n";
            mensaje += cadena[4];

            const confirm = this.dialog.open(ModalInfoComponent, {
              data: new ModalInfoBeanComponents(
                this.translateService.instant("pantalla.cuentasOrdenantes.AltaBajaCtaMasiva"),
                this.translateService.instant(mensaje),
                'confirm',
                "",
                ""
              ),
              hasBackdrop: true
            });

            confirm.afterClosed().subscribe(async (result) => {
              if (result === 'ok') {
                //Descarga de respuestas
                this.ctaOrdService.generarRespuestas(response.idCargaMasiva).then((resp: any) => {
                  this.fc.convertBase64ToDownloadFileInExport(resp);
                }).catch(() => {
                  this.dialog.open(ModalInfoComponent, {
                    data: new ModalInfoBeanComponents(
                      this.translateService.instant('modal.msjERRGEN0001Titulo'),
                      this.translateService.instant('modal.msjERRGEN0001Observacion'),
                      'error',
                      this.translateService.instant('modal.msjERRGEN0001Codigo'),
                      this.translateService.instant('modal.msjERRGEN0001Sugerencia')
                    ),
                  });
                }).finally(() =>
                  this.globals.loaderSubscripcion.emit(false)
                );
              }
            });

          } else {
            return this.mostrarMsj(codError, false);
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  mostrarMsj(codError: string, consulta: boolean) {
    this.limpiarAdminCtaOperantes();
    this.limpiarCtaConsulta();
    let title = "pantalla.cuentasOrdenantes."
    let obs = "pantalla.cuentasOrdenantes."
    let type: any = ""
    let code = "pantalla.cuentasOrdenantes."
    let sug = "pantalla.cuentasOrdenantes."
    if (!codError) {
      return
    }

    if (codError === 'RESULTA2') {// guardado exitoso
      title += 'msjINF00024Titulo';
      obs += 'msjINF00024Observacion';
      type += 'info';
      code += 'msjINF00024Codigo';
      sug += 'msjINF00024Sugerencia';
    } else if (codError === 'ACTABI02') {
      title += 'msjINF00001Titulo';
      obs += 'msjINF00001Observacion';
      type += 'info';
      code += 'msjINF00001Codigo';
      sug += 'msjINF00001Sugerencia';
    } else if (codError === 'ACTABI00') {
      title += 'msjINF00002Titulo';
      obs += 'msjINF00002Observacion';
      type += 'info';
      code += 'msjINF00002Codigo';
      sug += 'msjINF00002Sugerencia';
    } else if (codError === 'ACTABI01') {
      title += 'msjINF00003Titulo';
      obs += 'msjINF00003Observacion';
      type += 'info';
      code += 'msjINF00003Codigo';
      sug += 'msjINF00003Sugerencia';
    } else if (codError === 'B4130000') {
      title += 'msjINF00004Titulo';
      obs += 'msjINF00004Observacion';
      type += 'info';
      code += 'msjINF00004Codigo';
      sug += 'msjINF00004Sugerencia';
    } else if (codError === 'ODA10001') {
      title += 'msjINF00005Titulo';
      obs += 'msjINF00005Observacion';
      type += 'info';
      code += 'msjINF00005Codigo';
      sug += 'msjINF00005Sugerencia';
    } else if (codError === 'ODA10002') {
      title += 'msjINF00006Titulo';
      obs += 'msjINF00006Observacion';
      type += 'info';
      code += 'msjINF00006Codigo';
      sug += 'msjINF00006Sugerencia';
    } else if (codError === 'ACTABD00') {
      title += 'msjINF00007Titulo';
      obs += 'msjINF00007Observacion';
      type += 'info';
      code += 'msjINF00007Codigo';
      sug += 'msjINF00007Sugerencia';
    } else if (codError.includes('ACTABD01')) {
      title += 'msjINF00008Titulo';
      obs += 'msjINF00008Observacion';
      type += 'info';
      code += 'msjINF00008Codigo';
      sug += 'msjINF00008Sugerencia';
    } else if (codError === 'ACTABD02' && !consulta) {
      title += 'msjINF00009Titulo';
      obs += 'msjINF00009Observacion';
      type += 'info';
      code += 'msjINF00009Codigo';
      sug += 'msjINF00009Sugerencia';
    } else if (codError === 'ACTABD03') {
      title += 'msjINF00010Titulo';
      obs += 'msjINF00010Observacion';
      type += 'info';
      code += 'msjINF00010Codigo';
      sug += 'msjINF00010Sugerencia';
    } else if (codError === 'ERB41201') {
      title += 'msjINF00011Titulo';
      obs += 'msjINF00011Observacion';
      type += 'info';
      code += 'msjINF00011Codigo';
      sug += 'msjINF00011Sugerencia';
    } else if (codError === 'ODA10003') {
      title += 'msjINF00014Titulo';
      obs += 'msjINF00014Observacion';
      type += 'info';
      code += 'msjINF00014Codigo';
      sug += 'msjINF00014Sugerencia';
    } else if (codError === 'ACTABD04') {
      title += 'msjINF00015Titulo';
      obs += 'msjINF00015Observacion';
      type += 'info';
      code += 'msjINF00015Codigo';
      sug += 'msjINF00015Sugerencia';
    } else if (codError === 'ACTABD05') {
      title += 'msjINF00016Titulo';
      obs += 'msjINF00016Observacion';
      type += 'info';
      code += 'msjINF00016Codigo';
      sug += 'msjINF00016Sugerencia';
    } else if (codError === 'ACTABD06') {
      title += 'msjINF00017Titulo';
      obs += 'msjINF00017Observacion';
      type += 'info';
      code += 'msjINF00017Codigo';
      sug += 'msjINF00017Sugerencia';
    } else if (codError === 'ACTABD07') {
      title += 'msjINF00018Titulo';
      obs += 'msjINF00018Observacion';
      type += 'info';
      code += 'msjINF00018Codigo';
      sug += 'msjINF00018Sugerencia';
    } else if (codError === 'ACTABD08') {
      title += 'msjINF00019Titulo';
      obs += 'msjINF00019Observacion';
      type += 'info';
      code += 'msjINF00019Codigo';
      sug += 'msjINF00019Sugerencia';
    } else if (codError === 'ACTABD09') {
      title += 'msjINF00020Titulo';
      obs += 'msjINF00020Observacion';
      type += 'info';
      code += 'msjINF00020Codigo';
      sug += 'msjINF00020Sugerencia';
    } else if (codError === 'ACTABD10') {
      title += 'msjINF00021Titulo';
      obs += 'msjINF00021Observacion';
      type += 'info';
      code += 'msjINF00021Codigo';
      sug += 'msjINF00021Sugerencia';
    } else if (codError === 'ACTABD11') {
      title += 'msjINF00022Titulo';
      obs += 'msjINF00022Observacion';
      type += 'error';
      code += 'msjINF00022Codigo';
      sug += 'msjINF00022Sugerencia';
    } else if (codError === 'RESULTA3') {// guardado exitoso
      title += 'msjINF00025Titulo';
      obs += 'msjINF00025Observacion';
      type += 'info';
      code += 'msjINF00025Codigo';
      sug += 'msjINF00025Sugerencia';
    } else if (codError === 'RESULTA4') {// guardado exitoso
      title += 'msjINF00026Titulo';
      obs += 'msjINF00026Observacion';
      type += 'info';
      code += 'msjINF00026Codigo';
      sug += 'msjINF00026Sugerencia';
    } else if (codError === 'MSJ00027') {
      title += 'msjMSJ00027Titulo';
      obs += 'msjMSJ00027Observacion';
      type += 'info';
      code += 'msjMSJ00027Codigo';
      sug += 'msjMSJ00027Sugerencia';
    } else if (codError === 'MSJ00028') {
      title += 'msjMSJ00028Titulo';
      obs += 'msjMSJ00028Observacion';
      type += 'info';
      code += 'msjMSJ00028Codigo';
      sug += 'msjMSJ00028Sugerencia';
    } else if (codError === 'ERRBIC01') {
      title += 'msjMSJ00030Titulo';
      obs += 'msjMSJ00030Observacion';
      type += 'alert';
      code += 'msjMSJ00030Codigo';
      sug += 'msjMSJ00030Sugerencia';
    } else if (codError === 'ERB41202') {
      title += 'msjERB41202Titulo';
      obs += 'msjERB41202Observacion';
      type += 'alert';
      code += 'msjERB41202Codigo';
      sug += 'msjERB41202Sugerencia';
    } else if (codError === 'ERB41203') {
      title += 'msjERB41203Titulo';
      obs += 'msjERB41203Observacion';
      type += 'alert';
      code += 'msjERB41203Codigo';
      sug += 'msjERB41203Sugerencia';
    } else if (codError === 'ERB41302') {
      title += 'msjERB41302Titulo';
      obs += 'msjERB41302Observacion';
      type += 'alert';
      code += 'msjERB41302Codigo';
      sug += 'msjERB41302Sugerencia';
    } else if (codError === 'BGE5051') {
      title += 'msjBGE5051Titulo';
      obs += 'msjBGE5051Observacion';
      type += 'error';
      code += 'msjBGE5051Codigo';
      sug += 'msjBGE5051Sugerencia';
    } else if (codError === 'BGE0097' || codError === 'BGE5187') {
      console.log("Entro mensaje");
      title += 'msjBGE0097Titulo';
      obs += 'msjBGE0097Observacion';
      type += 'error';
      code += 'msj'+ codError +'Codigo';
      sug += 'msjBGE0097Sugerencia';
    } else if (codError === 'PEE1018') {
      title += 'msjPEE1018Titulo';
      obs += 'msjPEE1018Observacion';
      type += 'error';
      code += 'msjPEE1018Codigo';
      sug += 'msjPEE1018Sugerencia';
    } else if (codError === 'PEE0536') {
      title += 'msjPEE0536Titulo';
      obs += 'msjPEE0536Observacion';
      type += 'error';
      code += 'msjPEE0536Codigo';
      sug += 'msjPEE0536Sugerencia';
    } else if (codError === 'PEE0013') {
      title += 'msjPEE0013Titulo';
      obs += 'msjPEE0013Observacion';
      type += 'error';
      code += 'msjPEE0013Codigo';
      sug += 'msjPEE0013Sugerencia';
    } else if (codError === 'BGE0035') {
      title += 'msjBGE0035Titulo';
      obs += 'msjBGE0035Observacion';
      type += 'error';
      code += 'msjBGE0035Codigo';
      sug += 'msjBGE0035Sugerencia';
    } else if (codError === 'BGE0908') {
      title += 'msjBGE0908Titulo';
      obs += 'msjBGE0908Observacion';
      type += 'error';
      code += 'msjBGE0908Codigo';
      sug += 'msjBGE0908Sugerencia';
    } else if (codError === 'BGE5099') {
      title += 'msjBGE5099Titulo';
      obs += 'msjBGE5099Observacion';
      type += 'error';
      code += 'msjBGE5099Codigo';
      sug += 'msjBGE5099Sugerencia';
    } else if (codError === 'BGE0603') {
      title += 'msjBGE0603Titulo';
      obs += 'msjBGE0603Observacion';
      type += 'error';
      code += 'msjBGE0603Codigo';
      sug += 'msjBGE0603Sugerencia';
    } else if (codError === 'BGE5095') {
      title += 'msjBGE5095Titulo';
      obs += 'msjBGE5095Observacion';
      type += 'error';
      code += 'msjBGE5095Codigo';
      sug += 'msjBGE5095Sugerencia';
    } else if (codError === 'BGE5097') {
      title += 'msjBGE5097Titulo';
      obs += 'msjBGE5097Observacion';
      type += 'error';
      code += 'msjBGE5097Codigo';
      sug += 'msjBGE5097Sugerencia';
    } else if (codError === 'BGE5098') {
      title += 'msjBGE5098Titulo';
      obs += 'msjBGE5098Observacion';
      type += 'error';
      code += 'msjBGE5098Codigo';
      sug += 'msjBGE5098Sugerencia';
    } else if (codError === 'BGE0079') {
      title += 'msjBGE0079Titulo';
      obs += 'msjBGE0079Observacion';
      type += 'error';
      code += 'msjBGE0079Codigo';
      sug += 'msjBGE0079Sugerencia';
    } else if (codError === 'BGE0238') {
      title += 'msjBGE0238Titulo';
      obs += 'msjBGE0238Observacion';
      type += 'error';
      code += 'msjBGE0238Codigo';
      sug += 'msjBGE0238Sugerencia';
    } else if (codError === 'BGE5052') {
      title += 'msjBGE5052Titulo';
      obs += 'msjBGE5052Observacion';
      type += 'error';
      code += 'msjBGE5052Codigo';
      sug += 'msjBGE5052Sugerencia';
    } else if (codError === 'BGE2015') {
      title += 'msjBGE2015Titulo';
      obs += 'msjBGE2015Observacion';
      type += 'error';
      code += 'msjBGE2015Codigo';
      sug += 'msjBGE2015Sugerencia';
    } else {
      title = '';
      obs = '';
      type = '';
      code = '';
      sug = '';
    }

    if ((title != "" && obs != "") && (code != "" && sug != "")) {
      this.open(
        this.translateService.instant(title),
        this.translateService.instant(obs),
        type,
        this.translateService.instant(code),
        this.translateService.instant(sug)
      );
    }
  }

}
