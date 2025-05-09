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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewHistoryByUser = exports.registerViewHistory = void 0;
const viewhistoryModel_1 = __importDefault(require("../models/viewhistoryModel"));
const registerViewHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, space_id } = req.body;
        if (!user_id || !space_id) {
            return res
                .status(400)
                .json({ error: "Os campos 'user_id' e 'space_id' são obrigatórios." });
        }
        const history = yield viewhistoryModel_1.default.findOneAndUpdate({ user_id, space_id }, { $set: { createdAt: new Date() } }, { upsert: true, new: true });
        res.status(201).json(history);
    }
    catch (error) {
        console.error("Erro ao registrar visualização:", error);
        res.status(500).json({ error: "Erro ao registrar visualização." });
    }
});
exports.registerViewHistory = registerViewHistory;
const getViewHistoryByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ error: "user_id é obrigatório." });
        }
        const history = yield viewhistoryModel_1.default
            .find({ user_id })
            .populate("space_id");
        res.status(200).json(history);
    }
    catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res
            .status(500)
            .json({ error: "Erro ao buscar histórico de visualizações." });
    }
});
exports.getViewHistoryByUser = getViewHistoryByUser;
//# sourceMappingURL=viewhistoryController.js.map