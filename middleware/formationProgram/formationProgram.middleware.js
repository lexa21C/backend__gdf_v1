const { check, validationResult} = require('express-validator');
const Competence = require("../../models/Competence.js");
const ApiStruture = require("../../helpers/responseApi.js");


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