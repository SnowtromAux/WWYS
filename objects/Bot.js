class Bot{
    constructor(){
        this.gamesLeft = undefined;
        this.speed = undefined;
    }

    start(){
        document.getElementById("games-left").style.display = "block";

        this.gamesLeft = document.getElementById("bot-games").value;
        this.speed = document.getElementById("bot-speed").value;

        document.getElementById("auto-btn").innerHTML = "Stop Auto";

        setInterval(() => {
            if(this.gamesLeft == 0){
                clearInterval(this);
            }else{
                Spin("bot");
                document.getElementById("games-left").innerHTML = `Games Left: ${this.gamesLeft}`;
            }
        } , 1000 / this.speed)
    }

    stop(){
        document.getElementById("games-left").style.display = "none";

        this.gamesLeft = 0;
        this.speed = 0;

        document.getElementById("auto-btn").innerHTML = "Start Auto";
    }
}