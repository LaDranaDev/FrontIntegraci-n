export interface ArchivoDiario{
    ID_ARCH_PK: number; //fichero 
    TXT_NMBR_ARCH: string; //Nombre del archivo
    ESTADO: string; //estado
    FCH_FECH_REG: string; //fecha
    CANAL: string;//canal
    SENTIDO: string;//sentido 
    CLIENTE: string;//cliente 
    DESC_MAPA_IN: string;//Entrada
    DESC_MAPA_OUT: string;//Salida  
}
