define(function(require) {
    var $ = require('jquery');
    var allStages = require('./levels.js'); 
    var Invetory = require('./Inventory.js');
    var Character = require('./Character.js');

    var Quest = function() {          
        var quest = this;
        //var spentTime = 0;
        //var startTime = 0;
        quest.currentStage = 0;
        quest.inventory = new Invetory();
        quest.character = new Character();
       
        quest.startQuest = function(stage) {
            startTimer();
            quest.currentStage = stage || 0;         
            initMainModuleEvents();
            initInventoryModuleEvents();
            initCharacterModuleEvents(); 
            activateStageInventory (stage);  
            quest.nextStage(quest.currentStage);
        };

        quest.nextStage = function(passedStage) {  
            var stageObj = {};
            resetCharacter();
            (parseInt(passedStage)) ? quest.currentStage = passedStage : quest.currentStage++;
            writeStageToLS(quest.currentStage);
            clearMainContent();           
            stageObj = allStages[quest.currentStage - 1];  /* -1 because 1st stage in allStages array has zero index*/         
            stageObj.openStage(stageObj); 
        };
         function activateStageInventory (stage) {
            var inventory = $('.itemIcon');
            var n = 0 ;
            switch(stage) {
                case 2: n = 2;
                    break;
                case 3: n = 4;
                    break;
                case 4:n = 6
                    break;
                default: break;
            }
            for (var i = 0; i < n; i++) {
                $((inventory)[i]).removeClass('noItem');
            }

        }

        function startTimer() {
            $.ajax({
                url: '/time',
                method: 'GET'
            })
            .done( function(data) {
                var spentTime = data.seconds || 0;
                $(document).ready(function() {
                    var startTime = new Date().getTime();

                    $(window).unload(function() {
                        console.log('SPEND TIME   ' + (new Date().getTime() - startTime));
                        console.log('SPEND TIME   ' + spentTime);
                        spentTime += (new Date().getTime() - startTime);
                        saveTimeOnServer(spentTime);
                    });
                });
            });
        };

        function saveTimeOnServer(time) {
            $.ajax({
                url: '/time',
                method: 'POST',
                contentType: "application/json",
                data: JSON.stringify({seconds : time})
            });
        };

        function writeStageToLS(stage) {
            localStorage.setItem("currentStage", stage);
        };

        function getStageFromLS() {
           return parseInt(localStorage.getItem("currentStage"), 10) || 0;
        };

        function initMainModuleEvents() {
            var module = $('#mainSection');  

            $(module).on('main:stageFinished', quest.nextStage);
        };

        function initInventoryModuleEvents() {  
            var module = $('#inventory');  
            
            $(module).on('inventory:addItem', function(event, item) {
                quest.inventory.addItem(event, item.name);
            });
            $(module).on('inventory:addAllItems', function() {
                quest.inventory.addAllItemsAnimation();
            });
        };

        function initCharacterModuleEvents() {
            var module = $('#hero');

            $(module).on('hero:moveForward', function(event, move) {
                quest.character.moveForward(move.distance);
            });
            $(module).on('hero:moveBack', function(event, move) {
                quest.character.moveBack(move.distance);
            });
            $(module).on('hero:climbUp', function() {
                quest.character.climbUp();
            });
            $(module).on('hero:initialPosition', function(event, position) {
                quest.character.setStartPosition(position.coordinates);
            });
            $(module).on('hero:clearHasComeEvent', function() {
                quest.character.clearHasComeEvent();
            });
        }; 

        function resetCharacter() {
            $(hero).off('hero:heroHasCome');
        };

        function clearMainContent() {
            $('#mainContent > *').remove();
        };
    };   
    return Quest;
});