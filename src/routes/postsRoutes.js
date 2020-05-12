const express = require('express');
const router = express.Router();
const Post = require('../app/models/post');

router.get('/', async(req, res) => {

    const { limit } = req.query;
    const { offset } = req.query;

    try {

        const posts = await Post.find();
        res.json(posts);

    } catch (error) {
        res.json({ error })
    }
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;

    try {

        const post = await Post.findById(id);
        res.json(post);

    } catch (error) {

        res.status(404);
        res.json({ error });

    }
});

router.post('/', async(req, res) => {

    //Adicionar validação antes de criar o post

    const post = new Post({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    });

    try {

        const savedPost = await post.save();
        res.status(201);
        res.json(savedPost);

    } catch (error) {

        res.status(400);
        res.json({ error });

    }

});

router.delete('/:id', async(req, res) => {

    const { id } = req.params;

    try {

        const removedPost = await Post.remove({ _id: id });
        res.json(removedPost);

    } catch (error) {

        res.status(404);
        res.json({ error });

    }

});

module.exports = router;