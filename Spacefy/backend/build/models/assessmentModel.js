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
const AssessmentSchema = new mongoose_1.Schema({
    id_avaliacao: { type: Number, required: true, unique: true },
    nota: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, maxlength: 250 },
    data_avaliacao: { type: Date, required: true, default: Date.now },
    id_usuario: { type: Number, required: true },
    id_espaco: { type: Number, required: true },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500
    },
    evaluation_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    space_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Space"
    },
});
AssessmentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.score || this.score < 1 || this.score > 5) {
            throw new Error("A nota deve estar entre 1 e 5.");
        }
        next();
    });
});
exports.default = mongoose_1.default.model("Assessment", AssessmentSchema);
//# sourceMappingURL=assessmentModel.js.map