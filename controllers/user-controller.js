const { Users } = require("../models");

const userController = {
  //get all users
  getAllUsers(req, res) {
    Users.find({})
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .populate({
      path: 'friends',
      select: '-__v'
    })
    .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //get one user by id and populate thoughts and friends
  getUserById({ params }, res) {
    Users.findOne({ _id: params.usersId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select("-__v")
      .then((dbUserData) => {
        //if no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create a user
  createUser({ body }, res) {
    Users.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  //update a user by id
  updateUser({ params, body }, res) {
    Users.findOneAndUpdate({ _id: params.usersId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete user
  deleteUser({ params }, res) {
    Users.findOneAndDelete({ _id: params.usersId })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //add friend
  addFriend({ params }, res) {
    Users.findById(params.friendsId)
      .then(({ _id }) => {
        return Users.findOneAndUpdate(
          { _id: params.usersId },
          { $push: { friends: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        res.json(err);
      });
  },
//remove friend
  removeFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.usersId },
      { $pull: { friends: params.friendsId } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
