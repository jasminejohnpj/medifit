import { Sequelize, DataTypes } from "sequelize";
import { DatabaseName, DatabaseUsername, DatabasePassword,  DatabaseHost, DB_DIALECT, } from '../config/env.js';

const sequelize = new Sequelize(DatabaseName, DatabaseUsername, DatabasePassword, {
    dialect: DB_DIALECT,
    host: DatabaseHost,
    logging: false
});

const Medicine = sequelize.define(
    "Medicine",
    {
        MId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Medicine_Name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Medicine name cannot be empty" },
                len: {
                    args: [2, 100],
                    msg: "Medicine name must be between 2 and 100 characters",
                },
            },
        },
        Medicine_Price: {
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
        Medicine_Description: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: "Description cannot exceed 500 characters",
                },
            },
        },
        Medicine_Image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: { msg: "Image must be a valid URL" },
            },
        },
         MedicineImagePublicId: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
            notEmpty: { msg: "Public ID cannot be empty if image exists" },
      },
    },
    },
    { timestamps: true }
);


Medicine.beforeCreate((medicine) => {
  if (medicine.Medicine_Name) {
    medicine.Medicine_Name = medicine.Medicine_Name.toUpperCase();
  }
});

Medicine.beforeUpdate((medicine) => {
  if (medicine.Medicine_Name) {
    medicine.Medicine_Name = medicine.Medicine_Name.toUpperCase();
  }
});


sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Medicine table created/updated successfully");
    })
    .catch((error) => {
        console.error(" Error creating Product table:", error);
    });

export default Medicine;

