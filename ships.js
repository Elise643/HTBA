function loadShip() {
  let val1 = document.querySelector("#shipSelectOne").value;
  let val2 = document.querySelector("#shipSelectTwo").value;
  let p = document.querySelector("#shipResult");
  p.innerHTML = `Value 1 is ${val1}<br>Value 2 is ${val2}`;

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
        p.innerHTML += `<br><br>Ship name is ${ship}`;
      } else {
        p.innerHTML += `<br><br>No ship name found in data for ship ${searchValue}`;
      }
    })
    .catch(error => {
      console.error('Error fetching ships.json:', error);
      p.innerHTML += `<br><br>Error loading ship data.`;
    });
}
