const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Order
const orderSchema = new Schema({
    orderID: {
        type: Number,
        required: true,
        unique: true
    },
    userID: {
        type: Number,
        required: true,
        ref: 'User' // Reference đến model User
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'] // Kiểm tra số điện thoại 10 số
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    userCouponsID: {
        type: Number,
        ref: 'UserCoupon' // Reference đến model UserCoupon
    },
    paymentPrice: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return value <= this.totalPrice;
            },
            message: 'Giá thanh toán không thể lớn hơn tổng giá trị đơn hàng'
        }
    },
    orderStatus: {
        type: String,
        required: true,
        enum: [
            'pending',      // Chờ xác nhận
            'confirmed',    // Đã xác nhận
            'processing',   // Đang xử lý
            'completed',    // Hoàn thành
            'cancelled'     // Đã hủy
        ],
        default: 'pending'
    },
    shippingStatus: {
        type: String,
        required: true,
        enum: [
            'preparing',    // Đang chuẩn bị
            'shipping',     // Đang giao hàng
            'delivered',    // Đã giao hàng
            'returned'      // Đã hoàn trả
        ],
        default: 'preparing'
    },
    isPayed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Thêm index cho các trường thường được tìm kiếm
orderSchema.index({ userID: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ shippingStatus: 1 });
orderSchema.index({ createdAt: -1 }); // Index giảm dần theo thời gian tạo
orderSchema.index({ isPayed: 1 });

// Virtual field để lấy chi tiết đơn hàng
// Xem thêm tại: https://mongoosejs.com/docs/populate.html#populate_virtually
orderSchema.virtual('orderDetails', {
    ref: 'OrderDetail',    // Model tham chiếu
    localField: 'orderID', // Thuộc tính của model hiện tại
    foreignField: 'orderID', // Thuộc tính của model tham chiếu
    justOne: false        // Lấy tất cả kết quả
});

// Virtual field để lấy thông tin mã giảm giá
orderSchema.virtual('couponInfo', {
    ref: 'UserCoupon',        // Model tham chiếu
    localField: 'userCouponsID', // Thuộc tính của model hiện tại
    foreignField: 'userCouponsID', // Thuộc tính của model tham chiếu
    justOne: true            // Chỉ lấy 1 kết quả
});

// Lưu trạng thái ban đầu trước khi thay đổi
orderSchema.pre('save', function(next) {
    if (this.isModified('orderStatus')) {
        this._originalStatus = this.orderStatus;
    }
    next();
});

// Middleware để cập nhật trạng thái đơn hàng
orderSchema.pre('save', function(next) {
    // Nếu đơn hàng đã hoàn thành hoặc đã hủy, không cho phép thay đổi
    if (this.isModified('orderStatus') && 
        ['completed', 'cancelled'].includes(this._originalStatus) && 
        this.orderStatus !== this._originalStatus) {
        const err = new Error('Không thể thay đổi trạng thái của đơn hàng đã hoàn thành hoặc đã hủy');
        return next(err);
    }

    // Nếu đơn hàng đã giao hàng, tự động cập nhật trạng thái hoàn thành
    if (this.shippingStatus === 'delivered' && this.isPayed) {
        this.orderStatus = 'completed';
    }

    next();
});

// Tạo model từ schema
const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
