export class Emisora{
    emisora         : string;
    razonSocial     : string;
    status          : string;
}

export class EmisoraRequest{
    emisora         : string;
	numContrato     : string;
    razSocial     : string;
    user          : string | null;
}