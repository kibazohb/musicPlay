import { register  } from '../controllers/auth_controller';

const express = require('express')
const router = express.Router()

router.post('/register', register)

module.exports = router