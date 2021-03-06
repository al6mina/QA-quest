define(function(require) {
    var Stage = require('src/js/Stage.js');    
    var stage4 = new Stage('stage4Tmpl.html');
    var $ = require('jquery');
    require('jqueryUi');
    var isDotGameOpened = false;
    var isDotGameFinished = false;
    var hero = $('#hero');
    var heroStop = false;
    var heroClimbUp = false;
    var cabinTimer;
    var timerInsideCabin = 3  * 60 * 1000;
    var is404Opened = false;
    var haveCombination = false;
    var combination = [];
    var isPauseBtnClick = false;
    var insideCabinOpen =false;
	var timerCtrl = require('src/js/timerController.js');

    stage4.initEvents = function() {
    	stage4.setStage(4);
    	stage4.activeInventary(['.detail-1', '.detail-2', '.detail-3', '.detail-4', '.detail-5', '.detail-6']);
    	$(hero).removeClass('hideHero');
    	$(hero).trigger('hero:initialPosition', {coordinates: {x : 50, y :  530}});
    	$('#inventory').show();
    	$('.ladder').on('click', moveToLadder);
    	$('#pauseBtn').on('click.pauseHero', function(){
			if($(this).hasClass('play')) {
				isPauseBtnClick = true;
			} else {
				isPauseBtnClick = false;
				if(!isDotGameOpened  && !isDotGameFinished){
					loadDotGame();
				} else if(!is404Opened && heroClimbUp && isDotGameFinished){
					insideCabin()
				}
			}

		})
    	$(mainSection).on('inventory:itemAdded', function(event, item) {
	    	if(item.name.indexOf('detail-7') !== -1) {
	    	$('#inventory').trigger('inventory:addAllItems'); 
	    	$('#mainSection').on('inventory:allItemsAdded', function() {
		       	$('.ladder').addClass('show-ladder');
	       		$('.ladder').on('click', climbUpToShip);   
	    	});
	      }
		}); 
    };

    function climbUpToShip() {
    	$(hero).trigger('hero:climbUp');
    	heroClimbUp = true;
    	$(hero).on('hero:heroHasCome', insideCabin);
    };

    function stageFinished() {
    		stage4.isStageFinished = true;
    	$('#mainSection').trigger('main:stageFinished'); 
    	timerCtrl.updateTimer();
    };
/*INSIDE CABIN*/
  function insideCabin() {
  		if(!heroClimbUp || isPauseBtnClick || insideCabinOpen) return
					$(hero).addClass('hideHero');
					stage4.getTmpl('popupFrameTmpl.html').then(function() {
					$('.popupWrap').addClass('dark-bg')
					stage4.getTmpl('stage4BotCabinTmpl.html','.popup', null, start404Task);
			});
	};

	function start404Task() {
		insideCabinOpen=true;
		$('#pauseBtn').on('click', function(){
			if($(this).hasClass('play')) {
				clearInterval(cabinTimer)
			} else {
				startTimer(timerInsideCabin);
			}
		})
		startTimer(timerInsideCabin);
		$('.startButton').on('click', function() {
			if(!is404Opened) {
				load404Page();
			} else { 
				sendCombination(combination);
				stageFinished();
			}
		});
		$('.panelButton').on('click', function() {
			if($('.pressed').length == 4 && !$(this).hasClass('pressed')) return;
			($(this).hasClass('pressed')) ? removeForomCombination(this.id) : combination.push(this.id);
			$(this).toggleClass('pressed');
				switchOnLamp();
		});
		$('.popup-btn').on('click', function() {
			stage4.closePopup();
		});
		$('.close404Btn').on('click', function() {
			$('.panelButton').removeClass('pressed');
			$('.lamp').removeClass('switch-on')
			$('.error-page-frame').remove();
			combination = [];
			$('.popup > .cabin > *').toggleClass('closeBlock');
			$('.cabin').toggleClass('hideCabin');
			$('.panelButton').removeClass('pressed');
		});
		timerCtrl.updateTimer();
	};

function sendCombination(combination) {
        $('#mainSection').trigger('main:saveTime');
        $.ajax({
            url: '/combination',
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({combination : combination })
        });
    };
 
	function switchOnLamp () {
		var allLamps = $('.lamp');
		var len = $('.pressed').length
		for (var i=0; i<len; i++) {
			if(!$(allLamps[i]).hasClass('switch-on')) {
				$(allLamps[i]).toggleClass('switch-on')
			}
		}
	}

	function switchOffLamp () {
		var allLamps = $('.lamp');
		var len = $('.pressed').length
		for (var i=0; i<len; i++) { 	
			if($(allLamps[i]).hasClass('switch-on')) {
				$(allLamps[i]).toggleClass('switch-on')
			}
		}
	}

	function removeForomCombination(id) {
		var tempArray = [];

		for (var i = 0; i < combination.length; i++) {
			if(combination[i] != id) tempArray.push(combination[i]);
		}
		combination = tempArray.map(function(num) {
			return num;
		});
			switchOffLamp();
	};

// Cabin timer
	function startTimer(time) {
		// var generalTimeMinutes = time;
		var generalTimeMS = time;

		var minutes = $('.timer > .minutes');
		var seconds = $('.timer > .seconds');
		var minutesLeftvar;
		var secondsLeft;

		cabinTimer = setInterval(function() {
			if($('#pauseBtn').hasClass('play')) {
				cabinTimer.clearInterval()
			}
			if(generalTimeMS == 0) {
				clearInterval(cabinTimer);
				stageFinished();
			}
			minutesLeft = (generalTimeMS / 60000).toString()[0];
			secondsLeft = (generalTimeMS - (minutesLeft * 60000)) / 1000;
			secondsLeft = (secondsLeft < 10) ? '0' + secondsLeft : secondsLeft;
			$(minutes).text(minutesLeft);
			$(seconds).text(secondsLeft);
			generalTimeMS -= 1000;
			timerInsideCabin = generalTimeMS;
		}, 1000);
	};

// load Frame
	function load404Page() {
		is404Opened = true;
		haveCombination = true;
		$('.popup > .cabin > *').toggleClass('closeBlock');
		$('.cabin').toggleClass('hideCabin');
		stage4.getTmpl('iframeWith404.html', '.popup');
		timerCtrl.updateTimer();
	};

    function moveToLadder() {
		if(isDotGameOpened) return;
		$(hero).trigger('hero:moveForward', {distance: 625});
		$(hero).on('hero:heroHasCome', loadDotGame);
    };

/*DOT Game start*/
    function loadDotGame() {
			if($('#pauseBtn').hasClass('play') || isDotGameOpened) {
				return;
			}else {
				isDotGameOpened = true;
				$(hero).trigger('hero:clearHasComeEvent');
				stage4.getTmpl('popupFrameTmpl.html').then(function() {
				stage4.getTmpl('stage4DotGameTmpl.html','.popup', null, startDotGame);
		});
			}
    };

    function startDotGame() {
    	var dotGame = new ClickOnDotGame();
    	$('.startGameBtn, .retryBtn').on('click', dotGame.startClickGame); 
    };

    function ClickOnDotGame() {
    	var singleGameTime = 5;
			var points = 0;
			var seconds = singleGameTime;
			var totalTime = 1; /*this for reduce total second that adding when click on green dot*/
			var maxLeftCoordinate = 567;
			var maxTopCoordinate = 275;
			var minTop = 70; /*correction because there are stat-blocks on the top of game field*/
			/*intervals*/
			var gameTime;
			var attempts = 3;
			var tempTime;

			this.startClickGame = function() {
				var self = this;
				onGameInterface();
				createNewDot();
				showVisualization();
				attempts--;
				$('#pauseBtn').on('click', function(){
					if(isDotGameFinished) return;
					if($(this).hasClass('play')) {
						clearInterval(gameTime);
						resetVisual()
					} else {
						seconds = tempTime;
						
				showVisualization();
						gameTime = setInterval(function() {
					seconds -= 0.1;
					tempTime =seconds;
					if( seconds <= 0) { 
						clearInterval(gameTime);
						if((points >= 30) || (attempts == 0)) {
								finishGame();
						} else {
							onInfoInterface();
							resetTimerAndPoints();
						}
					}
				}, 100);
					}
		})
				gameTime = setInterval(function() {
					seconds -= 0.1;
					tempTime =seconds;
					if( seconds <= 0) { 
						clearInterval(gameTime);
						if((points >= 30) || (attempts == 0)) {
							finishGame();
						} else {
							onInfoInterface();
							resetTimerAndPoints();
						}
					}
				}, 100);
			};

		function clearVisualTimer() {
			$('.visualTimer').removeClass('addAnimation').removeClass('scaleToZero');
		};

		function showVisualization() {
			$('.visualTimer').hide("scale", {percent: 0, direction: 'horizontal'}, (seconds.toFixed(2) * 1000));
		};

		function resetVisual() {
			$('.visualTimer').stop(true, true).css({'display' : 'block'});	
		};

		function onGameInterface() {
			$('.playGround .gameResults').addClass('closeBlock');
			$('.playGround').removeClass('infoBackground');
			$('.startGameBtn').addClass('closeBlock');
			$('.retryBtn').addClass('closeBlock');
			$('.clickCounter').removeClass('closeBlock');
			$('.timer').removeClass('closeBlock');
			$('.attempts').addClass('closeBlock');
		};

		function onInfoInterface() {
			$('.playGround > .dot, .playGround > .fakeDot').remove();
			$('.playGround .gameResults').removeClass('closeBlock');
			$('.retryBtn').removeClass('closeBlock');
			$('.attempts').removeClass('closeBlock');
			$('.clickCounter').addClass('closeBlock');
			$('.timer').addClass('closeBlock');
		};

		function finishGame() {
			(points >= 30) ? stage4.sendTaskResults({'game':'dotGame', 'result':true}) : stage4.sendTaskResults({'game':'dotGame', 'result':false}); 
			isDotGameFinished = true;
			resetVisual();
			onInfoInterface();
			clearInterval(gameTime);
			resetTimerAndPoints();
			stage4.closePopup();
			timerCtrl.updateTimer();
			$('#inventory').trigger('inventory:addItem', {name:'.detail-7'});
		};

		function resetTimerAndPoints() {
			resetVisual();
			seconds = singleGameTime;
			points = 0;
			totalTime = 1;
			$('.clickCounter .points').text(points);
			$('.attempts .attemptCount').text(attempts);
		};

		function createNewDot() {
			if ($('.fakeDot').length) $('.fakeDot').remove();
			var dot = $('<div class="dot"></div>');
			var randomTop = Math.floor( Math.random() * (maxTopCoordinate - minTop) + minTop);
			var randomLeft = Math.floor( Math.random() * maxLeftCoordinate );

			$(dot).css({'transform' : 'translate(' + randomLeft + 'px,' + randomTop +'px)' });
			$(dot).on('click', dotClick);	
			$('.playGround').append(dot);
			createTotalDots();
		};

		function createTotalDots() {
			var random = Math.floor( (Math.random() * 100) + 1 );
			var fakeDotsCount = Math.floor( (Math.random() * 100) + 1);
			var dots = (fakeDotsCount < 50) ?  dots = 1 : dots = 2;

			for (var i = 0; i < dots; i++) {
				if (points > 0 && points <= 5) {
					if(random <= 5) createFakeDots(' 5');
				} else if(points <= 10 ) {
					if(random <= 25  ) createFakeDots(' 25');
				} else if(points <= 30) {
					if(random <= 50) createFakeDots('50');
				} else {
					if(random <= 70) createFakeDots('70'); 
				}
			}
		};

		function createFakeDots(perc) {
			var fakeDot = $('<div class="fakeDot"></div>');
			var randomTop = Math.floor( Math.random() * (maxTopCoordinate - minTop)) + minTop;
			var randomLeft = Math.floor( Math.random() * maxLeftCoordinate);
			var coordinates = correctCoordinates(randomTop, randomLeft);

			$(fakeDot).css({'transform' : 'translate(' + coordinates.left + 'px,' + coordinates.top +'px)' });
			$(fakeDot).on('click', fakeClick);
			decorateFakeDot(fakeDot);
			$('.playGround').append(fakeDot);
		};

		function correctCoordinates(top, left) {
			var realDot = $('.dot');
			var fakeDot = $('.fakeDot');

			switch(chekOnImposition(top, left, realDot)) {
				case 1: 
					((top + 50) > maxTopCoordinate) ? top -= 100 : top += 50;
					break;
				case 2:
					((top + 50) > maxTopCoordinate) ? top -= 100 : top += 50;
					break;
				case 3:
					((top + 100) > maxTopCoordinate) ? top -= 50 : top += 100;
					break;
				case 4:
					((top + 100) > maxTopCoordinate) ? top -= 50 : top += 100;
					break;
			}
			if(fakeDot.length && chekOnImposition(top, left, fakeDot)) {
				var correctState; 

				((left + 120) > maxLeftCoordinate) ? left -= 120 : left += 120;
				correctState = chekOnImposition(top, left, realDot);
				if(correctState == 1 || correctState == 2) ((top + 50) > maxTopCoordinate) ? top -= 100 : top += 50;
				if(correctState == 3 || correctState == 4) ((top + 100) > maxTopCoordinate) ? top -= 50 : top += 100;
			}
			return {
				top: top,
				left: left
			};
		};

		function chekOnImposition(top, left, dotToCompare) {
			var realDot = $('.dot');
			var fakeDot = $('.fakeDot');
			var comparingDotLeft =  parseInt( $(dotToCompare).css('transform').split(',')[4], 10); 
			var comparingDotTop = parseInt( $(dotToCompare).css('transform').split(',')[5], 10);
			var dotHeight = 50;
			var dotWidth = 50;
			var case1 = 1,   /* imposition cases*/
				case2 = 2,
				case3 = 3,
				case4 = 4;

			if(top > comparingDotTop && top < comparingDotTop + dotHeight) {
				if(left >= comparingDotLeft && left <= comparingDotLeft + dotWidth) {
					return case1	
				} else if(left +  dotWidth >= comparingDotLeft &&  left + dotWidth <= comparingDotLeft + dotWidth) {
					return case2
				}
			} else if(top + dotHeight > comparingDotTop && top + dotHeight < comparingDotTop + dotHeight) {
				if(left >= comparingDotLeft && left <= comparingDotLeft + dotWidth) {
					return case3
				} else if(left + dotWidth >= comparingDotLeft &&  left + dotWidth <= comparingDotLeft + dotWidth) {
					return case4
				}
			}
			return 0;		
		};

		function decorateFakeDot(dot) {
						/* yellow      blue        red         orange    */
			var colors = ['#e5d943', '#2dafbc', '#d95d5d', '#faae1a'];
			var randomColor = Math.floor( Math.random() * 4);
			var randomPicture = Math.floor( Math.random() * 4); 

			$(dot).css('background-color', colors[randomColor]);
		};

		function fakeClick() {
			var coordinates = {
				top: parseInt( $(this).css('transform').split(',')[5], 10),
			 	left: parseInt( $(this).css('transform').split(',')[4], 10)
			};

			seconds -= 0.2;
			showClickResult('-0.2 sec', coordinates);
			$(this).remove();
		};

		function removeDot() {
			$('.dot').remove();
		};

		function dotClick () {
			var min = 0.1;
			var max = 2;
			var coordinates = {
				top: parseInt( $(this).css('transform').split(',')[5], 10),
			 	left: parseInt( $(this).css('transform').split(',')[4], 10)
			};
			(max - (totalTime / 10) > min) ? seconds += max - (totalTime / 10) : seconds += min;
			totalTime++;
			showClickResult('+' + ((max - (totalTime / 10) > min) ? (max - (totalTime / 10)).toFixed(1) :  min) + ' sec', coordinates);
			removeDot();
			createNewDot();
			points++;	
			updatePoints(points);
			resetVisual();
			showVisualization();
		}; 

		function updatePoints(points) {
			$('.points').text(points);
		};

		function showClickResult(message, coordinates) {
			var block = '<div class="underDotMsg">' + message + '</div>';
			$('.playGround').append(block);
			$('.underDotMsg')
				.css({'top': coordinates.top + 'px', 'left': coordinates.left + 'px'})
				.animate({'top': coordinates.top - 10 + 'px'}, 300, function() {
					$('.underDotMsg').remove();
				});
		};
  };
    return stage4;
});