let coins = 0
let isclick = 0
let upgrade1 = 0
let upgrade1Done = 0
let upgrade2 = 0
let upgrade2Done = 0
let upgrade3 = 0
let upgrade3Done = 0
let upgrade4 = 0
let upgrade4Done = 0
let upgrade5 = 0
let upgrade5Done = 0
let upgrade6 = 0
let upgrade6Done = 0
let coinsPC = 1
let coinsPS = 0
let isExporting = 0
let isImporting = 0
let explosionChance = 0
let explosionBoost = 5
coinsText = document.getElementById("coinsCount");
coinsPerClickText = document.getElementById("coinsPerClick");
Upgrade1Text = document.getElementById("Upgrade1");
Upgrade2Text = document.getElementById("Upgrade2");
Upgrade3Text = document.getElementById("Upgrade3");
Upgrade4Text = document.getElementById("Upgrade4");
Upgrade5Text = document.getElementById("Upgrade5");
Upgrade6Text = document.getElementById("Upgrade6");
mainBlock = document.getElementById("blockImage")

let dirt = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2f/Dirt.png/revision/latest?cb=20220112085643"
let grass = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c7/Grass_Block.png/revision/latest?cb=20230226144250"
let stone = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d4/Stone.png/revision/latest?cb=20220112085705"
let coal = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/48/Coal_Ore_JE5_BE4.png/revision/latest?cb=20210325235945"
let iron = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/19/Iron_Ore_JE6_BE4.png/revision/latest?cb=20210326000111"
let gold = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/18/Gold_Ore_JE7_BE4.png/revision/latest?cb=20210414170925"
let redstone = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/cd/Redstone_Ore_JE4_BE3.png/revision/latest?cb=20210226103025"
let lapis = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/ea/Lapis_Lazuli_Ore_JE4_BE4.png/revision/latest?cb=20210414171130"
let diamonds = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/29/Diamond_Ore_JE5_BE5.png/revision/latest?cb=20210326000237"


let blocks = [dirt,
    grass, grass, grass,
    stone, stone, stone, stone, stone,
    coal, coal, coal, coal, coal, coal, coal, coal, coal, coal, 
    iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,iron,
    gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,gold,
    redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,redstone,
    lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,lapis,
    diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds,diamonds]
    

function numberFormat(number){
    if (number >= 1000){
        if (number >= 1000000){
            if (number >= 1000000000){
                if (number >= 1000000000000){
                    if (number >= 1000000000000000){
                        if (number >= 1000000000000000000){
                            return Math.round(number/100000000000000000)/10+"Qi"
                        }
                        return Math.round(number/100000000000000)/10+"Qd"
                    }
                    return Math.round(number/100000000000)/10+"T"
                }
                return Math.round(number/100000000)/10+"B"
            }
            return Math.round(number/100000)/10+"M"
        }
        return Math.round(number/100)/10+"K"
    }
    return Math.round(number)
}


function mainFunc(){
    var audio = document.getElementById('MainMusic');
    audio.play();
    coins += (coinsPS*(1-explosionChance/100)+((coinsPS-(coinsPS*(1-explosionChance/100)))*explosionBoost))/100
    buttonManager()
    if (coinsPS > 0){
        coinsText.textContent = numberFormat(coins)+"$"+" +"+numberFormat(coinsPS*(1-explosionChance/100)+((coinsPS-(coinsPS*(1-explosionChance/100)))*explosionBoost))+"/s";
    }
    else{
        coinsText.textContent = numberFormat(coins)+"$";
    }
    
    coinsPerClickText.textContent = numberFormat(coinsPC)+"$/Click"
    Upgrade1Text.textContent = "Fortune I Lvl "+(upgrade1Done)+" +"+numberFormat(2+(2*Math.floor(Math.pow(2,1+0.175*upgrade1Done))))+"$ Per Click - "+numberFormat(5*(Math.round(Math.pow(1.25, ((upgrade1Done+1)*1.25)))))+"$";
    Upgrade2Text.textContent = "Efficiency I Lvl "+(upgrade2Done)+" +"+numberFormat(1*Math.floor(Math.pow(3,1+0.25*upgrade2Done)))+"$ Per Second - "+numberFormat(15*(Math.round(Math.pow(1.25, ((upgrade2Done+1)*1.5)))))+"$";
    if (upgrade3Done<20){
        Upgrade3Text.textContent = "Explosion I Lvl "+(upgrade3Done)+" +5% >> x5$ "+numberFormat(15*(Math.round(Math.pow(1.25, ((upgrade3Done+1)*1.4)))))+"$";
    }
    else{
        Upgrade3Text.textContent = "Explosion I Lvl 20 (MAX)";
    }
    
    Upgrade4Text.textContent = "Fortune II Lvl "+(upgrade4Done)+" +"+numberFormat(14+(8*Math.floor(Math.pow(2,1+0.5*upgrade4Done))))+"$ Per Click - "+numberFormat(5*(Math.round(Math.pow(1.15, ((upgrade4Done+1)*1.15)))))+" Fortune I levels";
    Upgrade5Text.textContent = "Efficiency II Lvl "+(upgrade5Done)+" +"+numberFormat(1*Math.floor(Math.pow(4,1+0.25*upgrade5Done) ))+"$ Per Click - "+numberFormat(5*(Math.round(Math.pow(1.15, ((upgrade5Done+1)*1.15)))))+" Efficiencys I levels";
    if (upgrade6Done < 20){
        Upgrade6Text.textContent = "Explosion II Lvl "+(upgrade6Done)+" explosion gives +1x$ 20 Explosion I levels";
    }
    else{
        Upgrade6Text.textContent = "Explosion II Lvl 20 (MAX)";
    }

    colorButtons()
    mainBlock.src = blocks[Math.min(upgrade1Done+upgrade2Done, blocks.length-1)]
}


