"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/users.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const users_controller_1 = require("../controllers/users.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.patch('/me', auth_middleware_1.auth, [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required'),
], validate_middleware_1.validate, users_controller_1.updateUser);
router.patch('/me/password', auth_middleware_1.auth, [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], validate_middleware_1.validate, users_controller_1.updatePassword);
exports.default = router;
