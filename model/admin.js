import { Sequelize, DataTypes } from "sequelize";
import { DatabaseName, DatabaseUsername, DatabasePassword,  DatabaseHost, DB_DIALECT, } from '../config/env.js';

const sequelize = new Sequelize(DatabaseName, DatabaseUsername, DatabasePassword, {
  dialect: DB_DIALECT,
  host: DatabaseHost,
  logging: false,
});

const Admin = sequelize.define(
  "Admin",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    User_Name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
        len: {
          args: [2, 500],
          msg: "Username must be between 2 and 500 characters",
        },
      },
    },

    Password: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, 500],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
  },
  { timestamps: true }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Admin table created/updated successfully");
  })
  .catch((error) => {
    console.error(" Error creating Admin table:", error);
  });

export default Admin;
