"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend\src\routes\index.ts
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const issues_routes_1 = __importDefault(require("./issues.routes"));
const civicUpdates_routes_1 = __importDefault(require("./civicUpdates.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const error_middleware_1 = require("../middlewares/error.middleware");
const users_routes_1 = __importDefault(require("./users.routes"));
const router = express_1.default.Router();
router.use('/auth', auth_routes_1.default);
router.use('/issues', issues_routes_1.default);
router.use('/civic-updates', civicUpdates_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/users', users_routes_1.default);
// Error handling middleware
router.use(error_middleware_1.errorHandler);
exports.default = router;
