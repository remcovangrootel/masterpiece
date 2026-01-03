import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log("SUBMIT KLIKT!");

    const res = await fetch(`http://localhost:4000/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    console.log("Response:", res.status, data);

    if (!res.ok) {
      setError(data.error || "Onbekende fout");
      return;
    }

    setDone(true);

    // ⭐ Belangrijk: stuur naar login, niet naar "/"
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="reset-container">
      <h2>Nieuw wachtwoord instellen</h2>

      {error && <p className="error">{error}</p>}
      {done && <p className="success">Wachtwoord ingesteld! Je wordt doorgestuurd…</p>}

      {!done && (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nieuw wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Opslaan</button>
        </form>
      )}
    </div>
  );
}

