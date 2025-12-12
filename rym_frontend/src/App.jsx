import { useState, useEffect } from "react";
import "./styles.css";
import Button from "./components/Button";
import AlbumCard from "./components/AlbumCard";
import dice from "./components/dice.png"
import diceone from "./components/diceone.png"
import dicetwo from "./components/dicetwo.png"
import dicefour from "./components/dicefour.png"
import dicefive from "./components/dicefive.png"
import dicesix from "./components/dicesix.png"
import dicealt from "./components/dice.png"
import title from "./components/title.png"
import { fetchJSON } from "./api";


export default function App() {
  const [album, setAlbum] = useState(null);
  
  useEffect(() => {
    randomAlbum();
  }, []);

  const randomAlbum = async () => {
    setAlbum(await fetchJSON("/random"));
  };

  const randomTop200 = async () => {
    setAlbum(await fetchJSON("/random/top200"));
  };

  const randomGenre = async () => {
    const data = await fetchJSON("/random/genre");
    setAlbum(data.album);
    setHighlightGenre(data.random_genre);
    setActiveButton("genre");
  };

  const randomDecade = async (decade) => {
    setAlbum(await fetchJSON(`/random/decade/${decade}`));
  };

  return (
    <div className="container">

    <title>RYMRandom</title>
    <link rel="icon" type="image/png" href={"/diceone.png"} />

    <div className="title">
        <img className="dice" src={dice} />
        <img className="head" src={title}/>
        <img className="dice" src={diceone} />
    </div>

    <div className="subcontainer">
        <div className="buttons">
            <div className="dicecont">
                <img className="dicealt" src={diceone} />
                <Button onClick={randomAlbum}>Random Album</Button>
            </div>

        <div className="dicecont">
            <img className="dicealt" src={dicetwo} />
            <Button onClick={randomTop200}>Top 200 Album</Button>
        </div>

            <div className="dicecont">
                <img className="dicealt" src={dice} />
               <Button onClick={randomGenre}>Random Genre</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dicefour} />
               <Button onClick={() => randomDecade(2020)}>2020s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dicefive} />
               <Button onClick={() => randomDecade(2010)}>2010s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dicesix} />
               <Button onClick={() => randomDecade(2000)}>2000s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={diceone} />
               <Button onClick={() => randomDecade(1990)}>1990s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dicetwo} />
               <Button onClick={() => randomDecade(1980)}>1980s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dice} />
               <Button onClick={() => randomDecade(1970)}>1970s</Button>
            </div>

            <div className="dicecont">
                <img className="dicealt" src={dicefour} />
               <Button onClick={() => randomDecade(1960)}>1960s</Button>
            </div>
              
    </div>

      <AlbumCard album={album}/>
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