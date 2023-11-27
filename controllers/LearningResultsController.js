// Importar modelos y módulos necesarios
const Learning_results = require("../models/Learning_results.js")
const ApiStructure = require('../helpers/responseApi.js')
const Competences = require('../models/Competence.js')


// Controlador para listar todos los resultados de aprendizaje asociados a una competencia por su ID
exports.listLearningResults = async (req, res) => {
    const apiStructure = new ApiStructure();

    try {
        const { competence_id } = req.params;

        // Buscar resultados de aprendizaje relacionados con la competencia especificada
        const results = await Learning_results.find({ competence: competence_id });

        if (results.length > 0) {
            apiStructure.setResult(results, "Resultados de aprendizaje obtenidos correctamente");
        } else {
            apiStructure.setStatus(404, 'Info', 'No hay resultados de aprendizaje asociados a la competencia especificada');
        }
    } catch (error) {
        
        apiStructure.setStatus(500, 'Error', 'Ocurrió un error  al procesar la solicitud.');
    }

    return res.json(apiStructure.toResponse());
};

// Controlador para listar un resultado de aprendizaje por su ID
exports.resultById = async (req, res) => {
    const apiStructure = new ApiStructure();
    try {
        const { id_Result } = req.params;

        // Buscar un resultado de aprendizaje por su ID
        const result = await Learning_results.findById(id_Result);

        if (result) {
            apiStructure.setResult(result);
        } else {
            apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje con el ID proporcionado");
        }
    } catch (error) {
        
        apiStructure.setStatus(500, "Error", "Ocurrió un error al procesar la solicitud.");
    }

    res.json(apiStructure.toResponse());
};


// Controlador para crear un nuevo resultado de aprendizaje
exports.CreateResults = async (req, res) => {
    let apiStructure = new ApiStructure();
    let { learning_result, competence, _id } = req.body;
    console.log('code',_id)
    // Verificar si el código ya existe en la base de datos
    const existingResult = await Learning_results.findOne({ _id: _id });

    if (existingResult) {
        apiStructure.setStatus("Failed", 400, `El Código  Ya Existe`);
    } else {
        // Crear un nuevo resultado de aprendizaje
        await Learning_results.create({
            _id: _id, learning_result, competence
        }).then(async (success) => {
            apiStructure.setResult(success, "Resultado de aprendizaje creado");
        }).catch((err) => {
            apiStructure.setStatus(
                "No se pudo registrar el resultado de aprendizaje",
                500,
                err.message
            );
        })
    }
    res.json(apiStructure.toResponse());
}

// Controlador para actualizar un resultado de aprendizaje por su código
exports.UpdateResults = async(req, res) => {
    let apiStructure = new ApiStructure();
    let code = req.params.code;
    let reqResult = req.body;
    // Buscar un resultado de aprendizaje por su código
    const result = await Learning_results.findById({ _id: code })
  
    if(result){
        apiStructure.setResult("Resultado de Aprendizaje Actualizado Correctamente")
    }else {
        apiStructure.setStatus(404, "Info", "No existe el Resultado de Aprendizaje")
    }

    // Actualizar los datos del resultado de aprendizaje
    await Learning_results.findByIdAndUpdate(code, {   
         learning_result: reqResult.learning_result,
         competence: reqResult.competence
    }, {new: true}).then(async (success) => {
        apiStructure.setResult(success, "Resultado de Aprendizaje Actualizado con Éxito")
    }).catch((err) => {
    //     apiStructure.setStatus(
    //         "Failed",
    //         400,
    //         err._message,
    //     )
    //     return res.status(400).json(apiStructure.toResponse());
    })

    // const newData = await Learning_results.findByIdAndUpdate(code,{
    //     learning_result: reqResult.learning_result,
    //     competence: reqResult.competence
    // })
    // await newData.save()
    // apiStructure.setStatus("success", 200,  "Resultado de Aprendizaje Actualizado con Éxito");

    res.json(apiStructure.toResponse())
}

exports.deleteResults = async (req, res)=>{
    let apiStructure = new ApiStructure();
    try {
        const id_result = req.params.code;
        const learning_result =  await Learning_results.findByIdAndDelete({_id: id_result});
        if(learning_result){
            apiStructure.setResult('Eliminado')
        } else {
            apiStructure.setResult(404, "info", "No exite el resultado de aprendizaje ")
        }
    } catch (error){

    }
    res.json(apiStructure.toResponse())
}
