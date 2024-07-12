import { Contact } from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/constants.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  // sortBy = 'name',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = Contact.find({ userId: userId });

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
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
};

export const getContactById = async (contactId, userId) => {
  const contacts = await Contact.findOne({ _id: contactId, userId });
  return contacts;
};

export const createContact = async (payload, userId) => {
  payload.userId = userId;
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContacts = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawPatch = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadana: true,
      ...options,
    },
  );
  if (!rawPatch) return null;
  return {
    contact: rawPatch,
    isNew: Boolean(rawPatch?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
