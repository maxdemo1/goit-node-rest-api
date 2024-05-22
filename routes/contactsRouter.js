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
  createContactSchema,
  updateContactFavorite,
  updateContactSchema,
} from "../schemas/contactsValidationSchema.js";

const editValidation = validateBody(updateContactSchema);
const editFavoriteValidation = validateBody(updateContactFavorite);
const createValidation = validateBody(createContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createValidation, createContact);

contactsRouter.put("/:id", editValidation, updateContact);

contactsRouter.patch("/:id/favorite", editFavoriteValidation, setFavorite);

export default contactsRouter;
