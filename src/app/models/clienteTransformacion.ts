import { Clientes } from "./clientes";

export class clienteTransformacion {
    canal!: Canal;
    valSent!: string;
    flgBandActi!: string;
    cliente!:Cliente;
  }

  export class Canal{
    static id_CANL_PK:number;
  }

  export class Cliente{
    static idClte:string;
  }

  export class ClienteTransformaciones{
    CANAL!: string;
DESC_MAPA_IN!: string;
DESC_MAPA_OUT!: string;
FECHA_REGISTRO!
: 
"2022-10-28 15:22:57.0";
FLAG!: boolean;
ID_CANAL!:number;
ID_CLTE_TRFM_PK!: number;
ID_LAYT_IN!: number;
ID_LAYT_OUT!: number;
SENTIDO!: string;
  }



