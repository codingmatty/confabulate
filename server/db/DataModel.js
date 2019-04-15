const mongoose = require('mongoose');

module.exports = class DataModel {
  constructor({ modelName, schema }) {
    this.model = mongoose.model(modelName, schema);
  }

  async create(ownerId, data) {
    const dataToCreate = Array.isArray(data)
      ? data.map((doc) => ({ ...doc, ownerId }))
      : { ...data, ownerId };
    const createdDocuments = await this.model.create(dataToCreate);
    if (!createdDocuments) {
      return null;
    }
    return Array.isArray(createdDocuments)
      ? createdDocuments.map((doc) => doc.toObject({ getters: true }))
      : createdDocuments.toObject({ getters: true });
  }

  async get(ownerId, id) {
    const document = await this.model.findOne({ _id: id, ownerId });
    return document ? document : {};
  }

  async getAll(ownerId, query) {
    const documents = await this.model.find({ ...query, ownerId });
    return documents.map((doc) => doc.toObject({ getters: true }));
  }

  async update(ownerId, id, data) {
    const updatedDocument = await this.model.findOneAndUpdate(
      { _id: id, ownerId },
      data,
      { new: true }
    );
    return updatedDocument ? updatedDocument.toObject({ getter: true }) : {};
  }

  async delete(ownerId, id) {
    const removedDocument = await this.model.findOneAndRemove({
      _id: id,
      ownerId
    });
    return removedDocument ? removedDocument.toObject({ getter: true }) : null;
  }

  async deleteMany(ownerId, query = {}) {
    const { ok, deletedCount } = await this.model.deleteMany({
      ...query,
      ownerId
    });
    return { ok, deletedCount };
  }
};
