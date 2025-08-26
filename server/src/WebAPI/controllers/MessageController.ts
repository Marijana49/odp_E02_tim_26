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
    // ostale metode, npr. /api/v1/user/1 <--- user po ID-ju 1
    this.router.get("/message/:korIme", this.porukaByKorIme.bind(this));
    this.router.get("/messages",  this.poruke.bind(this));
    this.router.put("/messages/update", this.azurirajPoruku.bind(this));
  }

  private async porukaByKorIme(req: Request, res: Response): Promise<void> {
  try {
    const korIme = req.params.korIme;

    if (!korIme || korIme.trim() === '') {
      res.status(400).json({ success: false, message: "Korisničko ime nije prosleđeno." });
      return;
    }

    const poruka: MessageDto | null = await this.messageService.getByKorIme(korIme);

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
   * GET /api/v1/users
   * Svi korisnici
   */
  private async poruke(req: Request, res: Response): Promise<void> {
    try {
      const porukePodaci: MessageDto[] =
        await this.messageService.getSvePoruke();
         console.log("Poruke iz baze:", porukePodaci);

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

// PUT /api/v1/users/update
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

}
