import { bcrypt, validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const showRegistrationForm = ({ render }) => {
  render("register.eta");
};

const registerValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getRegisterData = async (request) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  console.log('email', email);

  return {
    email,
    password,
  };
};

const registerUser = async ({ params, request, response, state, render }) => {
  const registerData = await getRegisterData(request);

  const existingUsers = await userService.findUsersWithEmail(
    registerData.email
  );

  if (existingUsers.length > 0) {
    response.redirect("/auth/login");
    return;
  }

  const [passes, errors] = await validasaur.validate(
    registerData,
    registerValidationRules
  );

  if (!passes) {
    console.log(errors);
    registerData.validationErrors = errors;
    render("register.eta", registerData);
  } else {
    const hash = await bcrypt.hash(registerData.password);
    await userService.addUser(email, hash);
    response.redirect("/auth/login");
  }
};

const loginUser = async ({ request, response, state, render }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  const existingUsers = await userService.findUsersWithEmail(email);

  if (existingUsers.length === 0) {
    const loginData = { email, password };
    loginData.error = "Login error! Try again or create a new account!";
    render("login.eta", loginData);
    return;
  }

  // take the first row from the results
  const userObj = existingUsers[0];
  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);

  if (!passwordCorrect) {
    const loginData = { email, password };
    loginData.validationErrors = ["Login Error"];
    render("login.eta", loginData);
    return;
  }

  await state.session.set("user", {
    id: userObj.id,
    email: userObj.email,
    admin: userObj.admin,
  });

  response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export { showRegistrationForm, registerUser, showLoginForm, loginUser };
