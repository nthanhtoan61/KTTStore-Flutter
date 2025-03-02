const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')

// khôi dùng hết
router.post('/register', authController.register)// Route đăng ký
router.post('/login', authController.login)// Route đăng nhập
router.post('/forgot-password', authController.forgotPassword)// Route quên mật khẩu
router.post('/reset-password', authController.resetPassword)// Route reset mật khẩu
router.post('/verify-token', authController.verifyToken)// Route xác thực token

module.exports = router
