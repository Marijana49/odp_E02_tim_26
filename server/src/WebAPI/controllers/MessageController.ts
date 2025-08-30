import { Request, Response, Router } from "express";
import { IMessageService } from "../../Domain/services/messages/IMessageService";
import { MessageDto } from "../../Domain/DTOs/messages/MessageDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class MessageController {
  private router: Router;
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.router = Router();
    this.messageService = messageService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/message/:korIme", this.porukaByKorIme.bind(this));
    this.router.get("/messages",  this.poruke.bind(this));
    this.router.put("/messages/update", this.azurirajPoruku.bind(this));
    this.router.post('/messages', this.posaljiPoruku.bind(this));
  }

  private async porukaByKorIme(req: Request, res: Response): Promise<void> {
  try {
    const posiljalac = req.params.posiljalac;

    if (!posiljalac || posiljalac.trim() === '') {
      res.status(400).json({ success: false, message: "Korisničko ime nije prosleđeno." });
      return;
    }

    const poruka: MessageDto | null = await this.messageService.getByKorIme(posiljalac);

    if (!poruka) {
      res.status(404).json({ success: false, message: "Message not found." });
      return;
    }

    res.status(200).json(poruka);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching message." });
  }
}

  /**
   * GET /api/v1/messages
   * Svi korisnici
   */
  private async poruke(req: Request, res: Response): Promise<void> {
    try {
      const porukePodaci: MessageDto[] =
        await this.messageService.getSvePoruke();
        
        console.log("Poruke iz baze:", porukePodaci[0]);

      res.status(200).json(porukePodaci);
      return;
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  /**
   * Getter za router
   */
  public getRouter(): Router {
    return this.router;
  }

// PUT /api/v1/messages/update
private async azurirajPoruku(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body)
    const updateMessage = await this.messageService.azurirajPoruke(req.body);

    if (!updateMessage) {
      res.status(400).json({ success: false, message: "Ажурирање није успјело." });
      return;
    }

    res.status(200).json({ success: true, data: updateMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Грешка на серверу." });
  }
}

/**
   * POST /api/v1/auth/register
   * Registracija novog korisnika
   */
  private async posaljiPoruku(req: Request, res: Response): Promise<void> {
    try {
    const { posiljalac, primalac, tekst, stanje } = req.body;

    if (!posiljalac || !primalac || !stanje) {
      res.status(400).json({ success: false, message: "Недостају подаци за поруку." });
      return;
    }

    const novaPoruka = await this.messageService.posaljiPoruku({
      posiljalac,
      primalac,
      tekst: tekst,
      stanje
    });
    console.log(novaPoruka);

    res.status(201).json(novaPoruka);
  } catch (error) {
    console.error("Грешка при слању поруке:", error);
    res.status(500).json({ success: false, message: "Грешка на серверу." });
  }
}
}
