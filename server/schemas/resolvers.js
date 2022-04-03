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
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, bookBody ) => {

        },
        deleteBook: async ( parent, {bookId} ) => {

        }
    }
};

module.exports = resolvers;
