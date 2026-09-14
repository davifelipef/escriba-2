export type Publico =
  | "CEI"
  | "EMEI"
  | "EMEF"
  | "ETEC"
  | "Comunidade"
  | "Funcionário";

export type FaixaEtaria =
  | "Até 12"
  | "13 a 17"
  | "18 a 59"
  | "60 ou mais";

export type Periodo =
  | "Manhã"
  | "Tarde"
  | "Noite";

export interface Registro {
  id: string;
  data: string;
  hora: string;
  periodo: Periodo;
  faixaEtaria: FaixaEtaria;
  publico: Publico;
}