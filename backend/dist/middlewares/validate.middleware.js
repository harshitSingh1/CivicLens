"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const apiError_1 = require("../utils/apiError");
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new apiError_1.BadRequestError(errors.array().map((err) => err.msg).join(', '));
    }
    next();
};
exports.validate = validate;
