import template from "./app.html?raw";

import {
  FAIXAS_ETARIAS,
  PERIODOS,
  PUBLICOS,
} from "../models/opcoes";
import type {
  FaixaEtaria,
  Periodo,
  Publico,
  Registro,
} from "../models/registro";
import { RegistroService } from "../services/registro-service";
import { RelatorioService } from "../services/relatorio-service";
import { Calendario } from "./calendario";

type Modo = "automatico" | "manual";

type TipoToast = "sucesso" | "erro";

export class App {
  private service: RegistroService;
  private relatorioService: RelatorioService;
  private root: HTMLElement;

  private modo: Modo = "automatico";
  private faixaEtariaSelecionada: FaixaEtaria | null = null;
  private publicoSelecionado: Publico | null = null;
  private periodoSelecionado: Periodo | null = null;
  private calendario: Calendario;
  private dataSelecionada: string | null = null;

  constructor(service: RegistroService, root: HTMLElement) {
    this.service = service;
    this.relatorioService = new RelatorioService();
    this.root = root;

    this.calendario = new Calendario((data) => {
      this.dataSelecionada = data;
      this.atualizarBotaoData();
    });
  }

  render(): void {
    this.root.innerHTML = template;

    this.renderOpcoes();
    this.atualizarModo();
    this.atualizarBotaoData();
    this.configurarEventos();
  }

  private renderOpcoes(): void {
    const periodo = this.root.querySelector("#periodo");
    const faixaEtaria = this.root.querySelector("#faixa-etaria");
    const publico = this.root.querySelector("#publico");

    if (!periodo || !faixaEtaria || !publico) {
      throw new Error("Elementos da interface não encontrados.");
    }

    periodo.innerHTML = PERIODOS.map(
      (item) => `
        <button
          type="button"
          data-periodo="${item}"
          class="${
            this.periodoSelecionado === item ? "selected" : ""
          }"
        >
          ${item}
        </button>
      `,
    ).join("");

    faixaEtaria.innerHTML = FAIXAS_ETARIAS.map(
      (item) => `
        <button
          type="button"
          data-faixa="${item}"
          class="${
            this.faixaEtariaSelecionada === item
              ? "selected"
              : ""
          }"
        >
          ${item}
        </button>
      `,
    ).join("");

    publico.innerHTML = PUBLICOS.map(
      (item) => `
        <button
          type="button"
          data-publico="${item}"
          class="${
            this.publicoSelecionado === item
              ? "selected"
              : ""
          }"
        >
          ${item}
        </button>
      `,
    ).join("");
  }

  private atualizarModo(): void {
    const modo = this.root.querySelector("#modo");

    const calendario =
      this.root.querySelector<HTMLButtonElement>(
        "#abrir-calendario",
      );

    const periodos =
      this.root.querySelectorAll<HTMLButtonElement>(
        "#periodo button",
      );

    if (!modo || !calendario) {
      return;
    }

    const manual = this.modo === "manual";

    modo.querySelectorAll("button").forEach((button) => {
      button.classList.toggle(
        "selected",
        button.dataset.modo === this.modo,
      );
    });

    calendario.disabled = !manual;

    periodos.forEach((button) => {
      button.disabled = !manual;
    });
  }

  private atualizarBotaoData(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#abrir-calendario",
      );

    if (!button) {
      return;
    }

    if (!this.dataSelecionada) {
      button.textContent = "Abrir calendário";
      return;
    }

    const [ano, mes, dia] = this.dataSelecionada.split("-");

