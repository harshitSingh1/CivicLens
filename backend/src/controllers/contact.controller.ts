// backend/src/controllers/contact.controller.ts
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/apiResponse';
import { createContact, getContacts, getContactById, updateContact, deleteContact } from '../services/contact.service';
import { logger } from '../utils/logger';

const createContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await createContact(req.body);
    sendResponse(res, {
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    logger.error(`Error in createContactHandler: ${error}`);
    next(error);
  }
};

const getContactsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const options = {
      limit: parseInt(req.query.limit as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: req.query.sortBy as string,
    };

    const { contacts, count } = await getContacts(filter, options);

    sendResponse(res, {
      message: 'Contacts retrieved successfully',
      data: contacts,
      meta: {
        page: options.page,
        limit: options.limit,
        total: count,
      },
    });
  } catch (error) {
    logger.error(`Error in getContactsHandler: ${error}`);
    next(error);
  }
};

const getContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await getContactById(req.params.id);
    sendResponse(res, {
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    logger.error(`Error in getContactHandler: ${error}`);
    next(error);
  }
};

const updateContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await updateContact(req.params.id, req.body);
    sendResponse(res, {
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    logger.error(`Error in updateContactHandler: ${error}`);
    next(error);
  }
};

const deleteContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteContact(req.params.id);
    sendResponse(res, {
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    logger.error(`Error in deleteContactHandler: ${error}`);
    next(error);
  }
};

export {
  createContactHandler,
  getContactsHandler,
  getContactHandler,
  updateContactHandler,
  deleteContactHandler
};