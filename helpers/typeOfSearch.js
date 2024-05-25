import contactsModel from "../schemas/contactsMongooseSchema.js";

const typeOfSearch = (queryParams, ownerId) => {
  if (Object.keys(queryParams).length === 0) {
    return contactsModel.find({ owner: ownerId });
  } else if (
    Object.keys(queryParams).length === 2 &&
    Object.keys(queryParams)[0] === "page" &&
    Object.keys(queryParams)[1] === "limit"
  ) {
    return contactsModel
      .find({ owner: ownerId })
      .skip(queryParams.limit * (queryParams.page - 1))
      .limit(queryParams.limit);
  } else if (
    Object.keys(queryParams).length === 1 &&
    Object.keys(queryParams)[0] === "favorite"
  ) {
    return contactsModel.find({
      owner: ownerId,
      favorite: queryParams.favorite,
    });
  }
};
export default typeOfSearch;
