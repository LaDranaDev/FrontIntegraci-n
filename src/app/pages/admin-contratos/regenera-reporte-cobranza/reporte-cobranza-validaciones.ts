import { Injectable } from "@angular/core";

@Injectable()

export class ReporteCobranzaValidacionesCL {
  async validaGuardado(form: any, configData: any): Promise<any> {
    let validationFlag = true;
    let bodyMsg = {
      titulo: 'pantalla.reporteCobranzaConsolidado.',
      obser: 'pantalla.reporteCobranzaConsolidado.',
      type: '',
      errorCode: 'pantalla.reporteCobranzaConsolidado.',
      sugerencia: 'pantalla.reporteCobranzaConsolidado.',
    };

    const {
      // idContrato,
      // optCanal,
      // optFormato,
      // optClaCarg,
      // optClaAbono,
      cantFilesRadioConsolid,
      // chkSigN,
      // optTipoContenido,
      // chkCta,
      // anulaciones,
    } = form;

    const {
      // idFormatoMT940D,
      // idFormatoMT940,
      // idFormatoMT942,
      // idFormatoMT940_42,
      // idFormatoRepCobTXT,
      // idCanalREPAL,
      // idCanalSwiftFin,
      // valorRecArcxCta,
      optIntradia,
      //  optOperCierre,
      optConsXDia,
      // bandCierre,
      // banderaProducto,
      // banderaProdActivo,
      // listCanales,
      // listFormats,
      // listClacones,
      // listClaconesSelected,
      // listCuentas,
      // horarios,
    } = configData;

      if (cantFilesRadioConsolid.value !== undefined && cantFilesRadioConsolid.value !== '') {
        const { flag, payload } = await this.validaCanal(configData, form);
        validationFlag = flag;
        bodyMsg.titulo += payload.titulo
        bodyMsg.obser += payload.obser
        bodyMsg.type = payload.type
        bodyMsg.errorCode += payload.errorCode
        bodyMsg.sugerencia += payload.sugerencia
      } else {
        validationFlag = false;
        bodyMsg.titulo += 'msjERRTitulo'
        bodyMsg.obser += 'VALDAT03Observacion'
        bodyMsg.type = 'alert'
        bodyMsg.errorCode += 'VALDAT03Codigo'
        bodyMsg.sugerencia += 'VALDAT03Sugerencia'
      }
    return { validationFlag, bodyMsg };
  }





  async validaCanal(configData: any, form: any): Promise<any> {
    let flag = true, payload: any = {};

    const {
      optCanal,
      optFormato,
      optTipoContenido,
    } = form;

    const {
      idFormatoMT940D,
      idFormatoMT940,
      idFormatoMT942,
      idFormatoRepCobTXT,
      idCanalREPAL,
      idCanalSwiftFin,
      valorRecArcxCta,
      optIntradia,
      optConsXDia,
    } = configData;

    if (!optIntradia && optFormato.value.toString() === '' || !optIntradia && optFormato.value === null) {
      flag = false;
      payload.titulo = 'msjERRTitulo';
      payload.obser = 'VALDAT05Observacion';
      payload.type = 'alert';
      payload.errorCode = 'VALDAT05Codigo';
      payload.sugerencia = 'VALDAT05Sugerencia';
      return { flag, payload }
    }

    if (!optConsXDia && optFormato.value.toString() === '' || !optConsXDia && optFormato.value === null) {
      flag = false;
      payload.titulo = 'msjERRTitulo';
      payload.obser = 'VALDAT05Observacion';
      payload.type = 'alert';
      payload.errorCode = 'VALDAT05Codigo';
      payload.sugerencia = 'VALDAT05Sugerencia';
      return { flag, payload }

    }

    if (optCanal.value !== '' && optCanal.value !== null) {
      if (optFormato.value.toString() !== '' && optFormato.value !== null) {
        if (optFormato.value.toString() !== '' && optFormato.value !== null && optIntradia) {
          if (optFormato.value.toString() !== idFormatoMT942 &&
            optCanal.value === idCanalSwiftFin) {
            flag = false;
            payload.titulo = 'msjINF00016Titulo';
            payload.obser = 'msjINF00016Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00016Codigo';
            payload.sugerencia = 'msjINF00016Sugerencia';
            return { flag, payload }

          }
          if (optFormato.value.toString() !== idFormatoRepCobTXT &&
            optCanal.value === idCanalREPAL) {
            flag = false;
            payload.titulo = 'msjINF00017Titulo';
            payload.obser = 'msjINF00017Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00017Codigo';
            payload.sugerencia = 'msjINF00017Sugerencia';
            return { flag, payload }
          }
          if (optTipoContenido !== valorRecArcxCta &&
            optFormato.value.toString() === idFormatoRepCobTXT &&
            optCanal.value === idCanalREPAL) {
            flag = false;
            payload.titulo = 'msjINF00018Titulo';
            payload.obser = 'msjINF00018Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00018Codigo';
            payload.sugerencia = 'msjINF00018Sugerencia';
            return { flag, payload }
          }
        }
        if (optFormato.value.toString() !== '') {
          if (optFormato.value.toString() !== idFormatoMT940 &&
            optFormato.value.toString() !== idFormatoMT940D &&
            optCanal.value === idCanalSwiftFin) {

            flag = false;
            payload.titulo = 'msjINF00021Titulo';
            payload.obser = 'msjINF00021Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00021Codigo';
            payload.sugerencia = 'msjINF00021Sugerencia';
            return { flag, payload }
          }
          if (optFormato.value.toString() !== idFormatoRepCobTXT &&
            optCanal.value === idCanalREPAL) {
            flag = false;
            payload.titulo = 'msjINF00017Titulo';
            payload.obser = 'msjINF00017Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00017Codigo';
            payload.sugerencia = 'msjINF00017Sugerencia';
            return { flag, payload }
          }
          if (optTipoContenido !== valorRecArcxCta &&
            optFormato.value.toString() === idFormatoRepCobTXT &&
            optCanal.value === idCanalREPAL) {
            flag = false;
            payload.titulo = 'msjINF00018Titulo';
            payload.obser = 'msjINF00018Observacion';
            payload.type = 'alert';
            payload.errorCode = 'msjINF00018Codigo';
            payload.sugerencia = 'msjINF00018Sugerencia';
            return { flag, payload }
          }
        }
        return await this.validaContenido(configData, form);
      } else {
        flag = false;
        payload.titulo = 'msjERRTitulo';
        payload.obser = 'VALDAT05Observacion';
        payload.type = 'alert';
        payload.errorCode = 'VALDAT05Codigo';
        payload.sugerencia = 'VALDAT05Sugerencia';

      }
    } else {
      flag = false;
      payload.titulo = 'msjERRTitulo';
      payload.obser = 'VALDAT06Observacion';
      payload.type = 'alert';
      payload.errorCode = 'VALDAT06Codigo';
      payload.sugerencia = 'VALDAT06Sugerencia';

    }
    return { flag, payload };
  }

