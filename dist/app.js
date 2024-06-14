"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user.route"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongo_connect_1 = require("./lib/mongo.connect");
const app = (0, express_1.default)();
const port = process.env.PORT;
// connect To mongodb
(0, mongo_connect_1.connectedToMongodb)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/user", user_route_1.default);
app.get("/api", (req, res) => {
    res.json({ message: "welcome user" });
});
app.listen(port, () => console.log(`port is listining ${port}`));
