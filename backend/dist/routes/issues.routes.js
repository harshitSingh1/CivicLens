"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\routes\issues.routes.ts
const express_1 = __importDefault(require("express"));
const issues_controller_1 = require("../controllers/issues.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.auth, issues_controller_1.createIssueHandler);
router.get('/', issues_controller_1.getIssuesHandler);
router.get('/:id', issues_controller_1.getIssueHandler);
router.patch('/:id', auth_middleware_1.auth, [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['reported', 'open', 'in-progress', 'resolved', 'rejected'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
], validate_middleware_1.validate, issues_controller_1.updateIssueHandler);
router.delete('/:id', auth_middleware_1.auth, issues_controller_1.deleteIssueHandler);
router.post('/:id/upvote', auth_middleware_1.auth, issues_controller_1.upvoteIssueHandler);
router.post('/:id/comments', auth_middleware_1.auth, issues_controller_1.addCommentHandler);
router.delete('/:id/comments/:commentId', auth_middleware_1.auth, issues_controller_1.deleteCommentHandler);
exports.default = router;
