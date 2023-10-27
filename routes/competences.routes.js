const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const CompetenceController = require('../controllers/CompetenceController.js')

//* Competencias
router.get('/competences', CompetenceController.allCompentences)
router.get('/competences/:id_competence', CompetenceController.allCompentence)
router.post('/competences', CompetenceController.createCompetences)
router.put('/competences/:id_competence', CompetenceController.updateCompetences)
router.delete('/competences/:id_competence', CompetenceController.deleteCompetence)

router.get('/competences/show/:id_competence', CompetenceController.competenceId)
router.get('/competences/:formation_program_id', CompetenceController.compoetenceByFormation)

module.exports = router;