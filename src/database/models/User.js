"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: {
        type: String,
        unique: true,
        sparse: true,
    },
    subscription: {
        type: Boolean,
        default: false,
    },
    dateOfSubscription: {
        type: Date,
        default: null,
    },
    usedPromocodes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Promocode",
            default: null,
        },
    ],
    activePromocode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Promocode",
        default: null,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", User);
