import { IMessageRepo } from "../../../Domain/repositories/messages/IMessageRepo";
import { Poruka } from "../../../Domain/models/Poruka";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { PorukaEnum } from "../../../Domain/enums/PorukaEnum";

export class MessageRepository implements IMessageRepo {
  async create(mess: Poruka): Promise<Poruka> {
    try {
      const query = `
        INSERT INTO messages (posiljalac, primalac, tekst, stanje) 
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        mess.posiljalac,
        mess.primalac,
        mess.tekst,
        mess.stanje
      ]);

      return mess;
    } catch (error) {
      console.error('Error creating user:', error);
      return new Poruka();
    }
  }

  async getAll(): Promise<Poruka[]> {
    try {
      const query = `SELECT * FROM messages`;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new Poruka(
          row.posiljalac, 
          row.primalac, 
          row.tekst, 
          row.stanje
        )
      );
    } catch {
      return [];
    }
  }

  async update(mess: Poruka): Promise<Poruka> {
    try {
      const query = `
        UPDATE messages 
        SET tekst = ?, stanje = ?
        WHERE posiljalac = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        mess.tekst,
        mess.stanje,
        mess.posiljalac
      ]);

      if (result.affectedRows > 0) {
        return mess;
      }

       return new Poruka();
    } catch {
       return new Poruka();
    }
  }

  async delete(posiljalac: string): Promise<boolean> {
    try {
      const query = `
        DELETE FROM messages 
        WHERE posiljalac = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [posiljalac]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(posiljalac: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM messages 
        WHERE posiljalac = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [posiljalac]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }

  async getByUsername(posiljalac: string): Promise<Poruka> {
    try {
      const query = `
        SELECT posiljalac, primalac, tekst, stanje
        FROM messages 
        WHERE posiljalac = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [posiljalac]);

      if (rows.length > 0) {
        const row = rows[0];
        return new Poruka(row.posiljalac, row.primalac, row.tekst, row.stanje);
      }

      return new Poruka();
    } catch (error) {
      console.log("message get by username: " + error);
      return new Poruka();
    }
  }

}