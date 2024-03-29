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

export const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const result = await db.query("SELECT * FROM urls WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "A URL não foi encontrada." });
    }

    const url = result.rows[0];

    if (url.user_id !== userId) {
      return res.status(401).json({ error: "Você não tem permissão para excluir esta URL." });
    }

    await db.query("DELETE FROM urls WHERE id = $1", [id]);

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getUserProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    
    const userQuery = await db.query("SELECT id, name FROM users WHERE id = $1", [userId]);
    const user = userQuery.rows[0];

    
    const visitCountQuery = await db.query("SELECT SUM(visit_count) as total_visits FROM urls WHERE user_id = $1", [userId]);
    const totalVisits = visitCountQuery.rows[0].total_visits || 0;

   
    const urlsQuery = await db.query("SELECT id, short_url, original_url, visit_count FROM urls WHERE user_id = $1", [userId]);
    const shortenedUrls = urlsQuery.rows;

    
    const userProfile = {
      id: user.id,
      name: user.name,
      visitCount: totalVisits,
      shortenedUrls: shortenedUrls.map(url => ({
        id: url.id,
        shortUrl: url.short_url,
        url: url.original_url,
        visitCount: url.visit_count
      }))
    };

    
    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTopUsers = async (req, res) => {
  try {
    // Consulta SQL para obter os 10 principais usuários ordenados pela soma de visitas
    const query = `
      SELECT users.id, users.name, COALESCE(SUM(urls.visit_count), 0) as total_visits
      FROM users
      LEFT JOIN urls ON users.id = urls.user_id
      GROUP BY users.id
      ORDER BY total_visits DESC
      LIMIT 10
    `;

    const result = await db.query(query);

    // Formatar a resposta
    const topUsers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      totalVisits: row.total_visits
    }));

    return res.status(200).json(topUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};