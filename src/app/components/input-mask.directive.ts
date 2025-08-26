import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';
import { FuncionesComunesComponent } from './funciones-comunes.component';

@Directive({
  selector: '[appInputMask]'
})
export class InputMaskDirective {
 /* Campo Input de mascara */
  @Input()
  appInputMask!: string;
 /* Indica si se muestra mensaje */
 showMsg: boolean;
 /** Expresion regular de validacion de mascara */
  pattern!: RegExp;
 /* Expresiones regulares de validacion */
 private regexMap: any = {
   alfabetico: /^[a-zA-ZÀ-ú\u00d1 ]*$/g,
   alfanumerico: /^[a-zA-Z0-9\u00d1]*$/g,
   alfanumerico_punto_guionBajo: /^[a-zA-Z0-9\u00d1._]*$/g,
   alfanumerico_punto_guionBajo_espace: /^[a-zA-Z0-9-\u00d1._ ]*$/g,
   alfanumerico_space: /^[a-zA-ZÀ-ú0-9\u00d1 ]*$/g,
   alfanumerico_special: /^[a-zA-ZÀ-ú0-9\u00d1& ]*$/g,
   alfanumerico_espe: /^[a-zA-ZÀ-ú0-9\u00d1._:&\n \t  ]*$/g,
   alfanumerico_observ: /^[a-zA-ZÀ-ú0-9\u00d1,.&\n \t ]*$/g,
   alfanumerico_carac: /^[0-9.-]*$/g,
   alfanumerico_observ_bajo2: /^[a-zA-ZÀ-ú0-9\u00d1,._]*$/g,
   alfanumerico_observ_bajo: /^[a-zA-ZÀ-ú0-9\u00d1,._&\n \t ]*$/g,
   alfanumerico_observ_mensaje: /^[a-zA-ZÀ-ú0-9\u00d1,._&\n \t ]*$/g,
   parametro:  /^[a-zA-Z0-9\_ ñÑ:.u00d1\n]*$/g,
   parametro_parametro:  /^[a-zA-Z0-9\_ñÑu00d1\n]*$/g,
   CaracteresEspecialesGestionConexionDirectorio: /^[a-zA-Z0-9À-ú\/_ -\u00d1\n]*$/g,
   CaracteresEspecialesGestionConexionVarios: /^([\w$:&/()?¿´+*{}_., <>-]*)$/g, // faltan ][]
   CaracteresEspecialesGestionConexionUser: /^[a-zA-Z0-9À-ú/_ -\u00d1\n]*$/g,
   nomArchivoTrakin: /^[a-zA-Z0-9_ -.u00d1\n]*$/g,
   numerico: /^[0-9]*$/g,
   numerico_punto: /^[0-9\u00d1.]*$/g,
   numerico_Simbol$: /^[0-9\u00d1$.]*$/g,
   dosEntCuatroDec: /(?:(?=(^[0-9]{0,2})+([.])?)((^[0-9]{0,2})([.][0-9]{1,4})?)|((^[0-9]{0,2})+([.])?))$/g,
   tresEntDosDec: /(?:(?=(^[0-9]{0,3})+([.])?)((^[0-9]{0,3})([.][0-9]{1,2})?)|((^[0-9]{0,3})+([.])?))$/g,
   tresEntCuatroDec: /(?:(?=(^[0-9]{0,3})+([.])?)((^[0-9]{0,3})([.][0-9]{1,4})?)|((^[0-9]{0,3})+([.])?))$/g,
   ochoEntCincoDec: /(?:(?=(^[0-9]{0,8})+([.])?)((^[0-9]{0,8})([.][0-9]{1,5})?)|((^[0-9]{0,8})+([.])?))$/g,
   quinceEntDosDec: /(?:(?=(^[0-9]{0,15})+([.])?)((^[0-9]{0,15})([.][0-9]{0,2})?)|((^[0-9]{0,15})+([.])?))$/g,
   ochoEntCincoDecNeg: /(?:(?=(^\-?([0-9]{0,8})?)+([.])?)((^\-?([0-9]{0,8})?)([.][0-9]{1,5})?)|((^\-?([0-9]{0,8})?)+([.])?))$/g,
   tresEnt: /^[0-9]{1,3}$/g,
   tresDeducible: /(^[1][0]{2})|(^[1-9][0-9])|(^[0-9])$/g,
   correo: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g,
   correo2: /^([\w_\-\.@]*)$/g,
   archivoMonitor:  /^([\w_\-\. ]*)$/g,
   specialComment: /([\w}{¿¡?/&%$#!_.,;:+*-]*)$/g,
   numLetPuntoComaDiagonal: /^[a-zA-ZÀ-ú0-9\u00d1& .,\/]*$/g,
   inputCO:/[\(\)\/=+:?\!\¡\}\{%&*@$><;#~\^\[\]\'\"°¨|¬,]/gi,
   validaIP:  /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/

 };
 /** Constructor de clase
  * @param el ElementRef
  * @param renderer Renderer2
  */
 constructor(public el: ElementRef, 
              public renderer: Renderer2,private fc: FuncionesComunesComponent) {
   this.showMsg = false;
 }
/* Listener de eventos para validacion de mascaras */
@HostListener('keypress', ['$event']) onInput(e: KeyboardEvent) {
  const inputChar = e.key;
  const valorAvalidar = this.obtieneValorAValidar(e.currentTarget, inputChar);
  const arregloValidaciones = this.appInputMask.split('|');
  arregloValidaciones.forEach(element => {
    this.pattern = this.regexMap[element];
    if (this.pattern !== undefined) {
      this.validacionPorPattern(e, this.pattern, valorAvalidar);
    } else {
      this.validacionSinPattern(e, element, valorAvalidar);
    }
  });
}

/* Decorador que declara un DOM Event del tipo change a ser escuchado. Provee las implementaciones para cuando ocurre un cambio */
@HostListener('change', ['$event']) onchange(e: Event) {
  const valorAvalidar = this.obtieneValorAValidar(e.currentTarget, '');
  const arregloValidaciones = this.appInputMask.split('|');
  arregloValidaciones.forEach(element => {
    this.pattern = this.regexMap[element];
    if (this.pattern !== undefined) {
      this.validacionPorPatternChange(e, this.pattern, valorAvalidar);
    } else {
      this.validacionSinPatternChange(e, element, valorAvalidar);
    }
  });
}

/* Se ejecuta cuando una validacion de mascara no cumple */
badBoyAlert(color: string) {
  setTimeout(() => {
    this.showMsg = true;
    if(this.el.nativeElement.value.length !== 0) {
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'color');
    }
  }, 2000);
}

/* Funcion que recupera el valor del campo de texto*/
obtieneValorAValidar(editor:any, valorInsertar:any) {
  if (valorInsertar === 'Del') {
    valorInsertar = '.';
  } else if (valorInsertar === 'Subtract') {
    valorInsertar = '-';
  }
  const u = editor.value;
  const start = editor.selectionStart;
  const valor = u.substring(start, 0, valorInsertar) + valorInsertar;
  return valor;
}

/* Descripcion: Funcion que realiza la validacion segun una expresion regular
* @param e Evento que contiene los metadatos
* @param patternParam expresion Regular que se usa para validar
* @param valorAValidarParam Valor que ha de ser validado
*/
validacionPorPattern(e: KeyboardEvent, patternParam: RegExp, valorAValidarParam: any) {
  this.pattern.lastIndex = 0;
  this.agregaEstilo(e, this.pattern.test(valorAValidarParam));
}

/* Descripcion: Funcion que realiza la validacion del cambio de contenido segun la expresion regular recibida
* @param e Contiene los metadatos
* @param patternParam Expresion regular con la que se valida
* @param valorAValidarParam Es el valor que se validara
*/
validacionPorPatternChange(e: any, patternParam: RegExp, valorAValidarParam: any) {
  patternParam.lastIndex = 0;
  if (e.currentTarget.value !== '') {
    this.limpiaContenido(e, patternParam.test(valorAValidarParam));
  }
}
/* Descripcion: Limpia el contenido del campo
* @param e Event Evento con los metadatos
* @cumple boolean que define si limpia el campo
*/
limpiaContenido(e: any, cumple: boolean) {
  if (!cumple) {
    e.currentTarget.value = '';
    this.renderer.setStyle(this.el.nativeElement, 'color', '');
  }
}

/*Descripcion: Metodo que realiza la validacion segun el metodo definido
* @param e Event Contiene los metadatos
* @param definicionValidacion Cadena que contiene la definicion de validacion
* @param valorAValidarParam El valor a validar
*/
validacionSinPattern(e: any, definicionValidacion: string, valorAValidarParam: any): void {
  const arregloTipoValidacion = definicionValidacion.split('::');
  const tipoValidacion = arregloTipoValidacion[0];
  const valorValidacion = arregloTipoValidacion[1];
  switch (tipoValidacion) {
    case 'noDebeSerMayorQue':
      this.noDebeSerMayorQue(e, valorValidacion, valorAValidarParam);
      break;
    case 'changeNoMenorQue':
      break;
    default:
      break;
  }
}

/* Descripcion: Funcion que realiza la validacion cuando ocurre un Evento Change en un campo
* @param e Contiene los metadatos del evento
* @param definicionValidacion Contiene la definicion de la validacion
* @param valorAValidarParam Valor que ha de validarse
*/
validacionSinPatternChange(e: any, definicionValidacion: string, valorAValidarParam: any): void {
  const arregloTipoValidacion = definicionValidacion.split('::');
  const tipoValidacion = arregloTipoValidacion[0];
  const valorValidacion = arregloTipoValidacion[1];
  switch (tipoValidacion) {
    case 'noDebeSerMayorQue':
      this.limpiaContenido(e, this.noDebeSerMayorQue(e, valorValidacion, valorAValidarParam));
      break;
    case 'changeNoMenorQue':
      break;
    default:
      break;
  }
}

/*
* Descripcion: Funcion que realiza la asignacion de un estilo para indicar si es erroneo el valor capturado
* @param e KeyboardEvent Contiene los metadatos del evento
* @param agregar Define que estilo agregar
*/
agregaEstilo(e: KeyboardEvent, agregar: boolean): void {
  if (agregar) {
    this.renderer.setStyle(this.el.nativeElement, 'color', 'black');
    this.badBoyAlert('black');
  } else {
    this.badBoyAlert('black');
    this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
    e.preventDefault();
  }
}

/* Descripcion: Funcion que valida si la regla No Debe ser mayor que
*               Por ejemplo: Si se desea que un campo a no deba ser mayor que 100, la funcion
*               añade los estilos de error cuando se viola la regla.
* @param e Contiene los metadatos
* @param valorEsperado Es el valor que se debe respetar
* @param valorAComparar Valor recuperado del campo a validar
*/
noDebeSerMayorQue(e: any, valorEsperado: any, valorAComparar: string): boolean {
  let noEsMayor: boolean;
  try {
    const valorNumericoEsperado = this.fc.obtieneValorNumerico(valorEsperado);
    const valorNumericoComparar = this.fc.obtieneValorNumerico(valorAComparar);
    if (valorNumericoComparar > valorNumericoEsperado) {
      /* Se agrega el color rojo, indicando que el numero no es permitido y que sobrepasa el valor permitido */
      this.agregaEstilo(e, false);
      noEsMayor = false;
    } else {
      /* Se agrega el color verde, indicando que el numero es permitido y que no sobrepasa el valor permitido*/
      this.agregaEstilo(e, true);
      noEsMayor = true;
    }
  } catch (err) {
    this.agregaEstilo(e, false);
    noEsMayor = false;
  }
  return noEsMayor;
}
}
