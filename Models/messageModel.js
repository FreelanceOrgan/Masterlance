const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization')

const messagesSchema = mongoose.Schema(
    {
        _id: {
          type: mongoose.SchemaTypes.Number
        },
        fullName: {
          type: String,
          trim: true,
          required: [true, 'Full name is required'],
          minlength: [3, 'Too short full name, must be 3 characters at least'],
          maxlength: [32, 'Too long full name, must be 32 characters at most'],
        },
        email: {
          type: String,
          trim: true,
          required: [true, 'Email is required'],
          match: [/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid email"],
        },
        message: {
          type: String,
          trim: true,
          required: [true, 'Message is required'],
        },
        reply: {
          type: String,
          trim: true,
        },
        repliedBy: {
          type: Number,
          ref: 'users'
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
)

messagesSchema.plugin(AutoIncrement.plugin, {model: 'messages', startAt: 1,});

messagesSchema.pre(/find/, function(next) {
  this.populate({
    path: 'repliedBy',
    select: 'fullName email mobilePhone whatsAPP'
  })
  next();
});

messagesSchema.pre('save', async function(next) {
  await this.populate({
    path: 'repliedBy',
    select: 'fullName email mobilePhone whatsAPP'
  })
  next();
});

const messageModel = mongoose.model("messages", messagesSchema);

module.exports = messageModel;