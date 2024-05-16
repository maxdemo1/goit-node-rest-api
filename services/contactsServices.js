import contactsModel from "../schemas/contactsMongooseSchemas.js";

async function listContacts() {
  try {
    const listContacts = await contactsModel.find({});
    return listContacts;
  } catch (error) {
    console.error(error);
    return;
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
