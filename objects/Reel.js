class Reel{
    constructor(odds , reel_box){
        this.odds = odds;
        this.box = reel_box;
    }

    spin(){
        this.output = useCoef(this.odds , SYMBOLS);
        this.box.innerHTML = `${this.output}`;
    }
}