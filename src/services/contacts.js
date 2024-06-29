import { Contact } from '../db/contact.js';
import { SORT_ORDER } from '../constants/constants.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = Contact.find();

  if (filter.favourite) {
    contactsQuery.where('isFavourite').eq(filter.favourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };

  // const contacts = await Contact.find();
  // return contacts;
};

export const getContactById = async (contactId) => {
  const contacts = await Contact.findById(contactId);
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContacts = async (contactId, payload, options = {}) => {
  const rawPatch = await Contact.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
    includeResultMetadana: true,
    ...options,
  });

  if (!rawPatch) return null;
  return {
    contact: rawPatch,
    isNew: Boolean(rawPatch?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId });
  return contact;
};
