const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization')

const ticketSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.Number
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required'],
    },
    reply: {
      type: String,
      trim: true,
    },
    sendBy: {
      type: Number,
      ref: 'users',
      required: [true, 'Any message must be sent by a user']
    },
    repliedBy: {
      type: Number,
      ref: 'users'
    },
    isReplied: {
      type: Boolean,
      default: false
    },
    available: {
      type: Boolean,
      default: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

ticketSchema.plugin(AutoIncrement.plugin, {model: 'tickets', startAt: 1,});

ticketSchema.pre(/find/, function(next) {
  this.populate([
    {
      path: 'repliedBy',
      select: 'firstName lastName email mobilePhone whatsAPP'
    },
    {
      path: 'sendBy',
      select: 'firstName lastName email mobilePhone whatsAPP'
    }
  ])
  next();
});

ticketSchema.pre('save', async function(next) {
  await this.populate({
    path: 'repliedBy',
    select: 'firstName lastName email mobilePhone whatsAPP'
  })
  next();
});

const ticketModel = mongoose.model("tickets", ticketSchema);

module.exports = ticketModel;