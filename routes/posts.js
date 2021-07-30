const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
// const { check, validationResult } = require("express-validator");

// get api/posts
// getting posts
// public or private access
router.get("/posts", async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ date: -1 });
        res.json(allPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// get api/posts/:id
// get post by ID
// public access or private access
router.get("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ msg: "Post not found" });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).send({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
});

// post api/posts
// create a new posts
// public or private access
router.post("/posts", async (req, res) => {
    console.log(req.body);
    // destructing request body
    const { title, desc } = req.body;
    try {
        let post = new Post({
            title,
            desc,
        });
        if (!post) {
            return res.status(400).json({ msg: "Error creating in Post" });
        } else {
            await post.save();
            return res.status(200).json({ post });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// update api/posts/:id
// update post by ID
// public or private access
router.put("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                desc: req.body.desc,
            },
            { new: true }
        );
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).send({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
});

// delete api/posts/:id
// delete post by ID
// public access or private access
router.delete("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ msg: "Post not found" });
        }
        await post.remove();
        res.json({ msg: "Delete Success" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            res.status(404).send({ msg: "Post not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
