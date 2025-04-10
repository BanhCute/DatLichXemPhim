const uploadController = {
  Upload: async function (req) {
    try {
      if (!req.file) {
        throw new Error("Không có file được upload");
      }

      // Trả về thông tin file đã upload
      return {
        path: `/images/movies/${req.file.filename}`,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = uploadController;
