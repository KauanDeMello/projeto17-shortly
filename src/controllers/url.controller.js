import {db} from "../database/database.connection.js"
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const { userId } = req.user;

   
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera um identificador único para a shortUrl usando a biblioteca nanoid
    const shortUrl = nanoid(8);

    
    const result = await db.query(
      "INSERT INTO urls (original_url, short_url, user_id) VALUES ($1, $2, $3) RETURNING id",
      [url, shortUrl, userId]
    );

    const { id } = result.rows[0];

    return res.status(201).json({ id, shortUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
