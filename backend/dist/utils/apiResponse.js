"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse = (res, data, statusCode = http_status_codes_1.default.OK) => {
    res.status(statusCode).json({
        success: true,
        ...data,
    });
};
exports.default = sendResponse;
