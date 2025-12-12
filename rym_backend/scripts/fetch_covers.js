import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import fetch from "node-fetch";

/*This was a massive hassle to do, all this entire .js file does
is make up for a deficiency in the initial database that I was
working with. Since the data was scraped directly from RYM (from
what I can tell), it doesn't include the image URLs. This bothered
me and so I went down this rabbit hole of figuring out where I could
get image URLs. I didn't want to literally download 5,000 album
covers and then structure them into a folder because I have a modicum
of self-respect and so I found DISCOGS which lets users access their
API to do exactly what I want. This program essentially makes the call to 
DISCOGS using the albums stored in the initial table and then fetches the URL
to that album's cover art and then finally stores that fetched URL back into
the database in a new column in the same row as the initial album. After having
done this, I feel like it might have been easier to just do it manually. 

Note: Each error/log message is there after I encountered that particular error. I
have left them in as a reminder.

Note #2: The runtime for this fetch program was approximately an hour and a half.*/

dotenv.config();

const DB_PATH = "./rym.db";
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;
const REQUEST_DELAY = 1200; 

if (!DISCOGS_TOKEN) {
  console.error("Missing DISCogs token");
  process.exit(1);
}

sqlite3.verbose();
const db = new sqlite3.Database(DB_PATH);

function ensureCoverColumn() {
  return new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(albums);", (err, rows) => {
      if (err) return reject(err);

      const exists = rows.some(col => col.name === "cover_url");

      if (exists) {
        console.log("cover_url column already exists");
        resolve();
      } else {
        console.log("Adding cover_url column...");
        db.run("ALTER TABLE albums ADD COLUMN cover_url TEXT;", (err) => {
          if (err) return reject(err);
          resolve();
        });
      }
    });
  });
}

async function fetchCover(artist, title) {
  if (!artist || !title) return null;

  const query = encodeURIComponent(`${artist} ${title}`);
  const url = `https://api.discogs.com/database/search?q=${query}&type=release&token=${DISCOGS_TOKEN}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) return null;

    for (const item of data.results) {
      if (item.cover_image) return item.cover_image;
    }

    return null;
  } catch (err) {
    console.error("Discogs fetch error:", err);
    return null;
  }
}

async function updateAllCovers() {
  await ensureCoverColumn();

  console.log("Starting cover art download...");

  db.all("SELECT rowid, artist_name, release_name, cover_url FROM albums", async (err, rows) => {
    if (err) throw err;

    for (const album of rows) {
      const { rowid, artist_name, release_name, cover_url } = album;

      if (cover_url && cover_url.trim() !== "") {
        console.log(`Skipping (already updated): ${artist_name} — ${release_name}`);
        continue;
      }

      console.log(`🎧 Fetching: ${artist_name} — ${release_name}`);

      const newCover = await fetchCover(artist_name, release_name);

      if (newCover) {
        db.run(
          "UPDATE albums SET cover_url = ? WHERE rowid = ?",
          [newCover, rowid]
        );
        console.log("Saved cover URL");
      } else {
        console.log("No cover found");
      }

      await new Promise(res => setTimeout(res, REQUEST_DELAY));
    }

    console.log("All possible covers updated.");
    process.exit(0);
  });
}

updateAllCovers();