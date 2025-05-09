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
exports.createPayment = void 0;
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, spaceId, amount } = req.body;
        const payment = yield paymentModel_1.default.create({
            userId,
            spaceId,
            amount,
        });
        res.status(201).json({
            message: "Pedido de pagamento criado com sucesso.",
            paymentId: payment._id,
            status: payment.status,
        });
    }
    catch (err) {
        console.error("Erro ao criar pagamento:", err);
        res.status(500).json({ error: "Erro ao criar pagamento" });
    }
});
exports.createPayment = createPayment;
//# sourceMappingURL=paymentController.js.map