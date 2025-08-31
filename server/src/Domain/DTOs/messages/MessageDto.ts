export class MessageDto {
  public constructor(
    public id: number = 0,
    public posiljalac: string = "",
    public primalac: string = "",
    public tekst: string = "",
    public stanje: number = 0
  ) {}
}
