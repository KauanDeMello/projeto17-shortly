export const authMiddleware = (req, res, next) => {
    try {
    
      if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
  
  
      const token = req.headers.authorization.split(" ")[1];
  
      // Caso o token seja válido, você pode adicionar informações do usuário ao objeto req, como o ID do usuário
      req.user = {
        userId: 123, // Substitua pelo ID do usuário real obtido a partir do token
      };
  
      next();
    } catch (error) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
  };

  export default authMiddleware;
