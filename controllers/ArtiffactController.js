const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Artiffacts = require('../models/Artiffacts.js')
const Quarters = require('../models/Quarters.js')
const Documents = require('../models/Documents.js')
const Records = require('../models/Records.js')

exports.allArtiffacts = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { recordId, projectId } = req.params;

    try {
        // Obtener todos los trimestres y sus artefactos
        const record = await Records.findById(recordId);

        const quarters = await Quarters.find({ formation_program: record.formation_program }).lean();

        const array = [];
        for (let quarter of quarters) {
            const artiffacts = await Artiffacts.find({ quarter: quarter._id }).populate('quarter')
            array.push(...artiffacts)
        }

        // Obtener todos los artefactos y sus documentos
        const arrayD = [];
        for (let i = 0; i < array.length; i++) {
            const documents = await Documents.find({ artiffact: array[i]._id, project: projectId }, { doc: 0 })
                .populate({
                    path: 'artiffact',
                    model: 'Artiffacts',
                    populate: {
                        path: 'quarter',
                        model: 'Quarters',
                        select: 'number'
                    }

                });

            //   const filtered = records.filter(record => record.movementType);.lean();
            // Si el artefacto no tiene documentos, lo agregamos al arrayD
            if (documents.length === 0) {
                arrayD.push(array[i])
            } else {
                arrayD.push(...documents)
            }

        }

        apiStructure.setResult({ artiffacts: arrayD });
        return res.json(apiStructure.toResponse());
    } catch (err) {
        apiStructure.setStatus(
            "Falied",
            400,
            err.message,
        )
        return res.json(apiStructure.toResponse());
    }
}

// listar por ID
exports.artiffactById = async (req, res) => {
    const apiStructure = new ApiStructure();
    const { id_artiffact } = req.params;

    try {
        const artiffact = await Artifacts.findById(id_artiffact).populate('competence').populate('quarter');

        if (artiffact) {
            apiStructure.setResult(artiffact, "Artefacto obtenido correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe el Artefacto");
        }
    } catch (error) {
        console.error("Error al obtener el Artefacto por ID:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener el Artefacto por ID.");
    }

    res.json(apiStructure.toResponse());
};
// Crear artefacto
exports.createArtiffacts = async (req, res) => {
    const { body } = req;
    const apiStructure = new ApiStructure();

    try {
        // Eliminar el campo 'project' si está presente y es un arreglo vacío
        if ('project' in body && body.project.length === 0) {
            delete body.project;
        }

        // Convertir el nombre a minúsculas y capitalizar la primera letra
        const formattedName = body.name.charAt(0).toUpperCase() + body.name.slice(1).toLowerCase();

        // Verificar si el nombre ya existe en la base de datos
        const existingArtifact = await Artiffacts.findOne({ name: formattedName });

        if (existingArtifact) {
            apiStructure.setStatus("Failed", 400, `El nombre del Artefacto '${formattedName}' ya existe`);
        } else {
            // Actualizar el nombre formateado en el objeto antes de crearlo
            body.name = formattedName;

            // Crear el Artefacto
            const createdArtifact = await Artiffacts.create(body);

            apiStructure.setResult(createdArtifact, "Artefacto creado exitosamente");
        }
    } catch (error) {
        console.error("Error al crear el Artefacto:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al crear el Artefacto.");
    }

    res.json(apiStructure.toResponse());
};
exports.updateArtiffacts = async (req, res) => {
    const { name, description } = req.body;
    const { idArtiffacts } = req.params;
    const apiStructure = new ApiStructure();

    try {
        const updatedArtifact = await Artiffacts.findByIdAndUpdate(idArtiffacts, {
            name, description
        }, { new: true });

        if (updatedArtifact) {
            apiStructure.setResult(updatedArtifact, "Artefacto actualizado correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró el Artefacto para actualizar");
        }
    } catch (error) {
        console.error("Error al actualizar el Artefacto:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al actualizar el Artefacto.");
    }

    res.json(apiStructure.toResponse());
};
exports.deleteArtifact = async (req, res) => {
    const { idArtiffacts } = req.params;

    try {
        const deletedArtifact = await Artiffacts.findByIdAndDelete(idArtiffacts);

        if (!deletedArtifact) {
            return res.status(404).json({
                status: "Failed",
                statusCode: 404,
                message: `No se encontró un artefacto con el ID ${idArtiffacts}.`,
            });
        }

        return res.json({
            status: "Success",
            statusCode: 200,
            message: "Artefacto eliminado correctamente.",
            data: deletedArtifact,
        });
    } catch (error) {
        console.error("Error al eliminar el artefacto:", error);
        return res.status(500).json({
            status: "Failed",
            statusCode: 500,
            message: "Ocurrió un error interno al eliminar el artefacto.",
        });
    }
};
exports.artiffactsByQuarter = async (req, res) => {
    let apiStructure = new ApiStructure()
    try {
        const { quarterId } = req.params
        const artiffacts = await Artiffacts.find({ quarter: quarterId }).lean()
        const QuarteByCompetence = await Quarters.findById(quarterId).lean().populate('competence')
        if (!artiffacts) {
            apiStructure.setStatus(
                "info",
                202,
                "no artiffact in List",
            )
            return res.json(apiStructure.toResponse())
        }
        // const competence = QuarteByCompetence.map((item) => {
        //     return item.competence
        // })
        const object = {
            artiffacts: artiffacts,
            competence: QuarteByCompetence.competence
        }
        apiStructure.setResult(object)
        return res.json(apiStructure.toResponse())

    } catch {
        (error) => {
            console.error("Error in artiffactsByQuarter:", error);
            apiStructure.setStatus(500, "error", "Error get in server");
            return res.json(apiStructure.toResponse());
        }
    }
} 

exports.artiffactsByQuarter = async (req, res) => {
    let apiStructure = new ApiStructure()
    try {
        const { quarterId } = req.params
        console.log(quarterId)
        const artiffacts = await Artiffacts.find({ quarter: quarterId }).lean()
        console.log(artiffacts)
        const QuarteByCompetence = await Quarters.findById(quarterId).lean().populate('competence')
        if (!artiffacts) {

            apiStructure.setStatus(
                "info",
                202,
                "no artiffact in List",
            )
            return res.json(apiStructure.toResponse())
        }
        // const competence = QuarteByCompetence.map((item) => {
        //     return item.competence
        // })
        const object = {
            artiffacts: artiffacts,
            competence: QuarteByCompetence.competence
        }
        apiStructure.setResult(object)
        return res.json(apiStructure.toResponse())

    } catch {
        (error) => {
            console.error("Error in artiffactsByQuarter:", error);
            apiStructure.setStatus(500, "error", "Error get in server");
            return res.json(apiStructure.toResponse());
        }
    }
} 