let scripties = ['Alvin','Azari','Circe','Clara','Clyde','Con','DevOn','E.N.','Ephorto','Guyekio','Kaya','Kira','Opie','Ryder','Serina','Seth','Tyler','Virha','Winter'];
for (let char in scripties) {
    let op1 = document.createElement("option");
    let op2 = document.createElement("option");
    op1.textContent=char;
    op2.textContent=char;
    op1.value=char;
    op2.value=char;
    document.querySelector("#shipSelectOne").appendChild(op1);
    document.querySelector("#shipSelectTwo").appendChild(op2);
}