import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as optionController from "./controllers/optionController.js";
import {
  loginUser,
  registerUser,
  showLoginForm,
  showRegistrationForm,
} from "./controllers/authenticationController.js";
import {
  deleteTopic,
  postTopic,
  showTopic,
  showTopics,
} from "./controllers/topicController.js";
import { postAnswer } from "./controllers/answerController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics/:id/questions/:qId", questionController.showQuestion);

router.get("/topics/:id", showTopic);
router.get("/topics", showTopics);

router.post(
  "/topics/:tId/questions/:qId/options/:oId/delete",
  optionController.deleteOption
);
router.post(
  "/topics/:tId/questions/:qId/delete",
  questionController.deleteQuestion
);
router.post("/topics/:id/questions:qId/options", optionController.postOption);

router.post("/topics/:id/questions", questionController.postQuestion);
router.post("/topics/:id/delete", deleteTopic);
router.post("/topics", postTopic);

router.post("/quiz/:tId/questions/:qId/options/:oId", postAnswer);
router.get(
  "/quiz/:tId/questions/:qId/correct",
  questionController.showCorrectPage
);
router.get(
  "/quiz/:tId/questions/:qId/incorrect",
  questionController.showIncorrectPage
);
router.get("/quiz/:tId/questions/:qId", questionController.showRandomQuestion);
router.get("/quiz/:tId,", questionController.randomQuestion);
router.get("/quiz", showTopics);

router.get("/api/questions/random", questionController.jsonRandomQuestion);
router.get("/api/questions/answer", questionController.verifyJson);

router.get("/auth/register", showRegistrationForm);
router.post("/auth/register", registerUser);
router.get("/auth/login", showLoginForm);
router.post("/auth/login", loginUser);

export { router };
