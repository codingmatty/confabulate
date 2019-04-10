const mongoose = require('mongoose');

module.exports = class DataModel {
  constructor({ modelName, schema }) {
    this.model = mongoose.model(modelName, schema);
  }

  async create(ownerId, data) {
    const createdDocument = await this.model.create({ ...data, ownerId });
    return createdDocument;
  }

  async get(ownerId, id) {
    const document = await this.model.findOne({ _id: id, ownerId });
    return document ? document : {};
  }

  async getAll(ownerId, query) {
    return this.query({ ...query, ownerId });
  }

  async query(query = {}) {
    const documents = await this.model.find(query);
    return documents;
  }

  async update(ownerId, id, data) {
    const updatedDocument = await this.model.findOneAndUpdate(
      { _id: id, ownerId },
      data,
      { new: true }
    );
    return updatedDocument ? updatedDocument : {};
  }

  async delete(ownerId, id) {
    const removedDocument = await this.model.findOneAndRemove({
      _id: id,
      ownerId
    });
    return removedDocument ? removedDocument : null;
  }
};
