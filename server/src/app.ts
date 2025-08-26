import express from 'express';
import cors from 'cors';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { AuthController } from './WebAPI/controllers/AuthController';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { UserController } from './WebAPI/controllers/UserController';
import { IMessageRepo } from './Domain/repositories/messages/IMessageRepo';
import { MessageRepository } from './Database/repositories/messages/MessageRepository';
import { IMessageService } from './Domain/services/messages/IMessageService';
import { MessageService } from './Services/messages/MessageService';
import { MessageController } from './WebAPI/controllers/MessageController';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const messageRepository: IMessageRepo = new MessageRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const messageService: IMessageService = new MessageService(messageRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const messageController = new MessageController(messageService);


// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', messageController.getRouter());

export default app;