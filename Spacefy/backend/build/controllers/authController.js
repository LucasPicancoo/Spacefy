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
exports.login = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const hashManager_1 = require("../middlewares/hashManager");
const authenticator_1 = require("../middlewares/authenticator");
const authenticator = new authenticator_1.Authenticator();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }
        const isPasswordCorrect = yield (0, hashManager_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }
        const token = authenticator.generateToken({
            id: user._id.toString(),
            name: user.name,
            surname: user.surname,
            email: user.email,
            telephone: user.telephone,
            role: user.role,
        });
        return res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro ao fazer login" });
    }
});
exports.login = login;
//# sourceMappingURL=authController.js.map