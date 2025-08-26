import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionConexionContratoService } from 'src/app/services/gestion-buzon/gestion-conexion-contrato.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalConfirmacionComponent } from 'src/app/components/modals/modal-confirmacion/modal-confirmacion.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { ModalConfirmacionYNComponent } from 'src/app/components/modals/modal-confirmacion-y-n/modal-confirmacion-y-n.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configurar-parametros-para-contrato',
  templateUrl: './configurar-parametros-para-contrato.component.html',
  styleUrls: ['./configurar-parametros-para-contrato.component.css']
})
export class ConfigurarParametrosParaContratoComponent implements OnInit {

  datos: any;
  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
  parametrosContratoConfigForm!: UntypedFormGroup;
  protocolo:any
  productoSeleccionado:any
  productoSeleccionado2:any
  configurar:any
  agregar:any
  guarda:any
  lsOS:any
  proto:any
  resultConfirmacion:string
  path1:any
  path2:any
  bloquea: boolean = true; 
  constructor(
    public gestionConexionContratoService: GestionConexionContratoService,
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService
  ) {
    this.parametrosContratoConfigForm = this.initializeForm(); 
  }
  async ngOnInit() {
    this.datos = this.gestionConexionContratoService.getSaveLocalStorage('ConexionContrato');
    this.configurar = this.gestionConexionContratoService.getSaveLocalStorage('configurarParametro');
    this.path1 = this.gestionConexionContratoService.getSaveLocalStorage('path1');
    this.path2 = this.gestionConexionContratoService.getSaveLocalStorage('path2');
    this.agregar = this.gestionConexionContratoService.getSaveLocalStorage('agregar');
    /*const consultarProtocolo = {
      "numeroContrato": this.datos.numeroContrato,
       "codigoCliente": this.datos.codigoCliente
    }

    try{
      await this.gestionConexionContratoService.protocolo(consultarProtocolo).then(
        async (protoco:any) =>{
        this.protocolo = protoco.respuestaProt
        this.parametrosContratoConfigForm.patchValue({
          protocolo: protoco.idProt.toString()
          });
          //this.proto = protoco.idProt.toString()
          //this.productoSeleccionado = protoco.idProt.toString()
          this.globals.loaderSubscripcion.emit(false);
      })  
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("pantalla.modificar.contrato.titulo.ERGC002"), 
        this.translate.instant('antalla.modificar.contrato.observacion.ERGC002'),
        'error',
        this.translate.instant('pantalla.modificar.contrato.codigo.ERGC002'),
        this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC002')
        )   
    }*/
    this.configuracion();
  }
  async configuracion(){

    if(this.configurar !== null){
      try{
        const config = {
          "tipoOperPG": "M",
          "idProtocolo":  this.agregar.idProtocolo,
          "idContrato": this.datos.idContrato,
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente": this.datos.codigoCliente,
          "idProtocoloPara": this.agregar.idPtclPara,
          "idProtocoloPath1": this.path1,
          "idProtocoloPath2": this.path2
        }
        await this.gestionConexionContratoService.configurar(config).then(
          async (confi:any) => {
          this.lsOS = confi.putGetResponse.lstOs
          this.protocolo = confi.lstProtocolos
          this.parametrosContratoConfigForm.patchValue({
            protocolo: confi.idProtocolo
            });
          this.productoSeleccionado = confi.idProtocolo
          this.productoSeleccionado2 = confi.idProtocolo
          this.pintar(confi.putGetResponse)
          this.globals.loaderSubscripcion.emit(false);
        });
      }catch(e){
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.ERGC001"), 
            this.translate.instant('pantalla.configurar.contrato.observacion.ERGC001'),
            'error',
            this.translate.instant('pantalla.configurar.contrato.codigo.ERGC001'),
            this.translate.instant('pantalla.configurar.contrato.sugerencia.ERGC001')
            )   
          
          this.gestionConexionContratoService.setSaveLocalStorage('path1',null);
          this.gestionConexionContratoService.setSaveLocalStorage('path2',null);
          this.router.navigate(['gestionBuzon/configurarConexionContrato']);
      }
    }else{
      try{
        const config = {
          "tipoOperPG": "A",
          "idProtocolo": this.agregar.idProtocolo,
          "idContrato": this.datos.idContrato,
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente": this.datos.codigoCliente,
          "idProtocoloPara": this.agregar.idPtclPara,
          "idProtocoloPath1": '',
          "idProtocoloPath2": ''
        }
        await this.gestionConexionContratoService.configurar(config).then(
          async (confi:any) => {
          this.lsOS = confi.putGetResponse.lstOs
          this.protocolo = confi.lstProtocolos
          this.productoSeleccionado2 = confi.idProtocolo

          this.globals.loaderSubscripcion.emit(false);
        });
      }catch(e){
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.ERGC001"), 
            this.translate.instant('pantalla.configurar.contrato.observacion.ERGC001'),
            'error',
            this.translate.instant('pantalla.configurar.contrato.codigo.ERGC001'),
            this.translate.instant('pantalla.configurar.contrato.sugerencia.ERGC001')
            )   
          this.gestionConexionContratoService.setSaveLocalStorage('path1',null);
          this.gestionConexionContratoService.setSaveLocalStorage('path2',null);
          this.router.navigate(['gestionBuzon/configurarConexionContrato']);
      }
    }
  }

    /**
   * Metodo para poder inicializar el formulario
   */
    private initializeForm() {
      return this.formBuilder.group({
        protocolo:[''],
        uri:[''],
        ruta:[''],
        patron:[''],
        uriG:[''],
        rutaG:[''],
        patronG:[''],
        uriConsulta:[''],
        ip:[''],
        puerto:['',[Validators.pattern("^[0-9]*$")]],
        certificado:[''],
        directorio:[''],
        directorioG:[''],
        userId:[''],
        servidor:[''],
        host:[''],
        profile:[''],
        user:[''],
        hostOS:[''],
        nodoRemoto:[''],
        nodoLocal:[''],
        usuarioLocal:[''],
        passRemoto:[''],
        oscurecerPassword:[''],
        modoBinario:[''],
        Longitud:[''],
        formato:[''],
        modo:[''],
        sys:[''],
        disposición:['']
      })
    }

    /**
   * Metodo que obtiene el producto seleccionado
   */
    activa= false
  valueChange(event:any){
    this.productoSeleccionado = event.target.value;
    this.activa= true
  }
  hostSeleccionado:any
  pintar(valores:any){
    this.parametrosContratoConfigForm.patchValue({
      directorio:valores.registrosPG[0].directorio,
      directorioG:valores.registrosPG[1].directorio,
      patron:valores.registrosPG[0].patron,
      patronG:valores.registrosPG[1].patron,
      puerto:valores.registrosPG[0].puerto,
      servidor:valores.registrosPG[0].servidor,
      userId:valores.registrosPG[0].userId,
      profile:valores.registrosPG[0].profileId,
      hostOS:valores.hostOs,
      host:valores.registrosPG[0].knowIdHost,
      user:valores.registrosPG[0].userIdKey,
      nodoRemoto: valores.registrosPG[0].nodoRemoto,
      nodoLocal: valores.registrosPG[0].nodoLocal,
      oscurecerPassword: valores.registrosPG[0].oscurecerPwd,
      usuarioLocal: valores.registrosPG[0].usuarioLocal,
      passRemoto: valores.registrosPG[0].passwordRemoto,
      modoBinario: valores.registrosPG[0].modoBinario,
      Longitud: valores.registrosPG[0].longitudRegistro,
      formato: valores.registrosPG[0].formatoRegistro,
      modo: valores.registrosPG[0].modoDisp,
      sys: valores.registrosPG[0].parametroSysOpts,
      disposición: valores.registrosPG[0].disposicionRegistro,
      uri:'',
      uriG: '',
      certificado:  '',
      uriConsulta:'',
      ip: valores.registrosPG[0].servidor, // validar Que este*/
      ruta:valores.registrosPG[0].directorio,
      rutaG:valores.registrosPG[1].directorio,
      });
      if(valores.registrosPG[0].putGetWSDto !== null){
        this.parametrosContratoConfigForm.patchValue({
        uri: valores.registrosPG[0].putGetWSDto.uriPUTWS || '',
        uriG: valores.registrosPG[0].putGetWSDto.uriGETWS || '',
        certificado: valores.registrosPG[0].putGetWSDto.certificadoWS || '',
        uriConsulta: valores.registrosPG[0].putGetWSDto.uriConsultaWS || '',
        //ruta:'',
        //rutaG:'',
        })
      }
  }

  /** Faltan no esta 
   *  protocolo:[''],

        ruta:[''],
        rutaG:[''],
        ip:[''],
        hostOS:['']
   */


    guardar(valor:any){
      var idP = this.productoSeleccionado
      if(idP!==null && idP!==''){
        var idnuevo= this.agregar.idProtocolo
        if(idP!==idnuevo){
          if(this.validaCamposReq()){
            this.openConfirmYN(
              this.translate.instant('advertencia'),
            this.translate.instant('TPD'), valor);
          }
        }else{
          if(this.validaCamposReq()){
            this.envio(valor)
          }
        }
      }else{
        if(this.validaCamposReq()){
          this.envio(valor)
        }
      }
    }

    actualizar(valor:any){
      var idP = this.productoSeleccionado
      if(idP!==null && idP!==''){
        var idnuevo= this.agregar.idProtocolo
        if(idP!==idnuevo){
          if(this.validaCamposReq()){
            this.openConfirmYN(
              this.translate.instant('advertencia'),
            this.translate.instant('TPD'), valor);
          }
        }else{
          if(this.validaCamposReq()){
            this.envioActualizar(valor)
          }
        }
      }else{
        if(this.validaCamposReq()){
          this.envioActualizar(valor)
        }
      }
    }

    async envio(valor:any){
      if(valor === '1'){
          this.guarda = {
            "tipoOperPG": "A",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": "",
            "idProtocoloPath2": "",
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo":this.productoSeleccionado, // nuevo
              "profileIdPutGet": this.parametrosContratoConfigForm.value.profile,
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,
              "userIdKeyPutGet": this.parametrosContratoConfigForm.value.user,
              "nodoRemotoPutGet": "",
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": "",
              "usuarioLocalPutGet": "",
              "passwordRemotoPutGet": "",
              "oscurecerPwdPutGet": "",
              "modoBinarioPutGet": "",
              "formatoRegistroPutGet": "",
              "longitudRegistroPutGet": "",
              "modoDispPutGet": "",
              "parametroSysOptsPutGet": "",
              "disposicionRegistroPutGet": "",
              "hostOSPutGet": "",
              "webServiceRequest": {
                "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
                "wsipserverPutGet": this.parametrosContratoConfigForm.value.servidor,
                "wsrutaPut": this.parametrosContratoConfigForm.value.directorio,
                "wsrutaGet": this.parametrosContratoConfigForm.value.directorioG,
                "wspatronPutGet": this.parametrosContratoConfigForm.value.patron,
                "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
                "wsuriPut":'',
                "wsuriGet": '',
                "wsurldestPutGet": '' ,
                "wscertPutGet": '',
            }
              }
          }
      }
      if(valor === '2'){
        if(this.agregar.idProtocolo == '5'){
          this.guarda = {
            "tipoOperPG": "A",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": '',
            "idProtocoloPath2": '',
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo":  this.productoSeleccionado,
              "profileIdPutGet":"",//
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,//
              "userIdKeyPutGet": "",//
              "nodoRemotoPutGet":  this.parametrosContratoConfigForm.value.nodoRemoto,
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": this.parametrosContratoConfigForm.value.nodoLocal,
              "usuarioLocalPutGet": this.parametrosContratoConfigForm.value.usuarioLocal,
              "passwordRemotoPutGet":this.parametrosContratoConfigForm.value.passRemoto,
              "oscurecerPwdPutGet": this.parametrosContratoConfigForm.value.oscurecerPassword,
              "modoBinarioPutGet":  this.parametrosContratoConfigForm.value.modoBinario,
              "formatoRegistroPutGet":  this.parametrosContratoConfigForm.value.formato,
              "longitudRegistroPutGet":  this.parametrosContratoConfigForm.value.Longitud,
              "modoDispPutGet":  this.parametrosContratoConfigForm.value.modo,
              "parametroSysOptsPutGet":  this.parametrosContratoConfigForm.value.sys,
              "disposicionRegistroPutGet":  this.parametrosContratoConfigForm.value.disposición,
              "hostOSPutGet":  this.parametrosContratoConfigForm.value.hostOS,
              "webServiceRequest": {
                "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
                "wsipserverPutGet": this.parametrosContratoConfigForm.value.servidor,
                "wsrutaPut": this.parametrosContratoConfigForm.value.directorio,
                "wsrutaGet": this.parametrosContratoConfigForm.value.directorioG,
                "wspatronPutGet": this.parametrosContratoConfigForm.value.patron,
                "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
                "wsuriPut":'',
                "wsuriGet": '',
                "wsurldestPutGet": '' ,
                "wscertPutGet": '',
            }
              }
          }
        }else{
          
        this.guarda = {
          "tipoOperPG": "A",
          "idProtocolo": this.agregar.idProtocolo,
          "idContrato": this.datos.idContrato,
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente": this.datos.codigoCliente,
          "idProtocoloPara": this.agregar.idPtclPara,
          "idProtocoloPath1": "",
          "idProtocoloPath2": "",
            "putGetSaveRequest": {
            "directorioPut": this.parametrosContratoConfigForm.value.directorio,
            "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
            "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
            "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
            "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
            "patronPutGet": this.parametrosContratoConfigForm.value.patron,
            "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
            "idSelTipoProtocolo": this.productoSeleccionado,// nuevo protocolo
            "profileIdPutGet":"",//
            "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,//
            "userIdKeyPutGet": "",//
            "nodoRemotoPutGet":  this.parametrosContratoConfigForm.value.nodoRemoto,
            "usuarioRemotoPutGet": "",
            "nodoLocalPutGet": this.parametrosContratoConfigForm.value.nodoLocal,
            "usuarioLocalPutGet": this.parametrosContratoConfigForm.value.usuarioLocal,
            "passwordRemotoPutGet":this.parametrosContratoConfigForm.value.passRemoto,
            "oscurecerPwdPutGet": this.parametrosContratoConfigForm.value.oscurecerPassword,
            "modoBinarioPutGet":  this.parametrosContratoConfigForm.value.modoBinario,
            "formatoRegistroPutGet":  this.parametrosContratoConfigForm.value.formato,
            "longitudRegistroPutGet":  this.parametrosContratoConfigForm.value.Longitud,
            "modoDispPutGet":  this.parametrosContratoConfigForm.value.modo,
            "parametroSysOptsPutGet":  this.parametrosContratoConfigForm.value.sys,
            "disposicionRegistroPutGet":  this.parametrosContratoConfigForm.value.disposición,
            "hostOSPutGet":  this.parametrosContratoConfigForm.value.hostOS,
            }
        }
       }
     }
      if(valor === '5'){
        this.guarda = {
          "tipoOperPG": "A",
          "idProtocolo":this.agregar.idProtocolo,
          "idContrato": this.datos.idContrato,
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente": this.datos.codigoCliente,
          "idProtocoloPara": this.agregar.idPtclPara,
          "idProtocoloPath1": "",
          "idProtocoloPath2": "",
          "putGetSaveRequest": {
            "directorioPut": this.parametrosContratoConfigForm.value.directorio,
            "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
            "idSelTipoProtocolo": this.productoSeleccionado,
            "webServiceRequest": {
              "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
              "wsipserverPutGet": this.parametrosContratoConfigForm.value.ip,
              "wsrutaPut": this.parametrosContratoConfigForm.value.ruta,
              "wsrutaGet": this.parametrosContratoConfigForm.value.rutaG,
              "wspatronPutGet":  this.parametrosContratoConfigForm.value.patron,
              "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
              "wsuriPut": this.parametrosContratoConfigForm.value.uri,
              "wsuriGet": this.parametrosContratoConfigForm.value.uriG,
              "wsurldestPutGet":this.parametrosContratoConfigForm.value.uriConsulta ,
              "wscertPutGet": this.parametrosContratoConfigForm.value.certificado,
            }
          }
        }
      }
      try{
        await this.gestionConexionContratoService.nuevo(this.guarda).then(
          async (nuevo:any) => {
          this.parametrosContratoConfigForm.reset()
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.EXGC001"), 
            this.translate.instant('pantalla.configurar.contrato.observacion.EXGC001'),
            'info',
            this.translate.instant('pantalla.configurar.contrato.codigo.EXGC001'),
            this.translate.instant('pantalla.configurar.contrato.sugerencia.EXGC001')
            )   
          this.router.navigate(['gestionBuzon/configurarConexionContrato']);
        })
        this.guarda = {}
      }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("pantalla.configurar.contrato.titulo.ERGC001"), 
        this.translate.instant('pantalla.configurar.contrato.observacion.ERGC001'),
        'error',
        this.translate.instant('pantalla.configurar.contrato.codigo.ERGC001'),
        this.translate.instant('pantalla.configurar.contrato.sugerencia.ERGC001')
        )         }
    }

    validaCamposReq(){
      var valida;
      var idProtocolo= this.productoSeleccionado
      
      if(idProtocolo!=='5'){
        valida = this.validaComunesForm();
      } 
      if(idProtocolo  ==='5') {
        valida = this.validarProtocoloWS();
      }else if(idProtocolo!=='5' && valida){
          if(this.validaCamposmas()){
            valida= this.validaPath1y2();	
          }else{
            valida= false
          }
      }else{
        valida = false
      }

      return valida
    }

    validaPath1y2(){
      var valida=true;
      var path1=this.parametrosContratoConfigForm.value.directorio
      var path2=this.parametrosContratoConfigForm.value.directorioG
      var os2=this.parametrosContratoConfigForm.value.hostOS
      var sftp= this.parametrosContratoConfigForm.value.protocolo.toString()



      if(os2==='WIN' && sftp==='2'){
        if(this.validaPathsWin(path1,path2) ){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.requeridoOspathWin'),
            'alert',
            '',
            ''
            )      
          return valida=false
        }else{
        path1 = path1.replace('\//g','\\');
        path1 = path1.replace('\\//g','\\');
        path2 = path2.replace('\//g','\\');
        path2 = path2.replace('\\//g','\\');
          this.parametrosContratoConfigForm.patchValue({
            directorio:path1,
            directorioG: path2
        })
        }
      }else{
        if(!(path1.indexOf('/')===0) || !(path2.indexOf('/')===0)){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.requeridoOspathNoWin'),
            'alert',
            '',
            ''
            )      
          return valida=false;
        }else{
          this.parametrosContratoConfigForm.patchValue({
            directorio:path1.replace('\\','\/'),
            directorioG: path2.replace('\\','\/')
        })
        }
      }
      return valida;
    }

    validaPathsWin(path1:any,path2:any){
      if(path1.indexOf(':')===1 && path2.indexOf(':')===1){
        return false;
      }else if( path1.indexOf('\\')===0 &&  path2.indexOf('\\')===0 ){
         return false;
      }else{
        return true;
      }
      
    }
     validaCamposmas(){
      var validacion=true;
      var usuario=  this.parametrosContratoConfigForm.value.userId
      if(usuario===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.usuario'),
          'alert',
          '',
          ''
          ) 
         return false;
      }
      var idnuevo=this.parametrosContratoConfigForm.value.protocolo
      if(idnuevo===2){
        var os= this.parametrosContratoConfigForm.value.hostOS
        if(os===''){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.HostOS'),
            'alert',
            '',
            ''
            ) 
          return false
        }
      }
      return validacion;
    }

    validaComunesForm(){
      var validacion=true;
      var dirP=this.parametrosContratoConfigForm.value.directorio
      var dirG=this.parametrosContratoConfigForm.value.directorioG
      var puerto=this.parametrosContratoConfigForm.value.puerto
      var server=this.parametrosContratoConfigForm.value.servidor
      if(dirP==='' || dirG===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.dir'),
          'alert',
          '',
          ''
          ) 
        return false;
      }
      if(puerto===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.puerto'),
          'alert',
          '',
          ''
          ) 
        return false;
      }
      if(server===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.servidor'),
          'alert',
          '',
          ''
          ) 
        return false;
      }
      return true;
    }

    validarProtocoloWS(){
      var validacion=true;
      var serverWS=this.parametrosContratoConfigForm.value.ip
      var portWS=this.parametrosContratoConfigForm.value.puerto
      var uriConsulta=this.parametrosContratoConfigForm.value.uriConsulta
      var certWS=this.parametrosContratoConfigForm.value.certificado
      
      validacion = this.validarProtocoloWSUriRuta();
      if(validacion){
        if(uriConsulta===''){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.uriCons'),
            'alert',
            '',
            ''
            ) 
          return false;
        }
        if(portWS===''){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.puerto'),
            'alert',
            '',
            ''
            ) 
          return false;
        }
        if(serverWS===''){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.servidor'),
            'alert',
            '',
            ''
            ) 
          return false;
        }
        if(certWS===''){
          this.open(
            this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
            this.translate.instant('pantalla.configurar.contrato.certWS'),
            'alert',
            '',
            ''
            ) 
          return false;
        }
      }
      return validacion;
    }
   validarProtocoloWSUriRuta(){
      var validacion=true;
      var uriP=this.parametrosContratoConfigForm.value.uri
      var uriG=this.parametrosContratoConfigForm.value.uriG
      var rutaP=this.parametrosContratoConfigForm.value.ruta
      var rutaG=this.parametrosContratoConfigForm.value.rutaG
      var patronP=this.parametrosContratoConfigForm.value.patron
      var patronG=this.parametrosContratoConfigForm.value.patronG
      
      if(uriP==='' || uriG===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.uri'),
          'alert',
          '',
          ''
          ) 
        return false;
      }
      if(rutaP==='' || rutaG===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.ruta'),
          'alert',
          '',
          ''
          ) 
        return false;
      }
      if(patronP==='' || patronG===''){
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.msjERRTitulo"), 
          this.translate.instant('pantalla.configurar.contrato.patronWS'),
          'alert',
          '',
          ''
          )  
          return false;  
      }
      return validacion;
    }
    

    async envioActualizar(valor:any){
      if(valor === '1'){
        if(this.agregar.idProtocolo == '5'){
          this.guarda = {
            "tipoOperPG": "A",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": "",
            "idProtocoloPath2": "",
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo": this.productoSeleccionado, // nuevo
              "profileIdPutGet": this.parametrosContratoConfigForm.value.profile,
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,
              "userIdKeyPutGet": this.parametrosContratoConfigForm.value.user,
              "nodoRemotoPutGet": "",
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": "",
              "usuarioLocalPutGet": "",
              "passwordRemotoPutGet": "",
              "oscurecerPwdPutGet": "",
              "modoBinarioPutGet": "",
              "formatoRegistroPutGet": "",
              "longitudRegistroPutGet": "",
              "modoDispPutGet": "",
              "parametroSysOptsPutGet": "",
              "disposicionRegistroPutGet": "",
              "hostOSPutGet": "",
              "webServiceRequest": {
                "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
                "wsipserverPutGet": this.parametrosContratoConfigForm.value.ip,
                "wsrutaPut": this.parametrosContratoConfigForm.value.ruta,
                "wsrutaGet": this.parametrosContratoConfigForm.value.rutaG,
                "wspatronPutGet":  this.parametrosContratoConfigForm.value.patron,
                "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
                "wsuriPut": this.parametrosContratoConfigForm.value.uri,
                "wsuriGet": this.parametrosContratoConfigForm.value.uriG,
                "wsurldestPutGet":this.parametrosContratoConfigForm.value.uriConsulta ,
                "wscertPutGet": this.parametrosContratoConfigForm.value.certificado,
              }
              }
          }
        }else{
          this.guarda = {
            "tipoOperPG": "M",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": this.path1,
            "idProtocoloPath2": this.path2,
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo": this.productoSeleccionado,
              "profileIdPutGet": this.parametrosContratoConfigForm.value.profile,
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,
              "userIdKeyPutGet": this.parametrosContratoConfigForm.value.user,
              "nodoRemotoPutGet": "",
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": "",
              "usuarioLocalPutGet": "",
              "passwordRemotoPutGet": "",
              "oscurecerPwdPutGet": "",
              "modoBinarioPutGet": "",
              "formatoRegistroPutGet": "",
              "longitudRegistroPutGet": "",
              "modoDispPutGet": "",
              "parametroSysOptsPutGet": "",
              "disposicionRegistroPutGet": "",
              "hostOSPutGet": "",
              }
          }
        }
      }
      if(valor === '2'){
        if(this.agregar.idProtocolo == '5'){
          this.guarda = {
            "tipoOperPG": "A",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": this.path1,
            "idProtocoloPath2": this.path2,
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo":  this.productoSeleccionado,
              "profileIdPutGet":"",//
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,//
              "userIdKeyPutGet": "",//
              "nodoRemotoPutGet":  this.parametrosContratoConfigForm.value.nodoRemoto,
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": this.parametrosContratoConfigForm.value.nodoLocal,
              "usuarioLocalPutGet": this.parametrosContratoConfigForm.value.usuarioLocal,
              "passwordRemotoPutGet":this.parametrosContratoConfigForm.value.passRemoto,
              "oscurecerPwdPutGet": this.parametrosContratoConfigForm.value.oscurecerPassword,
              "modoBinarioPutGet":  this.parametrosContratoConfigForm.value.modoBinario,
              "formatoRegistroPutGet":  this.parametrosContratoConfigForm.value.formato,
              "longitudRegistroPutGet":  this.parametrosContratoConfigForm.value.Longitud,
              "modoDispPutGet":  this.parametrosContratoConfigForm.value.modo,
              "parametroSysOptsPutGet":  this.parametrosContratoConfigForm.value.sys,
              "disposicionRegistroPutGet":  this.parametrosContratoConfigForm.value.disposición,
              "hostOSPutGet":  this.parametrosContratoConfigForm.value.hostOS,
              "webServiceRequest": {
                "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
                "wsipserverPutGet": this.parametrosContratoConfigForm.value.ip,
                "wsrutaPut": this.parametrosContratoConfigForm.value.ruta,
                "wsrutaGet": this.parametrosContratoConfigForm.value.rutaG,
                "wspatronPutGet":  this.parametrosContratoConfigForm.value.patron,
                "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
                "wsuriPut": this.parametrosContratoConfigForm.value.uri,
                "wsuriGet": this.parametrosContratoConfigForm.value.uriG,
                "wsurldestPutGet":this.parametrosContratoConfigForm.value.uriConsulta ,
                "wscertPutGet": this.parametrosContratoConfigForm.value.certificado,
              }
              }
          }
        }else{
          this.guarda = {
            "tipoOperPG": "M",
            "idProtocolo": this.agregar.idProtocolo,
            "idContrato": this.datos.idContrato,
            "numeroContrato": this.datos.numeroContrato,
            "codigoCliente": this.datos.codigoCliente,
            "idProtocoloPara": this.agregar.idPtclPara,
            "idProtocoloPath1": this.path1,
            "idProtocoloPath2": this.path2,
              "putGetSaveRequest": {
              "directorioPut": this.parametrosContratoConfigForm.value.directorio,
              "directorioGet": this.parametrosContratoConfigForm.value.directorioG,
              "puertoPutGet": this.parametrosContratoConfigForm.value.puerto,
              "servidorPutGet": this.parametrosContratoConfigForm.value.servidor,
              "useriIDPutGet": this.parametrosContratoConfigForm.value.userId,
              "patronPutGet": this.parametrosContratoConfigForm.value.patron,
              "patronGetPutGet": this.parametrosContratoConfigForm.value.patronG,
              "idSelTipoProtocolo":  this.productoSeleccionado,
              "profileIdPutGet":"",//
              "knowIdHostPutGet": this.parametrosContratoConfigForm.value.host,//
              "userIdKeyPutGet": "",//
              "nodoRemotoPutGet":  this.parametrosContratoConfigForm.value.nodoRemoto,
              "usuarioRemotoPutGet": "",
              "nodoLocalPutGet": this.parametrosContratoConfigForm.value.nodoLocal,
              "usuarioLocalPutGet": this.parametrosContratoConfigForm.value.usuarioLocal,
              "passwordRemotoPutGet":this.parametrosContratoConfigForm.value.passRemoto,
              "oscurecerPwdPutGet": this.parametrosContratoConfigForm.value.oscurecerPassword,
              "modoBinarioPutGet":  this.parametrosContratoConfigForm.value.modoBinario,
              "formatoRegistroPutGet":  this.parametrosContratoConfigForm.value.formato,
              "longitudRegistroPutGet":  this.parametrosContratoConfigForm.value.Longitud,
              "modoDispPutGet":  this.parametrosContratoConfigForm.value.modo,
              "parametroSysOptsPutGet":  this.parametrosContratoConfigForm.value.sys,
              "disposicionRegistroPutGet":  this.parametrosContratoConfigForm.value.disposición,
              "hostOSPutGet":  this.parametrosContratoConfigForm.value.hostOS,
              "webServiceRequest": {
                "wsportPutGet": '',
                "wsipserverPutGet": '',
                "wsrutaPut": '',
                "wsrutaGet": '',
                "spatronPutGet":  '',
                "wspatronGetPutGet":  '',
                "wsuriPut":'',
                "wsuriGet": '',
                "wsurldestPutGet": '' ,
                "wscertPutGet": '',
              }
              }
          }
        }
      }
      if(valor === '5'){
        this.guarda = {
          "tipoOperPG": "M",
          "idProtocolo": this.agregar.idProtocolo,
          "idContrato": this.datos.idContrato,
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente": this.datos.codigoCliente,
          "idProtocoloPara": this.agregar.idPtclPara,
          "idProtocoloPath1": this.path1,
          "idProtocoloPath2": this.path2,
          "putGetSaveRequest": {
            "idSelTipoProtocolo": this.productoSeleccionado,
            "webServiceRequest": {
              "wsportPutGet": this.parametrosContratoConfigForm.value.puerto,
              "wsipserverPutGet": this.parametrosContratoConfigForm.value.ip,
              "wsrutaPut": this.parametrosContratoConfigForm.value.ruta,
              "wsrutaGet": this.parametrosContratoConfigForm.value.rutaG,
              "wspatronPutGet":  this.parametrosContratoConfigForm.value.patron,
              "wspatronGetPutGet":  this.parametrosContratoConfigForm.value.patronG,
              "wsuriPut": this.parametrosContratoConfigForm.value.uri,
              "wsuriGet": this.parametrosContratoConfigForm.value.uriG,
              "wsurldestPutGet":this.parametrosContratoConfigForm.value.uriConsulta ,
              "wscertPutGet": this.parametrosContratoConfigForm.value.certificado,
            }
          }
        }
      }
      try{
        await this.gestionConexionContratoService.nuevo(this.guarda).then(
          async(nuevo:any) => {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant("pantalla.configurar.contrato.titulo.EXGC001"), 
              this.translate.instant('pantalla.configurar.contrato.observacion.EXGC001'),
              'info',
              this.translate.instant('pantalla.configurar.contrato.codigo.EXGC001'),
              this.translate.instant('pantalla.configurar.contrato.sugerencia.EXGC001')
              )    
              this.router.navigate(['gestionBuzon/configurarConexionContrato']);
        })
      }catch(e){
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translate.instant("pantalla.configurar.contrato.titulo.ERGC001"), 
          this.translate.instant('pantalla.configurar.contrato.observacion.ERGC001'),
          'error',
          this.translate.instant('pantalla.configurar.contrato.codigo.ERGC001'),
          this.translate.instant('pantalla.configurar.contrato.sugerencia.ERGC001')
          )    
      }
    }
  
  
    cancelar(){
      this.gestionConexionContratoService.setSaveLocalStorage('path1',null);
      this.gestionConexionContratoService.setSaveLocalStorage('path2',null);
      this.router.navigate(['gestionBuzon/configurarConexionContrato']);
    }
    
    limpiar(){
      this.parametrosContratoConfigForm.reset();
    }

    open(  titulo: String,  contenido: String,  type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',  code: string,  sugerencia: string) {
      this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  openConfirmYN(titulo: string, contenido: string, valor:any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "yesNo"), hasBackdrop: true});
    dialogo.afterClosed().subscribe((result: string) => {
      if (result === 'si') {
        this.envio(valor)
      }
  });
  }

  disableEvent(event:any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }


  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  caracteresEspeciales(event: KeyboardEvent) {
    this.fc.especial(event);
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  num(event: KeyboardEvent) {
    this.fc.numeros(event);
  }



}
