import { register, login, refresh  } from '../controllers/auth_controller';

const express = require('express')
const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/refresh', refresh)

module.exports = router