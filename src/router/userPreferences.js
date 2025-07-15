const express = require('express');
const router = express.Router();
const controller = require('../controller/userPreferencesController');

router.get('/', controller.getAll);
router.get('/:userId', controller.getByUserId);
router.post('/', controller.create);
router.put('/:userId', controller.updateByUserId);
router.delete('/:userId', controller.deleteByUserId);

module.exports = router;
