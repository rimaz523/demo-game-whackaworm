var game = function () {
    var canvas;
    var stage;
    var titleBg;
    var titleBgImg = new Image();
    var playBtn;
    var playBtnImg = new Image();
    var creditsBtn;
    var creditsBtnImage = new Image();
    var titleView = new createjs.Container();
    var creditsView;
    var creditsViewImg = new Image();
    var gameBg;
    var gameBgImg = new Image();
    var alertBg;
    var alertBgImage = new Image();
    var score;
    var worm;
    var wormImg = new Image();
    var lastWorm;
    var wormsX = [80, 198, 338, 70, 225, 376, 142, 356];
    var wormsY = [11, 51, 34, 110, 136, 96, 211, 186];
    var centerX = 240;
    var centerY = 160;
    var gfxLoaded = 0;
    var timerSource;
    var currentWorms = 0;
    var wormsHit = 0
    var totalWorms = 10;

    function initializeGame() {
        canvas = document.getElementById('canvas');
        stage = new createjs.Stage(canvas);
        stage.mouseEventsEnabled = true;

        titleBgImg.src = 'images/titleBg.png';
        titleBgImg.name = 'titleBg';
        titleBgImg.onload = loadGfx;

        gameBgImg.src = 'images/gameBg.png';
        gameBgImg.name = 'gameBg';
        gameBgImg.onload = loadGfx;

        playBtnImg.src = 'images/playBtn.png';
        playBtnImg.name = 'playBtn';
        playBtnImg.onload = loadGfx;

        creditsBtnImage.src = 'images/creditsBtn.png';
        creditsBtnImage.name = 'creditsBtn';
        creditsBtnImage.onload = loadGfx;

        creditsViewImg.src = 'images/creditsView.png';
        creditsViewImg.name = 'credits';
        creditsViewImg.onload = loadGfx;

        alertBgImage.src = 'images/alertBg.png';
        alertBgImage.name = 'alertBg';
        alertBgImage.onload = loadGfx;

        wormImg.src = 'images/worm.png';
        wormImg.name = 'worm';
        wormImg.onload = loadGfx;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", stage);

    }


    function loadGfx(e) {
        if (e.target.name == 'titleBg') {
            titleBg = new createjs.Bitmap(titleBgImg);
        } else if (e.target.name == 'gameBg') {
            gameBg = new createjs.Bitmap(e.target);
        } else if (e.target.name == 'playBtn') {
            playBtn = new createjs.Bitmap(playBtnImg);
        } else if (e.target.name == 'creditsBtn') {
            creditsBtn = new createjs.Bitmap(creditsBtnImage);
        } else if (e.target.name == 'alertBg') {
            alertBg = new createjs.Bitmap(alertBgImage);
        }

        gfxLoaded++;
        if (gfxLoaded == 7) {
            addTitleView();
        }
    }

    function addTitleView() {
        stage.addChild(gameBg);

        playBtn.x = centerX - 25;
        playBtn.y = centerY + 35;

        creditsBtn.x = centerX - 40;
        creditsBtn.y = centerY + 80;
        titleView.addChild(titleBg, playBtn, creditsBtn);

        stage.addChild(titleView);

        startButtonListeners('add');
        stage.update();
    }

    function startButtonListeners(action) {
        if (action == 'add') {
            playBtn.addEventListener('click', showGameView);
            creditsBtn.addEventListener('click', showCredits);
        }
    }

    function showCredits() {
        playBtn.visible = false;
        creditsBtn.visible = false;
        creditsView = new createjs.Bitmap(creditsViewImg);
        creditsView.addEventListener('click', hideCredits);
        stage.addChild(creditsView);
        creditsView.x = -203;
        createjs.Tween.get(creditsView).to({ x: 0 }, 500);
    }

    function hideCredits() {
        playBtn.visible = true;
        creditsBtn.visible = true;
        createjs.Tween.get(creditsView).to({ x: -203 }, 500).call(function () { stage.removeChild(creditsView); creditsView = null });
    }

    function showGameView() {
        createjs.Tween.get(titleView).to({ x: -480 }, 500).call(
            function () {
                stage.removeChild(titleView);
                titleView = null;
                updateScore();
                showWorm();
            }
        );
    }

    function showWorm() {

        if (currentWorms == totalWorms) {
            showAlert();
        } else {
            if (lastWorm != null) {
                stage.removeChild(lastWorm);
                stage.update();
                lastWorm = null;
            }
            var randomPos = Math.floor(Math.random() * 8);
            var worm = new createjs.Bitmap(wormImg);
            worm.x = wormsX[randomPos];
            worm.y = wormsY[randomPos];
            stage.addChild(worm);
            worm.addEventListener('click', wormHit);
            lastWorm = worm;
            lastWorm.scaleY = 0.3;
            lastWorm.y += 42;
            stage.update();
            createjs.Tween.get(lastWorm).to({ scaleY: 1, y: wormsY[randomPos] }, 200).wait(1000).call(
                function () {
                    currentWorms++;
                    showWorm();
                }
            );
        }
    }

    function updateScore() {
        score = new createjs.Text('0' + '/' + totalWorms, 'bold 15px Arial', '#EEE');
        score.maxWidth = 1000;
        score.x = 58;
        score.y = 10;
        stage.addChild(score);
    }


    function wormHit() {
        wormsHit++;
        score.text = wormsHit + '/' + totalWorms;
        lastWorm.removeEventListener('click', wormHit);
        stage.removeChild(lastWorm);
        lastWorm = null;
        stage.update();
    }

    function showAlert() {
        alertBg.x = centerX - 120;
        alertBg.y = -80;
        stage.addChild(alertBg);
        createjs.Tween.get(alertBg).to({ y: centerY - 80 }, 500).call(function () {
            createjs.Ticker.removeAllEventListeners();
            var finalScore = new createjs.Text(wormsHit + '/' + totalWorms, 'bold 20px Arial', '#EEE');
            finalScore.maxWidth = 1000;
            finalScore.x = 220;
            finalScore.y = 180;
            var resetGame = new createjs.Text('Click To Reset Game', 'bold 20px Arial', '#EEE');
            resetGame.maxWidth = 1000;
            resetGame.x = 140;
            resetGame.y = 220;
            resetGame.addEventListener('click', resetWhackAWorm);
            stage.addChild(finalScore);
            stage.addChild(resetGame);
            stage.update();
        });
    }

    function resetWhackAWorm() {
        location.reload();
    }
    return { main: initializeGame }
}();

