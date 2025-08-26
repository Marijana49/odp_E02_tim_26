import type { PorukaEnum } from "../../../../server/src/Domain/enums/PorukaEnum";

export interface MessageDto {
    korIme: string;
    ulogovani: string;
    primljenaPoruka: string;
    poslataPoruka: string;
    stanje: PorukaEnum;
}