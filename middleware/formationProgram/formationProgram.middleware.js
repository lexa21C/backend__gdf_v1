const { check, validationResult} = require('express-validator');
const Formation_program = require("../../models/Formation_programs.js");
const ApiStruture = require("../../helpers/responseApi.js");
async function validateCodeUniqueness(req, res, next) {
    const { labor_competence_code } = req.body;
    let apiStructure = new ApiStruture();
    const existingCode = await Competence.findOne({ labor_competence_code });
    if (existingCode) {
        apiStructure.setStatus("Failed", 400, `Lo sentimos, el código de competencia laboral '${labor_competence_code}' ya está en uso. Por favor, elija un código único.`);
        return res.json(apiStructure.toResponse());
    }  
    // Si el código de competencia laboral no está duplicado y el perfil existe, pasa al siguiente middleware o al controlador
    next();
    
}


const validateFormationProgram = async (req, res, next) => {
    const apiStructure = new ApiStruture();
    console.log('middleware')
    const formationProgram = [
        check("program_name")
            .trim()
            .notEmpty().withMessage('El campo "nombre del programa" es obligatorio.' )
            .isString().withMessage('El campo "nombre del programa" debe ser una cadena de caracteres.'),
        check("number_quarters")
            .trim()
            .notEmpty().withMessage('El campo  "Código Programa" es obligatorio.')
            .isNumeric().withMessage('El campo "Código Programa" debe ser un valor numérico. '),
        check("total_duration")
            .trim()
            .notEmpty().withMessage('El campo "total duracion" es obligatorio.')
            .isString().withMessage('El campo "Total duracion" debe ser una cadena de caracteres. '),
        check("Program_version")
            .trim()
            .notEmpty().withMessage('EL campo "Programa version" es obligatorio.'),
        check("program_start_date")
            .trim()
            .notEmpty().withMessage('El campo "Fecha incio del programa" es obligatorio'),
        check("program_end_date")
            .trim()
            .notEmpty().withMessage( 'El campo "Fecha final del programa" es obligatorio'),
        check("competence")
            .notEmpty().withMessage('El campo "competencias" es obligatorio.'),
        check("program_level")
            .notEmpty().withMessage('El campo "Nivel programa" es obligatorio.'),
        check("thematic_line")
            .notEmpty().withMessage('El campo "competencias" es obligatorio.')
    ]
    Promise.all(formationProgram.map(validation => validation.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errorMessages = errors.array().map((error) => error.msg);
                apiStructure.setStatus(
                    "Failed",
                    400,
                    errorMessages
                );
                res.json(apiStructure.toResponse());
            }
            next();
        })
}

module.exports = {
    validateFormationProgram
}