const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app = express.json();

//create server
app = express();

//Intialize the DataBase

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBServer();

//get all the players details
app.get("/players/", async (request, response) => {
  const getPlayersquery = `
    SELECT 
    * 
    FROM 
    cricket_team 
    ORDER BY 
    player_id;`;

  const getDetailsPlayers = await db.all(getPlayersquery);
  response.send(getDetailsPlayers);
});
//app.listen(3000);

//create new player details
app.post("/players/", async (request, response) => {
  const playersDeatails = request.body;
  const { player_id, playerName, jerseyNumber, role } = playersDeatails;
  const newPlayerQuery = `INSERT INTO cricket_team(playerName,jerseyName,role)
       VALUES
      ('${playerName}',${jerseyNumber},'${role})';`;

  const newRespone = await db.run(newPlayerQuery);

  response.send("Player Added to Team");
});
//app.listen(3000);

//get the player details using player_id

app.get("players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const selectPlayerID = `SELECT 
       * 
       FROM
       cricket_team
       WHERE 
       player_id = ${playerId}`;

  const playerDetails = await db.run(selectPlayerID);
  response.send(playerDetails);
});
app.listen(3000);
