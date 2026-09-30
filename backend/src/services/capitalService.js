import { capitalRepository } from "../database/capitalRepository";

export async function dados() {
  return capitalRepository.dados();
}
