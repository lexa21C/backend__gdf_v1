
var Project = require("../models/Projects.js"); 
var estructureApi = require("../helpers/responseApi.js");
var Category = require("../models/Categories.js")
var Record = require("../models/Records.js");
const { body, validationResult } = require('express-validator');

exports.allProjects = async (req, res) => {
    let apiEstructure = new estructureApi();

    try {
        const results = await Project.find().populate('category');;
        console.log(results[3].category)
    

        if (results.length > 0) {
            apiEstructure.setResult(results);
        } else {
            apiEstructure.setStatus(404, "No existe el proyecto");
        }
    } catch (error) {
        console.log(error);
        apiEstructure.setStatus(500, "Error en el servidor");
    }

    res.json(apiEstructure.toResponse());
}


exports.allProjectsByRecords = async (req, res) => {
    let apiEstructure = new estructureApi();

    let {record_id} = req.params;  
    const results = await Project.find({ record: record_id })
    .populate({
        path: 'record',
        populate: {
            path: 'user',
            model: 'Users',
            populate:{
                path: 'formation_program',
                model: 'Formation_programs',
                populate: {
                    path: 'competence',
                    model: 'Competences',
                    select: '_id labor_competence_code labor_competition labor_competition_version'
            }
            }
        }
    })
    .populate('category');

    if (results.length > 0) {
        apiEstructure.setResult(results);
    } else {
        apiEstructure.setStatus(404, "No existe el Proyecto Formativo")
    }
    res.json(apiEstructure.toResponse());
    
};


//Crear Proyecto
exports.createProject = async (req, res) => {
    let apiEstructure = new estructureApi();
    let { name, state, problem_statement, project_justification, general_objective,
        specific_objectives, scope_feasibility, project_summary, technological_research,
        glossary, date_presentation, approval_date, category, record } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        apiEstructure.setStatus(
            "Failed",
            400,
            errors.array()
        );
        res.status(400).json(apiEstructure.toResponse());
    }

    try {
        // Verificar si el nombre ya existe en la base de datos
        const existingProject = await Project.findOne({ name });

        if (existingProject) {
            apiEstructure.setStatus("Failed", 400, `El nombre del proyecto '${name}' Ya Existe`);
        } else {
            let arrayC = [];
            const arrayCategories = Array.isArray(category);
            if (arrayCategories) {
                for (let i = 0; i < category.length; i++) {
                    const foundcategory = await Category.findOne({ name: category[i] });
                    arrayC.push(foundcategory._id);
                }
                category = arrayC;
            } else {
                const f = await Category.findOne({ name: category });
                category = f;
            }

            const r = await Record.findOne({ number_record: record });
            record = r;
                     
            // Crear el nuevo proyecto con los datos proporcionados
            const newProject = await Project.create({
                name, state, problem_statement, project_justification, general_objective,
                specific_objectives, scope_feasibility, project_summary, technological_research,
                glossary, date_presentation, approval_date, category, record
            });

            apiEstructure.setResult(newProject, "Proyecto creado Exitosamente");
        }
    } catch (err) {
        apiEstructure.setStatus("Failed", 500, err.message);
    }
    res.json(apiEstructure.toResponse());
};


exports.projectById = async (req, res) => {
    let apiEstructure = new estructureApi();
    let id_project = req.params.id_project;

    const project = await Project.findById({ _id: id_project }).populate("category");

    if (project) {
        apiEstructure.setResult(project);
    } else {
        apiEstructure.setStatus(404, "No existe el Proyecto Formativo")
    }
    res.json(apiEstructure.toResponse());
}

