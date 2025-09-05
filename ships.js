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
p.innerHTML = `Value 1 is ${val1}<br>Value 2 is ${val2}`;
let ship = null;
let s = [val1,val2];
s.sort();
let searchValue = s.join(":");
fetch('ships.json')
  .then(response => response.json())
  .then(data => {
    const item = data.find(obj => obj["Pair"] === searchValue);
    ship = item ? item["Ship"] : null;
  })
  if (!ship === null) {
    p.innerHTML += `<br><br>Ship name is ${ship}`;
  }
  else {
    p.innerHTML += `<br><br>No ship name found in data for ship ${searchValue}`;
  }


}