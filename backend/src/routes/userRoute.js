import { loginUser, registerUser, adminLogin } from "../controllers/userController.js";

// POST /api/user/register
export async function userRegister(db, request, env) {
  return registerUser(db, request, env);
}

// POST /api/user/login
export async function userLogin(db, request, env) {
  return loginUser(db, request, env);
}

// POST /api/user/admin
export async function userAdminLogin(request, env) {
  return adminLogin(request, env);
}
