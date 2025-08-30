import { PorukaEnum } from "../../Domain/enums/PorukaEnum";

export class Poruka {
  public constructor(
    public posiljalac: string = '',
    public primalac: string = '',
    public tekst: string = '',
    public stanje: number = 0,
  ) {}
}
