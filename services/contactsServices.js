import HttpError from "../helpers/HttpError.js";
import typeOfSearch from "../helpers/typeOfSearch.js";
import contactsModel from "../schemas/contactsMongooseSchema.js";

async function listContacts(queryParams, ownerId) {
  try {
    const listContacts = await typeOfSearch(queryParams, ownerId);
    return listContacts;
  } catch (error) {
    console.error(error);
    return HttpError(error.status);
  }
}

async function getContactById(contactId, ownerId) {
  try {
    const foundedContact = await contactsModel.findOne({
      _id: contactId,
      owner: ownerId,
    });

    return foundedContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function removeContactById(contactId, ownerId) {
  try {
    const deletedContact = await contactsModel.findOneAndDelete({
      _id: contactId,
      owner: ownerId,
    });
    return deletedContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function addContact({ name, email, phone, favorite = false, owner }) {
  const newContact = {
    name,
    email,
    phone,
    favorite,
    owner,
  };

  try {
    const newContactResult = await contactsModel.create(newContact);
    return newContactResult;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function editContact(id, ownerId, newContactData) {
  if (newContactData.favorite === undefined) {
    newContactData = { ...newContactData, favorite: false };
  }
  try {
    const newContact = await contactsModel.findOneAndUpdate(
      { _id: id, owner: ownerId },
      newContactData,
      { new: true }
    );

    return newContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function setFavorite(id, ownerId, favoriteState) {
  try {
    const editContact = await contactsModel.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { favorite: favoriteState },
      { new: true }
    );
    return editContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

const contactsService = {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  editContact,
  setFavorite,
};
export default contactsService;
