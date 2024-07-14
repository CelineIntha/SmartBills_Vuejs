import express from 'express';
import ctrl from '../controllers/client.mjs';
const router = express.Router();
// ici le / correspond à la route GET /clients/ (voir le index.mjs qui déclare l'import de ces routes avec app.use('/clients, billRoutes)
router.get('/', ctrl.getItems)

// ici la route GET /clients/:id
router.get('/:id', ctrl.getItem)

// ici la route PATCH /clients/:id
router.patch('/:id', ctrl.patchItem)

// ici la route POST /clients/
router.post('/', ctrl.postItem)

// ici la route PATCH /clients/:id
router.delete('/:id', ctrl.deleteItem)

export { router };

