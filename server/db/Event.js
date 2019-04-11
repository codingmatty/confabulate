const { Schema } = require('mongoose');
const DataModel = require('./DataModel');

const EventSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    date: Date,
    type: String,
    note: String,
    involvedContacts: [Schema.Types.ObjectId]
  },
  { timestamps: true }
);

class EventModel extends DataModel {
  constructor() {
    super({ modelName: 'Event', schema: EventSchema });
  }
}

module.exports = EventModel;
