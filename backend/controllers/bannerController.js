// controllers/bannerController.js
import Banner from "../models/bannerModel.js";
import cloudinary from "cloudinary";

const getBanner = async (req, res) => {
  try {
    const banners = await Banner.find({ visible: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, banners });
  } catch (err) {
    console.error("getBanners:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { headline, subtext, buttonText, buttonUrl } = req.body;

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    const banner = await Banner.create({
      imageUrl,
      publicId,
      headline,
      subtext,
      buttonText,
      buttonUrl,
      visible: true
    });

    res.json({ success: true, banner });
  } catch (err) {
    console.error("createBanner:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false });

    if (banner.publicId) {
      await cloudinary.v2.uploader.destroy(banner.publicId);
    }

    await banner.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export { getBanner, createBanner, deleteBanner };

/*
Helper to upload buffer via stream (Cloudinary doesn't accept buffer directly).
We create a Promise wrapper for upload_stream.
*/
function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: "banners" }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}
