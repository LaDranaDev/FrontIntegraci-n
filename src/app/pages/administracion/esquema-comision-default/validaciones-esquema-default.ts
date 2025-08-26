export class ValidacionesEsquemaDefault {
      SIGNO_PESOS = '$';
      PORCENTAJE = '%';
      SIN_LIMITE = 'Sin Límite';


      esDatoValido(event: KeyboardEvent) {

            var key = (event.charCode) ? event.charCode :
                  ((event.keyCode) ? event.keyCode : ((event.which) ? event.which : 0));

            return (key <= 13 || (key >= 48 && key <= 57) || key === 46 || key === 8
                  || key === 44);
      }

      esDatoValidoPivote(value: string, index: number, idCntr: string, valorprecio: number, idRango?: string) {
            var selLimite: any = document.getElementById(`limite${idCntr}`);
            let inputRango: any = document.getElementById(`rango${idCntr}${index}`);

            if (selLimite.value === '') {

                  selLimite.value = 0;
            }

            console.log(value.indexOf(this.SIGNO_PESOS), 'busca signo de pesos');
            console.log(value.indexOf(this.PORCENTAJE), 'busca porcentaje');

            if (value.indexOf(this.SIGNO_PESOS) > -1) {
                  inputRango.value = value.replace(this.SIGNO_PESOS, '');
            }
            if (value.indexOf(this.PORCENTAJE) > -1) {
                  inputRango.value = value.replace(this.PORCENTAJE, '');

            }
            if (value !== '' && value !== this.SIN_LIMITE) {
                  if (isNaN(parseInt(value))) {
                        if (index === parseInt(selLimite.value) && parseInt(selLimite.value) > 0 && valorprecio === 1) {
                              inputRango.value = this.SIN_LIMITE;
                        } else {
                              const valueWithSimbol = inputRango.value && (inputRango.value as string).includes('$') ? inputRango.value: `$${inputRango.value}`
                              inputRango.value = valueWithSimbol ? valueWithSimbol: '';
                        }
                        return;
                  }
                  if (index === parseInt(selLimite.value)
                        || parseInt(value) > 0) {
                        if (isNaN(parseInt(value))) {
                              if (value.indexOf(this.SIN_LIMITE) > -1) {
                                    if (index === parseInt(selLimite.value) && parseInt(selLimite.value) > 0) {
                                          inputRango.value = this.SIN_LIMITE;
                                    } else {
                                          if (isNaN(parseInt(value))) {
                                                inputRango.value = '';
                                          }
                                    }
                                    //}
                              } else {
                                    if (index === parseInt(selLimite.value) && parseInt(selLimite.value) > 0) {
                                          inputRango.value = this.SIN_LIMITE;

                                    } else {
                                          inputRango.value = '';
                                    }
                              }
                        } else {
                              if (index == parseInt(selLimite.value)) {
                                    //el operador ternario sirve únicamente para poder cambiar el valor del primer rango cuando se selecciona rango 0
                                    inputRango.value = index === 0 && idRango === '0' ? inputRango.value:  this.SIN_LIMITE;
                              } else {
                                    if (isNaN(parseInt(value))) {
                                          inputRango.value = '';
                                    }
                              }
                        }
                        // si el valor no es SinLimite y es el valor elegido como limite
                        // se habilitan todos lo limites para que sean obligatorios.
                        // if (inputRango.value !== this.SIN_LIMITE) {
                        //             var valorcmb = '1';

                        //             if (producto !== PRODUCTO_PIVOTE && (selLimite.value === 0 || selLimite.value === 1)) {

                        //                   if ($(this).val() === '') {
                        //                         $(this).val(valorcmb);
                        //                         habilitaRangos(idRango, valorcmb, producto, '');
                        //                         $(this).addClass('CamposCompletar');
                        //                   }
                        //             }
                        // }
                  }
            } else {
                  inputRango.value = inputRango.value;
            }
      }

      esDatoValidoSinLimite(value: string, index: number, idCntr: string, cadena: string) {
            var selLimite: any = document.getElementById(`limite${idCntr}`);
            console.log(selLimite.value, 'sin pivote');
            let inputRango: any = document.getElementById(`rango${idCntr}${index}`);
            
            if (value.indexOf(this.SIGNO_PESOS) > -1) {
                  console.log('entro a la primera');

                  inputRango.value = value ? value.replace(this.SIGNO_PESOS, ''): '0.0';
            }
            if (value.indexOf(this.PORCENTAJE) > -1) {
                  console.log('entro a la segunda');

                  inputRango.value = value ? value.replace(this.PORCENTAJE, ''): '0.0';
            }
            if (value !== this.SIN_LIMITE && isNaN(parseInt(value))) {
                  console.log('entro a la 3ra');
                  console.log(parseInt(selLimite.value));

                  if (index === parseInt(selLimite.value) && parseInt(selLimite.value) >= 0) {
                        console.log('pone texto sin limite');

                        inputRango.value = this.SIN_LIMITE
                  } else {
                        const inputSimbol = inputRango.value && (inputRango.value as string).includes('$') ? inputRango.value : `$${inputRango.value}`
                        inputRango.value = selLimite.value > 0 && inputSimbol ? inputSimbol : '0.0';
                  }
                  return;
            }
            if (value !== this.SIN_LIMITE && index === parseInt(selLimite.value)) {

                  inputRango.value = this.SIN_LIMITE;

            }
      }

}
