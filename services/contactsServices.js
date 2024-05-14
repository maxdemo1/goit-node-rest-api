import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const listContacts = await fs.readFile(contactsPath, {
      encoding: "utf-8",
    });
    return JSON.parse(listContacts);
  } catch (error) {
    console.error(error);
    return;
  }
}

async function getContactById(contactId) {
  if (contactId === undefined) {
    throw new Error("ID is required");
  }

  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === contactId);

  if (foundContact === undefined) {
    return null;
  }

  return foundContact;
}

async function removeContactById(contactId) {
  if (contactId === undefined) {
    throw new Error("ID is required");
  }

  const allContacts = await listContacts();
  const deleteContactIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (deleteContactIndex === -1) {
    return null;
  }

  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify(
        [
          ...allContacts.slice(0, deleteContactIndex),
          ...allContacts.slice(deleteContactIndex + 1),
        ],

        undefined,
        2
      )
    );
  } catch (error) {
    throw new Error(error);
  }

  return allContacts[deleteContactIndex];
}

async function addContact({ name, email, phone }) {
  if (name === undefined || email === undefined || phone === undefined) {
    throw new Error("all fields are required");
  }
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const allContacts = await listContacts();

  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify([...allContacts, newContact], null, 2)
    );
  } catch (error) {
    throw new Error(error);
  }

  return newContact;
}

async function editContact(id, newUserData) {
  const allContacts = await listContacts();
  const editContactIndex = allContacts.findIndex(
    (contact) => contact.id === id
  );

  if (editContactIndex === -1) {
    return null;
  }
  const editedContact = { ...allContacts[editContactIndex], ...newUserData };
  try {
    await fs.writeFile(
      contactsPath,
      JSON.stringify(
        [
          ...allContacts.slice(0, editContactIndex),
          editedContact,
          ...allContacts.slice(editContactIndex + 1),
        ],

        undefined,
        2
      )
    );
  } catch (error) {
    throw new Error(error);
  }

  return editedContact;
}

const contactsService = {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  editContact,
};
export default contactsService;
