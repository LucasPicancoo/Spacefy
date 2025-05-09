"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const viewhistoryController_1 = require("../controllers/viewhistoryController");
const viewHistoryRouter = express_1.default.Router();
viewHistoryRouter.post("/register", viewhistoryController_1.registerViewHistory);
viewHistoryRouter.get("/user/:user_id", viewhistoryController_1.getViewHistoryByUser);
exports.default = viewHistoryRouter;
//# sourceMappingURL=viewhistoryRoutes.js.map