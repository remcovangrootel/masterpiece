import jwt from "jsonwebtoken";

const JWT_SECRET = "vervang_dit_door_een_veilige_string";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Geen token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, player_id }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Ongeldig token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Geen toegang" });
    }
    next();
  };
}
