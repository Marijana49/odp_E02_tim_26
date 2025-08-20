import { PorukaEnum } from "../../Domain/enums/PorukaEnum";

export class Poruka {
  public constructor(
    public korIme: string = '',
    public primljenaPoruka: string = '',
    public poslataPoruka: string = '',
    public stanje: PorukaEnum.Poslato, 
  ) {}
}