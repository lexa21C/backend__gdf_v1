const Quarter = require('../models/Quarters.js')
const ApiStructure = require('../helpers/responseApi.js')
const Formation_programs = require('../models/Formation_programs.js')
const Competence = require('../models/Competence.js')

exports.allQuarters = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { formation_program_id } = req.params;

    try {
        const formationProgram = await Formation_programs.findById(formation_program_id);
        if (!formationProgram) {
            apiStructure.setStatus(
                404,
                "info",
                "No Formation program");
            return res.json(apiStructure.toResponse());
        }

        const quarters = await Quarter.find({ formation_program: formation_program_id }).lean().populate('competence');
        // const competencesQuarters = quarters.map((e) => { return e.competence }).flat()
        // const numberQuarter = Math.ceil(formationProgram.total_duration / 3);
        // const quarterProgram = Array.from({ length: numberQuarter }, (_, i) => i + 1);

        const competences = await Competence.find({
            program: formation_program_id,
            // _id: { $nin: competencesQuarters }
        }).lean();

        const formArtifacts = [{
            quarters: quarters,
            competences: competences
        }];
        apiStructure.setResult(formArtifacts);

        return res.json(apiStructure.toResponse());
    } catch (error) {
        console.error(
            "Error in allQuarters:",
            error);
        apiStructure.setStatus(
            500,
            "error",
            "Error serve"
        );
        return res.json(apiStructure.toResponse());
    }
};

exports.createQuarter = async (req, res) => {
    let {number, competence, formation_program} = req.body;
    const apiStructure = new ApiStructure();

    // Comprobar si el número ya existe en la base de datos
    const existingQuarter = await Quarter.findOne({ number: number });
    
    if (existingQuarter) {
    // Devuelve una respuesta de error si el número no es único
    apiStructure.setStatus("Failed", 400, `El numero del trimestre '${number}' Ya Existe`);

    } else {
    // Crea el Trimestre si el numero es único
    await Quarter.create({
    number,
     competence,
      formation_program
    }).then((success) => {
        apiStructure.setResult(success, 'Trimestre creado con exito')
     }).catch((err) => {
        apiStructure.setStatus(
            "Failed",
            400,
            err.message,
          )
     });
    }
    res.json(apiStructure.toResponse())
};


exports.updataQuarter = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        let { body } = req;
        console.log(body)
        let { quarteId } = req.params
        await Quarter.findByIdAndUpdate(quarteId, body)
        apiStructure.setResult(body);
        return res.json(apiStructure.toResponse());                                           
    } catch {
        console.error("Error in UpdateQuarter:", error);
        apiStructure.setStatus(500, "error", "Error update in server");
        return res.json(apiStructure.toResponse());
    }
}

exports.deleteQuarter = async (req, res) => {
    const quarterId = req.params.id;
  
    // Verificar si quarterId es un ObjectId válido
    if (!quarterId || !isValidObjectId(quarterId)) {
      return res.status(400).json({ error: 'ID de trimestre no válido' });
    }
  
    try {
      const deletedQuarter = await Quarter.findByIdAndRemove(quarterId);
  
      if (!deletedQuarter) {
        return res.status(404).json({ error: 'Trimestre no encontrado' });
      }
  
      return res.status(200).json({ message: 'Trimestre eliminado exitosamente' });
    } catch (error) {
      console.error("Error en DeleteQuarter:", error);
      return res.status(500).json({ error: 'Se produjo un error al eliminar el trimestre' });
    }
  };
  