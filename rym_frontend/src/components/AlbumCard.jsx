import spotifylogo from "../components/spotifylogo.png"
import "../styles.css";

export default function AlbumCard({ album, highlightGenre }) {
  if (!album) return null;

  const data = album.album ? album.album : album;

  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(
    `${data.artist_name} ${data.release_name}`
  )}`;


  return (
    <div className="album-card">
      {data.cover_url && (
        <img
          src={data.cover_url}
          alt={`${data.release_name} cover`}
          className="album-cover"
        />
      )}

      <div className="album-title">
        <span className="album-name"> Album: <u>{data.release_name}</u> </span>
        <span className="artist-name"> Artist: {data.artist_name} </span>
        
      </div>

      <div className="album-meta">
        <span className="album-year">
            {data.release_date ? data.release_date.substring(0, 4) : "Unknown Year"}
        </span>

        {" • "}
        <span className="album-genres">{data.primary_genres}</span>

        {data.position && (
          <>
            {" • "}
            <span className="album-rank">Rank: <u>{data.position}</u></span>
          </>
        )}
      </div>
      <div className="imglink">
        <img src={spotifylogo} alt="Spotify" className="spotifylogo" />
        <a className="textlink" href={spotifySearchUrl} target="_blank">
            Listen on Spotify
      </a>
      </div>
      
    </div>
  );
}