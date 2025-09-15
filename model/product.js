
import { Sequelize, DataTypes } from "sequelize";
import { DatabaseName, DatabaseUsername, DatabasePassword,  DatabaseHost, DB_DIALECT, } from '../config/env.js';

const sequelize = new Sequelize(DatabaseName, DatabaseUsername, DatabasePassword, {
  dialect: DB_DIALECT,
  host: DatabaseHost,
  logging: false,
});

const Product = sequelize.define(
  "Product", 
  {
    PId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Health_Product_Name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Product name cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Product name must be between 2 and 100 characters",
        },
      },
    },
    Product_Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Price must be an integer" },
        min: {
          args: [1],
          msg: "Price must be greater than 0",
        },
      },
    },
    Product_Description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description cannot exceed 500 characters",
        },
      },
    },
    Health_Product_Image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: "Image must be a valid URL" },
      },
    },
    productImagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Public ID cannot be empty if image exists" },
      },
    },
  },
  { timestamps: true }
);

Product.beforeCreate((product) => {
  if (product.Health_Product_Name) {
    product.Health_Product_Name = product.Health_Product_Name.toUpperCase();
  }
});
Product.beforeUpdate((product) => {
  if (product.Health_Product_Name) {
    product.Health_Product_Name = product.Health_Product_Name.toUpperCase();
  }
});

sequelize
  .sync({ alter: true }) // 👈 this will automatically add the new column
  .then(() => {
    console.log("Product table created/updated successfully");
  })
  .catch((error) => {
    console.error("Error creating Product table:", error);
  });

export default Product;
