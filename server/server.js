const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const fs = require('fs');

// Cấu hình môi trườngg
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Phục vụ static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Kết nối đến MongoDB
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("✅Kết nối đến MongoDB thành công"))
  .catch((err) => console.error("❌Kết nối đến MongoDB thất bại:", err));

// Import routes
const authRoutes = require('./routes/auth.route');
const addressRoutes = require('./routes/address.route');
const cartRoutes = require('./routes/cart.route');
const categoryRoutes = require('./routes/category.route');
const couponRoutes = require('./routes/coupon.route');
const favoriteRoutes = require('./routes/favorite.route');
const notificationRoutes = require('./routes/notification.route');
const orderDetailRoutes = require('./routes/order-detail.route');
const orderRoutes = require('./routes/order.route');
const productRoutes = require('./routes/product.route');
const targetRoutes = require('./routes/target.route');
const userCouponRoutes = require('./routes/user-coupon.route');
const userNotificationRoutes = require('./routes/user-notification.route');
const reviewRoutes = require('./routes/review.route');
const userRoutes = require('./routes/user.route');
const promotionRoutes = require('./routes/promotion.route');
const productSizeStockRoutes = require('./routes/product-size-stock.route');
const productColorRoutes = require('./routes/product-color.route');
// const paymentRoutes = require('./routes/payment.route');
// const statisticRoutes = require('./routes/statistic.route');

// Import authentication middleware
const { authenticateAdmin, authenticateCustomer } = require("./middlewares/auth.middleware");

// Public routes (không cần xác thực)
app.use('/api/auth', authRoutes);// Đăng ký và đăng nhập
app.use('/api/products', productRoutes);// Xem sản phẩm
app.use('/api/categories', categoryRoutes);// Xem danh mục
app.use('/api/promotions', promotionRoutes);// Quản lý khuyến mãi
app.use('/api/reviews', reviewRoutes);// Đánh giá sản phẩm
app.use('/api/product-size-stock', productSizeStockRoutes);// Quản lý size và số lượng tồn
app.use('/api/targets', targetRoutes);// Quản lý target

// Customer routes (cần xác thực customer)
app.use('/api/address', authenticateCustomer, addressRoutes);// Quản lý địa chỉ
app.use('/api/cart', authenticateCustomer, cartRoutes);// Quản lý giỏ hàng
app.use('/api/favorite', authenticateCustomer, favoriteRoutes);// Quản lý yêu thích
app.use('/api/coupon', authenticateCustomer, couponRoutes);// Quản lý mã giảm giá
app.use('/api/notification', authenticateCustomer, notificationRoutes);// Quản lý thông báo
app.use('/api/order-detail', authenticateCustomer, orderDetailRoutes);// Quản lý chi tiết đơn hàng
app.use('/api/user', authenticateCustomer, userRoutes);// Quản lý thông tin cá nhân
app.use('/api/order', authenticateCustomer, orderRoutes);// Quản lý đơn hàng
app.use('/api/target', targetRoutes);// Quản lý target
app.use('/api/user-coupon', authenticateCustomer, userCouponRoutes);// Quản lý mã giảm giá
app.use('/api/user-notification', authenticateCustomer, userNotificationRoutes);// Quản lý thông báo
app.use('/api/product-size-stock', authenticateCustomer, productSizeStockRoutes);// Quản lý size và số lượng tồn
// app.use('/api/payment', authenticateCustomer, paymentRoutes);// Thanh toán

//!=================== Admin routes (cần xác thực admin) ==================
app.use('/api/admin', authenticateAdmin, (req, res, next) => {
  console.log("Đã xác thực admin");
  next();
});
//! VÍ DỤ 1 API CỦA ADMIN : /api/admin/products/admin/products - đây là API admin đang sử dụng
//?Trang Dashboard
//* GET /api/products/all-by-categories - Lấy thống kê sản phẩm theo danh mục
// * GET /api/admin/users - Lấy thống kê về người dùng
// * GET /api/admin/orders/admin/orders - Lấy thống kê về đơn hàng và doanh thu
// * GET /api/admin/coupons/admin/coupons - Lấy thống kê về mã giảm giá
// * GET /api/admin/promotions/all - Lấy thống kê về chương trình khuyến mãi
// * GET /api/admin/notifications/admin/notifications - Lấy thống kê về thông báo
// * GET /api/reviews/admin/all - Lấy thống kê về đánh giá sản phẩm

//?Trang Customer Management
app.use('/api/admin/users', authenticateAdmin, userRoutes);// Quản lý người dùng

//?Trang Product Management
app.use('/api/admin/products', authenticateAdmin, productRoutes);// Quản lý sản phẩm
app.use('/api/admin/product-size-stock', authenticateAdmin, productSizeStockRoutes);// Quản lý size và số lượng tồn
app.use('/api/admin/product-colors', authenticateAdmin, productColorRoutes);// Quản lý màu sắc
//!ADMIN CALL THÊM /api/categories
//!ADMIN CALL THÊM /api/targets

//?Trang Order Management
app.use('/api/admin/orders', authenticateAdmin, orderRoutes);// Quản lý đơn hàng
app.use('/api/admin/order-details', authenticateAdmin, orderDetailRoutes);// Quản lý chi tiết đơn hàng


//?Trang Promotion Management
app.use('/api/admin/promotions', authenticateAdmin, promotionRoutes);// Quản lý khuyến mãi
//!ADMIN CALL THÊM /api/categories
//!ADMIN CALL THÊM /api/products

//?Trang Coupon Management
app.use('/api/admin/coupons', authenticateAdmin, couponRoutes);// Quản lý mã giảm giá
//!ADMIN CALL THÊM /api/categories


//?Trang Notification Management
app.use('/api/admin/notifications', authenticateAdmin, notificationRoutes);// Quản lý thông báo
//!ADMIN CALL THÊM /api/admmin/users/admin/users





app.use('/api/admin/categories', authenticateAdmin, categoryRoutes);// Quản lý danh mục
// app.use('/api/admin/statistics', authenticateAdmin, statisticRoutes);// Thống kê
// app.use('/api/subscriptions', subscriptionRoutes);
// app.use('/api/support', emailRoutes);// Gửi email

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
