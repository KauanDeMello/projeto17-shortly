import {db} from "../database/database.connection"
import validateSignup from "../middleware/userMiddleware.js"


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