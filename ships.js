let scripties = ['Alvin','Azari','Circe','Clara','Clyde','Con','DevOn','E.N.','Ephorto','Guyekio','Kaya','Kira','Opie','Ryder','Serina','Seth','Tyler','Virha','Winter'];
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

      if (ship !== null) {
        p.innerHTML += `<br><br>Ship name for ${val1} and ${val2} is ${ship}`;
      } else {
        p.innerHTML += `<br><br>No ship name found in data`;
      }
    })
    .catch(error => {
      console.error('Error fetching ships.json:', error);
      p.innerHTML += `<br><br>Error loading ship data.`;
    });
}
