"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spaceController_1 = require("../controllers/spaceController");
const token_1 = require("../middlewares/token");
const spaceRouter = express_1.default.Router();
spaceRouter.get("/getAllSpaces", spaceController_1.getAllSpaces);
spaceRouter.get("/getSpaceById/:id", spaceController_1.getSpaceById);
spaceRouter.post("/createSpace", token_1.validateAndGetTokenData, spaceController_1.createSpace);
spaceRouter.put("/updateSpace/:id", token_1.validateAndGetTokenData, spaceController_1.updateSpace);
spaceRouter.delete("/deleteSpace/:id", token_1.validateAndGetTokenData, spaceController_1.deleteSpace);
exports.default = spaceRouter;
//# sourceMappingURL=spaceRoutes.js.map