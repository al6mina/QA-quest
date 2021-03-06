define(function (require) {
    var $ = require('jquery');
    var Stage = require('src/js/Stage.js');
    var stage2 = new Stage('stage2Tmpl.html');
    var DragNDrop = require('src/js/dragndrop.js');
    var dragNdrop = new DragNDrop();
    var canPlay = false;
    var stage_content = {
            taskDescription: 'Your task is to assemble the right combination of shapes. You should move them to clean field',  
            src : ['_brown.png', '_white.png']           
    }; 
    var hero = $('#hero');
    var isPictureGameOpened = false;
    var isTicTacToeGameOpened = false;
    var tempTime;
    var timerCtrl = require('src/js/timerController.js');

    stage2.initEvents = function () {
                 /*
            rewrite object on the server side
            stage2.setStage(2)
        */
        stage2.setStage(2)
        stage2.activeInventary(['.detail-1', '.detail-2']);
        var mainSection = $('#mainSection'); 

        $(hero).trigger('hero:initialPosition', {coordinates: {x : 30, y :  565}});
        /* This event is needed to finish stage after finishing tic tac toe game.*/
        $(mainSection).on('inventory:itemAdded', function(event, item) {
            if(item.name.indexOf('detail-4') !== -1) {
                if(!stage2.isStageFinished)  finishStage();
            }
        });      
        $('#inventory').show();
        turnOffTheLight();
        addFlashLightEvents();
        $('.choosePic').on('click', openPictureGame);
    };

    function finishStage() {
        stage2.isStageFinished = true;
        removeFlashLightEvents();
        $('#mainSection').trigger('main:stageFinished');
        timerCtrl.updateTimer();
    };
/* TURN OFF THE LIGHT*/
    function turnOffTheLight() {
         $('#mainContent').addClass('lightOff');
         $('#stage2').addClass('flashLight');
    };

     /*    Move events to flash light*/
    function addFlashLightEvents() {
        $(document).mousemove(function(e) {
            var marginCorrection = parseInt($('#mainSection').css('margin-left'));
            $('#stage2').css({
                '-webkit-clip-path': 'circle(130px at ' + (e.pageX - marginCorrection) + 'px ' + e.pageY + 'px)',
                 'clip-path': 'circle(130px at ' + (e.pageX - marginCorrection) + 'px ' + e.pageY + 'px)',
                'cursor': 'url("../images/flashlight.ico")'
            });
        });
    };

    function removeFlashLightEvents() {
        $(document).off('mousemove');
        $('#mainContent').removeClass('lightOff');
        $('#stage2').removeClass('flashLight');
        $('.flashLightShadow').remove();
        $('#stage2').css({'-webkit-clip-path': 'none'});
    }; 
/*PICTURE GAME*/
    function openPictureGame() {
        if(isPictureGameOpened) return;
        isPictureGameOpened = true;
        $(hero).trigger('hero:moveForward', {distance: 450}); 
        $(hero).on('hero:heroHasCome', findRightPicture);
        // timerCtrl.updateTimer();
    };

    function findRightPicture () {    
        stage2.getTmpl('popupFrameTmpl.html').then(function(n) {   
            stage2.getTmpl('stage2PictureGameTmpl.html','.popup', stage_content, startPictureMovingGame);
        });
    };
     // add all event listeners for drag'n'drop
    function startPictureMovingGame() {            
        var fieldToDrop = $('.field-to-drop')[0];
        var fieldToReturn =  $('.pictures-to-choose')[0];
        
        dragNdrop.makeDragabble($('.pic-to-drag'));
        dragNdrop.makeDroppable([fieldToDrop], dropPicture);
        dragNdrop.makeDroppable([fieldToReturn], returnPictureBack);
        $('#sendPicture').on('click', finishPictureGame);
            // create an observer instance
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if(mutation.type === 'childList') {
                    if(mutation.addedNodes.length > 0) {
                        $('#sendPicture').prop('disabled', false)
                    }else {
                        $('#sendPicture').prop('disabled', true)
                    }
                }
              });    
            });
        // timerCtrl.updateTimer();
            // configuration of the observer:
            var config = {  childList: true };
             
            // pass in the target node, as well as the observer options
            observer.observe(fieldToDrop, config);
             
            // later, you can stop observing
            // observer.disconnect();

    };
    // callback to drop choosen picture to empty field
    function dropPicture () {
        data = dragNdrop.data;        
        if ($(event.target)[0].nodeName !== 'DIV') {
            var target = $(event.target).closest('div');

            if (target.html() !== '') {
                return false;
            } else {
                $(event.target).closest('div').html(data);
            }          
        } else if ($(event.target).html() !== '') {
            return false;          
        }  
    };
    // callback to drop choosen picture back
    function returnPictureBack (event, data) {      
       $('.pictures-to-choose').append(data); 
    };

    function finishPictureGame() {
        var pictureID = $('.field-to-drop').children().children().attr('id');
        if(!pictureID) return false;
        $.ajax({
            url: '/pictureID',
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify( {picture : pictureID} )
        });

        stage2.closePopup();
        $('#inventory').trigger('inventory:addItem', {name:'.detail-3'});      
        $('.stone').on('click', startTicTacToe);
         timerCtrl.updateTimer();
    };

    function startTicTacToe() {
        if(isTicTacToeGameOpened) return;
        isTicTacToeGameOpened = true; 
        $(hero).trigger('hero:moveForward', {distance: 865});
        $(hero).trigger('hero:clearHasComeEvent');
        $(hero).on('hero:heroHasCome', initTicTacToeGame);       
    };

