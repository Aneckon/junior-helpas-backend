const { Vacation } = require('../models/models');

class VacationController {
  async createVacation(req, res) {
    const {
      id,
      userId,
      nameCompany,
      descriptionsCompany,
      specialization,
      experience,
      salary,
      briefDescription,
      detailedInformation,
      city,
      country,
      englishLevel,
      phone,
      telegram,
      linkedin,
      webSite,
    } = req.body;
    const vacation = await Vacation.create(
      {
        id,
        webSite,
        userId,
        nameCompany,
        descriptionsCompany,
        specialization,
        experience,
        salary,
        briefDescription,
        detailedInformation,
        city,
        country,
        englishLevel,
        phone,
        telegram,
        linkedin,
      },
      { where: { id } },
    );
    return res.json(vacation);
  }

  async updateVacation(req, res) {
    const {
      id,
      webSite,
      userId,
      nameCompany,
      descriptionsCompany,
      specialization,
      experience,
      salary,
      briefDescription,
      detailedInformation,
      city,
      country,
      englishLevel,
      phone,
      telegram,
      linkedin,
    } = req.body;
    const vacation = await Vacation.update(
      {
        id,
        webSite,
        userId,
        nameCompany,
        descriptionsCompany,
        specialization,
        experience,
        salary,
        briefDescription,
        detailedInformation,
        city,
        country,
        englishLevel,
        phone,
        telegram,
        linkedin,
      },
      { where: { id } },
    );
    return res.json(vacation);
  }

  async getVacation(req, res) {
    const userId = req.params.userId;
    const vacation = await Vacation.findAll({ where: { userId } });
    return res.json(vacation);
  }

  async getVacationEditItem(req, res) {
    const id = req.params.id;
    const vacation = await Vacation.findOne({ where: { id } });
    return res.json(vacation);
  }

  async getVacationItem(req, res) {
    const id = req.params.id;
    const vacation = await Vacation.findOne({ where: { id } });
    return res.json(vacation);
  }

  async getAllVacation(req, res) {
    const vacation = await Vacation.findAll();
    return res.json(vacation);
  }

  async delete(req, res) {
    const id = req.params.id;
    const vacation = await Vacation.destroy({ where: { id } });
    return res.json(vacation);
  }
}

module.exports = new VacationController();
