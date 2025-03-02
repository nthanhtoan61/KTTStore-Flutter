const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'djh8j3ofk',
  api_key: '747932665488779',
  api_secret: '7elw2YlkaF6T0VemR-DBfQdhkfA'
});

// Hàm tải lên file lên Cloudinary
async function uploadFile(file) {
  try {
    const fileName = path.parse(file).name; // Lấy tên file mà không có phần mở rộng
    const options = {
      public_id: fileName
    };

    const uploadResult = await cloudinary.uploader.upload(file, options);
    console.log(`Đã tải lên thành công: ${uploadResult.public_id}`);
    return uploadResult.public_id;
  } catch (error) {
    console.error('Lỗi khi tải lên:', error);
    throw error;
  }
}

// Thư mục chứa các tập tin cần tải lên
const directoryPath = './public/uploads/uploadPendingImages';

// Đọc danh sách tập tin trong thư mục
fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Lỗi khi đọc thư mục:', err);
    return;
  }

  // Duyệt qua từng tập tin và tải lên Cloudinary
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const publicId = await uploadFile(filePath);
    console.log(`Đã tải lên ${file}: ${publicId}`);
  }
});