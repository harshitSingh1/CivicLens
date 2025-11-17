"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getContactById = exports.getContacts = exports.createContact = void 0;
// backend/src/services/contact.service.ts
const contact_model_1 = __importDefault(require("../models/contact.model"));
const apiError_1 = require("../utils/apiError");
const createContact = async (contactData) => {
    const contact = await contact_model_1.default.create(contactData);
    return contact;
};
exports.createContact = createContact;
const getContacts = async (filter, options) => {
    const query = {};
    if (filter.status) {
        query.status = filter.status;
    }
    if (filter.subject) {
        query.subject = filter.subject;
    }
    if (filter.search) {
        query.$or = [
            { name: { $regex: filter.search, $options: 'i' } },
            { email: { $regex: filter.search, $options: 'i' } },
            { message: { $regex: filter.search, $options: 'i' } }
        ];
    }
    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;
    const sort = {};
    if (options.sortBy) {
        const parts = options.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    else {
        sort.createdAt = -1;
    }
    const contacts = await contact_model_1.default.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const count = await contact_model_1.default.countDocuments(query);
    return { contacts, count };
};
exports.getContacts = getContacts;
const getContactById = async (id) => {
    const contact = await contact_model_1.default.findById(id);
    if (!contact) {
        throw new apiError_1.NotFoundError('Contact not found');
    }
    return contact;
};
exports.getContactById = getContactById;
const updateContact = async (id, updateData) => {
    const contact = await contact_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
    if (!contact) {
        throw new apiError_1.NotFoundError('Contact not found');
    }
    return contact;
};
exports.updateContact = updateContact;
const deleteContact = async (id) => {
    await contact_model_1.default.findByIdAndDelete(id);
};
exports.deleteContact = deleteContact;
