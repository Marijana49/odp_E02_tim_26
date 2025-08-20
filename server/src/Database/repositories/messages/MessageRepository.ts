import { IMessageRepo } from "../../../Domain/repositories/messages/IMessageRepo";
import { Poruka } from "../../../Domain/models/Poruka";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { PorukaEnum } from "../../../Domain/enums/PorukaEnum";

export class MessageRepository implements IMessageRepo {
  async create(mess: Poruka): Promise<Poruka> {
    try {
      const query = `
        INSERT INTO mess (korIme, primljenaPoruka, poslataPoruka, stanje) 
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        mess.korIme,
        mess.primljenaPoruka,
        mess.poslataPoruka,
        mess.stanje
      ]);


      if (result.insertId) {
        return new Poruka(mess.korIme, mess.primljenaPoruka, mess.poslataPoruka, mess.stanje);
      }

      return new Poruka(undefined, undefined, undefined, PorukaEnum.Poslato);
    } catch (error) {
      console.error('Error creating user:', error);
      return new Poruka(undefined, undefined, undefined, PorukaEnum.Poslato);
    }
  }

  async getAll(): Promise<Poruka[]> {
    try {
      const query = `SELECT * FROM mess`;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new Poruka(row.korIme, row.primljenaPoruka, row.poslataPoruka, row.stanje)
      );
    } catch {
      return [];
    }
  }

  async update(mess: Poruka): Promise<Poruka> {
    try {
      const query = `
        UPDATE mess 
        SET primljenaPoruka = ?, poslataPoruka = ?, stanje = ?
        WHERE korIme = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        mess.primljenaPoruka,
        mess.poslataPoruka,
        mess.stanje,
        mess.korIme
      ]);

      if (result.affectedRows > 0) {
        return mess;
      }

       return new Poruka(undefined, undefined, undefined, PorukaEnum.Poslato);
    } catch {
       return new Poruka(undefined, undefined, undefined, PorukaEnum.Poslato);
    }
  }

  async delete(korIme: string): Promise<boolean> {
    try {
      const query = `
        DELETE FROM mess 
        WHERE korIme = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [korIme]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(korIme: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM mess 
        WHERE korIme = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [korIme]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}