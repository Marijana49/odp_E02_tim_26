import type { Poruka } from "../../../../server/src/Domain/models/Poruka";
import type { MessageDto } from "../../models/messages/MessageDTO";

export interface IMessageAPIService {
    getSvePoruke(token: string): Promise<MessageDto[]>;
    updatePoruke(token: string, podaci: MessageDto) : Promise<boolean>;
    posaljiPoruku(poruka: Poruka, token: string): Promise<Poruka>
}