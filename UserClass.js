// const bcrypt = require("bcrypt");
import pool from "./DataBase.js";
import bcrypt from "bcrypt";

const getUsers = async () => {
  let players = {};
  try {
    const result = await pool.query(
      `SELECT a.username,a.email, b.state FROM users a left outer join states b on a.id_state = b.id_estado;`
    );

    for (let i = 0; i < result.rows.length; i++) {
      players = {
        values: [...result.rows],
      };
    }
  } catch (err) {
    console.log(err.message);
  }

  return players;
};

const getUser = async (name) => {
  let values = [];

  values.push(name);

  let query =
    "SELECT a.username, a.email, a.date_res, b.state  FROM users a right outer join states b on b.id_estado = a.id_state where LOWER(a.username) =" +
    "LOWER($" +
    values.length +
    ")";

  const result = await pool.query(query, values);

  let players = {};

  for (let i = 0; i < result.rows.length; i++) {
    players = {
      values: [...result.rows],
    };

    return players;
  }
};

const GetLogin = async (nameOrEmail, password) => {
  let values = [];
  let response = {};

  if (!nameOrEmail) {
    response = {
      error: "Ingrese usuario o email",
      success: false,
    };
    return response;
  }

  if (!password) {
    response = {
      error: "Ingrese contraseña",
      success: false,
    };
    return response;
  }

  values.push(nameOrEmail);

  let query =
    "SELECT username, email, password FROM users  where LOWER(username) =" +
    "LOWER($" +
    values.length +
    ") OR LOWER(email) = LOWER($" +
    values.length +
    ");";

  const result = await pool.query(query, values);

  if (result.rows.length <= 0) {
    response = {
      error: "Usuario o email no existen",
      success: false,
    };
    return response;
  }

  const isValidPassword = await bcrypt.compare(
    password,
    result.rows[0].password
  );

  if (!isValidPassword) {
    response = {
      error: "Contraseña incorrecta",
      success: false,
    };
    return response;
  }

  let users = {
    user: {
      username: result.rows[0].username,
      email: result.rows[0].email,
    },
    success: true,
    message: "Usuario encontrado",
    error: null,
  };

  return users;
};

const AddUser = async (
  username,
  email,
  password,
  state,
  date,
  provider,
  provider_id
) => {
  let response = {};

  try {
    if (provider === "LOCAL") {
      if (!password) {
        response = {
          message: "",
          error: "Debe ingresar una contraseña",
          success: false,
          user: null,
        };

        return response;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        "INSERT INTO users (username,email,password,id_state,date_res,provider)VALUES($1,$2,$3,(SELECT id_estado FROM states WHERE state = $4),$5,$6)",
        [
          username.toLowerCase(),
          email,
          hashedPassword,
          state.toUpperCase(),
          date,
          provider.toUpperCase(),
        ]
      );
    } else if (provider === "GOOGLE") {
      await pool.query(
        "INSERT INTO users (username,email,id_state,date_res,provider,provider_id)VALUES($1,$2,(SELECT id_estado FROM states WHERE state = $3),$4,$5,$6)",
        [
          username.toLowerCase(),
          email,
          state.toUpperCase(),
          date,
          provider.toUpperCase(),
          provider_id,
        ]
      );
    } else {
      response = {
        message: "",
        error: "Ingrese un provider correcto",
        success: false,
        user: null,
      };
      return response;
    }
    response = {
      message: "Se agregado correctamente",
      success: true,
      error: "",
      user: {
        username,
        email,
      },
    };
    return response;
  } catch (err) {
    response = {
      message: "",
      error: "Ya existe el usuario o email",
      success: false,
      user: null,
    };

    return response;
  }
};

const Users = {
  getUsers,
  getUser,
  AddUser,
  GetLogin,
};

export default Users;
