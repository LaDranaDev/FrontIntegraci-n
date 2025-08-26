export class Clientes {
  usuario!:Usuarios[];
  ID_CLTE_PK!: number;
  TXT_NMBR_CLTE!: string;
  NUM_BUC!: string;
  ID_USU_FK!: number;
  DSC_CLTE!: string;
}
export class Usuarios
{
  id_USU_PK!:number;
}