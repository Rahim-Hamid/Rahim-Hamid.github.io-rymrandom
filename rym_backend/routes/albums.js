import express from "express";
import db from "../db.js";

const router = express.Router();

function normalizeRow(row) {
  if (!row) return null;
  // extract year from release_date if present (format "YYYY-MM-DD")
  let release_year = null;
  if (row.release_date) {
    const y = String(row.release_date).substring(0, 4);
    const yi = parseInt(y, 10);
    if (!Number.isNaN(yi)) release_year = yi;
  }
  // compute decade if year present
  const decade = release_year ? Math.floor(release_year / 10) * 10 : null;

  return {
    ...row,
    release_year,
    decade
  };
}

// Random album
router.get("/random", (req, res) => {
  db.get("SELECT * FROM albums ORDER BY RANDOM() LIMIT 1;", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(normalizeRow(row));
  });
});

// Random album from top 200
router.get("/random/top200", (req, res) => {
  db.get(
    "SELECT * FROM albums WHERE position <= 200 ORDER BY RANDOM() LIMIT 1;",
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(normalizeRow(row));
    }
  );
});

// Keep compatibility: /random/decade/:decade (frontend likely calls this)
router.get("/random/decade/:decade", (req, res) => {
  const decadeStart = parseInt(req.params.decade, 10);
  const decadeEnd = decadeStart + 9;

  const query = `
    SELECT *
    FROM albums
    WHERE CAST(SUBSTR(release_date, 1, 4) AS INTEGER)
      BETWEEN ? AND ?
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  db.get(query, [decadeStart, decadeEnd], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(normalizeRow(row));
  });
});

// Also provide /decade/:decade if you ever call that directly
router.get("/decade/:decade", (req, res) => {
  const decadeStart = parseInt(req.params.decade, 10);
  const decadeEnd = decadeStart + 9;

  const query = `
    SELECT *
    FROM albums
    WHERE CAST(SUBSTR(release_date, 1, 4) AS INTEGER)
      BETWEEN ? AND ?
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  db.get(query, [decadeStart, decadeEnd], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(normalizeRow(row));
  });
});

router.get("/random/genre", (req, res) => {
  db.all("SELECT primary_genres, secondary_genres FROM albums", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let allGenres = new Set();

    // Extract genres exactly as they appear
    rows.forEach(r => {
      if (r.primary_genres) {
        r.primary_genres.split(",").forEach(g => {
          const cleaned = g.trim();
          if (cleaned) allGenres.add(cleaned);
        });
      }
      if (r.secondary_genres) {
        r.secondary_genres.split(",").forEach(g => {
          const cleaned = g.trim();
          if (cleaned) allGenres.add(cleaned);
        });
      }
    });

    const genreArray = Array.from(allGenres);
    if (genreArray.length === 0)
      return res.status(404).json({ error: "No genres found" });

    const randomGenre =
      genreArray[Math.floor(Math.random() * genreArray.length)];

    // Simple lookup using SQL substring match
    db.get(
      `
      SELECT * FROM albums
      WHERE primary_genres LIKE ? OR secondary_genres LIKE ?
      ORDER BY RANDOM()
      LIMIT 1;
      `,
      [`%${randomGenre}%`, `%${randomGenre}%`],
      (err, album) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ random_genre: randomGenre, album });
      }
    );
  });
});

// Random album from a specific genre (use LIKE against primary/secondary)
router.get("/random/genre/:genre", (req, res) => {
  const { genre } = req.params;

  db.get(
    `SELECT * FROM albums
     WHERE primary_genres LIKE ? OR secondary_genres LIKE ?
     ORDER BY RANDOM()
     LIMIT 1;`,
    [`%${genre}%`, `%${genre}%`],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(normalizeRow(row));
    }
  );
});

export default router;