import type { FaixaEtaria, Periodo, Publico } from "./registro";

export const PUBLICOS: Publico[] = [
  "CEI",
  "EMEI",
  "EMEF",
  "ETEC",
  "Comunidade",
  "Funcionário",
];

export const FAIXAS_ETARIAS: FaixaEtaria[] = [
  "Até 12",
  "13 a 17",
  "18 a 59",
  "60 ou mais",
];

export const PERIODOS: Periodo[] = [
  "Manhã",
  "Tarde",
  "Noite",
];