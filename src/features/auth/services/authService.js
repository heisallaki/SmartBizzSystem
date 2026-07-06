const MOCK_USER = {
  id: 1,
  name: "Administrator",
  email: "admin@smartbizz.com",
  role: "admin",
};

export async function login(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email === "admin@smartbizz.com" &&
        password === "password123"
      ) {
        resolve(MOCK_USER);
      } else {
        reject(new Error("Invalid email or password."));
      }
    }, 1000);
  });
}

export async function logout() {
  return Promise.resolve();
}