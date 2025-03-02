const express = require('express');
const router = express.Router();
const ProductColorController = require('../controllers/ProductColorController');
const { authenticateToken, isAdmin } = require('../middlewares/auth.middleware');

// Routes cho người dùng
router.get('/product/:productID', ProductColorController.getProductColors); // Lấy tất cả màu của sản phẩm
router.get('/:id', ProductColorController.getColorById); // Lấy chi tiết màu

//!ADMIN
router.put('/admin/product-colors/add/:id/images', authenticateToken, isAdmin, ProductColorController.uploadImages); // Upload hình ảnh
router.post('/admin/product-colors/add/:productID', authenticateToken, isAdmin, ProductColorController.addColor); // Thêm màu mới
router.delete('/admin/product-colors/delete/:id/images', authenticateToken, isAdmin, ProductColorController.deleteImage); // Xóa hình ảnh
router.delete('/admin/product-colors/delete/:id', authenticateToken, isAdmin, ProductColorController.deleteColor); // Xóa màu

module.exports = router;
