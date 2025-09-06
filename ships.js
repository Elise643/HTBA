let scripties = ['Alvin','Azari','Circe','Clara','Clyde','Con','DevOn','E.N.','Ephorto','Guyekio','Kaya','Kira','Opie','Ryder','Serina','Seth','Tyler','Virha','Winter','Elise','Alix','Rebecca'];
for (let char of scripties) {
    let op1 = document.createElement("option");
    let op2 = document.createElement("option");
    op1.textContent=char;
    op2.textContent=char;
    op1.value=char;
    op2.value=char;
    document.querySelector("#shipSelectOne").appendChild(op1);
    document.querySelector("#shipSelectTwo").appendChild(op2);
}

document.querySelector("#shipSelectOne").addEventListener("change",function () {
    loadShip();
});
document.querySelector("#shipSelectTwo").addEventListener("change", function() {
    loadShip();
});

document.querySelector("#searchShip").addEventListener("change", function() {
    searchShip();
});

function searchShip() {
    let key = document.querySelector("#searchShip").value;
    if (key && key != ""){
          fetch('ships.json')
    .then(response => response.json())
    .then(data => {
        let item = data.find(obj => obj["Ship"] === key);
        if (item!=null){
        document.querySelector("#searchShipResult").textContent = item["Pair"].replace(":", " and ");
        }
        else  {
            item = data.find(obj => obj["Alternates"] && obj["Alternates"].includes(key));
            if (item!=null) {
                document.querySelector("#searchShipResult").textContent = `This is wrong, but if you meant the ship between ${item["Pair"].replace(":"," and ")}, then it's actually ${item["Ship"]}`;

            }
else {
            item = data.find(obj => obj["Ship"].toLowerCase() === key.toLowerCase());

            if (key.toLowerCase()==="con"){
                document.querySelector("#searchShipResult").textContent = `This is case-sensitive. Con's weird. Con is Con shipped with Con; COn is Con shipped with DevOn; anything else is nothing, but good job, I guess.`;
            }
            else if (item!=null) {
                document.querySelector("#searchShipResult").textContent = `This is case-sensitive. You probably meant ${item["Ship"]}, which is ${item["Pair"].replace(":", " and ")}`;

            }
            else {
                item = data.find(
                    obj =>
                    obj["Alternates"] &&
                    obj["Alternates"].some(alt => alt.toLowerCase() === key.toLowerCase())
                );
                if (item!=null){
                document.querySelector("#searchShipResult").textContent = `If I assume you don't know how case sensitivity works and that you meant ${item["Pair"].replace(":", " and ")}, the ship is actually ${item["Ship"]}`;
}
else                 document.querySelector("#searchShipResult").textContent = `That's...not a thing. Reevaluate your life choices.`;

}}}

    });
    }
}

function loadShip() {
  let val1 = document.querySelector("#shipSelectOne").value;
  let val2 = document.querySelector("#shipSelectTwo").value;
  let p = document.querySelector("#shipResult");

  let s = [val1, val2];
  s.sort();
  let searchValue = s.join(":").trim();

  fetch('ships.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const item = data.find(obj => obj["Pair"] === searchValue);
      const ship = item ? item["Ship"] : null;
      const score = item ? item["Score"] : null;

      if (ship !== null) {
        p.innerHTML = `<br><br>Ship name for ${val1} and ${val2} is ${ship}`;
        if (score===1) p.innerHTML += "<br><br>These are literally the same person";
        if (score===2) p.innerHTML += "<br><br>This name is standard and agreed upon I believe";
        if (score===3) p.innerHTML += "<br><br>This isn't one we use very often but it's fairly standard/not the worst";
        if (score===4) p.innerHTML += "<br><br>This is definitely not the greatest ship name ever. But, it could be worse";
        if (score===5) p.innerHTML += "<br><br>This ship name is just bad. I was grasping at straws here";
        if (score===6) p.innerHTML = p.innerHTML.replace("Ship", "Pairing (not a ship, they're siblings)");
        if (score===7) p.innerHTML += "<br><br>Elise was being a little silly but this isn't necessarily bad";
        if (score===8) p.innerHTML += "<br><br>This is so bad, please provide suggestions";
        if (score===9) p.innerHTML += "<br><br>This is one of the absolute worst ship names to exist in relation to the script. H E L P  M E";

      } else {
        p.innerHTML = `<br><br>No ship name found in data`;
      }
    })
    .catch(error => {
      console.error('Error fetching ships.json:', error);
      p.innerHTML = `<br><br>Error loading ship data.`;
    });
}
