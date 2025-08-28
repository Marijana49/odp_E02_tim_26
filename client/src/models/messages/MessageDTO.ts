import type { PorukaEnum } from "../../../../server/src/Domain/enums/PorukaEnum";

export interface MessageDto {
    posiljalac: string;
    primalac: string;
    tekst: string;
    stanje: PorukaEnum;
}