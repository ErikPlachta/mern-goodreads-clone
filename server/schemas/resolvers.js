const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //-- request thine-self if you  must!
        //TODO:: 04/03/2022 #EP || Add this to be proper
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .select('__v -password') //-- ??
                    .populate('savedBooks');
                //-- return the results
                return userData;
            }
            throw new AuthenticationError('ERROR: Auth Required');
        },
        //-- get a single user by either their id or their username
        getSingleUser: async (parent, { _id, username }) => {
            //TODO:: 04/03/2022 #EP || Add or by ID
            return User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks');
        },
    },

    Mutation: {
    }
};

module.exports = resolvers;
