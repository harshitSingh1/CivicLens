"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\routes\civicUpdates.routes.ts
const express_1 = __importDefault(require("express"));
const civicUpdates_controller_1 = require("../controllers/civicUpdates.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('admin', 'authority'), [
    (0, express_validator_1.body)('type')
        .isIn(['event', 'hazard', 'project', 'alert', 'utility'])
        .withMessage('Invalid update type'),
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('affectedAreas').isArray({ min: 1 }).withMessage('At least one affected area is required'),
    (0, express_validator_1.body)('affectedAreas.*.state').trim().notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('status')
        .isIn(['upcoming', 'ongoing', 'completed'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('source')
        .isIn(['government', 'community', 'automated'])
        .withMessage('Invalid source'),
], validate_middleware_1.validate, civicUpdates_controller_1.createCivicUpdateHandler);
router.get('/', civicUpdates_controller_1.getCivicUpdatesHandler);
router.get('/search', civicUpdates_controller_1.searchByLocationHandler);
router.get('/:id', civicUpdates_controller_1.getCivicUpdateHandler);
router.patch('/:id', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('admin', 'authority'), [
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['upcoming', 'ongoing', 'completed'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('severity')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid severity'),
], validate_middleware_1.validate, civicUpdates_controller_1.updateCivicUpdateHandler);
router.delete('/:id', auth_middleware_1.auth, (0, auth_middleware_1.authorize)('admin', 'authority'), civicUpdates_controller_1.deleteCivicUpdateHandler);
exports.default = router;
