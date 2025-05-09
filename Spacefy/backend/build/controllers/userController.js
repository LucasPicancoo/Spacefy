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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.toggleFavoriteSpace = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const hashManager_1 = require("../middlewares/hashManager");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.auth) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({
                error: "Acesso negado. Apenas administradores podem listar todos os usuários.",
            });
        }
        const users = yield userModel_1.default.find({}, "-password");
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro ao listar usuários" });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, password, telephone, role, cpfOrCnpj } = req.body;
        if (!name || !surname || !email || !password || !telephone || !role) {
            res
                .status(400)
                .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        if (role === "locatario" && !cpfOrCnpj) {
            res
                .status(400)
                .json({ error: "O campo CPF/CNPJ é obrigatório para locatários." });
        }
        const newUser = new userModel_1.default({
            name,
            surname,
            email,
            password,
            telephone,
            role,
            cpfOrCnpj,
        });
        yield newUser.save();
        const _a = newUser.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        if (error.code === 11000) {
            res.status(400).json({ error: "O e-mail já está em uso." });
        }
        else {
            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, telephone, password, surname } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID de usuário inválido." });
        }
        if (!name || !email || !telephone || !password || !surname) {
            return res
                .status(400)
                .json({ error: "Preencha todos os campos obrigatórios." });
        }
        const emailExists = yield userModel_1.default.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
            return res
                .status(409)
                .json({ error: "Este e-mail já está em uso por outro usuário." });
        }
        const hashedPassword = yield (0, hashManager_1.hash)(password);
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, { name, email, telephone, password: hashedPassword, surname }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error.code === 11000) {
            return res.status(409).json({ error: "E-mail já cadastrado." });
        }
        return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
});
exports.updateUser = updateUser;
const toggleFavoriteSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { userId } = req.params;
    const { spaceId } = req.body;
    try {
        if (((_a = req.auth) === null || _a === void 0 ? void 0 : _a.role) !== "usuario") {
            return res.status(403).json({
                error: "Apenas usuários podem favoritar ou desfavoritar espaços.",
            });
        }
        if (!spaceId) {
            return res.status(400).json({ error: "O ID do espaço é obrigatório." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(spaceId)) {
            return res.status(400).json({ error: "ID inválido." });
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        const alreadyFavorited = ((_b = user.favorites) !== null && _b !== void 0 ? _b : []).some((id) => id.toString() === spaceId);
        if (alreadyFavorited) {
            user.favorites = ((_c = user.favorites) !== null && _c !== void 0 ? _c : []).filter((id) => id.toString() !== spaceId);
        }
        else {
            user.favorites = [...((_d = user.favorites) !== null && _d !== void 0 ? _d : []), (spaceId)];
        }
        yield user.save();
        return res.status(200).json({
            message: alreadyFavorited
                ? "Espaço removido dos favoritos."
                : "Espaço adicionado aos favoritos.",
            favorites: user.favorites,
        });
    }
    catch (error) {
        console.error("Erro ao favoritar/desfavoritar espaço:", error);
        return res.status(500).json({ error: "Erro interno ao atualizar favoritos." });
    }
});
exports.toggleFavoriteSpace = toggleFavoriteSpace;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.auth) {
            return res.status(401).json({ error: "Autenticação necessária" });
        }
        const { id } = req.params;
        const { role, id: userId } = req.auth;
        const allowedRoles = ["usuario", "locatario", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                error: "Apenas usuários, locatários ou administradores podem deletar contas"
            });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        if (role !== "admin" && userId !== id) {
            return res.status(403).json({
                error: "Você só pode deletar sua própria conta"
            });
        }
        const deletedUser = yield userModel_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.status(200).json({ message: "Conta deletada com sucesso" });
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({
            error: "Erro interno no servidor ao deletar usuário",
            details: error.message
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map