"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareLink = void 0;
const song_model_1 = require("../models/song.model");
function shareLink(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, id } = req.params;
            let title, description, imageUrl, url, singer, releasedDate;
            if (type !== "song" && type !== "playlist")
                return res
                    .status(400)
                    .json({ message: "invalid type only video and playlist is shared" });
            if (type === "song") {
                const findSong = yield song_model_1.songModel.findById(id);
                title = findSong === null || findSong === void 0 ? void 0 : findSong.title;
                description = findSong === null || findSong === void 0 ? void 0 : findSong.about;
                imageUrl =
                    (findSong === null || findSong === void 0 ? void 0 : findSong.thumbnail.secure_url) ||
                        "https://images.unsplash.com/photo-1727189899371-abd5873c4709?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D";
                url = `http://192.168.1.109:3000/sharelink/song/${findSong === null || findSong === void 0 ? void 0 : findSong._id}`;
                singer = findSong === null || findSong === void 0 ? void 0 : findSong.singer;
                releasedDate = findSong === null || findSong === void 0 ? void 0 : findSong.createdAt.toString().slice(0, 15);
            }
            res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${imageUrl}">
          <meta property="og:url" content="${url}">
          <meta property="og:type" content="website">
          <style>
              body {
                  background-color: #121212;
                  color: #ffffff;
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
              }
              .container {
                  text-align: center;
                  padding: 20px;
                  border: 1px solid #333;
                  border-radius: 8px;
                  background-color: #1e1e1e;
              }
              .icon {
                  width: 100px;
                  height: 100px;
                  margin-bottom: 20px;
              }
              .title {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .description {
                  font-size: 18px;
                  margin-bottom: 20px;
              }
              .image {
                  width: 100%;
                  max-width: 150px;
                  max-height:300px;
                  resize-mode:'cover';
                  border-radius: 8px;
              }
              .release {
                 display: flex;
                 flex-direction: row;
                 align-items: center;
                 gap : 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1 style="color : #21c856"> Beatify</h1>
              <div class="title">${title}</div>
              <div class="description">${description}</div>
              <div class="release"> <h3 style=" color : #dbdbdb">Singer : </h3> <h2 style="color: #21c856;">${singer}</h2> </div>
              <div class="release"> <h3 style=" color : #dbdbdb">Realeased : </h3> <h2 style="color: #21c856;">${releasedDate}</h2> </div>
              <img class="image" src="${imageUrl}" alt="Preview Image">
              <p>Download our app <a href="${url}" style="color: #21c856;">Drive Link or PlayStore or AppStores</a></p>
          </div>
      </body>
      </html>
    `);
        }
        catch (error) {
            res.status(500).json({ message: `error in sharelink ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.shareLink = shareLink;
