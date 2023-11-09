const Formation_programs = require('../models/Formation_programs.js')
const ApiStructure = require('../helpers/responseApi.js');
const Records = require('../models/Records.js');

exports.all = async (req, res) => {
    let apiStructure = new ApiStructure();

    try {
        const results = await Records.find({});

        if (results.length > 0) {
            apiStructure.setResult(results);
        } else {
            apiStructure.setStatus(404, "No existe la ficha");
        }
    } catch (error) {
        console.log(error);
        apiStructure.setStatus(500, "Error en el servidor");
    }

    res.json(apiStructure.toResponse());
};


exports.allRecords = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { formationPrograms_Id } = req.params;

        const results = await Records.find({ formation_program: formationPrograms_Id })
            .populate('formation_program')
            .populate({
                path: 'user',
                populate: {
                    path: 'training_center',
                }
            });

        if (results.length > 0) {
            apiStructure.setResult(results, "Registros obtenidos correctamente");
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay registros disponibles');
        }
    } catch (error) {
        console.error("Error al obtener registros:", error);
        apiStructure.setStatus(500, 'Error interno', 'Ocurrió un error interno al obtener registros.');
    }

    res.json(apiStructure.toResponse());
};


exports.recordById = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { idRecord } = req.params;
        const record = await Records.findById(idRecord);

        if (record) {
            apiStructure.setResult(record, "Registro obtenido correctamente");
        } else {
            apiStructure.setStatus(404, "Info", "No existe el Proyecto Formativo");
        }
    } catch (error) {
        console.error("Error al obtener el registro por ID:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al obtener el Proyecto Formativo por ID.");
    }

    res.json(apiStructure.toResponse());
};

exports.createRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body;
    const apiStructure = new ApiStructure();

    try {
        const existingRecord = await Records.findOne({ number_record: number_record });
        if (existingRecord) {
            apiStructure.setStatus("Stop", 400, "Lo sentimos, ya existe una ficha con ese número");
        } else {
            const createdRecord = await Records.create({
                number_record,
                start_date,
                finish_date,
                formation_program,
                user,
            });
            apiStructure.setResult(createdRecord, "Ficha Creada exitosamente");
        }
    } catch (err) {
        apiStructure.setStatus("Failed", 400, err.message);
    }

    res.json(apiStructure.toResponse());
};

exports.updateRecords = async (req, res) => {
    const { number_record, start_date, finish_date, formation_program, user } = req.body;
    const { idRecords } = req.params;
    const apiStructure = new ApiStructure();

    try {
        const updatedRecord = await Records.findByIdAndUpdate(idRecords, {
            number_record, start_date, finish_date, formation_program, user
        }, { new: true });

        if (updatedRecord) {
            apiStructure.setResult(updatedRecord, "Ficha actualizada con éxito");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró la ficha para actualizar");
        }
    } catch (error) {
        console.error("Error al actualizar la ficha:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al actualizar la ficha.");
    }

    res.json(apiStructure.toResponse());
};

exports.deleteRecords = async (req, res) => {
    const { idRecords } = req.params;
    const apiStructure = new ApiStructure();

    try {
        const deletedRecord = await Records.findByIdAndDelete(idRecords);

        if (deletedRecord) {
            apiStructure.setResult(deletedRecord, "Ficha eliminada exitosamente");
        } else {
            apiStructure.setStatus(404, "Info", "No se encontró la ficha para eliminar");
        }
    } catch (error) {
        console.error("Error al eliminar la ficha:", error);
        apiStructure.setStatus(500, "Error interno", "Ocurrió un error interno al eliminar la ficha.");
    }

    res.json(apiStructure.toResponse());
};