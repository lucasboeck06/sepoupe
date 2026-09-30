import { capitalRepository } from "../database/capitalRepository.js";

export async function capital() {
  return capitalRepository.dados();
}
