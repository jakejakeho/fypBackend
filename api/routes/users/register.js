const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const multer = require('multer');
var fs = require('fs');
const mongoose = require('mongoose');
const User = require('../../models/user')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir1 = './file';
        if (!fs.existsSync(dir1)) {
            fs.mkdirSync(dir1);
        }
        const dir2 = './file/usericon';
        if (!fs.existsSync(dir2)) {
            fs.mkdirSync(dir2);
        }
        cb(null, 'file/usericon/');
    },
    filename: (req, file, cb) => {
        let customFileName = crypto.randomBytes(18).toString('hex'),
            fileExtension = file.originalname.split('.').pop();
        cb(null, customFileName + '.' + fileExtension)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// register
router.post("/", upload.single('userImage'), (req, res, next) => {
    var userIcon = 'file/usericon/09f005179b070c5edba53daaeeb7b7dde790.jpg';
    if(req.file != null){
        console.log(req.file);
        var userIcon = req.file.path.replace("\\", "/").replace("\\", "/");
    }
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        profile: {
            name: req.body.name,
            email: req.body.email,
            userImage: userIcon,
            favouriteGenre:req.body.favouriteGenre,
            gender: req.body.gender,
            DOB: new Date(0).setUTCSeconds(req.body.DOB),
        },
    });
    User.findOne({ username: req.body.username })
        .exec()
        .then(doc => {
            if (doc) {
                doc.password = undefined;
                console.log("From database" + doc);
                res.status(500).json({ error: "exisited" });
            } else {
                user.save()
                    .then(result => {
                        console.log(result);
                        user.password = undefined;
                        res.status(201).json({
                            message: 'Handling POST requests to register',
                            createdUser: user
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

module.exports = router;