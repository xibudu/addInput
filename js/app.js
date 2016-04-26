angular.module('myApp', ['ng'])
  .controller('myCtrl', function ($scope) {
    var i=1;
    $scope.lists = [];
    $scope.add=function(){
      var obj={index:i++};
      $scope.lists.push(obj);
    };

    $scope.del=function(idx){
      $scope.lists.splice(idx,1);
    };
    $scope.submit = function () {
      $scope.lists.sort(function(a,b){
        return a.index- b.index;
      });
      var json = {};
      $.each($scope.lists,function(i,v){
        json[v.key]= v.value;
      });
      console.log(json);
    }
  });