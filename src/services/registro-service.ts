import type {
  FaixaEtaria,
  Periodo,
  Publico,
  Registro,
} from "../models/registro";
import { RegistroRepository } from "../database/registro-repository";

interface DadosRegistro {
  faixaEtaria: FaixaEtaria;
  publico: Publico;
}

interface DadosRegistroManual extends DadosRegistro {
  data: string;
  periodo: Periodo;
}

class RegistroService {
  private repository: RegistroRepository;

  constructor(repository: RegistroRepository) {
    this.repository = repository;
  }

  async registrarAutomatico(
    dados: DadosRegistro,
  ): Promise<Registro> {
    const agora = new Date();

    const registro: Registro = {
      id: crypto.randomUUID(),
      data: this.formatarData(agora),
      hora: this.formatarHora(agora),
      periodo: this.obterPeriodo(agora),
      faixaEtaria: dados.faixaEtaria,
      publico: dados.publico,
    };

    await this.repository.salvar(registro);

    return registro;
  }

  async registrarManual(
    dados: DadosRegistroManual,
  ): Promise<Registro> {
    const agora = new Date();

    const registro: Registro = {
      id: crypto.randomUUID(),
      data: dados.data,
      hora: this.formatarHora(agora),
      periodo: dados.periodo,
      faixaEtaria: dados.faixaEtaria,
      publico: dados.publico,
    };

    await this.repository.salvar(registro);

    return registro;
  }

  async listarRegistros(): Promise<Registro[]> {
    return this.repository.listar();
  }

  async excluirUltimoRegistro(): Promise<Registro | null> {
    const registros = await this.repository.listar();

    if (registros.length === 0) {
      return null;
    }

    const ultimo = registros.reduce((maisRecente, registro) => {
      const dataMaisRecente = this.converterParaDate(maisRecente);
      const dataRegistro = this.converterParaDate(registro);

      return dataRegistro > dataMaisRecente
        ? registro
        : maisRecente;
    });

    await this.repository.excluir(ultimo.id);

    return ultimo;
  }

  private converterParaDate(registro: Registro): Date {
    const [dia, mes, ano] = registro.data.split("/");
    const [hora, minuto, segundo] = registro.hora.split(":");

    return new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minuto),
      Number(segundo),
    );
  }

  private obterPeriodo(data: Date): Periodo {
    const hora = data.getHours();

    if (hora < 12) {
      return "Manhã";
    }

    if (hora < 18) {
      return "Tarde";
    }

    return "Noite";
  }

  private formatarData(data: Date): string {
    return data.toLocaleDateString("pt-BR");
  }

  private formatarHora(data: Date): string {
    return data.toLocaleTimeString("pt-BR");
  }
}

export { RegistroService };