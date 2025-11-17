"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/contact.routes.ts
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('subject').notEmpty().withMessage('Subject is required'),
    (0, express_validator_1.body)('message').trim().notEmpty().withMessage('Message is required')
], validate_middleware_1.validate, contact_controller_1.createContactHandler);
router.get('/', auth_middleware_1.auth, contact_controller_1.getContactsHandler);
router.get('/:id', auth_middleware_1.auth, contact_controller_1.getContactHandler);
router.patch('/:id', auth_middleware_1.auth, contact_controller_1.updateContactHandler);
router.delete('/:id', auth_middleware_1.auth, contact_controller_1.deleteContactHandler);
exports.default = router;
