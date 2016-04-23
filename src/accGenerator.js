(function() {
    'use strict';

    var fsp  = require('fs-promise');


    var accGenerator = {
            createUserInfoData: createUserInfoData,
            createAccounts: createAccounts,
            getAccounts: getAccounts
        },
        accounts = [];


    function getAccounts() {
        return accounts;
    }

/*    function getAddress() {
        fs.readFile('emails/emails.txt', 'utf-8', function(err, data) {
            if (err) return err;
            var addressArray = data.split(/\r?\n/);
            createAccounts(addressArray);
            createUserInfoData(addressArray);
        });
    }*/

    function createAccounts(address) {
       /* var accounts = [];*/

        for (var i = 0; i < address.length; i++) {
            var singleAccount = {};

            singleAccount.username = address[i].split('@')[0].toLowerCase();
            singleAccount.password = generatePassword();

            accounts.push(singleAccount);
        }
        return fsp.writeFile('users/userAccounts.json', JSON.stringify(accounts), function(err, data) {
            if (err) return err;

        });
    }

    function generatePassword() {
        var password = '';
        var passLength = Math.floor((Math.random() * (17 - 10)) + 10);
        var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var numbers = '0123456789';

        for (var i = 0; i < passLength; i++) {
            if((Math.floor((Math.random() * 100) + 1)) <= 70) {
                password += numbers.charAt(Math.floor((Math.random() * 10)));
            } else {
                password += letters.charAt(Math.floor((Math.random() * 52)));
            }
        }

        return password;
    }

    function createUserInfoData(address) {
        var users = [];

        for (var i = 0; i < address.length; i++) {
            var singleUserObj = {};

            singleUserObj.username = address[i].split('@')[0].toLowerCase();
            singleUserObj.currentStage = 0;
            singleUserObj.gameData = {
                wordGame: {
                    data: '',
                    result: false
                },
                pictureGame: {
                    data: 'picture4',
                    result: false
                },
                bashe: {
                    data: '',
                    result: false
                },
                dotGame: {
                    data: '',
                    result: false
                },
                combination:{
                    data: '',
                    result: false
                }
            };

            users.push(singleUserObj);
        }

        return fsp.writeFile('users/users.json', JSON.stringify(users), function(err, data) {
            if (err) return err;
        });
    }

    module.exports = accGenerator;
})();