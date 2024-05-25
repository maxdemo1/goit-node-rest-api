import HttpError from "../../helpers/HttpError.js";
import contactsService from "../../services/contactsServices.js";
import contactsModel from "../../schemas/contactsMongooseSchema.js";

export const getAllContacts = async (req, res, next) => {
  const allContacts = await contactsService.listContacts(
    req.query,
    req.user.id
  );

  if (Array.isArray(allContacts) && allContacts.length === 0) {
    res.status(404).send({ message: "No data in database" });
    return;
  } else if (allContacts.length === undefined) {
    next(allContacts);
    return;
  }
  res.send(allContacts);
};

export const getOneContact = async (req, res, next) => {
  const contactById = await contactsService.getContactById(
    req.params.id,
    req.user.id
  );

  if (contactById === null) {
    next(HttpError(404));
    return;
  }
  if (contactById === "invalidID") {
    next(HttpError(400));
    return;
  }

  res.send(contactById);
};

export const deleteContact = async (req, res, next) => {
  const deletedContact = await contactsService.removeContactById(
    req.params.id,
    req.user.id
  );

  switch (deletedContact) {
    case null:
      next(HttpError(404));
      break;
    case "invalidID":
      next(HttpError(400));
      break;
    default:
      res.send(deletedContact);
      break;
  }
};

export const createContact = async (req, res, next) => {
  const request = req.body;

  const newContact = await contactsService.addContact(request);
  newContact === null ? next(HttpError(500)) : res.status(201).send(newContact);
};

export const updateContact = async (req, res, next) => {
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
    req.user.id,
    newContactData
  );

  switch (editedContact) {
    case null:
      next(HttpError(404));
      break;
    case "invalidID":
      next(HttpError(400));
      break;
    default:
      res.send(editedContact);
      break;
  }
};

export const setFavorite = async (req, res, next) => {
  const editedContact = await contactsService.setFavorite(
    req.params.id,
    req.user.id,
    req.body.favorite
  );
  switch (editedContact) {
    case null:
      next(HttpError(404));
      break;
    case "invalidID":
      next(HttpError(400));
      break;
    default:
      res.send(editedContact);
      break;
  }
};
