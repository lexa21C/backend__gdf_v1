var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Competence = Schema(
  {
    _id:String,
    labor_competition: String,
    labor_competence_code: String,
    competition_name: String,
    labor_competition_version: String,
    maximun_duration: String,
    quarter: Number,
    program: [
      {
        ref: "Formation_programs",
        type: mongoose.Schema.Types.Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Competences", Competence);
