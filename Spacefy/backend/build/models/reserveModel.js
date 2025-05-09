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
const ReservationSchema = new mongoose_1.Schema({
    id_reserva: { type: Number, required: true, unique: true },
    id_usuario: { type: Number, required: true },
    id_espaco: { type: Number, required: true },
    data_inicio: { type: Date, required: true },
    data_fim: { type: Date, required: true },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User"
    },
    space_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Space"
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pendente", "confirmada", "cancelada"],
        default: "pendente",
    },
    criado_em: { type: Date, required: true, default: Date.now },
});
ReservationSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.start_date >= this.end_date) {
            throw new Error("A data de início deve ser anterior à data de término.");
        }
        next();
    });
});
exports.default = mongoose_1.default.model("Reservation", ReservationSchema);
//# sourceMappingURL=reserveModel.js.map