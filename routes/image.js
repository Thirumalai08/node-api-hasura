const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
// cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: "nambi5062",
    api_key: "995869899353763",
    api_secret: "s3TjMBWbp4DqNZ_MVwgpI37cEt8",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "upload img",
        format: async () => {
            "jpg", "png";
        },
        public_id: (req, file) => file.filename,
    },
});
const parser = multer({ storage: storage });
// storage
// const storage = multer.diskStorage({
// destination: (req, file, cb) => {
//     cb(null, "uploads");
// },
// filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
// },
// });
// const upload = multer({ storage: storage });
// image model
const Image = require("../models/Image");
// get api/image api url
// get image url
// public access
router.get("/image", async (req, res) => {
    try {
        const allImages = await Image.find().sort({ date: -1 });
        res.json(allImages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
// post api/image api url
// create a image url
// public access
router.post("/image", parser.single("image"), async (req, res) => {
    console.log(req.file.path);
    try {
        let imageUpload = new Image({
            imageUrl: req.file.path,
        });
        await imageUpload.save();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
    // const { data } = req.file.path
    // const data = {
    //     image: req.file.path,
    // };
    // console.log(req.file.path);
    // try {
    //     const uploader = cloudinary.uploader.upload(req.file.path);
    //     uploader.then((res) => {
    //         let image = new Image({
    //             img: res.url,
    //         });
    //         image.save();
    //         res.status(200).json({ res });
    //     });
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).send("Server Error");
    // }
    // try {
    // const data = {
    //     image: req.file.path,
    // };
    // cloudinary.uploader
    //     .upload(data.image)
    //     .then((result) => {
    //         const image = new Image({
    //             img: result.url,
    //         });
    //         image.save();
    //         res.status(200).send({
    //             message: "success",
    //             result,
    //         });
    //     })
    //     .catch((error) => {
    //         res.status(500).send({
    //             message: "failure",
    //             error,
    //         });
    //     });
    // } catch(err) {
    //     console.error(err.message)
    //     res.status(500).send("Server Error")
    // }
});
module.exports = router;
