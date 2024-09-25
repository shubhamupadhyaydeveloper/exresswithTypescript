import { playlistModel } from "@/models/playlist.model";
import { songModel } from "@/models/song.model";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export async function shareLogic(
  req: Request<{ type: string; id: string }, {}, {}>,
  res: Response
) {
  try {
    const { type, id } = req.params;

    if (type !== "playlist" && type !== "song")
      return res.json({ message: "invalid request" }).status(400);

    if (!isValidObjectId(id))
      return res.json({ message: "invalid object id" }).status(400);

    let title, description, imageUrl, url;

    if (type === "playlist") {
      const findPlaylist = await playlistModel.findById(id);

      if (!findPlaylist)
        return res.json({ message: "playlist not found" }).status(404);

      title = `check out this playist ${findPlaylist.title} on beatify`;
      description = `${findPlaylist.description} go and check out this`;
      imageUrl =
        findPlaylist.imageUrl ??
        "https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_640.png";
      url = `http://localhost:3000/share/playlist/${findPlaylist._id}`;
    } else {
      const findSong = await songModel.findById(id);
      if (!findSong) return res.json({ message: "song not found" }).status(404);
      title = `check out this song ${findSong.title}`;
      description = `${findSong.about}`;
      imageUrl =
        findSong.thumbnail.secure_url ??
        "https://cdn.pixabay.com/photo/2016/05/24/22/54/icon-1413583_640.png";
      url = `http://localhost:3000/share/song/${findSong._id}`;
    }

   return res.send(`
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
          </style>
      </head>
      <body>
          <div class="container">
              <img class="icon" src="https://res.cloudinary.com/dponzgerb/image/upload/v1720080478/qlkp7z3muc2qw3dhfism.png" alt="App Icon">
              <div class="title">${title}</div>
              <div class="description">${description}</div>
              <img class="image" src="${imageUrl}" alt="Preview Image">
              <p>Download our app <a href="${url}" style="color: #1e90ff;">Drive Link or PlayStore or AppStores</a></p>
          </div>
      </body>
      </html>
    `);
  } catch (error: any) {
    console.log("error in share logic", error.message);
  }
}
