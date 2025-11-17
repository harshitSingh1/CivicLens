// backend/src/services/contact.service.ts
import Contact from '../models/contact.model';
import { IContact } from '../interfaces/contact.interface';
import { NotFoundError } from '../utils/apiError';

const createContact = async (contactData: IContact): Promise<IContact> => {
  const contact = await Contact.create(contactData);
  return contact;
};

const getContacts = async (filter: {
  status?: string;
  subject?: string;
  search?: string;
}, options: {
  limit?: number;
  page?: number;
  sortBy?: string;
}): Promise<{ contacts: IContact[]; count: number }> => {
  const query: any = {};

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

  const sort: any = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const contacts = await Contact.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const count = await Contact.countDocuments(query);

  return { contacts, count };
};

const getContactById = async (id: string): Promise<IContact> => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new NotFoundError('Contact not found');
  }
  return contact;
};

const updateContact = async (id: string, updateData: Partial<IContact>): Promise<IContact> => {
  const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  if (!contact) {
    throw new NotFoundError('Contact not found');
  }
  return contact;
};

const deleteContact = async (id: string): Promise<void> => {
  await Contact.findByIdAndDelete(id);
};

export {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
};