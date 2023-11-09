const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const CompetenceController = require('../controllers/CompetenceController.js')
const {validateCodeUniqueness, validateCompetence } = require('../middleware/competence/competence.middleware.js')
const {  validateExistenceMiddleware } = require('../middleware/competence/update.middleware.js')
//* Competencias
router.get('/competences', CompetenceController.allCompentences)
router.get('/competences/:id_competence', CompetenceController.allCompentence)
router.post('/competences',validateCodeUniqueness, validateCompetence , CompetenceController.createCompetences)
router.put('/competences/:id_competence',validateExistenceMiddleware, CompetenceController.updateCompetences)
router.delete('/competences/:id_competence', CompetenceController.deleteCompetence)

router.get('/competences/show/:id_competence', CompetenceController.competenceId)
router.get('/competences/:formation_program_id', CompetenceController.compoetenceByFormation)

module.exports = router;