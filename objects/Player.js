class Player{
    constructor(balance , bet){
        this.balance = balance;
        this.bet = bet;
    }

    setup(){
        document.getElementById("balance").innerHTML = `Balance: ${this.balance}`;
        document.getElementById("bet").innerHTML = `Bet: ${this.bet}`;
    }

    updateBalance(){
        document.getElementById("balance").innerHTML = `Balance: ${this.balance.toFixed(1)}`
    }
}