(function() {
    'use strict';

    var router = require('express').Router(),
        fs = require('fs');

    router.get('/getStage', function(req, res) {
        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    res.json({ stage: users[i].currentStage });
                }
            }
        });
    });

    router.post('/setStage', function(req, res) {
        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    users[i].currentStage  = req.body.stage;
                    fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                        if (err) return err;
                    });
                }
            }
        });
        res.status(200).end();
    });

    router.post('/gameResult', function(req, res) {
        var userTaskDone = req.body.taskDone;

        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    users[i].gameData[userTaskDone.game].result = userTaskDone.result;

                    fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                        if (err) return err;
                    });
                }
            }
            res.status(200).end();
        });
    });

    router.post('/gameResult', function(req, res) {
        var userTaskDone = req.body.taskDone;
        console.log(userTaskDone.result)
        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    users[i].gameData[userTaskDone.game].result = userTaskDone.result;

                    fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                        if (err) return err;
                    });
                }
            }
            res.status(200).end();
        });
    });

    router
        .get('/wordGame', function(req, res) {
            var sendData;
            // maybe this function should be replaced?
            function shuffle(array) {
                var counter = array.length, temp, index;
                // While there are elements in the array
                while (counter > 0) {
                    // Pick a random index
                    index = Math.floor(Math.random() * counter);
                    // Decrease counter by 1
                    counter--;
                    // And swap the last element with it
                    temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }
                return array;
            }
            var userQuestion = {};

            fs.readFile('./questions.json', 'utf-8', function(err, data) {
                if (err) return err;
                var question = JSON.parse(data);
                var index = Math.round(Math.min(question.length-1, Math.random() * 10));

                userQuestion = question[index];
                sendData = {
                    question: userQuestion.question,
                    letters: shuffle((userQuestion.answer).split(''))
                };
                fs.readFile('users/users.json', 'utf-8', function(err, data) {
                    if (err) console.log('error');
                    var users = JSON.parse(data);
                    var userName = req.cookies.userName;

                    for (var i = 0; i < users.length; i++) {
                        if (users[i].username == userName) {
                            users[i].gameData.wordGame.data = userQuestion.answer.toLowerCase();
                            fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                                if (err) return err;
                            });
                        }
                    }
                });
                res.json({question: sendData});
            });
        })
        .post('/wordGame', function(req, res) {
            var word = req.body.word;

            fs.readFile('users/users.json', 'utf-8', function(err, data) {
                if (err) console.log('error');
                var users = JSON.parse(data);
                var userName = req.cookies.userName;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username == userName) {
                        if(word.toLowerCase() === users[i].gameData.wordGame.data) {
                            users[i].gameData.wordGame.result = true;
                            fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                                if (err) return err;
                            });
                        }
                    }
                }
                res.status(200).end();
            });
        });

    router.post('/pictureID', function(req, res) {
        var id = 'picture4';
        if(req.body.picture == id) {
            fs.readFile('users/users.json', 'utf-8', function(err, data) {
                if (err) console.log('error');
                var users = JSON.parse(data);
                var userName = req.cookies.userName;

                for (var i = 0; i < users.length; i++) {
                    if (users[i].username == userName) {
                        users[i].gameData.pictureGame.result = true;
                        fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                            if (err) return err;
                        });
                    }
                }
                res.status(200).end();
            });
        }
    });

    router.get('/getCombination', function(req, res) {
        var buttonsToClick = ["greenCircle", "orangeCircle", "blueCircle", "yellowCircle", "greenTriangle",
            "orangeTriangle","blueTriangle", "yellowTriangle", "greenSquare", "orangeSquare", "blueSquare","yellowSquare"];
        var userUniqCombination = [];

        function getUniqCombination(arr, combi) {
            var index =	Math.min( Math.round(Math.random()*10), arr.length - 1);

            if (combi.indexOf(arr[index]) === -1) {
                combi.push(arr[index])
            } else {
                getUniqCombination(arr,combi)
            }
            return combi;
        }

        while (userUniqCombination.length < 4) {
            getUniqCombination(buttonsToClick, userUniqCombination);
        }

        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    users[i].gameData.combination.data = userUniqCombination;
                    fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                        if (err) return err;
                    });
                }
            }
        });
        res.json({combination: userUniqCombination});
    });

    router.post('/combination', function(req, res) {
        var result = false;
        var userCombination = req.body.combination;

        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            var users = JSON.parse(data);
            var userName = req.cookies.userName;

            for (var i = 0; i < users.length; i++) {
                if (users[i].username == userName) {
                    var arr = users[i].gameData.combination.data;

                    for (var index = 0; index < arr.length; index++) {
                        if(arr[index] !== userCombination[index]) {
                            result = false;
                            break;
                        } else {
                            result =  true;
                        }
                    }
                    users[i].gameData.combination.result = result;
                    fs.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
                        if (err) return err;
                    });
                    return true;
                }
            }
        });
        res.status(200).end();
    });

    router.get('/badge', function(req, res) {
        fs.readFile('users/users.json', 'utf-8', function(err, data) {
            if (err) console.log('error');
            if(data){
                console.log(data)
            }
            try{
                var users = JSON.parse(data);
            }catch(err){
                console.log(err)
            }
            var users = JSON.parse(data);
            var userName = req.cookies.userName;
            var userResult = 100;

            for ( var i = 0; i < users.length; i++ ) {
                if ( users[i].username == userName ) {
                    for ( var game in users[i].gameData ) {
                        for ( var key in users[i].gameData[game] ) {
                            if(key == 'result') {
                                if(users[i].gameData[game][key] == false) {
                                    userResult -= 10;
                                }
                            }
                        }
                    }
                    var badge;
                    if(userResult >= 90) {
                        badge = {
                            'title' : 'Sherlock',
                            'src':'sherlock_180x180.png'
                        }
                    } else if(userResult >= 70 && userResult < 90) {
                        badge = {
                            'title' : 'Expert',
                            'src':'expert_180x180.png'
                        }
                    } else {
                        badge = {
                            'title' : 'Finder',
                            'src':'finder_180x180.png'
                        }
                    }
                    res.json({badge: badge});
                }
            }
        });
    });
    module.exports = router;
})();
