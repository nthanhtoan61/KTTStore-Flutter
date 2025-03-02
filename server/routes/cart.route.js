const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Tất cả routes đều yêu cầu đăng nhập
router.use(authenticateToken);

// Routes cho giỏ hàng (trừ clear cart ra khôi dùng hết)
router.get('/', CartController.getCart); // Lấy giỏ hàng của user
router.post('/add', CartController.addToCart); // Thêm sản phẩm vào giỏ
router.put('/:id', CartController.updateCartItem); // Cập nhật số lượng sản phẩm
router.delete('/:id', CartController.removeFromCart); // Xóa sản phẩm khỏi giỏ
router.delete('/', CartController.clearCart); // Xóa toàn bộ giỏ hàng

module.exports = router;
