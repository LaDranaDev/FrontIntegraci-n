export class DatosContratoRequest {
    codigoCliente       : string;
    statusContrato      : string;
    razonSocial         : string;
    cuentaEje           : string;
    numContrato         : string;
    idContrato          : string;
}

export class EstadoCuentarequest{
	idContrato          : String;       /** id de contrato  */
	numContrato         : string;       /** numero de contrato  */
	idFrecuencia        : string;       /** id de frecuencia  */
	cuentas             : Cuenta[];     /** id del tipo de formato	 */
	idLayout            : string        /**status bitacora**/;
	numCuenta           : string;       /**num cuenta bitacora**/
	status              : string;       /**status bitacora**/
	horaEjecucion       : String;       /** Hora de ejecucion del reporte en formato HHMM  */
}

export class Cuenta{
	idContratoCuenta    : number;       /** id del contrato de la cuenta */
	idContrato          : number;       /**  id del contrato */
	numCuenta           : string;       /** numero de cuenta */
	tipoCuenta          : string;       /** tipo de cuenta */
	bandIntercambiaria  : string;       /** Bandera que indica si una cuenta es interbancaria o bancaria	 */
	bandPersonalidad    : string;       /** Bandera que indica si una persona es fisica o moral */
	titular             : string;       /** titular de la cuenta*/
	fechaAlta           : string;       /** fecha de alta de la cuenta */
	terceros            : boolean;      /** indica si es cuenta de terceros */
	statusCuenta        : string;       /** estatus de la cuenta  */
	codigo              : string;       /** codigo de la cuenta */
	terceroPropio       : string;       /** descripcion de validar si la cuenta es de terceros o propios*/
	bandActivo          : string;       /** Identificador para saber el estatus de la cuenta	 */
    idDivisa            : string;       /** Identificador del id de la divisa	 */
	idContratoStr       : string;       /**idcontrato  */
	noComisiones        : string;       /**Identificador para saber el numero de comisiones	 */
	bic                 : string;       /** Bic	 */
	bicAnterior         : string;       /** Bic  */
	actualizaBic        : boolean;      /** bandera para actualizar solo bic	 */
}