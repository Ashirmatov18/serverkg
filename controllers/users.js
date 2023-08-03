// import { v4 as uuid } from "uuid";

// let users = [];

// export const getUsers = (req, res) => {
//   res.send(users);
// };

// export const createUser = (req, res) => {
//   const user = req.body;

//   users.push({ ...user, id: uuid() });
//   res.send("user added");
// };

// export const getUser = (req, res) => {
//   const singleUser = users.filter((user) => user.id === req.params.id);
//   res.send(singleUser);
// };

// export const deleteUser = (req, res) => {
//   users = users.filter((user) => user.id !== req.params.id);
//   res.send("User deleted");
// };

// export const updateUser = (req, res) => {
//   const user = users.find((user) => user.id === req.params.id);

//   user.name = req.body.name;
//   user.driving = req.body.driving;
//   user.year = req.body.year;
//   user.color = req.body.color;
//   user.image = req.body.image;
//   user.mileage = req.body.mileage;
//   user.price = req.body.price;
//   res.send("user updated");
// };
