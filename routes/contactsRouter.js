import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  setFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  updateContactFavorite,
  updateContactSchema,
} from "../schemas/contactsValidationSchemas.js";

const editValidation = validateBody(updateContactSchema);
const editFavoriteValidation = validateBody(updateContactFavorite);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", editValidation, updateContact);

contactsRouter.patch("/:id/favorite", editFavoriteValidation, setFavorite);

export default contactsRouter;
