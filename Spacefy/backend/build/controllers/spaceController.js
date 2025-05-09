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
exports.deleteSpace = exports.updateSpace = exports.createSpace = exports.getSpaceById = exports.getAllSpaces = void 0;
const spaceModel_1 = __importDefault(require("../models/spaceModel"));
const getAllSpaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spaces = yield spaceModel_1.default.find();
        if (!spaces) {
            res.status(404).json({ error: "Nenhum espaço encontrado" });
        }
        res.status(200).json(spaces);
    }
    catch (error) {
        console.error("Erro ao listar espaços:", error);
        res.status(500).json({ error: "Erro ao listar espaços" });
    }
});
exports.getAllSpaces = getAllSpaces;
const getSpaceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const space = yield spaceModel_1.default.findById(id);
        if (!space) {
            return res.status(404).json({ error: "Espaço não encontrado" });
        }
        return res.status(200).json(space);
    }
    catch (error) {
        console.error("Erro ao buscar espaço:", error);
        return res.status(500).json({ error: "Erro ao buscar espaço" });
    }
});
exports.getSpaceById = getSpaceById;
const createSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.auth) === null || _a === void 0 ? void 0 : _a.role) !== "locatario") {
            return res
                .status(403)
                .json({ error: "Apenas locatários podem criar espaços." });
        }
        const { space_name, max_people, location, space_type, space_description, space_amenities, price_per_hour, owner_name, document_number, owner_phone, owner_email, image_url, } = req.body;
        if (!space_name ||
            !max_people ||
            !location ||
            !space_type ||
            !price_per_hour ||
            !space_amenities ||
            !owner_name ||
            !document_number ||
            !owner_phone ||
            !owner_email ||
            !image_url) {
            res
                .status(400)
                .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        const newSpace = new spaceModel_1.default({
            space_name,
            max_people,
            location,
            space_type,
            space_description,
            space_amenities,
            price_per_hour,
            owner_name,
            document_number,
            owner_phone,
            owner_email,
            image_url,
        });
        yield newSpace.save();
        res.status(201).json(newSpace);
    }
    catch (error) {
        console.error("Erro ao criar espaço:", error);
        if (error instanceof Error && error.name === "ValidationError") {
            res.status(400).json({ error: "Erro de validação dos campos" });
        }
        res.status(500).json({ error: "Erro ao criar espaço" });
    }
});
exports.createSpace = createSpace;
const updateSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.auth) === null || _a === void 0 ? void 0 : _a.role) !== "locatario") {
            return res
                .status(403)
                .json({ error: "Apenas locatários podem atualizar espaços." });
        }
        const { space_name, max_people, location, space_type, price_per_hour, owner_name, document_number, owner_phone, owner_email, image_url, } = req.body;
        if (!space_name ||
            !max_people ||
            !location ||
            !space_type ||
            !price_per_hour ||
            !owner_name ||
            !document_number ||
            !owner_phone ||
            !owner_email ||
            !image_url) {
            return res
                .status(400)
                .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        const { id } = req.params;
        const updatedSpace = yield spaceModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedSpace) {
            return res.status(404).json({ error: "Espaço não encontrado" });
        }
        return res.status(200).json(updatedSpace);
    }
    catch (error) {
        console.error("Erro ao atualizar espaço:", error);
        if (error instanceof Error && error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro ao atualizar espaço" });
    }
});
exports.updateSpace = updateSpace;
const mongoose_1 = __importDefault(require("mongoose"));
const deleteSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.auth || !["locatario", "admin"].includes(req.auth.role)) {
            return res.status(403).json({
                error: "Apenas locatários ou administradores podem excluir espaços."
            });
        }
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const deletedSpace = yield spaceModel_1.default.findByIdAndDelete(id);
        if (!deletedSpace) {
            return res.status(404).json({ error: "Espaço não encontrado" });
        }
        return res.status(200).json({
            message: "Espaço excluído com sucesso",
            deletedSpace
        });
    }
    catch (error) {
        console.error("Erro ao excluir espaço:", error);
        return res.status(500).json({
            error: "Erro ao excluir espaço",
            details: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});
exports.deleteSpace = deleteSpace;
//# sourceMappingURL=spaceController.js.map