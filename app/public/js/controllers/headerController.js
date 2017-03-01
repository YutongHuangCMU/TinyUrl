var app = angular.module('tinyUrlApp');

app.controller('headerController', function($window, $scope, $uibModal) {
    $scope.isLoggedIn = JSON.parse($window.sessionStorage.isLoggedIn || false);
    $scope.username = JSON.parse($window.sessionStorage.username || '{}');

    function openModal(loginType) {
        $uibModal.open({
            templateUrl: "./public/views/modal.html",
            controller: "modalController",
            size: "sm",
            resolve: {
                loginType: function () {
                    return loginType;
                }
            }
        }).result.then(function (data) {
            $scope.isLoggedIn = true;
            $scope.username = data.username;
            updateSessionStorage(data.username, data.token, true);
        });
    }

    $scope.signup = function() {
        openModal("Sign Up");
    };
    $scope.login = function() {
        openModal("Log In");
    };
    $scope.logout = function() {
        $scope.isLoggedIn = false;
        $scope.username = {};
        updateSessionStorage({}, {}, false);
    };

    function updateSessionStorage(username, token, isLoggedIn) {
        $window.sessionStorage.username = JSON.stringify(username);
        $window.sessionStorage.token = JSON.stringify(token);
        $window.sessionStorage.isLoggedIn = JSON.stringify(isLoggedIn);
    }
});
