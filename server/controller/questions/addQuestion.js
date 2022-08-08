const QuestionsModel = require('../../model/questionsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const addQuestionValidator = validator([]);

const addQuestion = async (req, res) => {
  res.status(200).send(req.body);
};

module.exports = [addQuestionValidator, addQuestion];
