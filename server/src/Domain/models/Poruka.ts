import { PorukaEnum } from "../../Domain/enums/PorukaEnum";

export class Poruka {
  public constructor(
    public id: number = 0,
    public text: string = '',
    public stanje: PorukaEnum, 
    public lozinka: string = ''
  ) {}
}