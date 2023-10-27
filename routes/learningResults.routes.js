const router = require('express').Router();
const {checkAuth} = require('../middleware/auth.js')
const LearningResultsController=require('../controllers/LearningResultsController.js')

//* Resultados de Aprendizaje

router.get('/learningResults/:competence_id',LearningResultsController.ListLearningResults)
router.post('/learningResults',LearningResultsController.CreateResults)
router.put('/learningResults/:code',LearningResultsController.UpdateResults);
router.delete('/learningResults/:code', LearningResultsController.deleteResults)
router.get('/learningResults/show/:id_Result',LearningResultsController.resultById);

module.exports = router;
