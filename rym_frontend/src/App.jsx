import { useState, useEffect } from "react";
import "./styles.css";
import Button from "./components/Button";
import AlbumCard from "./components/AlbumCard";

import dice from "./components/dice.png";
import diceone from "./components/diceone.png";
import dicetwo from "./components/dicetwo.png";
import dicefour from "./components/dicefour.png";
import dicefive from "./components/dicefive.png";
import dicesix from "./components/dicesix.png";
import titleImg from "./components/title.png";

const API_BASE = "https://rym-backend.onrender.com/api/albums";

export default function App() {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    fetchRandomAlbum();
  }, []);

  async function fetchRandomAlbum() {
    const res = await fetch(`${API_BASE}/random`);
    const data = await res.json();
    setAlbum(data);
  }

  async function fetchTop200() {
    const res = await fetch(`${API_BASE}/random/top200`);
    const data = await res.json();
    setAlbum(data);
  }

  async function fetchDecade(decade) {
    const res = await fetch(`${API_BASE}/random/decade/${decade}`);
    const data = await res.json();
    setAlbum(data);
  }

  async function fetchRandomGenre() {
    const res = await fetch(`${API_BASE}/random/genre`);
    const data = await res.json();
    setAlbum(data.album);
  }

  return (
    <div className="container">

      <div className="title">
        <img className="dice" src={dice} alt="" />
        <img className="head" src={titleImg} alt="RYM Random" />
        <img className="dice" src={diceone} alt="" />
      </div>

      <div className="subcontainer">
        <div className="buttons">

          <div className="dicecont">
            <img className="dicealt" src={diceone} alt="" />
            <Button onClick={fetchRandomAlbum}>Random Album</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicetwo} alt="" />
            <Button onClick={fetchTop200}>Top 200 Album</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dice} alt="" />
            <Button onClick={fetchRandomGenre}>Random Genre</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicefour} alt="" />
            <Button onClick={() => fetchDecade(2020)}>2020s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicefive} alt="" />
            <Button onClick={() => fetchDecade(2010)}>2010s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicesix} alt="" />
            <Button onClick={() => fetchDecade(2000)}>2000s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={diceone} alt="" />
            <Button onClick={() => fetchDecade(1990)}>1990s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicetwo} alt="" />
            <Button onClick={() => fetchDecade(1980)}>1980s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dice} alt="" />
            <Button onClick={() => fetchDecade(1970)}>1970s</Button>
          </div>

          <div className="dicecont">
            <img className="dicealt" src={dicefour} alt="" />
            <Button onClick={() => fetchDecade(1960)}>1960s</Button>
          </div>

        </div>
        {album ? <AlbumCard album={album} /> : <p>Loading album…</p>}
      </div>

      <div className="textbox">
        <p>This project uses <a className="textlink" href="https://www.kaggle.com/datasets/tobennao/rym-top-5000?resource=download">a Kaggle database</a> that logged the Top 5,000 albums from 
        <a className="textlink" href="https://rateyourmusic.com/"> rateyourmusic.com</a> back in 2021. The aim of this is to get you to press the buttons
        and listen to an album that you otherwise would never have really considered listening to, so I hope that you find yourself pleasantly surprised by something you find. <br></br>  <br></br> 
        Note: The Spotify function only works if the album exists on Spotify, and may result in imprecise searches. <br></br>
        A few albums may not display an album cover due to translation issues.
      </p>

      <p>- Project RYMRandom built and maintained by Abdul Rahim Hamid - </p>
      </div>

    </div>
  );
}