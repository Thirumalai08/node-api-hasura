const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
});

module.exports = Image = new mongoose.model("image", imageSchema);
