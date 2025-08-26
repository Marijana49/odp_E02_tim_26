import { MessageDto } from "../../Domain/DTOs/messages/MessageDto";
import { Poruka } from "../../Domain/models/Poruka";
import { IMessageRepo } from "../../Domain/repositories/messages/IMessageRepo";
import { IMessageService } from "../../Domain/services/messages/IMessageService";

export class MessageService implements IMessageService {
  public constructor(private messRepo: IMessageRepo) {}

 async getByKorIme(korIme: string): Promise<MessageDto | null> {
    return await this.messRepo.getByUsername(korIme);
  }

  async getSvePoruke(): Promise<MessageDto[]> {
    const poruke: Poruka[] = await this.messRepo.getAll();
    const porukeDTO: MessageDto[] = poruke.map(
      (poruka) => new MessageDto(poruka.korIme, poruka.ulogovani, poruka.primljenaPoruka, poruka.poslataPoruka, poruka.stanje)
    );

    return porukeDTO;
  }

  async azurirajPoruke(dto: MessageDto): Promise<MessageDto | null> {
    const postojeci = await this.messRepo.getByUsername(dto.korIme);
    if (!postojeci.korIme) return null;

    postojeci.korIme = dto.korIme ?? postojeci.korIme;
    postojeci.ulogovani = dto.ulogovani ?? postojeci.ulogovani;
    postojeci.primljenaPoruka = dto.primljenaPoruka ?? postojeci.primljenaPoruka;
    postojeci.poslataPoruka = dto.poslataPoruka ?? postojeci.poslataPoruka;
    postojeci.stanje = dto.stanje ?? postojeci.stanje;

    const azuriran = await this.messRepo.update(postojeci);

    if (!azuriran.korIme) return null;

    return {
      korIme: azuriran.korIme,
      ulogovani: azuriran.ulogovani,
      primljenaPoruka: azuriran.primljenaPoruka,
      poslataPoruka: azuriran.poslataPoruka,
      stanje: azuriran.stanje,
    };
  }

  async posaljiPoruku(dto: MessageDto): Promise<MessageDto> {
    const novaPoruka = new Poruka(
      dto.korIme,
      dto.ulogovani,
      dto.primljenaPoruka ?? '',
      dto.poslataPoruka ?? '',
      dto.stanje
    );

    const kreirana = await this.messRepo.create(novaPoruka);

    return new MessageDto(
      kreirana.korIme,
      kreirana.ulogovani,
      kreirana.primljenaPoruka,
      kreirana.poslataPoruka,
      kreirana.stanje
    );
  }

}
