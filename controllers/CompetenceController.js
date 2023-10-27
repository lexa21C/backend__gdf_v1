const Competence = require('../models/Competence.js')
const Formation_programs = require('../models/Formation_programs.js')
const ApiStructure = require('../helpers/responseApi.js')
const Artiffacts = require('../models/Artiffacts.js')

exports.allCompentences = async (req, res) => {
    let apiStructure = new ApiStructure();

    const competences = await Competence.find({}).populate('program')
    if (competences.length > 0) {
        apiStructure.setResult(competences)
    } else {
        apiStructure.setStatus(404, 'No hay competencias')
    }

    res.json(apiStructure.toResponse())
}

exports.competenceId = async (req, res) => {
    let apiEstructure = new ApiStructure();
    let id_competences = req.params.id_competence;

    const competence = await Competence.find({ _id: id_competences });

    if (competence) {
        apiEstructure.setResult(competence)
    } else {
        apiEstructure.setStatus(404, "info", "No existe la competencia")
    }
    res.json(apiEstructure.toResponse())
}


exports.createCompetences = async (req, res) => {
    let apiStructure = new ApiStructure();
    let { _id, labor_competition,labor_competence_code,competition_name,labor_competition_versio,maximun_duration, quarter, program} = req.body;

    // let arrayF = []
    // for (let i = 0; i < formation_programs.length; i++) {
    //     const foundprogram= await Formation_programs.findOne({ program_name: formation_programs[i] })

    //     arrayF.push(foundformation_programs._id)

    // }
    // program= arrayF
    // const foundprogram= await Formation_programs.findOne({name : "ADSO"})
    // res.json(foundformation_programs._id)

    await Competence.create({ _id, labor_competition,labor_competence_code,competition_name,labor_competition_versio,maximun_duration, quarter, program})
        .then(async (success) => {
            apiStructure.setResult(success)

        })
        .catch((err) => {
            apiStructure.setStatus(
                "NO se pudo registrar la competencia",
                500,
                err._message

            );
        });
    res.json(apiStructure.toResponse())
}

exports.compoetenceByFormation = async (req, res) => {

    let apiStructure = new ApiStructure();
    let { formation_program_id } = req.params
    let formationProgram = await Formation_programs.findById({ _id: formation_program_id });
    
    if (formationProgram != null) {
        const FormArtifacts = []

        let numberQuarter = formationProgram.total_duration / 3;
        const quaterProgram = []
        for (let i = 1; i <= numberQuarter; i++) {
            quaterProgram.push(i)
        }

        let competence = await Competence.find({
            program: formation_program_id,
        });
        const competenceArray = competence.map((e) => { return e })


        FormArtifacts.push({
            quaters: quaterProgram,
            competences: competenceArray
        })

        apiStructure.setResult(FormArtifacts)

    } else {
        apiStructure.setStatus(
            404,
            "info",
            "No se encuantra el progrma de formacion"

        );
    }
    res.json(apiStructure.toResponse())


}

// exports.updateCompetences = async (req, res) => {
//     let apiEstructure = new ApiStructure();
//     let id_competence = req.params.id_competence;
//     let competenceUpdate = req.body;

//     const competence = await Competence.findById({_id: id_competence});
//     if (competence){
//         apiEstructure.setResult('Actualizado')
//     }else {
//         apiEstructure.setResult(404, "info","No exite la competencia")
//     }
//     await  Competence.findByIdAndUpdate(id_competence, {})
// }