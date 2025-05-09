"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndGetTokenData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateAndGetTokenData = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token de autenticação ausente." });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.auth = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};
exports.validateAndGetTokenData = validateAndGetTokenData;
//# sourceMappingURL=token.js.map