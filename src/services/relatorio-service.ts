import * as XLSX from "xlsx";
import type { Registro } from "../models/registro";

class RelatorioService {
  gerar(registros: Registro[]): void {
    const dados = registros.map((registro) => ({
      Data: registro.data,
      Hora: registro.hora,
      Período: registro.periodo,
      "Faixa etária": registro.faixaEtaria,
      Público: registro.publico,
    }));

    const planilha = XLSX.utils.json_to_sheet(dados);
    const arquivo = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      arquivo,
      planilha,
      "Registros",
    );

    XLSX.writeFile(
      arquivo,
      this.obterNomeArquivo(),
    );
  }

  private obterNomeArquivo(): string {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();

    return `escriba-relatorio-${dia}-${mes}-${ano}.xlsx`;
  }
}

export { RelatorioService };