/* TIC TAC TOE GAME*/
    function initTicTacToeGame() {

        $('#ticTacToe').addClass('show-Game');
        $('.field').on('click', function (event) {
            ticAppear($(this).attr('id'));
        }); 
        $('.newGameB').on('click', playAgain);
         /*
                functions and variables to play tictactoe game
         */
        var x = "src/images/x.png";
        var oz = "src/images/o.png";
        var pause = 0;
        var all = 0;
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var e = 0;
        var f = 0;
        var g = 0;
        var h = 0;
        var i = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var m = 0;
        var n = 0;
        var o = 0;
        var p = 0;
        var temp = "";
        var ok = 0;
        var cf = 0;
        var choice = 16;
        var aRandomNumber = 0;
        var comp = 0;
        var t = 0;
        var wn = 0;
        var ls = 0;
        var ts = 0;
        var counter = 0;
         // logic to know who is winner
         // 1 - X; 2 - 0; 3 - draw
        function logicOne() {
            if ((a == 1) && (b == 1) && (c == 1) && (d == 1)) all = 1;
            if ((a == 1) && (f == 1) && (k == 1) && (p == 1)) all = 1;
            if ((a == 1) && (e == 1) && (i == 1) && (m == 1)) all = 1;
            if ((b == 1) && (f == 1) && (j == 1) && (n == 1)) all = 1;
            if ((c == 1) && (g == 1) && (k == 1) && (o == 1)) all = 1;
            if ((d == 1) && (h == 1) && (l == 1) && (p == 1)) all = 1;
            if ((e == 1) && (f == 1) && (g == 1) && (h == 1)) all = 1;
            if ((g == 1) && (i == 1) && (k == 1) && (l == 1)) all = 1;
            if ((m == 1) && (n == 1) && (o == 1) && (p == 1)) all = 1;
            if ((m == 1) && (j == 1) && (g == 1) && (d == 1)) all = 1;
            //
            if ((a == 2) && (b == 2) && (c == 2) && (d == 2)) all = 2;
            if ((a == 2) && (f == 2) && (k == 2) && (p == 2)) all = 2;
            if ((a == 2) && (e == 2) && (i == 2) && (m == 2)) all = 2;
            if ((b == 2) && (f == 2) && (j == 2) && (n == 2)) all = 2;
            if ((c == 2) && (g == 2) && (k == 2) && (o == 2)) all = 2;
            if ((d == 2) && (h == 2) && (l == 2) && (p == 2)) all = 2;
            if ((e == 2) && (f == 2) && (g == 2) && (h == 2)) all = 2;
            if ((j == 2) && (i == 2) && (k == 2) && (l == 2)) all = 2;
            if ((m == 2) && (n == 2) && (o == 2) && (p == 2)) all = 2;
            if ((m == 2) && (j == 2) && (g == 2) && (d == 2)) all = 2;
            if ((a != 0) && (b != 0) && (c != 0) && (d != 0) && (e != 0) && (f != 0) && (g != 0) && (h != 0) && (i != 0) && (j != 0) && (k != 0) && (l != 0) && (m != 0) && (n != 0) && (o != 0) && (p != 0) && (all == 0)) all = 3;
         }
             // logic for AI move
        function logicTwo() {
            if ((a == 2) && (b == 2) && (c == 0) && (d == 2) && (temp == "")) temp = "C";
            if ((a == 2) && (b == 0) && (c == 2) && (d == 2) && (temp == "")) temp = "B";
            if ((a == 0) && (b == 2) && (c == 2) && (d == 2) && (temp == "")) temp = "A";
            if ((a == 2) && (b == 2) && (c == 2) && (d == 0) && (temp == "")) temp = "D";
            if ((a == 2) && (e == 2) && (i == 2) && (m == 0) && (temp == "")) temp = "M";
            if ((a == 2) && (e == 0) && (i == 2) && (m == 2) && (temp == "")) temp = "E";
            if ((a == 0) && (e == 2) && (i == 2) && (m == 2) && (temp == "")) temp = "A";
            if ((a == 2) && (e == 2) && (i == 0) && (m == 2) && (temp == "")) temp = "I";
            if ((a == 2) && (f == 2) && (k == 0) && (p == 2) && (temp == "")) temp = "K";
            if ((a == 2) && (f == 0) && (k == 2) && (p == 2) && (temp == "")) temp = "F";
            if ((a == 0) && (f == 2) && (k == 2) && (p == 2) && (temp == "")) temp = "A";
            if ((a == 2) && (f == 2) && (k == 2) && (p == 0) && (temp == "")) temp = "P";
            if ((b == 2) && (f == 2) && (j == 2) && (n == 0) && (temp == "")) temp = "N";
            if ((b == 2) && (f == 2) && (j == 0) && (n == 2) && (temp == "")) temp = "J";
            if ((b == 2) && (f == 0) && (j == 2) && (n == 2) && (temp == "")) temp = "F";
            if ((b == 0) && (f == 2) && (j == 2) && (n == 2) && (temp == "")) temp = "B";
            if ((c == 0) && (g == 2) && (k == 2) && (o == 2) && (temp == "")) temp = "C";
            if ((c == 2) && (g == 0) && (k == 2) && (o == 2) && (temp == "")) temp = "G";
            if ((c == 2) && (g == 2) && (k == 0) && (o == 2) && (temp == "")) temp = "K";
            if ((c == 2) && (g == 2) && (k == 2) && (o == 0) && (temp == "")) temp = "O";
            if ((d == 0) && (h == 2) && (l == 2) && (p == 2) && (temp == "")) temp = "D";
            if ((d == 2) && (h == 0) && (l == 2) && (p == 2) && (temp == "")) temp = "H";
            if ((d == 2) && (h == 2) && (l == 0) && (p == 2) && (temp == "")) temp = "L";
            if ((d == 2) && (h == 2) && (l == 2) && (p == 0) && (temp == "")) temp = "P";
            if ((d == 0) && (g == 2) && (j == 2) && (m == 2) && (temp == "")) temp = "D";
            if ((d == 2) && (g == 0) && (j == 2) && (m == 2) && (temp == "")) temp = "G";
            if ((d == 2) && (g == 2) && (j == 0) && (m == 2) && (temp == "")) temp = "J";
            if ((d == 2) && (g == 2) && (j == 2) && (m == 0) && (temp == "")) temp = "M";
            if ((e == 0) && (f == 2) && (g == 2) && (h == 2) && (temp == "")) temp = "E";
            if ((e == 2) && (f == 0) && (g == 2) && (h == 2) && (temp == "")) temp = "F";
            if ((e == 2) && (f == 2) && (g == 0) && (h == 2) && (temp == "")) temp = "G";
            if ((e == 2) && (f == 2) && (g == 2) && (h == 0) && (temp == "")) temp = "H";
            if ((i == 0) && (j == 2) && (k == 2) && (l == 2) && (temp == "")) temp = "I";
            if ((i == 2) && (j == 0) && (k == 2) && (l == 2) && (temp == "")) temp = "J";
            if ((i == 2) && (j == 2) && (k == 0) && (l == 2) && (temp == "")) temp = "K";
            if ((i == 2) && (j == 2) && (k == 2) && (l == 0) && (temp == "")) temp = "L";
            if ((m == 0) && (n == 2) && (o == 2) && (p == 2) && (temp == "")) temp = "M";
            if ((m == 2) && (n == 0) && (o == 2) && (p == 2) && (temp == "")) temp = "N";
            if ((m == 2) && (n == 2) && (o == 0) && (p == 2) && (temp == "")) temp = "O";
            if ((m == 2) && (n == 2) && (o == 2) && (p == 0) && (temp == "")) temp = "P";
        }
             // logic for AI block your win
        function logicThree() {
            if ((a == 1) && (b == 1) && (c == 0) && (d == 1) && (temp == "")) temp = "C";
            if ((a == 1) && (b == 0) && (c == 1) && (d == 1) && (temp == "")) temp = "B";
            if ((a == 0) && (b == 1) && (c == 1) && (d == 1) && (temp == "")) temp = "A";
            if ((a == 1) && (b == 1) && (c == 1) && (d == 0) && (temp == "")) temp = "D";
            if ((a == 1) && (e == 1) && (i == 1) && (m == 0) && (temp == "")) temp = "M";
            if ((a == 1) && (e == 0) && (i == 1) && (m == 1) && (temp == "")) temp = "E";
            if ((a == 0) && (e == 1) && (i == 1) && (m == 1) && (temp == "")) temp = "A";
            if ((a == 1) && (e == 1) && (i == 0) && (m == 1) && (temp == "")) temp = "I";
            if ((a == 1) && (f == 1) && (k == 0) && (p == 1) && (temp == "")) temp = "K";
            if ((a == 1) && (f == 0) && (k == 1) && (p == 1) && (temp == "")) temp = "F";
            if ((a == 0) && (f == 1) && (k == 1) && (p == 1) && (temp == "")) temp = "A";
            if ((a == 1) && (f == 1) && (k == 1) && (p == 0) && (temp == "")) temp = "P";
            if ((b == 1) && (f == 1) && (j == 1) && (n == 0) && (temp == "")) temp = "N";
            if ((b == 1) && (f == 1) && (j == 0) && (n == 1) && (temp == "")) temp = "J";
            if ((b == 1) && (f == 0) && (j == 1) && (n == 1) && (temp == "")) temp = "F";
            if ((b == 0) && (f == 1) && (j == 1) && (n == 1) && (temp == "")) temp = "B";
            if ((c == 0) && (g == 1) && (k == 1) && (o == 1) && (temp == "")) temp = "C";
            if ((c == 1) && (g == 0) && (k == 1) && (o == 1) && (temp == "")) temp = "G";
            if ((c == 1) && (g == 1) && (k == 0) && (o == 1) && (temp == "")) temp = "K";
            if ((c == 1) && (g == 1) && (k == 1) && (o == 0) && (temp == "")) temp = "O";
            if ((d == 0) && (h == 1) && (l == 1) && (p == 1) && (temp == "")) temp = "D";
            if ((d == 1) && (h == 0) && (l == 1) && (p == 1) && (temp == "")) temp = "H";
            if ((d == 1) && (h == 1) && (l == 0) && (p == 1) && (temp == "")) temp = "L";
            if ((d == 1) && (h == 1) && (l == 1) && (p == 0) && (temp == "")) temp = "P";
            if ((d == 0) && (g == 1) && (j == 1) && (m == 1) && (temp == "")) temp = "D";
            if ((d == 1) && (g == 0) && (j == 1) && (m == 1) && (temp == "")) temp = "G";
            if ((d == 1) && (g == 1) && (j == 0) && (m == 1) && (temp == "")) temp = "J";
            if ((d == 1) && (g == 1) && (j == 1) && (m == 0) && (temp == "")) temp = "M";
            if ((e == 0) && (f == 1) && (g == 1) && (h == 1) && (temp == "")) temp = "E";
            if ((e == 1) && (f == 0) && (g == 1) && (h == 1) && (temp == "")) temp = "F";
            if ((e == 1) && (f == 1) && (g == 0) && (h == 1) && (temp == "")) temp = "G";
            if ((e == 1) && (f == 1) && (g == 1) && (h == 0) && (temp == "")) temp = "H";
            if ((i == 0) && (j == 1) && (k == 1) && (l == 1) && (temp == "")) temp = "I";
            if ((i == 1) && (j == 0) && (k == 1) && (l == 1) && (temp == "")) temp = "J";
            if ((i == 1) && (j == 1) && (k == 0) && (l == 1) && (temp == "")) temp = "K";
            if ((i == 1) && (j == 1) && (k == 1) && (l == 0) && (temp == "")) temp = "L";
            if ((m == 0) && (n == 1) && (o == 1) && (p == 1) && (temp == "")) temp = "M";
            if ((m == 1) && (n == 0) && (o == 1) && (p == 1) && (temp == "")) temp = "N";
            if ((m == 1) && (n == 1) && (o == 0) && (p == 1) && (temp == "")) temp = "O";
            if ((m == 1) && (n == 1) && (o == 1) && (p == 0) && (temp == "")) temp = "P";
        }

        function checkSpace() {
            if ((temp == "A") && (a == 0)) {
                ok = 1;
                if (cf == 0) a = 1;
                if (cf == 1) a = 2;
                return true;
            }
            if ((temp == "B") && (b == 0)) {
                ok = 1;
                if (cf == 0) b = 1;
                if (cf == 1) b = 2;
                return true;
            }
            if ((temp == "C") && (c == 0)) {
                ok = 1;
                if (cf == 0) c = 1;
                if (cf == 1) c = 2;
                return true;
            }
            if ((temp == "D") && (d == 0)) {
                ok = 1;
                if (cf == 0) d = 1;
                if (cf == 1) d = 2;
                return true;
            }
            if ((temp == "E") && (e == 0)) {
                ok = 1;
                if (cf == 0) e = 1;
                if (cf == 1) e = 2;
                return true;
            }
            if ((temp == "F") && (f == 0)) {
                ok = 1;
                if (cf == 0) f = 1;
                if (cf == 1) f = 2;
                return true;
            }
            if ((temp == "G") && (g == 0)) {
                ok = 1;
                if (cf == 0) g = 1;
                if (cf == 1) g = 2;
                return true;
            }
            if ((temp == "H") && (h == 0)) {
                ok = 1;
                if (cf == 0) h = 1;
                if (cf == 1) h = 2;
                return true;
            }
            if ((temp == "I") && (i == 0)) {
                ok = 1;
                if (cf == 0) i = 1;
                if (cf == 1) i = 2;
                return true;
            }
            if ((temp == "J") && (j == 0)) {
                ok = 1;
                if (cf == 0) j = 1;
                if (cf == 1) j = 2;
                return true;
            }
            if ((temp == "K") && (k == 0)) {
                ok = 1;
                if (cf == 0) k = 1;
                if (cf == 1) k = 2;
                return true;
            }
            if ((temp == "L") && (l == 0)) {
                ok = 1;
                if (cf == 0) l = 1;
                if (cf == 1) l = 2;
                return true;
            }
            if ((temp == "M") && (m == 0)) {
                ok = 1;
                if (cf == 0) m = 1;
                if (cf == 1) m = 2;
                return true;
            }
            if ((temp == "N") && (n == 0)) {
                ok = 1;
                if (cf == 0) n = 1;
                if (cf == 1) n = 2;
                return true;
            }
            if ((temp == "O") && (o == 0)) {
                ok = 1;
                if (cf == 0) o = 1;
                if (cf == 1) o = 2;
                return true;
            }
            if ((temp == "P") && (p == 0)) {
                ok = 1;
                if (cf == 0) p = 1;
                if (cf == 1) p = 2;
                return true;
            }
        };
      
        function ticAppear(chName) {
            pause = 0;
            if (all != 0) ended();
            if (all == 0) {
                cf = 0;
                ok = 0;
                temp = chName;
                checkSpace();
                if (ok == 1) {
                    $('#'+chName).addClass('tic');
                    process();
                    if (ok == 0) taken();
                    if ((all == 0) && (pause == 0)) {
                        setTimeout(function() {
                            toeAppear();
                            return;
                        }, 200);  
                    } 
                }
            }
        };

        function taken() {
            return false;
        };

        function toeAppear() {
            temp = "";
            ok = 0;
            cf = 1;
            logicTwo();
            logicThree();
            checkSpace();
            while (ok == 0) {
                aRandomNumber = Math.random()
                comp = Math.round((choice - 1) * aRandomNumber) + 1;
                if (comp == 1) temp = "A";
                if (comp == 2) temp = "B";
                if (comp == 3) temp = "C";
                if (comp == 4) temp = "D";
                if (comp == 5) temp = "E";
                if (comp == 6) temp = "F";
                if (comp == 7) temp = "G";
                if (comp == 8) temp = "H";
                if (comp == 9) temp = "I";
                if (comp == 10) temp = "J";
                if (comp == 11) temp = "K";
                if (comp == 12) temp = "L";
                if (comp == 13) temp = "M";
                if (comp == 14) temp = "N";
                if (comp == 15) temp = "O";
                if (comp == 16) temp = "P";
                checkSpace();
            }
            $('#' + temp).addClass('toe');
            process();
        };

        function ended() {
            return false;
        };

        function process() {
            logicOne();
            if (all == 2) {
                // 0 won
                counter = 0
                $('.newGameB').addClass('show-item');
            } else if (all == 1 ) {
                // X won
                finishTicTacToe();
            } else if(all == 3) {
                // draw
                 $('.newGameB').addClass('show-item');
            }

        };
            // play again function (2 draws and level will finish)
        function playAgain() {
            $('.newGameB').removeClass('show-item');
            if (all === 3) {
                counter++;
            } else {
                counter = 0;
            }

            if (counter == 2) { 
                $('#ticTacToe').removeClass('show-item');
                finishTicTacToe()
                return false;
            } 
            reset();
           
        };
            // clean game field
        function reset() {
            var fields = $('.field');
            fields.each( function(index) {
                $(this).removeClass('toe');
                $(this).removeClass('tic');
            });
            
            all = 0;
            a = 0;
            b = 0;
            c = 0;
            d = 0;
            e = 0;
            f = 0;
            g = 0;
            h = 0;
            i = 0;
            j = 0;
            k = 0;
            l = 0;
            m = 0;
            n = 0;
            o = 0;
            p = 0;
            temp = "";
            ok = 0;
            cf = 0;
            choice = 16;
            aRandomNumber = 0;
            comp = 0;
            if (t == 0) {
                t = 2;
                toeAppear();
            }
            t--;
        }
    };        
     // end of game tictactoe
    function finishTicTacToe() {
        $('.newGameB').removeClass('show-item')
        $('#inventory').trigger('inventory:addItem', {name:'.detail-4'}); 
        $('#ticTacToe').removeClass('show-item');
    };
    return stage2;
});