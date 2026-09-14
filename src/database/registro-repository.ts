import { openDB, type IDBPDatabase } from "idb";
import type { Registro } from "../models/registro";

const DATABASE_NAME = "escriba";
const DATABASE_VERSION = 1;
const STORE_NAME = "registros";

interface EscribaDatabase {
  registros: Registro;
}

class RegistroRepository {
  private dbPromise: Promise<IDBPDatabase<EscribaDatabase>>;

  constructor() {
    this.dbPromise = openDB<EscribaDatabase>(
      DATABASE_NAME,
      DATABASE_VERSION,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, {
              keyPath: "id",
            });
          }
        },
      },
    );
  }

  async salvar(registro: Registro): Promise<void> {
    const db = await this.dbPromise;

    await db.put(STORE_NAME, registro);
  }

  async listar(): Promise<Registro[]> {
    const db = await this.dbPromise;

    return db.getAll(STORE_NAME);
  }

  async excluir(id: string): Promise<void> {
    const db = await this.dbPromise;

    await db.delete(STORE_NAME, id);
  }
}

export { RegistroRepository };