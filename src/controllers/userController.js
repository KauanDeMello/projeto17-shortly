import {db} from "../database/database.connection"
import bcrypt from "bcrypt"


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const checkUserQuery = "SELECT * FROM users WHERE email = $1";
      const existingUser = await db.query(checkUserQuery, [email]);
  
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "Já existe um usuário cadastrado com este email." });
      }
  
      const createUserQuery = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
      await db.query(createUserQuery, [name, email, password]);
  
      return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }; 


  export const signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (existingUser.rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
  
      const validPassword = await bcrypt.compare(password, existingUser.rows[0].password);
  
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
  
      return res.status(200).json({ message: "Autenticação bem-sucedida." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };