"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => {
    if (!token) {
        throw new Error("Authorization token is required.");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        return { id: decoded.id, name: decoded.name };
    }
    catch (error) {
        throw new Error("Invalid or expired token.");
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=VerifyToken.js.map