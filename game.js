let reels = [];
let player , bot;
let respin_state = 0;
let prev_progress = {};
let autoplay = false;
const hm = new HardMeters();
const series = new Series();


Setup();


function Setup(){
    const reel_boxes = document.getElementsByClassName('reel')

    bot = new Bot();

    player = new Player(BALANCE , BETS[0]);

    player.setup();

    reels.push(new Reel(REEL_1_ODDS , reel_boxes[0]));
    reels.push(new Reel(REEL_2_ODDS , reel_boxes[1]));
    reels.push(new Reel(REEL_3_ODDS , reel_boxes[2]));
}

function Spin(spinner){
    if(autoplay && spinner == "player")return;
    if(player.balance < player.bet)return;
        
    let gifts_num = 0;
    let blank_num = 0;
    let zero_num = 0;
    if(respin_state == 0){
        if(autoplay)
            bot.gamesLeft--;

        player.balance -= player.bet;
        player.updateBalance();

        document.getElementById("win").innerHTML = `Win: `;

        if(autoplay){
            series.games++;
            series.tb += player.bet;
            series.update();
        }
        hm.games++;
        hm.tb += player.bet;
        hm.update();

        for(const reel of reels)
            reel.spin();

        for(const reel of reels){
            if(reel.output == 'G')gifts_num++;
            if(reel.output == 'B')blank_num++;
            if(reel.output == '0' || reel.output == '00')zero_num++;
        }

        prev_progress.gifts = gifts_num;
        prev_progress.blanks = blank_num;
        prev_progress.zeros = zero_num;

        if(blank_num + zero_num == 3 && gifts_num == 0 && zero_num > 0 && blank_num > 0 || 
           blank_num == 1 && zero_num == 1 && gifts_num == 1 ||
           gifts_num == 2 && blank_num == 1){
            document.getElementById("respin").innerHTML = "there is respin";
            document.getElementById("respin").style.display = "block";
            respin_state = 1;
            return;
        }

        CalculateWin();    
    }else if(respin_state == 1){
        if(prev_progress.gifts == 2 && prev_progress.blanks == 1){
            for(const reel of reels)
                if(reel.output != "G")
                    reel.spin();

            CalculateWin();
            return;
        }else if(prev_progress.gifts == 1 && prev_progress.blanks == 1 && prev_progress.zeros == 1){
            for(const reel of reels){
                if(reel.output != "0" && reel.output != "00")
                    reel.spin();
            }
            
            for(const reel of reels){
                if(reel.output == 'G')gifts_num++;
                if(reel.output == 'B')blank_num++;
                if(reel.output == '0' || reel.output == '00')zero_num++;
            }

            if(gifts_num == 0 && zero_num + blank_num == 3 && zero_num != prev_progress.zeros && blank_num >= 1)
                respin_state = 2;
            else
                CalculateWin();
            return;
        }else{
            for(const reel of reels)
                if(reel.output !== "0" && reel.output !== "00")
                    reel.spin();
        
            for(const reel of reels){
                if(reel.output == 'G')gifts_num++;
                if(reel.output == 'B')blank_num++;
                if(reel.output == '0' || reel.output == '00')zero_num++;
            }

            if(gifts_num == 0 && zero_num + blank_num == 3 && zero_num != prev_progress.zeros && blank_num >= 1)
                respin_state = 2;
            else
                CalculateWin();
        }
    }else{
        for(const reel of reels)
            if(reel.output !== "0" && reel.output !== "00")
                reel.spin();

        CalculateWin();
    }
}

function CalculateWin(){
    let output_str = "";

    let gifts_num = 0;
    for(const reel of reels){
        if(reel.output == "G")gifts_num++;
    }

    if(gifts_num == 3){
        if(autoplay){
            series.bg++;
            series.bw += JACKPOT;
            series.update();
        }
        hm.bg++;
        hm.bw += JACKPOT;
        hm.update();
        output_str = `${JACKPOT}`;
    }else{
        for(const reel of reels){
            if(reel.output == "B" || reel.output == "G")
                output_str += "";
            else
                output_str += reel.output;
        }

        if(autoplay){
            series.nw += Number(output_str);
            series.update();
        }
        hm.nw += Number(output_str);
        hm.update();
    }
    
    document.getElementById("respin").style.display = "none";

    respin_state = 0;

    player.balance += Number(output_str);

    if(Number(output_str) == 0){
        if(autoplay){
            series.eg++;
            series.update();
        }
        hm.eg++;
        hm.update();
    }

    if(autoplay){
        series.tw += Number(output_str);
        series.update();
    }
    hm.tw += Number(output_str);
    hm.update();

    showWin(Number(output_str));
}

function showWin(win){
    document.getElementById("win").innerHTML = `Win: ${win}`;
    player.updateBalance();
}

function triggerAuto(){
    if(autoplay)
        bot.stop();
    else{
        series.reset();
        series.update();
        bot.start();
    }

    autoplay = !autoplay;
}