import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ostale metode, npr. /api/v1/user/1 <--- user po ID-ju 1
    this.router.get("/users", authenticate, authorize("admin", "user"), this.korisnici.bind(this));
    this.router.put("/users/update", authenticate, authorize("user", "admin"), this.izmijeniProfil.bind(this));
  }

  /**
   * GET /api/v1/users
   * Svi korisnici
   */
  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();
         console.log("Korisnici iz baze:", korisniciPodaci);

      res.status(200).json(korisniciPodaci);
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
private async izmijeniProfil(req: Request, res: Response): Promise<void> {
  try {
    const updatedUser = await this.userService.azurirajKorisnika(req.body);

    if (!updatedUser) {
      res.status(400).json({ success: false, message: "Ажурирање није успјело." });
      return;
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Грешка на серверу." });
  }
}

  
}
