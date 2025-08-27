export class UserDto {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = "",
    public uloga: string = "user",
    public slike: string = "",
    public brTelefona: string = "",
    public ime: string = "",
    public prezime: string = "",
  ) {}
}
