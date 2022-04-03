const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //-- request thine-self if you  must!
        me: async (parent, args, context) => {
            if(context.user){
                const foundUser = await User.findOne({
                    $or: [
                        { _id: user ? user._id : params.id },
                        { username: params.username }
                    ],
                })
                    .select('__v -password') //-- don't return password
                    .populate('savedBooks'); //-- populate save book array
                //-- return the results
                return foundUser;
            }
            throw new AuthenticationError('ERROR: Auth Required');
        },
        //-- get a single user by either their id or their username
        getSingleUser: async (parent, { _id, username }) => {
            
            return User.findOne({ username })
                .select('-__v -password') //-- exclude passwords
                .populate('savedBooks');  //-- populate save book array
        },
    },

    Mutation: {
        //-- takes username, email, and password to create ne user
        createUser: async (parent, params) => {
            const user = await User.create(params);
            const token = signToken(user);
            
            return { token, user };
        },
        //-- user can login with username or email and password
        login: async (parent, params, res) => {
            const user = await User
                .findOne({
                    $or: [
                        { username: params.username },
                        { email: params.email }
                    ]
                });
      
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }
      
            const correctPw = await user.isCorrectPassword(params.password);
      
            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }
      
            const token = signToken(user);
            return { token, user };
        },
        
        saveBook: async (parent, params, context ) => {
            //-- if logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: params } },
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