exports.updateProjects = async (req, res) => {
    let apiEstructure = new estructureApi();
    let id_project = req.params.id_project;
    let reqproject = req.body;

    const project = await Project.findById({ _id: id_project });

    if (project) {
        apiEstructure.setResult("Proyecto Actualizado! Exitosamente ")
    } else {
        apiEstructure.setStatus(404, "Info", "No existe el Proyecto")
    }
    let arrayC = []
    const arrayCategories=Array.isArray(reqproject.category)

    if(arrayCategories ){
        if(reqproject.category[0].name !=null ){
            for (let i = 0; i < reqproject.category.length; i++) {
                const foundcategory = await Category.findOne({ name: reqproject.category[i].name });
                arrayC.push(foundcategory._id)
            }
        }else{
            for (let i = 0; i < reqproject.category.length; i++) {
                const foundcategory = await Category.findOne({ name: reqproject.category[i] });
                arrayC.push(foundcategory._id)
            }
        }

        reqproject.category = arrayC
    }else{
         const f = await Category.findOne({ name: reqproject.category });
         reqproject.category= f._id
    }

    await Project.findByIdAndUpdate(id_project, {
        name: reqproject.name,
        state: reqproject.state,
        problem_statement: reqproject.problem_statement,
        project_justification: reqproject.project_justification,
        general_objective: reqproject.general_objective,
        specific_objectives: reqproject.specific_objectives,
        scope_feasibility: reqproject.scope_feasibility,
        project_summary: reqproject.project_summary,
        technological_research: reqproject.technological_research,
        glossary: reqproject.glossary,
        date_presentation: reqproject.date_presentation,
        approval_date: reqproject.approval_date,
        category: reqproject.category
    }).then(async (success) => {
        apiEstructure.setResult(success, "Proyecto Actualizado! Exitosamente ")
    }).catch((err) => {
        apiStructure.setStatus(
            "Falied",
            400,
            err._message,
        )
    });

    res.json(apiEstructure.toResponse());
}

exports.deleteProject = async (req, res) => {
    let apiEstructure = new estructureApi();
    let id_project = req.params.id_project;
  
    const project = await Project.findById({ _id: id_project });
    if (project) {
        apiEstructure.setResult("Proyecto Eliminado")
    } else {
        apiEstructure.setStatus(404, "Info", "No existe el proyecto")
    }
    await Project.findByIdAndDelete({ _id: id_project });
    res.json(apiEstructure.toResponse());
}

exports.searchProject = async (req, res) => {
    let apiEstructure = new estructureApi();
    const { name, categories } = req.body;

    const category_name = await Category.find({ name: categories })

    const id = []
    if (categories.length > 0) {
        Project.find(
            { name: { $regex: new RegExp(name, 'i') } }
        )
            .populate('category').then((project) => {
                project.forEach((data) => {
                    id.push(data.id)
                })
                SearchCategory(res, id, category_name)    
            })
            .catch((error) => {
                apiEstructure.setStatus(404,"No existe el proyecto", error);
            });
    } else {
        Project.find(
            { name: { $regex: new RegExp(name, 'i') } }
        )
            .populate('category').then((project) => {
                //res.json(project)
                apiEstructure.setResult(project);
            })
            .catch((error) => {
               apiEstructure.setStatus(404, "Info", "No existe el proyecto", error);
            });
            res.json(apiEstructure.toResponse());

    }
    
}

const SearchCategory = async (res, idProject, a) => {
    let apiEstructure = new estructureApi();
    var o = []
    for (let i = 0; i < idProject.length; i++) {
        o.push(
            await Project.find({ _id: idProject, category: a[i] }).populate('category')
        )
        apiEstructure.setResult(o, "Busqueda exitosa");
    }
    //res.json({ o })
    res.json(apiEstructure.toResponse());
}


// Controlador para buscar fichas y proyectos por el ID del programa
exports.getFichasAndProjectsByProgram = async (req, res) => {
  const programId = req.params.formationPrograms_Id;
  console.log(programId)

  try {
    // Busca todas las fichas que tienen el mismo programa
    const fichas = await Record.find({ formation_program: programId });

    // Recopila los IDs de las fichas encontradas
    const fichaIds = fichas.map(ficha => ficha._id);

    // Luego, busca todos los proyectos que están asociados a las fichas encontradas
    const results = await Project.find({ record: { $in: fichaIds } }).populate('category');

    // Devuelve las fichas y proyectos encontrados
    return res.json({  results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en la consulta.' });
  }
};


