import { MessageDto } from "../../Domain/DTOs/messages/MessageDto";
import { Poruka } from "../../Domain/models/Poruka";
import { IMessageRepo } from "../../Domain/repositories/messages/IMessageRepo";
import { IMessageService } from "../../Domain/services/messages/IMessageService";

export class MessageService implements IMessageService {
  public constructor(private messRepo: IMessageRepo) {}

 async getByKorIme(posiljalac: string): Promise<MessageDto | null> {
    return await this.messRepo.getByUsername(posiljalac);
  }

  async getSvePoruke(): Promise<MessageDto[]> {
    const poruke: Poruka[] = await this.messRepo.getAll();
    const porukeDTO: MessageDto[] = poruke.map(
      (poruka) => new MessageDto(poruka.id, poruka.posiljalac, poruka.primalac, poruka.tekst, poruka.stanje)
    );

    return porukeDTO;
  }

  async azurirajPoruke(dto: MessageDto): Promise<MessageDto | null> {
    const postojeci = await this.messRepo.getById(dto.id);
    if (!postojeci.posiljalac) return null;
    
    postojeci.stanje = dto.stanje ?? postojeci.stanje;

    const azuriran = await this.messRepo.update(postojeci);

    if (!azuriran.posiljalac) return null;

    return {
      id: azuriran.id,
      posiljalac: azuriran.posiljalac,
      primalac: azuriran.primalac,
      tekst: azuriran.tekst,
      stanje: azuriran.stanje,
    };
  }

  async posaljiPoruku(dto: MessageDto): Promise<MessageDto> {
    const novaPoruka = new Poruka(
      dto.id,
      dto.posiljalac,
      dto.primalac,
      dto.tekst ?? '',
      dto.stanje
    );

    const kreirana = await this.messRepo.create(novaPoruka);

    return new MessageDto(
      kreirana.id,
      kreirana.posiljalac,
      kreirana.primalac,
      kreirana.tekst,
      kreirana.stanje
    );
  }

}
