var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var competence_create = Schema(
  {
  
    labor_competition: String,
    labor_competence_code: Number,
    labor_competition_version: String,
    estimated_duration: String,

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CompetenceCreate", competence_create);
