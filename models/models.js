const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  nickname: { type: DataTypes.STRING, required: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  position: { type: DataTypes.STRING },
  education: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSON },
  experience: { type: DataTypes.JSON },
  city: { type: DataTypes.STRING },
  aboutme: { type: DataTypes.STRING },
  telegram: { type: DataTypes.STRING },
  linkedin: { type: DataTypes.STRING },
  github: { type: DataTypes.STRING },
  portfolio: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
});

const Resume = sequelize.define('resume', {
  userId: { type: DataTypes.INTEGER, required: true },
  name: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  position: { type: DataTypes.STRING },
  education: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSON },
  experience: { type: DataTypes.JSON },
  city: { type: DataTypes.STRING },
  aboutme: { type: DataTypes.STRING },
  telegram: { type: DataTypes.STRING },
  linkedin: { type: DataTypes.STRING },
  github: { type: DataTypes.STRING },
  portfolio: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
});

const Vacation = sequelize.define('vacation', {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.INTEGER, required: true },
  specialization: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  nameCompany: { type: DataTypes.STRING },
  descriptionsCompany: { type: DataTypes.TEXT },
  briefDescription: { type: DataTypes.TEXT },
  detailedInformation: { type: DataTypes.TEXT },
  experience: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  englishLevel: { type: DataTypes.STRING },
  linkedin: { type: DataTypes.STRING },
  telegram: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  webSite: { type: DataTypes.STRING },
});

const Token = sequelize.define('token', {
  refreshToken: { type: DataTypes.STRING, required: true },
});

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
  User,
  Token,
  Vacation,
  Resume,
};
