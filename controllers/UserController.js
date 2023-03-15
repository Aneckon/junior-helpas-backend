const { User, Token, Resume } = require('../models/models');
const bcrypt = require('bcrypt');
const path = require('path');
const uuid = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const TokenService = require('../services/TokenService');

class UserController {
  async register(req, res) {
    const { email, nickname, password } = req.body;
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.send(401, {
        message: 'Акаунт вже інсує з таким емайлом',
      });
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ email, nickname, password: hashPassword });
    const refreshToken = TokenService.generateJWT(user.id, user.email);
    const token = await Token.create({ refreshToken, userId: user.id });
    res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });
    return res.json(token);
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send(401, {
        user: 'Такого акаунта не існує',
      });
    }
    let comparePassword = await bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.send(401, {
        password: 'Неправельний пароль',
      });
    }
    const refreshToken = TokenService.generateJWT(user.id, user.email);
    const token = await Token.create({ refreshToken, userId: user.id });
    res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(token);
  }

  async logout(req, res) {
    const { refreshToken } = req.body;
    const token = TokenService.removeJWT(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  async addInfo(req, res) {
    const {
      id,
      name,
      lastname,
      position,
      education,
      skills,
      city,
      aboutme,
      telegram,
      linkedin,
      github,
      portfolio,
      phone,
      salary,
    } = req.body;

    let imageName;

    if (req.files !== null && req.files !== undefined) {
      const { image } = req.files;
      imageName = uuid.v4() + '.jpg';
      image.mv(path.resolve(__dirname, '..', 'static', imageName));
    }

    const user = await User.update(
      {
        name,
        lastname,
        position,
        education,
        skills,
        city,
        aboutme,
        telegram,
        linkedin,
        github,
        phone,
        portfolio,
        salary,
        image: imageName,
      },
      { where: { id } },
    );
    return res.json(user);
  }

  async createresume(req, res) {
    const {
      userId,
      name,
      lastname,
      position,
      phone,
      education,
      skills,
      city,
      experience,
      aboutme,
      telegram,
      linkedin,
      github,
      portfolio,
      salary,
      email,
      image,
    } = req.body;

    const resume = await Resume.create(
      {
        userId,
        name,
        lastname,
        position,
        phone,
        education,
        skills,
        city,
        experience,
        aboutme,
        telegram,
        linkedin,
        github,
        portfolio,
        salary,
        email,
        image,
      },
      { where: { userId } },
    );

    const doc = new PDFDocument();

    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res.attachment('resume.pdf'));

    doc.font('./fonts/Finlandica-Medium.ttf');

    doc.pipe(fs.createWriteStream('resume.pdf'));

    doc.rect(0, 0, 1000, 40).fill('#F6F6F6');

    doc.image('./images/logo.png', 500, 5, {
      width: 30,
      height: 30,
      align: 'center',
      valign: 'center',
    });

    doc.image(image !== undefined ? `./static/${image}` : './images/logo.png', 80, 80, {
      width: 100,
      height: 100,
      align: 'center',
      valign: 'center',
    });

    doc.fillColor('#1E1E1E').fontSize(20).text(`${name} ${lastname}`, 200, 80);
    doc.fillColor('#1E1E1E').fontSize(10).text('Контакти:', 200, 115);
    doc.fillColor('#1E1E1E').fontSize(10).text(`${phone}`, 200, 135);
    doc.fillColor('#1E1E1E').fontSize(10).text(`${email}`, 200, 145);

    doc.fillColor('#1E1E1E').fontSize(10).text(`Проживаю: ${city}`, 200, 170);
    doc.fillColor('#1E1E1E').fontSize(10).text(`Освіта: ${education}`, 200, 180);

    doc
      .fillColor('#5F5F5F')
      .fontSize(10)
      .text('Бажана посада та заробітна плата та навички', 80, 220);
    doc.moveDown();

    doc.fillColor('#1E1E1E').fontSize(18).text(`${position}`);
    doc.fillColor('#1E1E1E').fontSize(18).text(`${salary}`, 460, 245);

    doc.fillColor('#5F5F5F').fontSize(10).text('Навички', 80, 285);
    {
      skills &&
        skills.map((item) => {
          doc.fillColor('#1E1E1E').fontSize(12).text(`- ${item.name} `);
        });
    }
    doc.moveDown();
    doc.moveDown();

    doc.fillColor('#5F5F5F').fontSize(10).text('Досвід роботи');
    doc.moveDown();

    {
      experience &&
        experience.map((item) => {
          doc.fillColor('#5F5F5F').fontSize(10).text('- Назва компанії');
          doc.fillColor('#1E1E1E').fontSize(14).text(item.companyName);
          doc.moveDown();
          doc.fillColor('#5F5F5F').fontSize(10).text('- Посада');
          doc.fillColor('#1E1E1E').fontSize(12).text(item.companyPosition);
          doc.moveDown();
          doc.fillColor('#5F5F5F').fontSize(10).text('- Обовязки на роботі');
          doc.fillColor('#1E1E1E').fontSize(12).text(item.companyDescriptions);
          doc.moveDown();
          doc.moveDown();
        });
    }
    doc.moveDown();

    doc.fillColor('#5F5F5F').fontSize(10).text('Про себе');
    doc.moveDown();
    doc.fillColor('#1E1E1E').fontSize(12).text(`${aboutme}`);
    doc.moveDown();
    doc.moveDown();

    doc.fillColor('#5F5F5F').fontSize(10).text('Соц мережі');
    doc.moveDown();
    doc.fillColor('#1E1E1E').fontSize(10).text(`Телеграм: ${telegram}`);
    doc.moveDown();
    doc.fillColor('#1E1E1E').fontSize(10).text(`LinkedIn: ${linkedin}`);
    doc.moveDown();
    doc.fillColor('#1E1E1E').fontSize(10).text(`GitHub: ${github}`);
    doc.moveDown();
    doc.fillColor('#1E1E1E').fontSize(10).text(`Портфоліо: ${portfolio}`);
    doc.moveDown();

    doc.end();
  }

  async getResume(req, res) {
    const userId = req.params.userId;
    const resume = await Resume.findAll({ where: { userId } });
    return res.json(resume);
  }

  async getProfile(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    return res.json(user);
  }
}

module.exports = new UserController();
