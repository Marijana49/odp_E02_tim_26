import { MessageDto } from "../../DTOs/messages/MessageDto";

export interface IMessageService {
  getSvePoruke(): Promise<MessageDto[]>;
  azurirajPoruke(dto: MessageDto): Promise<MessageDto | null>;
  getByKorIme(korIme: string): Promise<MessageDto | null>;
}