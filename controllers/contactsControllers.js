import { createContactSchema } from "../schemas/contactsValidationSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const allContacts = await contactsService.listContacts();

  if (Array.isArray(allContacts) && allContacts.lenght === 0) {
    res.status(404).send({ message: "No data in database" });
    return;
  }
  res.send(allContacts);
};

export const getOneContact = async (req, res) => {
  const contactById = await contactsService.getContactById(req.params.id);

  if (contactById === null) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  if (contactById === "invalidID") {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  res.send(contactById);
};

export const deleteContact = async (req, res) => {
  const deletedContact = await contactsService.removeContactById(req.params.id);

  switch (deletedContact) {
    case null:
      res.status(404).json({ message: "Not found" });
      break;
    case "invalidID":
      res.status(400).send({ message: "Bad Request" });
      break;
    default:
      res.send(deletedContact);
      break;
  }
};

export const createContact = async (req, res) => {
  const request = req.body;

  const { error, _ } = createContactSchema.validate({ ...request });

  if (error !== undefined) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const newContact = await contactsService.addContact(request);
  newContact === null
    ? res.status(500).send({ message: "Inernal error" })
    : res.status(201).send(newContact);
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Body must have tree fields" });
    return;
  }
  const newContactData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  const editedContact = await contactsService.editContact(
    req.params.id,
    newContactData
  );

  switch (editedContact) {
    case null:
      res.status(404).json({ message: "Not found" });
      break;
    case "invalidID":
      res.status(400).send({ message: "Bad Request" });
      break;
    default:
      res.send(editedContact);
      break;
  }
};

export const setFavorite = async (req, res) => {
  const editedContact = await contactsService.setFavorite(
    req.params.id,
    req.body.favorite
  );
  switch (editedContact) {
    case null:
      res.status(404).json({ message: "Not found" });
      break;
    case "invalidID":
      res.status(400).send({ message: "Bad Request" });
      break;
    default:
      res.send(editedContact);
      break;
  }
};
