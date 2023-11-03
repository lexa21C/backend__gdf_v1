const Formation_programs = require("../models/Formation_programs.js")
const estructuraApi = require('../helpers/responseApi.js');
const Competence = require('../models/Competence.js')
const User = require('../models/Users.js')
var Level=require("../models/Program_levels.js")
exports.allFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();

    try {
        // Utiliza una proyección para seleccionar solo los campos que deseas (id y program_name)
        const results = await Formation_programs.find().populate('competence');

        if (results.length > 0) {
            apiEstructure.setResult(results);
        } else {
            apiEstructure.setStatus(404, "No existen programas de formación");
        }
    } catch (error) {
        console.log(error);
        apiEstructure.setStatus(500, "Error en el servidor");
    }

    res.json(apiEstructure.toResponse());
}


exports.allFormationProgramIdUser = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let { user_id } = req.params
    const user = await User.findById({ _id: user_id }).populate({
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

    })
    const level=await Level.find({})
    const formation_program = user?.formation_program.map((e) => {
        return e
    })

    if (formation_program?.length > 0) {
        apiEstructure.setResult(formation_program)
    } else {
        apiEstructure.setStatus(404, "info", "No hay usuarios con el Programas de formacion")
    }

    res.json(apiEstructure.toResponse());
}

exports.createFormstionPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    console.log(req.body)
    let {program_name, number_quarters,total_duration, Program_version,program_start_date,program_end_date, competence, program_level,thematic_line } = req.body;
    let _id  = parseInt(number_quarters)
    // const r = await Competence.findOne({ labor_competition: competence });
    // competence = r

    // const u = await User.findOne({ email: user });
    // user = u

    const newFormation_programs = await Formation_programs.create({
       _id, program_name, number_quarters,total_duration, Program_version,program_start_date,program_end_date, competence ,program_level,thematic_line
    })
        .then((succces) => {
            console.log(succces)
            apiEstructure.setResult(succces)
        })
        .catch((error) => {
            console.log(error)
            apiEstructure.setStatus(
                error.parent || error,
                "Error al crear un programa de formacion",
                error.parent || error
            );
        });
        // apiEstructure.setResult(newFormation_programs, "Programa de formacion creado Exitosamente");

    res.json(apiEstructure.toResponse());
}

exports.formation_programsbyid = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;


    const formation_programs = await Formation_programs.find({ _id: id_formation_programs });
    console.log(formation_programs)
    if (formation_programs.length > 0) {
        apiEstructure.setResult(formation_programs)
    } else {
        console.log('error')
        apiEstructure.setStatus(404, "info", "No existe el programa de formacion")
    }
    res.json(apiEstructure.toResponse())
}

exports.updateFormationPrograms = async (req, res) => {
    let apiEstructure = new estructuraApi();
    let id_formation_programs = req.params.id_formation_programs;
    try {

        let {_id, program_name, number_quarters,total_duration, Program_version,Fecha_inicio_programa,program_end_date, competence, program_level,thematic_line } = req.body;
        // const formation_programs = await Formation_programs.findById({ _id: id_formation_programs });
    
        const formation_program_update = await Formation_programs.findByIdAndUpdate(
            {_id:id_formation_programs},  
            {_id, program_name, number_quarters,total_duration, Program_version,Fecha_inicio_programa,Fecha_fin_programa, competence, program_level,thematic_line },
            {new: true}
            );
        if (formation_program_update) {
            apiEstructure.setResult(formation_program_update,"Actualizado")
        } else {
            apiEstructure.setStatus(404, "Info", "No existe el programa de formacion")
        }
    }catch{

    }

    res.json(apiEstructure.toResponse());
}

exports.deleteFormationPrograms = async (req, res) => {
   
    let apiEstructure = new estructuraApi();
    try {

        let id_formation_programs = req.params.id_formation_programs;
    
        const formation_programs = await Formation_programs.findById({ _id: id_formation_programs })
        if (formation_programs) {
            apiEstructure.setResult("Eliminado")
        } else {
            apiEstructure.setStatus(404, "info", "NO existe el usuario")
        }
    
        await Formation_programs.findByIdAndDelete({ _id: id_formation_programs });
    } catch (error){

    }
    res.json(apiEstructure.toResponse());

}

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
    let apiStructure = new estructuraApi();
    let { id_formation_programs } = req.params;

    const thematics = await Formation_programs.findById({ _id: id_formation_programs })
    apiStructure.setResult(thematics)
    console.log(thematics)
    // if (thematics.length > 0) {
    // } else {
    //     apiStructure.setStatus(404, "NOt found")
    // }

    res.json(apiStructure.toResponse())
}