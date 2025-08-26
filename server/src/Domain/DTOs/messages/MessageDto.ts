import { PorukaEnum } from "../../enums/PorukaEnum";

export class MessageDto {
  public constructor(
    public korIme: string = "",
    public primljenaPoruka: string = "",
    public poslataPoruka: string = "",
    public stanje: PorukaEnum = PorukaEnum.Poslato
  ) {}
}
