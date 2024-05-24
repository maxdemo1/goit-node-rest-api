import HttpError from "../helpers/HttpError.js";
import contactsModel from "../schemas/contactsMongooseSchema.js";

async function listContacts(queryParams) {
  try {
    if (Object.keys(queryParams).length === 0) {
      const listContacts = await contactsModel.find({});
      return listContacts;
    } else if (
      Object.keys(queryParams).length === 2 &&
      Object.keys(queryParams)[0] === "page" &&
      Object.keys(queryParams)[1] === "limit"
    ) {
      const listContacts = await contactsModel
        .find({})
        .skip(queryParams.limit * (queryParams.page - 1))
        .limit(queryParams.limit);
      return listContacts;
    } else if (
      Object.keys(queryParams).length === 1 &&
      Object.keys(queryParams)[0] === "favorite"
    ) {
      const listContacts = await contactsModel.find({
        favorite: queryParams.favorite,
      });
      return listContacts;
    } else {
      console.log("Invalid query parameters");
      return HttpError(400);
    }
  } catch (error) {
    console.error(error);
    return HttpError(error.status);
  }
}

async function getContactById(contactId) {
  try {
    const foundedContact = await contactsModel.findById(contactId);
    return foundedContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function removeContactById(contactId) {
  try {
    const deletedContact = await contactsModel.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function addContact({ name, email, phone, favorite = false }) {
  const newContact = {
    name,
    email,
    phone,
    favorite,
  };

  try {
    const newContactResult = await contactsModel.create(newContact);
    return newContactResult;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function editContact(id, newContactData) {
  if (newContactData.favorite === undefined) {
    newContactData = { ...newContactData, favorite: false };
  }
  try {
    const newContact = await contactsModel.findByIdAndUpdate(
      id,
      newContactData,
      { new: true }
    );
    return newContact;
  } catch (error) {
    console.error(error);
    return "invalidID";
  }
}

async function setFavorite(id, favoriteState) {
  try {
    const editContact = await contactsModel.findByIdAndUpdate(
      id,
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
