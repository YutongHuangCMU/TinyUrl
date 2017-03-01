var app = angular.module('tinyUrlApp');

app.controller('modalController', function ($scope, $http, $uibModalInstance, loginType) {
    $scope.loginType = loginType;
    $scope.ok = function () {
        if (loginType === "Sign Up") {
            authenticate("signup");
        } else if (loginType === "Log In") {
            authenticate("login");
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    function authenticate(postUrl) {
        $http.post("/api/v1/" + postUrl , {
            username: $scope.username,
            password: $scope.password //TODO: use https
        }).success(function (data) {
            var user = {
                username: $scope.username,
                token: data.token
            };
            $uibModalInstance.close(user);
        });
    }
});