  async validaContenido(configData: any, form: any) {
    let flag = true, payload: any = {};

    const {
      listCuentas,
      listClaconesSelected,
    } = configData;
    const {
      optTipoContenido,
    } = form;


    if (optTipoContenido.value !== undefined && optTipoContenido.value !== '') {
      if (listClaconesSelected.length > 0 && this.mensajeCuentas(listCuentas) === '') {
        return { flag, payload };

        // if (optIntradia && optConsXDia && (optFormato.value === idFormatoMT940 || optFormato.value === idFormatoMT942)) {

        //   jConfirm('', VALDAT09Observacion, '', '',
        //     function (e) {
        //       if (e) {
        //         var intradia = $('#chkEnviarIntradia').is(":checked");
        //         $('#optOperCierre').val(intradia);
        //         ir_a(ID_FORMA_CONFIG_COBR, URL_GUARDAR_COBRANZA);
        //       }
        //     }, cancelar);
        // }
      } else {
        const msjCta = this.mensajeCuentas(listCuentas)
        if (msjCta !== '') {
          flag = false;
          payload.titulo = 'msjERRTitulo';
          payload.obser = msjCta;
          payload.type = 'error';
          payload.errorCode = 'ERRCTAS1';
          payload.sugerencia = 'VALDAT07Sugerencia';
        } else {
          flag = false;
          payload.titulo = 'msjERRTitulo';
          payload.obser = 'VALDAT07Observacion';
          payload.type = 'alert';
          payload.errorCode = 'VALDAT07Codigo';
          payload.sugerencia = 'VALDAT06Sugerencia';
        }
      }
    } else {
      flag = false;
      payload.titulo = 'msjERRTitulo';
      payload.obser = 'VALDAT08Observacion';
      payload.type = 'alert';
      payload.errorCode = 'VALDAT08Codigo';
      payload.sugerencia = 'VALDAT08Sugerencia';
    }
    return { flag, payload };
  }

  mensajeCuentas(listCuentas: any[]) {
    if (listCuentas.length === 0) {
      return 'msjCuentasFaltantes';
    }
    return '';
  }

  // validaCanalConsolidado(optCanal, selFormatoArchivoConsolidado, tipoContenido) {
  //   if (optCanal !== '') {
  //     if (selFormatoArchivoConsolidado !== '') {
  //       if (selFormatoArchivoConsolidado !== idFormatoMT940 &&
  //         selFormatoArchivoConsolidado !== idFormatoMT940D &&
  //         optCanal === idCanalSwiftFin) {
  //         //jAlert(msjINF00019Sugerencia, msjINF00019Titulo,
  //         msjINF00019Codigo, msjINF00019Observacion);
  //         return false;
  //       }
  //       validaContenido(tipoContenido);
  //     } else {
  //       //jAlert(VALDAT05Observacion, msjERRTitulo, VALDAT05Codigo, VALDAT05Sugerencia);
  //     }
  //   } else {
  //     //jAlert(VALDAT06Observacion, msjERRTitulo, VALDAT06Codigo, VALDAT06Sugerencia);
  //   }
  // }

}
