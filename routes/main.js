var express = require('express');
var router = express.Router();
const controllerIndex = require('../controllers/mainControllers');


router.get('/', controllerIndex.index)

module.exports = router