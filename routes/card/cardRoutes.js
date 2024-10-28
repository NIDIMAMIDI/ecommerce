import { Router } from 'express';
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';
import { createCard, listCards } from '../../controllers/card/cardControllers.js';

// Create a new router instance
const cardRouter = Router();

// Define a POST route for creating a card, with authorization middleware
cardRouter.post('/create', auth, createCard);

// Define a GET route for listing cards, with authorization middleware
cardRouter.get('/list', auth, listCards);

export default cardRouter; // Export the router instance as the default export
