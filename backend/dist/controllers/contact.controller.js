"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactHandler = exports.updateContactHandler = exports.getContactHandler = exports.getContactsHandler = exports.createContactHandler = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const contact_service_1 = require("../services/contact.service");
const logger_1 = require("../utils/logger");
const createContactHandler = async (req, res, next) => {
    try {
        const contact = await (0, contact_service_1.createContact)(req.body);
        (0, apiResponse_1.default)(res, {
            message: 'Contact form submitted successfully',
            data: contact
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in createContactHandler: ${error}`);
        next(error);
    }
};
exports.createContactHandler = createContactHandler;
const getContactsHandler = async (req, res, next) => {
    try {
        const filter = req.query;
        const options = {
            limit: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            sortBy: req.query.sortBy,
        };
        const { contacts, count } = await (0, contact_service_1.getContacts)(filter, options);
        (0, apiResponse_1.default)(res, {
            message: 'Contacts retrieved successfully',
            data: contacts,
            meta: {
                page: options.page,
                limit: options.limit,
                total: count,
            },
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getContactsHandler: ${error}`);
        next(error);
    }
};
exports.getContactsHandler = getContactsHandler;
const getContactHandler = async (req, res, next) => {
    try {
        const contact = await (0, contact_service_1.getContactById)(req.params.id);
        (0, apiResponse_1.default)(res, {
            message: 'Contact retrieved successfully',
            data: contact,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in getContactHandler: ${error}`);
        next(error);
    }
};
exports.getContactHandler = getContactHandler;
const updateContactHandler = async (req, res, next) => {
    try {
        const contact = await (0, contact_service_1.updateContact)(req.params.id, req.body);
        (0, apiResponse_1.default)(res, {
            message: 'Contact updated successfully',
            data: contact,
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in updateContactHandler: ${error}`);
        next(error);
    }
};
exports.updateContactHandler = updateContactHandler;
const deleteContactHandler = async (req, res, next) => {
    try {
        await (0, contact_service_1.deleteContact)(req.params.id);
        (0, apiResponse_1.default)(res, {
            message: 'Contact deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error(`Error in deleteContactHandler: ${error}`);
        next(error);
    }
};
exports.deleteContactHandler = deleteContactHandler;
