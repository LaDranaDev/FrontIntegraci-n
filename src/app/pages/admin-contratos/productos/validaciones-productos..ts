import { Injectable, InjectionToken } from "@angular/core";

@Injectable()
export class ValidarProductoCL {
  longitudContratoValida(numContrato: string) {
    if (numContrato.length == 0 || numContrato.length == 12) {
      return true;
    }
    return false;
  }
  validaNemonico(nemonico: any) {
    if (nemonico.length < 4) {
      return false;
    }
    return true;
  }

  validarCamposObligatorios(payload: any, checkConfirming:any): string {
    const { datosCliente, datosForm, chkIdCanalSwiftFin, chkIdCanalSwiftFile, productos }: any = payload;
    const { idContrato, descEstatus } = datosCliente;
    const { bic, messagePartner, tipoTransferencia, periodoHabilitacion } = datosForm;

    let alMenosUnProductoSeleccionado = false;

    if (idContrato && idContrato == '') {

      if (descEstatus.toUpperCase().indexOf('ALTA') == -1) {
        return 'CTERR01';
      }
    }
    
    if (!periodoHabilitacion || parseInt(periodoHabilitacion.value) < 0) {
      return 'CTERR02';
    }

    if (!productos || productos.length === 0) {
      return 'CTERR03';
    }

    if ((chkIdCanalSwiftFin || chkIdCanalSwiftFile) &&
      (bic.value.length < 8 || bic.value.length > 13)) {
      return 'CTERR17';
    }

    if (chkIdCanalSwiftFin && messagePartner.value.length != 4) {
      return 'CTERR18';
    }

    if (chkIdCanalSwiftFile && tipoTransferencia.value === '') {
      return 'CTERR19';
    }

    let validacionProducto = { bandera: false, msj: '' }
    productos.forEach((item: any): void => {
      const { asignado, numeroReintentos, intervaloReintentos, aplicaContratoConfirming, contratosConfirming } = item
      if (asignado) {
        alMenosUnProductoSeleccionado = true;

        if (numeroReintentos && intervaloReintentos) {
          if (numeroReintentos != "" && intervaloReintentos != "") {
            if (numeroReintentos == 0 && intervaloReintentos != 0) {
              validacionProducto.bandera = true;
              validacionProducto.msj = 'CTERR07';
              return;
            }

            if (numeroReintentos != 0 && intervaloReintentos == 0) {
              validacionProducto.bandera = true;
              validacionProducto.msj = 'CTERR08';
              return;
            }

            if (numeroReintentos < 0 || numeroReintentos > 99) {
              validacionProducto.bandera = true;
              validacionProducto.msj = 'CTERR07';
              return;
            }

            if (intervaloReintentos != 0 && (intervaloReintentos < 5 || intervaloReintentos > 60)) {
              validacionProducto.bandera = true;
              validacionProducto.msj = 'CTERR08';
              return;
            }
          } else if (numeroReintentos == "" && intervaloReintentos != "") {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR07';
            return;
          } else if (numeroReintentos != "" && intervaloReintentos == "") {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR08';
            return;
          } else if (numeroReintentos != "" && numeroReintentos != 0) {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR07';
            return;
          } else if (intervaloReintentos != "" && intervaloReintentos != 0) {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR08';
            return;
          }
        }

        if (aplicaContratoConfirming === 'S' && contratosConfirming !== undefined) {    
          if (contratosConfirming.length == 0 && checkConfirming) {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR10';
            return;
          }
          let countContratoConfTmp = 0;
          contratosConfirming.map((contrato: any) => {
            if (contrato.status === "A") {
              countContratoConfTmp++
            }
          })
          if (countContratoConfTmp == 0) {
            validacionProducto.bandera = true;
            validacionProducto.msj = 'CTERR11';
            return;
          }
        }

      }

    });

    if (validacionProducto.bandera) {
      return validacionProducto.msj
    }
    if (!alMenosUnProductoSeleccionado) {
      return 'CTERR12';
    }

    return 'CTERR00';
  }

  validaReintentos(listaProductos: any[]) {
    let banderaValido = true;
    listaProductos.forEach(item => {
      if (item.aplicaReintentos === 'A') {
        let valor = item.numeroReintentos
        if (valor !== '') {
          valor = 0
        }
        if (parseInt(valor) > 0) {
          if (parseInt(item.intervaloReintentos) == 0) {
            banderaValido = false;
          }

        }
      }
    })

    return banderaValido;
  }

  armarRequest(formulario: any, datosUsuario: any, listaProductos: any[], canales: any) {

    const { periodoHabilitacion, diasProgramarArchivos, verificarCuentaBeneficiaria, usarClabeParaEdoCta, usarCifrasControl, bandCambioProd, nemonico, bic, messagePartner, tipoTransferencia, alias, bandActCont, backConfirming, idCanalCore } = formulario;
    const { idContrato, numContrato, bucCliente, razonSocial, cuentaEje, descEstatus, personalidad, nombreCompleto, idEstatus } = datosUsuario;


    let request: any = {
      idContrato,
      numContrato,
      periodoHabilitacion: periodoHabilitacion.value,
      diasProgramarArchivos: diasProgramarArchivos.value,
      verificarCuentaBeneficiaria: verificarCuentaBeneficiaria.value === true ? "A" : "I",
      usarClabeParaEdoCta: usarClabeParaEdoCta.value === true ? "A" : "I",
      usarCifrasControl: usarCifrasControl.value === true ? "A" : "I",
      bandCambioProd: bandCambioProd.value === true ? "A" : "I",
      buc: bucCliente,
      razonSocial,
      nemonico: nemonico.value,
      cuentaEje,
      idEstatus,
      estatus: descEstatus,
      productos: [],
      bandActCont: bandActCont.value,
      canales: [],
      bic: bic.value,
      messagePartner: messagePartner.value,
      tipoTransferencia: tipoTransferencia.value,
      alias: alias.value,
      backConfirming: backConfirming.value,
      idEstatusCancelado: 0,
      tipoContrato: "",
      personalidad,
      nombre: nombreCompleto,
      apPaterno: "",
      apMaterno: "",
    }

    let listaCanalesSeleccionados: Array<any> = []
    canales.value.map((item: any) => {
      const { idCanal, estadoSeleccion } = item;

      if (idCanalCore.value === idCanal) {
        listaCanalesSeleccionados = [...listaCanalesSeleccionados, item]
      } else if (estadoSeleccion) {
        listaCanalesSeleccionados = [...listaCanalesSeleccionados, item]
      }
    })

    let listaSeleccionados: Array<any> = []
    listaProductos.map((item: any): any => {
      if (item.asignado) {
        item.envioEmail = item.envioEmail === true ? "A" : "I";
        item.activo = 'A'
        listaSeleccionados = [...listaSeleccionados, item];
        return;
      }
    });

    request.canales = listaCanalesSeleccionados;
    request.productos = listaSeleccionados;

    return request;
  }

}