function buttonManager(){
    if (isExporting == 1){
        isExporting = 0
        exportSave()
    }
    if (isImporting == 1){
        isImporting = 0
        importSave()
    }
    if (isclick == 1){
        isclick = 0
        click()
    }
    if (upgrade1 == 1){
        upgrade1 = 0
        upgrade(1)
    }
    if (upgrade2 == 1){
        upgrade2 = 0
        upgrade(2)
    }
    if (upgrade3 == 1){
        upgrade3 = 0
        if (upgrade3Done < 20){
            upgrade(3)
        }
    }
    if (upgrade4 == 1){
        upgrade4 = 0
        upgrade(4)
    }
    if (upgrade5 == 1){
        upgrade5 = 0
        upgrade(5)
    }
    if (upgrade6 == 1){
        upgrade6 = 0
        upgrade(6)
    }
}

function colorButtons(){
    if (upgrade1Done < 1){
        Upgrade1Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade1Done < 11){
            Upgrade1Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade1Done < 26){
                Upgrade1Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade1Done < 51){
                    Upgrade1Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade1Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
    if (upgrade2Done < 1){
        Upgrade2Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade2Done < 11){
            Upgrade2Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade2Done < 26){
                Upgrade2Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade2Done < 51){
                    Upgrade2Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade2Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
    if (upgrade3Done < 1){
        Upgrade3Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade3Done < 5){
            Upgrade3Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade3Done < 12){
                Upgrade3Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade3Done < 20){
                    Upgrade3Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade3Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
    if (upgrade4Done < 1){
        Upgrade4Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade4Done < 11){
            Upgrade4Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade4Done < 26){
                Upgrade4Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade4Done < 51){
                    Upgrade4Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade4Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
    if (upgrade5Done < 1){
        Upgrade5Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade5Done < 11){
            Upgrade5Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade5Done < 26){
                Upgrade5Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade5Done < 51){
                    Upgrade5Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade5Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
    if (upgrade6Done < 1){
        Upgrade6Text.style.backgroundColor = "rgb(255, 255, 255)";
    }
    else{
        if (upgrade6Done < 5){
            Upgrade6Text.style.backgroundColor = "rgb(214, 210, 210)";
        }
        else{
            if (upgrade6Done < 12){
                Upgrade6Text.style.backgroundColor = "rgb(141, 111, 100)";
            }
            else{
                if (upgrade6Done < 20){
                    Upgrade6Text.style.backgroundColor = "rgb(223, 197, 123)";
                }
                else{
                    Upgrade6Text.style.backgroundColor = "rgb(93, 226, 231)";
                }
            }
        }
    }
}

function upgrade(upgrade) {
    if (upgrade == 1){
        let price = 5*(Math.round(Math.pow(1.25, ((upgrade1Done+1)*1.25))))
        let nextLevelPrice = 5*(Math.round(Math.pow(1.15, ((upgrade4Done+1)*1.15))))
        if (coins >= price && upgrade1Done<nextLevelPrice){
            coins -= price
            coinsPC += 2+(2*Math.floor(Math.pow(2,1+0.175*upgrade1Done)))
            upgrade1Done += 1
        }
    }
    if (upgrade == 2){
        let price = 15*(Math.round(Math.pow(1.25, ((upgrade2Done+1)*1.5))))
        let nextLevelPrice = 5*(Math.round(Math.pow(1.15, ((upgrade5Done+1)*1.15))))
        if (coins >= price && upgrade2Done < nextLevelPrice){
            coins -= price
            coinsPS += 1*Math.floor(Math.pow(3,1+0.25*upgrade2Done))
            upgrade2Done += 1
        }
    }
    if (upgrade == 3){
        let price = 15*(Math.round(Math.pow(1.25, ((upgrade3Done+1)*1.4))))
        if (coins >= price){
            coins -= price
            upgrade3Done += 1
            explosionChance = upgrade3Done*5
        }
    }
    if (upgrade == 4){
        let price = 5*(Math.round(Math.pow(1.15, ((upgrade4Done+1)*1.15))))
        if (upgrade1Done >= price){
            upgrade1Done -= price
           
            let removal = 0
            while (removal < price){
                removal += 1;
                coinsPC -= 6+(2*Math.floor(Math.pow(2,1+0.175*upgrade1Done-removal)))
            }
            coinsPC += 1*(14+(8*Math.floor(Math.pow(2,1+0.5*upgrade4Done))))
            upgrade4Done += 1
        }
    }
    if (upgrade == 5){
        let price = 5*(Math.round(Math.pow(1.15, ((upgrade5Done+1)*1.15))))
        if (upgrade2Done >= price){
            upgrade2Done -= price
            let removal = 0
            while (removal < price){
                removal += 1;
                coinsPS -= 1*Math.floor(Math.pow(3,1+0.25*upgrade2Done-removal))
            }
            coinsPS += 1*Math.floor(Math.pow(4,1+0.25*upgrade5Done))
            upgrade5Done += 1
        }
    }
    if (upgrade == 6){
        if (upgrade3Done >= 20){
            if (upgrade6Done < 20){
                upgrade3Done -= 20
                explosionChance = 0
                explosionBoost += 1
                upgrade6Done += 1
            }
        }
    }
}

function click() {
    let random = Math.round(Math.random()*100)
    if (random<=explosionChance) {
        coins += coinsPC*explosionBoost
    }
    else{
        coins += coinsPC
    }

    
}


function createSaveString(){
    let saveString = ""
    saveString += Math.floor(coins)
    saveString += "%"
    saveString += Math.floor(coinsPC)
    saveString += "%"
    saveString += Math.floor(coinsPS)
    saveString += "%"
    saveString += Math.floor(upgrade1Done)
    saveString += "%"
    saveString += Math.floor(upgrade2Done)
    saveString += "%"
    saveString += Math.floor(upgrade3Done)
    saveString += "%"
    saveString += Math.floor(explosionChance)
    saveString += "%"
    saveString += Math.floor(explosionBoost)
    saveString += "%"
    saveString += Math.floor(upgrade4Done)
    saveString += "%"
    saveString += Math.floor(upgrade5Done)
    saveString += "%"
    saveString += Math.floor(upgrade6Done)
    saveString += "%"
    return saveString
}


function exportSave(){
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([createSaveString()], {type: "text/plain"}));
    a.download = "steveTheMinerClickerGameSave.stmsf";
    a.click();
}


function workWithSaveString(saveString){
    console.log(saveString)
    let item = 1
    let got = 0
    let letter = 0
    let thisLetter = null
    while (letter<=saveString.length) {
        thisLetter = saveString[letter]
        if (thisLetter == "%"){
            if (item == 1){
                coins = got
            }
            if (item == 2){
                coinsPC = got
            }
            if (item == 3){
                coinsPS = got
            }
            if (item == 4){
                upgrade1Done = got
            }
            if (item == 5){
                upgrade2Done = got
            }
            if (item == 6){
                upgrade3Done = got
            }
            if (item == 7){
                explosionChance = got
            }
            if (item == 8){
                explosionBoost = got
            }
            if (item == 9){
                upgrade4Done = got
            }
            if (item == 10){
                upgrade5Done = got
            }
            if (item == 11){
                upgrade6Done = got
            }
            got = 0
            item += 1
        }
        else{
            if (got > 0){
                got = got*10
            }
            got += parseInt(thisLetter)
        }
        letter += 1
    }
}


function importSave(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
           var content = readerEvent.target.result;
           workWithSaveString(content)
        }}
    input.click();
}


setInterval(mainFunc, 10);