const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// Route to get all items
router.get('/', itemsController.getAllItems);

// Route to get a single item by ID
router.get('/:id', itemsController.getItemById);

// Route to create a new item
router.post('/', itemsController.createItem);

// Route to update an existing item
router.put('/:id', itemsController.updateItem);

// Route to delete an item
router.delete('/:id', itemsController.deleteItem);

module.exports = router;