const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    response.statusMessage = "Username or password missing";
    return response.status(400).end();
  } else if (username.length < 3) {
    response.statusMessage = "Username must be at least 3 characters long";
    return response.status(400).end();
  } else if (password.length < 3) {
    response.statusMessage = "Password must be at least 3 characters long";
    return response.status(400).end();
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  response.json(user);
})

module.exports = usersRouter;
