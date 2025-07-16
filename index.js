const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2505-hector";
const $app = document.querySelector("#app");

// State Variables
let playerArr = [];
let selectedPlayer;
let teamArr = [];

// API - Gets all the players data stored in the API and updates the variable "playerArr"
const GetAllPlayers = async () => {
  try {
    const response = await fetch(API_URL + "/players");
    const result = await response.json();
    playerArr = result.data.players;
  } catch (error) {
    console.error(error.message);
  }
};

//Adds a new player to the API and then re-renders the page
const AddPlayer = async (newPlayer) => {
  try {
    const response = await fetch(API_URL + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });
    await GetAllPlayers();
    Render();
  } catch (error) {
    console.error(error.message);
  }
};

//Removes player from API given ID and re-renders the page
const RemovePlayer = async (id) => {
  try {
    const response = await fetch(API_URL + "/players/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    selectedPlayer = null;
    await GetAllPlayers();
    Render();
  } catch (error) {
    console.error(error.message);
  }
};

// Gets player object from the API given the ID
const GetPlayer = async (id) => {
  try {
    const response = await fetch(API_URL + "/players/" + id);
    const result = await response.json();
    selectedPlayer = result.data.player;
    Render();
  } catch (error) {
    console.error(error.message);
  }
};

//Gets teams from API and updates the "teamArr" variable and returns a team name given the team id and player id
const GetTeams = async () => {
  try {
    const response = await fetch(API_URL + "/teams");
    const result = await response.json();
    teamArr = result.data.teams;
  } catch (error) {
    console.error(error.message);
  }
};

//Component Function

// Function returns a form the user will use to add to the roster.
const AddPlayerComponent = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
     <label>Name:</label>
     <input type="text" id="name"><br><br>
     <label>Breed:</label>
     <input type="text" id="breed"><br><br>
     <input type="submit" value="Add Player">
    `;

  //Adds a player to the API and then re-renders the page with the updated version of the API
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newPlayer = {
      name: $form.querySelector("#name").value,
      breed: $form.querySelector("#breed").value,
    };
    AddPlayer(newPlayer);
  });

  return $form;
};

//Returns the a Team name given the team id, Its used it the player details component
const GetTeam = (teamId) => {
  for (let team of teamArr) {
    if (team.id === teamId) return team.name;
  }
  return "Unassigned";
};

//This function returns the Player Details Element
const PlayerDetailsComponent = () => {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Select a player to learn more.";
    return $p;
  } else {
    const $player = document.createElement("section");
    $player.innerHTML = `
        <img src=${selectedPlayer.imageUrl} alt=${
      selectedPlayer.name
    } width="200" height="300">
        <h3>Name: ${selectedPlayer.name}</h3>
        <h3>ID: ${selectedPlayer.id}</h3>
        <h3>Status: ${selectedPlayer.status}</h3>
        <h3>Breed: ${selectedPlayer.breed}</h3>
        <h3>Team: ${GetTeam(selectedPlayer.teamId)}</h3>
        <button type="button" id="delete">Remove From Roster</button>
        `;

    const $delete = $player.querySelector("#delete");

  //This eventlistener removes a player from the API and then re-renders the page with the updated version of the API
    $delete.addEventListener("click", () => RemovePlayer(selectedPlayer.id));

    return $player;
  }
};

//This function returns the Player List Element
const PlayerListComponent = () => {
  const $list = document.createElement("ul");

  for (let player of playerArr) {
    const $player = document.createElement("li");
    $player.innerHTML = `
        <a href="#selected">
        ${player.name} <br>
        <img src=${player.imageUrl} alt=${player.name} width="100" height="150">
        </a>
        `;
    $list.append($player);

    //Updates the SelectedPlayer variable and then re-renders the page
    $player.addEventListener("click", () => GetPlayer(player.id));
  }
  return $list;
};

//Gets called after a state variable has been changed
const Render = () => {
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
     <section>
      <h2>Players List</h2>
      <PlayersList></PlayersList>
     </section>
     <section>
      <h2>Player Details</h2>
      <SelectedPlayer></SelectedPlayer>
     </section>
     <section>
      <h2>Invite A Puppy</h2>
      <InvitePuppy></InvitePuppy>
     </section>
    </main>
    `;

  $app.querySelector("PlayersList").replaceWith(PlayerListComponent());
  $app.querySelector("SelectedPlayer").replaceWith(PlayerDetailsComponent());
  $app.querySelector("InvitePuppy").replaceWith(AddPlayerComponent());
};

const Run = async () => {
  await GetAllPlayers();
  await GetTeams();
  Render();
};

Run();
