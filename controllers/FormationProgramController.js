const Formation_programs = require("../models/Formation_programs.js")
const estructuraApi = require('../helpers/responseApi.js');
const Competence = require('../models/Competence.js')
const User = require('../models/Users.js')
var Level=require("../models/Program_levels.js")

exports.allFormationPrograms = async (req, res) => {
    const apiStructure = new estructuraApi();

    try {
        // Utiliza una proyección para seleccionar solo los campos que deseas (id y program_name)
        const results = await Formation_programs.find().populate('competence');

        if (results.length > 0) {
            apiStructure.setResult(results, "Programas de formación obtenidos correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existen programas de formación");
        }
    } catch (error) {
        console.error("Error en allFormationPrograms:", error);
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};



exports.allFormationProgramIdUser = async (req, res) => {
    const apiStructure = new estructuraApi();
    const { user_id } = req.params;

    try {
        const user = await User.findById(user_id).populate({
            path: 'formation_program',
            model: 'Formation_programs',
            populate: [
                {
                    path: 'competence',
                    model: 'Competences',
                    select: '_id labor_competence_code labor_competition labor_competition_version',
                },
                {
                    path: 'program_level',
                    model: 'Program_levels',
                }
            ],
        });

        const formationPrograms = user?.formation_program;

        if (formationPrograms?.length > 0) {
            apiStructure.setResult(formationPrograms);
        } else {
            apiStructure.setStatus(404, "Info", "No hay usuarios con programas de formación asociados");
        }
    } catch (error) {
        
        apiStructure.setStatus(500, "Error ", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};


// exports.createFormstionPrograms = async (req, res) => {
//     let apiEstructure = new estructuraApi();
//     console.log(req.body)
//     let {program_name, program_code,total_duration, Program_version,program_start_date,program_end_date, competence, program_level,thematic_line } = req.body;

//     // const r = await Competence.findOne({ labor_competition: competence });
//     // competence = r

//     // const u = await User.findOne({ email: user });
//     // user = u

//     const newFormation_programs = await Formation_programs.create({
//         program_name, program_code,total_duration, Program_version,program_start_date,program_end_date, competence ,program_level,thematic_line
//     })
//         .then((succces) => {
//             console.log(succces)
//             apiEstructure.setResult(succces)
//         })
//         .catch((error) => {
//             console.log(error)
//             apiEstructure.setStatus(
//                 error.parent || error,
//                 "Error al crear un programa de formacion",
//                 error.parent || error
//             );
//         });
//         // apiEstructure.setResult(newFormation_programs, "Programa de formacion creado Exitosamente");

//     res.json(apiEstructure.toResponse());
// }
exports.createFormstionPrograms = async (req, res) => {
    const apiStructure = new estructuraApi();
    try {
        const {
            program_name,
            program_code,
            total_duration,
            Program_version,
            program_start_date,
            program_end_date,
            competence,
            program_level,
            thematic_line
        } = req.body;

        // Puedes realizar la validación de la existencia de la competencia y el nivel del programa antes de crearlo
        // const existingCompetence = await Competence.findOne({ labor_competition: competence });
        // const existingProgramLevel = await ProgramLevel.findOne({ /*... */ });

        // if (!existingCompetence || !existingProgramLevel) {
        //     apiStructure.setStatus(400, "Info", "La competencia o el nivel del programa no existen");
        //     return res.json(apiStructure.toResponse());
        // }

        const newFormationProgram = await Formation_programs.create({
            program_name,
            program_code,
            total_duration,
            Program_version,
            program_start_date,
            program_end_date,
            competence,
            program_level,
            thematic_line
        });

        apiStructure.setResult(newFormationProgram, "Programa de formación creado exitosamente");
    } catch (error) {
        console.error("Error en createFormationPrograms:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};



exports.formationProgramsById = async (req, res) => {
    const apiStructure = new estructuraApi();
    const id_formation_programs = req.params.id_formation_programs;

    try {
        const formationPrograms = await Formation_programs.findById(id_formation_programs);

        if (formationPrograms) {
            apiStructure.setResult(formationPrograms);
        } else {
            apiStructure.setStatus(404, "Info", "No existe el programa de formación");
        }
    } catch (error) {
        console.error("Error en formationProgramsById:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.");
    }

    return res.json(apiStructure.toResponse());
};


exports.updateFormationPrograms = async (req, res) => {
    const apiStructure = new estructuraApi();
    const id_formation_programs = req.params.id_formation_programs;

    try {
        const {
            _id,
            program_name,
            program_code,
            total_duration,
            Program_version,
            program_start_date,
            program_end_date,
            competence,
            program_level,
            thematic_line
        } = req.body;

        const updatedFormationProgram = await Formation_programs.findByIdAndUpdate(
            id_formation_programs,
            {
                _id,
                program_name,
                program_code,
                total_duration,
                Program_version,
                program_start_date,
                program_end_date,
                competence,
                program_level,
                thematic_line
            },
            { new: true }
        );

        if (updatedFormationProgram) {
            apiStructure.setResult(updatedFormationProgram, "Programa de formación actualizado correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe el programa de formación");
        }
    } catch (error) {
        console.error("Error al actualizar el programa de formación:", error);
        apiStructure.setStatus(500, "Error ", "Ocurrió un error  al actualizar el programa de formación.");
    }

    return res.json(apiStructure.toResponse());
};


exports.deleteFormationPrograms = async (req, res) => {
    const apiStructure = new estructuraApi();
    try {
        const idFormationPrograms = req.params.id_formation_programs;

        const formationPrograms = await Formation_programs.findById(idFormationPrograms);
        if (formationPrograms) {
            apiStructure.setResult("Programa de formación eliminado correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe el programa de formación");
        }

        await Formation_programs.findByIdAndDelete(idFormationPrograms);
    } catch (error) {
        console.error("Error al eliminar el programa de formación:", error);
        apiStructure.setStatus(500, "Error ", "Ocurrió un error  al eliminar el programa de formación.");
    }

    return res.json(apiStructure.toResponse());
};


// exports.formationsProgrmasUser=async(req,res)=>{
//     let apiEstructure = new estructuraApi();
//     let {programs}=req.params
//     const formation_programs = await Formation_programs.find({_id: programs})
//     if(formation_programs.length >0){
//         apiEstructure.setResult(formation_programs)
//     }else{
//         apiEstructure.setStatus(404, "info", "No hay Programas de formacion")
//     }

//     res.json(apiEstructure.toResponse());
// }

// exports.myformationprograms = async (req, res) => {
//     let apiStructure = new estructuraApi();
//     let { idformation_programs } = req.params;

//     const thematics = await Formation_programs.find({ thematic_line: idformation_programs })
//     if (thematics.length > 0) {
//         apiStructure.setResult(thematics)
//     } else {
//         apiStructure.setStatus(404, "NOt found")
//     }

//     res.json(apiStructure.toResponse())
// }

exports.allFormationProgram = async (req, res) => {
    const apiStructure = new estructuraApi();
    const { id_formation_programs } = req.params;

    try {
        const formationProgram = await Formation_programs.findById(id_formation_programs);

        if (formationProgram) {
            apiStructure.setResult(formationProgram);
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró el programa de formación");
        }
    } catch (error) {
        console.error("Error al obtener el programa de formación:", error);
        apiStructure.setStatus(500, "Error ", "Ocurrió un error  al procesar la solicitud.");
    }

    return  res.json(apiStructure.toResponse());
};
