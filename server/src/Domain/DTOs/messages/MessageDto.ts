export class MessageDto {
  public constructor(
    public posiljalac: string = "",
    public primalac: string = "",
    public tekst: string = "",
    public stanje: number = 0
  ) {}
}
