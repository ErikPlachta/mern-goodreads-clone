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
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        
        login: async ({ body }, res) => {
            const user = await User
                .findOne({
                    $or: [
                        { username: body.username },
                        { email: body.email }
                    ]
                });
      
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }
      
            const token = signToken(user);
            return { token, user };
        },
        
        saveBook: async (parent, body, context ) => {
            //-- if logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                //-- finished, exit
                return updatedUser;
            }
            //-- not logged in, exit
            throw new AuthenticationError('ERROR: Auth Required');
        },
        
        //-- Remove association of book from user specific array savedBooks
        deleteBook: async ( parent, { bookId }, context ) => {
            //-- if logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                ).populate('savedBooks');
                //-- finished, exit
                return updatedUser;
            }
            //-- not logged in, exit
            throw new AuthenticationError('ERROR: Auth Required');
        },
    },
};

module.exports = resolvers;
