"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const token_1 = require("../middlewares/token");
const userRouter = express_1.default.Router();
userRouter.get("/getAllUsers", token_1.validateAndGetTokenData, userController_1.getAllUsers);
userRouter.post("/createUser", userController_1.createUser);
userRouter.put("/updateUser/:id", userController_1.updateUser);
userRouter.delete("/deleteUser/:id", token_1.validateAndGetTokenData, userController_1.deleteUser);
userRouter.post("/:userId/favorites", token_1.validateAndGetTokenData, userController_1.toggleFavoriteSpace);
exports.default = userRouter;
//# sourceMappingURL=userRoutes.js.map