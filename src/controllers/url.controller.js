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

export const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM urls WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "A URL não foi encontrada." });
    }

    const { id: urlId, shortUrl, url } = result.rows[0];
    return res.status(200).json({ id: urlId, shortUrl, url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const redirectToUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const result = await db.query("SELECT * FROM urls WHERE shortUrl = $1", [shortUrl]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "A URL não foi encontrada." });
    }

    const { id, url, visitCount } = result.rows[0];
    const updatedVisitCount = visitCount + 1;

    // Atualiza a contagem de visitas no banco de dados
    await db.query("UPDATE urls SET visitCount = $1 WHERE id = $2", [updatedVisitCount, id]);

    // Redireciona o usuário para a URL original
    return res.redirect(url);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};