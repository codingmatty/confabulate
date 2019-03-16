const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
exports.typeDefs = gql`
  extend type Query {
    meeting(id: ID!): Meeting
    meetings(query: MeetingQueryData = {}): [Meeting]!
  }
  extend type Mutation {
    addMeeting(data: MeetingInputData): Meeting
    updateMeeting(id: ID!, data: MeetingUpdateData): Meeting
    removeMeeting(id: ID!): Status
  }
  type Meeting {
    id: ID!
    date: Date!
    title: String!
    involvedContacts: [Contact]!
  }
  input MeetingInputData {
    date: Date!
    title: String!
    involvedContacts: [ID!] # contactIds
  }
  input MeetingUpdateData {
    date: Date
    title: String
    involvedContacts: [ID!] # contactIds
  }
  input MeetingQueryData {
    id: ID
    startDate: Date
    endDate: Date
    fuzzyTitle: String
    involvedContact: ContactQueryData
  }
`;

// Provide resolver functions for your schema fields
exports.resolvers = {
  Query: {
    meeting: (obj, { id }, { db }) => db.getMeeting(id),
    // TODO: Implement advanced search with MeetingQueryData fields
    meetings: (obj, { query }, { db }) => db.getMeetings(query)
  },
  Mutation: {
    addMeeting: (obj, { data }, { db }) => {
      const { involvedContacts = [] } = data;
      const filteredContacts = involvedContacts.filter(
        (contactId) => db.getContact(contactId) // Filter out non-existent contact ids
      );
      return db.addMeeting({ ...data, involvedContacts: filteredContacts });
    },
    updateMeeting: (obj, { id, data }, { db }) => db.updateMeeting(id, data),
    removeMeeting: (obj, { id }, { db }) => {
      const removedMeetings = db.removeMeeting(id);
      return {
        status: 'SUCCESS',
        message: `${removedMeetings.length} Meeting(s) Removed`
      };
    }
  },
  Meeting: {
    involvedContacts: (meeting, args, { db }) => {
      return meeting.involvedContacts.map((contactId) =>
        db.getContact(contactId)
      );
    }
  }
};
