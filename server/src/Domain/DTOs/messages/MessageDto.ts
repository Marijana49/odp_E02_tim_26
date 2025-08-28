import { PorukaEnum } from "../../enums/PorukaEnum";

export class MessageDto {
  public constructor(
    public posiljalac: string = "",
    public primalac: string = "",
    public tekst: string = "",
    public stanje: PorukaEnum = PorukaEnum.Poslato
  ) {}
}
