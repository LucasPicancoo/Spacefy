"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SpaceSchema = new mongoose_1.Schema({
    space_name: { type: String, required: true },
    max_people: { type: Number, required: true },
    location: { type: String, required: true },
    space_type: { type: String, required: true },
    space_description: { type: String, maxlength: 500 },
    space_amenities: { type: [String], required: true },
    price_per_hour: { type: Number, required: true },
    owner_name: { type: String, required: true },
    document_number: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const isCPF = value.length === 11 && /^\d{11}$/.test(value);
                const isCNPJ = value.length === 14 && /^\d{14}$/.test(value);
                return isCPF || isCNPJ;
            },
            message: "O campo CPF/CNPJ deve conter um CPF válido (11 dígitos) ou um CNPJ válido (14 dígitos)."
        }
    },
    owner_phone: { type: String, required: true },
    owner_email: { type: String, required: true },
    image_url: { type: String, required: true },
});
SpaceSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.space_name) {
            throw new Error("O Nome do Espaço não foi informado.");
        }
        if (!this.max_people) {
            throw new Error("O número máximo de pessoas não foi informado.");
        }
        if (!this.location) {
            throw new Error("A URL de localização do espaço não foi informada.");
        }
        if (!this.price_per_hour) {
            throw new Error("O preço por hora não foi informado.");
        }
        if (!this.space_type) {
            throw new Error("O tipo de espaço não foi informado.");
        }
        if (!this.document_number) {
            throw new Error("O campo CPF/CNPJ é obrigatório.");
        }
        if (!this.space_amenities) {
            throw new Error("Selecione pelo menos uma comodidade.");
        }
        const isCPF = this.document_number.length === 11 && /^\d{11}$/.test(this.document_number);
        const isCNPJ = this.document_number.length === 14 && /^\d{14}$/.test(this.document_number);
        if (!isCPF && !isCNPJ) {
            throw new Error("O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 dígitos.");
        }
        next();
    });
});
exports.default = mongoose_1.default.model("Space", SpaceSchema);
//# sourceMappingURL=spaceModel.js.map