    button.textContent = `${dia}/${mes}/${ano}`;
  }

  private configurarEventos(): void {
    this.configurarSelecaoModo();
    this.configurarSelecaoFaixaEtaria();
    this.configurarSelecaoPublico();
    this.configurarSelecaoPeriodo();
    this.configurarCalendario();
    this.configurarRegistro();
    this.configurarRelatorio();
    this.configurarVisualizacaoDados();
    this.configurarFechamentoDados();
    this.configurarExclusaoUltimo();
  }

  private configurarSelecaoModo(): void {
    const container = this.root.querySelector("#modo");

    container?.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const modo = target.dataset.modo;

      if (modo !== "automatico" && modo !== "manual") {
        return;
      }

      this.modo = modo;

      if (modo === "automatico") {
        this.periodoSelecionado = null;
        this.dataSelecionada = null;
      }

      this.render();
    });
  }

  private configurarSelecaoFaixaEtaria(): void {
    const container = this.root.querySelector("#faixa-etaria");

    container?.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const faixa = target.dataset.faixa;

      if (!faixa) {
        return;
      }

      this.faixaEtariaSelecionada = faixa as FaixaEtaria;

      container
        .querySelectorAll("button")
        .forEach((button) => button.classList.remove("selected"));

      target.classList.add("selected");
    });
  }

  private configurarSelecaoPublico(): void {
    const container = this.root.querySelector("#publico");

    container?.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const publico = target.dataset.publico;

      if (!publico) {
        return;
      }

      this.publicoSelecionado = publico as Publico;

      container
        .querySelectorAll("button")
        .forEach((button) => button.classList.remove("selected"));

      target.classList.add("selected");
    });
  }

  private configurarSelecaoPeriodo(): void {
    const container = this.root.querySelector("#periodo");

    container?.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const periodo = target.dataset.periodo;

      if (!periodo) {
        return;
      }

      this.periodoSelecionado = periodo as Periodo;

      container
        .querySelectorAll("button")
        .forEach((button) => button.classList.remove("selected"));

      target.classList.add("selected");
    });
  }

  private configurarCalendario(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#abrir-calendario",
      );

    button?.addEventListener("click", () => {
      if (this.modo !== "manual") {
        return;
      }

      this.calendario.open();
    });
  }

  private configurarRegistro(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#registrar",
      );

    button?.addEventListener("click", async () => {
      if (
        !this.faixaEtariaSelecionada ||
        !this.publicoSelecionado
      ) {
        this.mostrarToast(
          "Selecione a faixa etária e o público.",
          "erro",
        );
        return;
      }

      if (this.modo === "automatico") {
        await this.service.registrarAutomatico({
          faixaEtaria: this.faixaEtariaSelecionada,
          publico: this.publicoSelecionado,
        });

        this.limparFormulario();
        this.render();
        this.mostrarToast("Dados salvos com sucesso!");

        return;
      }

      if (!this.dataSelecionada || !this.periodoSelecionado) {
        this.mostrarToast("Selecione a data e o período.",
          "erro",
        );
        return;
      }

      await this.service.registrarManual({
        data: this.formatarDataManual(),
        periodo: this.periodoSelecionado,
        faixaEtaria: this.faixaEtariaSelecionada,
        publico: this.publicoSelecionado,
      });

      this.limparFormulario();
      this.render();
      this.mostrarToast("Dados salvos com sucesso!");
    });
  }

  private configurarRelatorio(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#gerar-relatorio",
      );

    button?.addEventListener("click", async () => {
      const registros = await this.service.listarRegistros();

      if (registros.length === 0) {
        this.mostrarToast(
          "Não há dados salvos para gerar o relatório.",
          "erro",
        );
        return;
      }

      this.relatorioService.gerar(registros);

      this.mostrarToast("Relatório gerado com sucesso!");
    });
  }

  private configurarVisualizacaoDados(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#visualizar-dados",
      );

    button?.addEventListener("click", async () => {
      await this.exibirDados();
    });
  }

  private configurarFechamentoDados(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#fechar-dados",
      );

    button?.addEventListener("click", () => {
      this.fecharDados();
    });

    const modal = this.root.querySelector("#dados-modal");

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.fecharDados();
      }
    });
  }

  private configurarExclusaoUltimo(): void {
    const button =
      this.root.querySelector<HTMLButtonElement>(
        "#apagar-ultimo",
      );

    button?.addEventListener("click", async () => {
      const registro =
        await this.service.excluirUltimoRegistro();

      if (!registro) {
        this.mostrarToast("Não há dados salvos para excluir.",
        "erro",
        );
        return;
      }

      this.mostrarToast("Último registro excluído com sucesso!");
    });
  }

  private async exibirDados(): Promise<void> {
    const registros = await this.service.listarRegistros();

    this.preencherTabela(registros);
    this.abrirDados();
  }

  private preencherTabela(registros: Registro[]): void {
    const tabela = this.root.querySelector("#dados-tabela");

    if (!tabela) {
      return;
    }

    if (registros.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="5">
            Nenhum dado salvo.
          </td>
        </tr>
      `;

      return;
    }

    tabela.innerHTML = registros
      .map(
        (registro) => `
          <tr>
            <td>${registro.data}</td>
            <td>${registro.hora}</td>
            <td>${registro.periodo}</td>
            <td>${registro.faixaEtaria}</td>
            <td>${registro.publico}</td>
          </tr>
        `,
      )
      .join("");
  }

  private abrirDados(): void {
    const modal = this.root.querySelector("#dados-modal");

    if (!modal) {
      return;
    }

    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
  }

  private fecharDados(): void {
    const modal = this.root.querySelector("#dados-modal");

    if (!modal) {
      return;
    }

    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
  }

  private mostrarToast(
    mensagem: string,
    tipo: TipoToast = "sucesso",
  ): void {
    const toast = this.root.querySelector("#toast");

    if (!toast) {
      return;
    }

    toast.textContent = mensagem;
    toast.classList.remove("erro");

    if (tipo === "erro") {
      toast.classList.add("erro");
    }

    toast.classList.add("visible");

    window.setTimeout(() => {
      toast.classList.remove("visible");
    }, 2500);
  }

  private formatarDataManual(): string {
    if (!this.dataSelecionada) {
      throw new Error("Data não selecionada.");
    }

    const [ano, mes, dia] = this.dataSelecionada.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  private limparFormulario(): void {
    this.faixaEtariaSelecionada = null;
    this.publicoSelecionado = null;
    this.periodoSelecionado = null;
    this.dataSelecionada = null;
  }
}