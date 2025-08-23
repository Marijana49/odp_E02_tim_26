export class UserDto {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = "",
    public uloga: string = "user",
    public slika: string = "",
    public brTelefona: string = "",
    public ime: string = "",
    public prezime: string = "",
  ) {}
}
