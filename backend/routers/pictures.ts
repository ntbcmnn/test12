import express from 'express';
import User from '../models/User';
import Picture from '../models/Picture';
import auth, {RequestWithUser} from '../middleware/auth';
import {imagesUpload} from '../multer';
import {Error} from "mongoose";

const picturesRouter = express.Router();

picturesRouter.get("/", async (req: express.Request, res: express.Response, next) => {
        let photos;

        try {
            if (req.query.user) {
                photos = await Picture.find({user: req.query.user}).populate("user");
            } else {
                photos = await Picture.find().populate("user");
            }

            res.send(photos.reverse());
        } catch (e) {
            next(e);
        }
    }
);

picturesRouter.post("/", imagesUpload.single('image'), auth, async (req: express.Request, res: express.Response, next) => {
        const reqWithUser = req as RequestWithUser;

        if (!reqWithUser.user) {
            res.status(401).send('User not found');
            return;
        }

        try {
            const newPhoto = {
                user: reqWithUser.user._id,
                name: req.body.name,
                image: req.file ? 'images' + req.file.filename : null,
            };

            const photo = new Picture(newPhoto);
            await photo.save();
            res.send(photo);
        } catch (error) {
            if (error instanceof Error.ValidationError) {
                res.status(400).send(error);
                return;
            }
            next(error);
        }
    }
);

picturesRouter.delete(
    "/:id",
    auth,
    async (req: express.Request, res: express.Response, next) => {
        const {id} = req.params;

        const token = req.get("Authorization");

        if (!token) {
            res.status(401).send({error: "Token is missing."});
            return;
        }

        try {
            const user = await User.findOne({token});

            if (!user) {
                res.status(401).send({error: "No users matching this token."});
                return;
            }

            const photo = await Picture.findById(id);

            if (!photo) {
                res.status(404).send({error: "Picture not found"});
                return;
            }

            if (user.role === "admin") {
                await Picture.findByIdAndDelete(id);
                res.send({message: "Picture deleted successfully."});
                return;
            }

            if (photo.user.toString() !== user._id.toString()) {
                res
                    .status(403)
                    .send({error: "You are not allowed to delete this photo."});
                return;
            }

            await Picture.findByIdAndDelete(id);
            res.send({message: "Picture deleted successfully."});
        } catch (e) {
            next(e);
        }
    },
);

export default picturesRouter;
