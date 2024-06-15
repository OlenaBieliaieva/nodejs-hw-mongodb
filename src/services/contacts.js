import { Contact } from '../db/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
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
    contact: rawPatch.value,
    isNew: Boolean(rawPatch?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId });
  return contact;
};
