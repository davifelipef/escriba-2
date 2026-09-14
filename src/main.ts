import "./style.css";

import { RegistroRepository } from "./database/registro-repository";
import { RegistroService } from "./services/registro-service";
import { App } from "./ui/app";

const repository = new RegistroRepository();
const service = new RegistroService(repository);

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Elemento #app não encontrado.");
}

const app = new App(service, root);

app.render();