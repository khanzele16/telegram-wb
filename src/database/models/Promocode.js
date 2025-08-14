"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Promocode = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    useNumber: { type: Number, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Promocode", Promocode);
