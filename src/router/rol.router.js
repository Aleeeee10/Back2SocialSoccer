const express = require('express');
const router = express.Router();

const { mandar } = require('../controller/rol.controller');

router.post('/add/:id', mandar)

module.exports = router;