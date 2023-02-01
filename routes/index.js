const express = require('express')
const router = express.Router();



/*Data base Schema*/

const home_controller = require('../controller/home_controller')


router.get('/',  home_controller.home)
router.use('/users', require('./user-route'))
router.use('/post', require('./post'))
router.use('/comment', require('./comment'))
router.use('/like', require('./like'));

router.use('/api', require('./api'))

module.exports = router;
