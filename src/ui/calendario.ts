type SelecaoDataCallback = (data: string) => void;

export class Calendario {
  private aoSelecionar: SelecaoDataCallback;
  private entrada: HTMLInputElement;

  constructor(aoSelecionar: SelecaoDataCallback) {
    this.aoSelecionar = aoSelecionar;

    this.entrada = document.createElement("input");
    this.entrada.type = "date";

    this.entrada.style.position = "fixed";
    this.entrada.style.left = "50%";
    this.entrada.style.top = "50%";
    this.entrada.style.transform = "translate(-50%, -50%)";
    this.entrada.style.opacity = "0";
    this.entrada.style.pointerEvents = "none";

    document.body.appendChild(this.entrada);

    this.entrada.addEventListener("change", () => {
      if (!this.entrada.value) {
        return;
      }

      this.aoSelecionar(this.entrada.value);
    });
  }

  open(): void {
    this.entrada.showPicker();
  }
}