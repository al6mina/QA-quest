define(function(require) {
    var Stage = require('src/js/Stage.js');    
    var stage4 = new Stage('stage4Tmpl.html');
    var $ = require('jquery');
    require('jqueryUi');

    stage4.initEvents = function() {
    	/* its temporarily until standard control is not define*/
    	var dotGame = new ClickOnDotGame();
    	$('.startGameBtn').on('click', dotGame.startClickGame);
		/*------------------------------------------*/
    };
    function ClickOnDotGame() {
    	var singleGameTime = 3;
		var points = 0;
		var seconds = singleGameTime;
		var totalTime = 1; /*this for reduce total second that adding when click on green dot*/
		var maxLeftCoordinate = 410;
		var maxTopCoordinate = 510;
		/*intervals*/
		var gameTime;

		this.startClickGame = function() {
			onGameInterface();
			createNewDot();
			showVisualization();
			gameTime = setInterval(function() {
				$('.digitalTimer').text(seconds.toFixed(2));
				seconds -= 0.1;
				if( seconds <= 0) { 
					clearInterval(gameTime);
					finishGame();
				}
			}, 100);
		};

		function clearVisualTimer() {
			$('.visualTimer').removeClass('addAnimation').removeClass('scaleToZero');
		};

		function showVisualization() {
			$('.visualTimer').hide("scale", {percent: 0, direction: 'horizontal'}, (seconds.toFixed(2) * 1000) + 4500);
		};

		function resetVisual() {
			$('.visualTimer').stop(true,true).css({'display' : 'block'});
			showVisualization();

		};

		function onGameInterface() {
			$('.playGround > *').remove();
			$('.startGameBtn').addClass('closeBlock');
			$('.clickCounter').removeClass('closeBlock');
			$('.timer').removeClass('closeBlock');
		};

		function onInfoInterface() {
			$('.playGround > *').remove();
			$('.startGameBtn').removeClass('closeBlock');
			$('.clickCounter').addClass('closeBlock');
			$('.timer').addClass('closeBlock');
		};

		function finishGame() {
			onInfoInterface();
			showResults(points);
			clearInterval(gameTime);
			resetTimerAndPoints();
			updatePoints(points);
		};

		function showResults(points) {
			var resultBlock = '<div class="gameResults"><p> Your points: ' + points + '</p></div>';
			$('.playGround').append(resultBlock);
		};

		function resetTimerAndPoints() {
			seconds = singleGameTime;
			points = 0;
			totalTime = 1;
			$('.digitalTimer').text(seconds.toFixed(2));
		};

		function createNewDot() {
			if ($('.fakeDot').length) $('.fakeDot').remove();
			var dot = $('<div class="dot"></div>');
			var randomTop = Math.floor( Math.random() * maxTopCoordinate );
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
/*			var realDot =  $('.dot');
			var realDotLeft =  parseInt( $(realDot).css('transform').split(',')[4], 10); 
			var realDotTop = parseInt( $(realDot).css('transform').split(',')[5], 10);
			var dotHeight = 70;
			var dotWidth = 70;*/
			var randomTop = Math.floor( Math.random() * maxTopCoordinate);
			var randomLeft = Math.floor( Math.random() * maxLeftCoordinate);
			var coordinates = correctCoordinates(randomTop, randomLeft);
			/* this code corrects coordinates of "fake" dot to prevent imposition of one on one*/
			/*if(randomTop > realDotTop && randomTop < realDotTop + dotHeight) {
				if(randomLeft >= realDotLeft && randomLeft <= realDotLeft + dotWidth) {
					randomTop += 70;
				} else if(randomLeft +  dotWidth >= realDotLeft &&  randomLeft + dotWidth <= realDotLeft + dotWidth) {
					randomLeft += 140;
				}
			} else if(randomTop + dotHeight > realDotTop && randomTop + dotHeight < realDotTop + dotHeight) {
				if(randomLeft >= realDotLeft && randomLeft <= realDotLeft + dotWidth) {
					randomTop += 140;
				} else if(randomLeft + dotWidth >= realDotLeft &&  randomLeft + dotWidth <= realDotLeft + dotWidth) {
					randomLeft += 140;
				}
			}*/
			$(fakeDot).css({'transform' : 'translate(' + coordinates.left + 'px,' + coordinates.top +'px)' });
			$(fakeDot).on('click', fakeClick);
			decorateFakeDot(fakeDot);
			$('.playGround').append(fakeDot);
		};

		/*  function impr    */

		function correctCoordinates(top, left) {
			var realDot = $('.dot');
			var fakeDot = $('.fakeDot');
			var realDotLeft =  parseInt( $(realDot).css('transform').split(',')[4], 10); 
			var realDotTop = parseInt( $(realDot).css('transform').split(',')[5], 10);
			var dotHeight = 70;
			var dotWidth = 70;

			if(top > realDotTop && top < realDotTop + dotHeight) {
				if(left >= realDotLeft && left <= realDotLeft + dotWidth) {
					
					console.log('---1---');

					console.log('top before: ' + top);
					((top + 70) > maxTopCoordinate) ? top -= 140 : top += 70;
					console.log('top after: ' + top);
				} else if(left +  dotWidth >= realDotLeft &&  left + dotWidth <= realDotLeft + dotWidth) {
					
					console.log('---2---');

					console.log('top before: ' + top);
					((top + 70) > maxTopCoordinate) ? top -= 140 : top += 70;
					console.log('top after: ' + top);
				}
			} else if(top + dotHeight > realDotTop && top + dotHeight < realDotTop + dotHeight) {
				if(left >= realDotLeft && left <= realDotLeft + dotWidth) {

					console.log('---3---');

					console.log('top before: ' + top);
					((top + 140) > maxTopCoordinate) ? top -= 70 : top += 140;
					console.log('top after: ' + top);
				} else if(left + dotWidth >= realDotLeft &&  left + dotWidth <= realDotLeft + dotWidth) {

					console.log('---4---');

					console.log('top before: ' + top);
					((top + 140) > maxTopCoordinate) ? top -= 70 : top += 140;
					console.log('top after: ' + top);
				}
			}

			if(fakeDot.length) {
				var fakeTop = parseInt( $(fakeDot).css('transform').split(',')[5], 10);
				var fakeLeft = parseInt( $(fakeDot).css('transform').split(',')[4], 10); 

				if( chekIfCoverFakeDot(top, left, fakeTop ,fakeLeft ,dotHeight, dotWidth) ) {

					( (left + 160) > maxLeftCoordinate) ? left -= 160 : left += 160;

					/*change this*/

					if(top > realDotTop && top < realDotTop + dotHeight) {
						if(left >= realDotLeft && left <= realDotLeft + dotWidth) {
							((top + 70) > maxTopCoordinate) ? top -= 140 : top += 70;
						} else if(left +  dotWidth >= realDotLeft &&  left + dotWidth <= realDotLeft + dotWidth) {
							((top + 70) > maxTopCoordinate) ? top -= 140 : top += 70;
						}
					} else if(top + dotHeight > realDotTop && top + dotHeight < realDotTop + dotHeight) {
						if(left >= realDotLeft && left <= realDotLeft + dotWidth) {
							((top + 140) > maxTopCoordinate) ? top -= 70 : top += 140;
						} else if(left + dotWidth >= realDotLeft &&  left + dotWidth <= realDotLeft + dotWidth) {
							((top + 140) > maxTopCoordinate) ? top -= 70 : top += 140;
						}
					}					
					/* ---------------------*/
					console.log('corrected');
				}
			}
			return {
				top: top,
				left: left
			};
		};

		function chekIfCoverFakeDot(top, left, fakeTop, fakeLeft,dotHeight,dotWidth) {
			if( (top > fakeTop && top < fakeTop + dotHeight) || (top + dotHeight > fakeTop && top + dotHeight < fakeTop + dotHeight) )  {
				if( (left >= fakeLeft && left <= fakeLeft + dotWidth) ||  (left +  dotWidth >= fakeLeft &&  left + dotWidth <= fakeLeft + dotWidth))	
				return true;
			}
			return false;
		};

		/*-------------------------*/
		function decorateFakeDot(dot) {
						/* yellow      blue        red         orange    */
			var colors = ['#E3DB00', '#1D28FF', '#FF1D28', '#FF8724'];
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
			/*max and min total time values*/
			var min = 0.1;
			var max = 2;
			var coordinates = {
				top: parseInt( $(this).css('transform').split(',')[5], 10),
			 	left: parseInt( $(this).css('transform').split(',')[4], 10)
			 };

	/*		(max - (totalTime / 10) > min) ? seconds += max - (totalTime / 10) : seconds += min;
			totalTime++;	*/
			seconds += 10;
			showClickResult('+' + ((max - (totalTime / 10) > min) ? (max - (totalTime / 10)).toFixed(1) :  min) + ' sec', coordinates);
			removeDot();
			createNewDot();
			points++;	
			updatePoints(points);
			resetVisual();
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