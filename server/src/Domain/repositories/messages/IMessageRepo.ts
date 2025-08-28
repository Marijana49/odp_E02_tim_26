import { Poruka } from "../../models/Poruka";

/**
 * Repository interface za upravljanje korisnicima
 * Definiše operacije za rad sa korisnicima u bazi podataka
 */
export interface IMessageRepo {
  /**
   * Kreira novog korisnika u bazi podataka
   * @param mess - Objekat korisnika za kreiranje
   * @returns Promise koji vraća kreiranog korisnika sa dodeljenim ID-om ili prazan objekat
   */
  create(mess: Poruka): Promise<Poruka>;

  /**
   * Vraća sve korisnike iz baze podataka
   * @returns Promise koji vraća niz svih korisnika
   */
  getAll(): Promise<Poruka[]>;

  /**
   * Ažurira postojećeg korisnika
   * @param mess - Objekat korisnika sa ažuriranim podacima
   * @returns Promise koji vraća ažuriranog korisnika ili prazan objekat ako ažuriranje nije uspešno
   */
  update(mess: Poruka): Promise<Poruka>;

  /**
   * Briše korisnika iz baze podataka
   * @param posiljalac - ID korisnika za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(posiljalac: string): Promise<boolean>;

  /**
   * Proverava da li korisnik postoji u bazi podataka
   * @param posiljalac - ID korisnika za proveru
   * @returns Promise koji vraća true ako korisnik postoji, false inače
   */
  exists(posiljalac: string): Promise<boolean>;

  /**
   * Pronalazi korisnika po korisničkom imenu
   * @param posiljalac - Korisničko ime za pretragu
   * @returns Promise koji vraća korisnika ili prazan objekat ako nije pronađen
   */
  getByUsername(posiljalac: string): Promise<Poruka>;
}