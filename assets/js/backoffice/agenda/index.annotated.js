angular.module('momi-agenda', ['ui.router'])
.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('agenda', {
        url : '/agenda',
        parent:'dashboard',
        params:{
                type:'MONTH',
                date: new Date(),
        },
        views:{
            'page1': {
                template: '<agenda items-list="itemsList"></agenda>',
                controller:["$scope", "itemsList", function($scope, itemsList){
                        $scope.itemsList = itemsList;
                }],
                resolve:{
                    itemsList :  ["$stateParams", "eventService", function( $stateParams, eventService){

                        console.log('RESOLVE EVENT');
                        return eventService.fetch();
                       
                        
                    }]
                }
            }

        }
       })
      

}]);

