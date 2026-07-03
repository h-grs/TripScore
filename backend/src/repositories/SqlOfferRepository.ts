import Database from "better-sqlite3";
import { IOfferRepository } from "./IOfferRepository";
import { Offer } from "../models/Offer";

export class SqlOfferRepository implements IOfferRepository {
  private db: Database.Database;

  constructor(dbPath: string = "offers.db") {
    this.db = new Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS offers (
        id TEXT PRIMARY KEY,
        destination TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        rating REAL NOT NULL,
        durationDays INTEGER
      )
    `);

    const count = (
      this.db.prepare("SELECT COUNT(*) as c FROM offers").get() as { c: number }
    ).c;
    if (count === 0) {
      const insert = this.db.prepare(`
        INSERT INTO offers VALUES (@id, @destination, @type, @category, @price, @rating, @durationDays)
      `);
      const seed = this.db.transaction(() => {
        insert.run({
          id: "1",
          destination: "Lisbonne",
          type: "flight",
          category: "budget",
          price: 89,
          rating: 4.2,
          durationDays: null,
        });
        insert.run({
          id: "2",
          destination: "Bali",
          type: "package",
          category: "luxury",
          price: 1450,
          rating: 4.8,
          durationDays: 10,
        });
        insert.run({
          id: "3",
          destination: "Marrakech",
          type: "hotel",
          category: "standard",
          price: 320,
          rating: 3.9,
          durationDays: 4,
        });
      });
      seed();
    }
  }

  async findAll(): Promise<Offer[]> {
    return this.db.prepare("SELECT * FROM offers").all() as Offer[];
  }
}
