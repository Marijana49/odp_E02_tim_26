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
    this.router.get("/users/:id", authenticate, authorize("admin", "user"), this.korisnikById.bind(this));
    this.router.get("/users", authenticate, authorize("admin", "user"), this.korisnici.bind(this));
    this.router.put("/users/update", authenticate, authorize("user", "admin"), this.izmijeniProfil.bind(this));
  }

  private async korisnikById(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid ID format." });
      return;
    }

    const korisnik: UserDto | null = await this.userService.getKorisnikById(userId);

    if (!korisnik) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json(korisnik);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user." });
  }
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
    console.log(req.body)
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
