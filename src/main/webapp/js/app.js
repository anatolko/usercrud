var crudApp = angular.module('crudApp', ['ngResource','ui.bootstrap']);

// сервис для работы с rest-сервисом пользователей
crudApp.factory('UserService', ['$resource',
    function($resource) {
        return $resource('user/:id', {},
            {
                'update': { method:'PUT',params: {id: '@id'} }
            }
        );
    }
]);

// контроллер для управления списком пользователей
crudApp.controller('UserListCtrl', ['$scope', 'UserService',
    function($scope, UserService, $filter) {

        $scope.users = [];
        
        $scope.sort = {       
            sortingOrder : 'id',
            reverse : false
        };
    
        $scope.gap = 5;
        
        $scope.filteredUsers = [];
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.totalItems = 0;

        $scope.$watch('currentPage + sort.sortingOrder + sort.reverse + users', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;
            
            $scope.users.sort(function(a, b){
                switch ($scope.sort.sortingOrder)
                {
                    case 'id':  var keyA = a.id,
                                keyB = b.id;
                                break;
                    case 'name': var keyA = a.name,
                                 keyB = b.name;
                                 break;
                    case 'age': var keyA = a.age,
                                 keyB = b.age;
                                 break;
                    case 'createdOn': var keyA = new Date(a.createdOn),
                                 keyB = new Date(b.createdOn);
                                 break;
                    case 'isAdmin': var keyA = a.admin,
                                 keyB = b.admin;
                                 break;
                }
                
                // Compare the 2 dates
                var flag = 1;
                if ($scope.sort.reverse) {
                    flag = flag * -1;
                }
                if(keyA < keyB) return -1*flag;
                if(keyA > keyB) return 1*flag;
                return 0;
            });
            
            $scope.filteredUsers = $scope.users.slice(begin, end);
            $scope.totalItems = $scope.users.length;
            


        });
         

        // получаем пользователей
        UserService.get(function(data) {
            if (data && data._embedded) {
                $scope.users = data._embedded.users;
                
            }
        });

         // добавляет пользователя
        $scope.addUser = function() {
            if ($scope.user.name && $scope.user.age) {
                UserService.save(
                        {
                            name: $scope.user.name,
                            age: $scope.user.age,
                            admin: !!$scope.user.admin === true ? true : false,
                            createdOn: new Date()
                        }, function() {
                            // очищаем форму
                            $scope.user = null;
                            
                            // обновляем список пользователей
                            UserService.get(function(data) {
                                if (data && data._embedded) {
                                    $scope.users = data._embedded.users;
                                }
                            });
                        }
                );
            }
        };

        $scope.selectedUsers = [];  // список выбранных пользователей

        // удаляет выбранных пользователей
        $scope.deleteUsers = function() {
            $scope.selectedUsers.forEach(function(user, idx) {
                UserService.remove({id: user.id}, function() {
                    // удаляем пользователя из выбранных пользователей
                    $scope.selectedUsers.splice(idx, 1);

                    // удаляем из списка пользователей
                    $scope.users.forEach(function(origUser, idx) {
                        if (origUser.id === user.id) {
                            $scope.users.splice(idx, 1);
                        }
                    });
                });
            });
        };

        // выбирает всех пользователей в списке
        $scope.checkAll = function() {
            // очищаем список выбранных пользователей
            $scope.selectedUsers = [];

            // выставляем свойство - выбрать всех или нет
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }

            // отмечаем каждую запись
            angular.forEach($scope.users, function (user) {
                user.isSelected = $scope.selectedAll;
            });

            // получаем список выбранных пользователей
            $scope.selectedUsers = $scope.users.filter(function(user) {
                return user.isSelected === true;
            });
        };

        // отмечает пользователя в списке
        $scope.check = function() {
            // получаем текущего пользователя
            var currentUser = this.user;
            // если выбрали - добавляем в список выбранных пользователей
            if (currentUser.isSelected) {
                $scope.selectedUsers.push(currentUser);
            } else {
                // иначе - удаляем из списка
                $scope.selectedUsers.forEach(function(user, idx) {
                    if (user.id === currentUser.id) {
                        $scope.selectedUsers.splice(idx, 1);
                    }
                });
            }
        };
        
        // отображает окно редактирования пользователя
        $scope.showEditUserWindow = function() {
            // устанавливаем в модальное окно выбранного пользователя
            $scope.editableUser = this.user;

            // показываем модальное окно
            $('#editUserModal').modal('toggle');
        };
        
        // редактирует пользователя
        $scope.editUser = function() {
            UserService.update(
                    {
                        id: $scope.editableUser.id
                    },
                    {
                        name: $scope.editableUser.name,
                        age: $scope.editableUser.age,
                        admin: !!$scope.editableUser.admin === true ? true : false,
                        createdOn: $scope.editableUser.createdOn
                    }, function() {
                        // обнуляем пользователя для редактирования
                        $scope.editableUser = null;

                        // закрываем модальное окно
                        $('#editUserModal').modal('toggle');
                    });
        };
    }]);

crudApp.$inject = ['$scope', '$filter'];

crudApp.directive("customSort", function() {
return {
    restrict: 'A',
    transclude: true,    
    scope: {
      order: '=',
      sort: '='
    },
    template : 
      ' <a ng-click="sort_by(order)" style="color: black;cursor: pointer;text-decoration:none;">'+
      '    <span ng-transclude></span>'+
      '    <i ng-class="selectedCls(order)"></i>'+
      '</a>',
    link: function(scope) {
                
    // change sorting order
    scope.sort_by = function(newSortingOrder) {       
        var sort = scope.sort;
        
        if (sort.sortingOrder == newSortingOrder){
            sort.reverse = !sort.reverse;
        }                    

        sort.sortingOrder = newSortingOrder;        
    };
    
   
    scope.selectedCls = function(column) {
        if(column == scope.sort.sortingOrder){
            return ('glyphicon glyphicon-sort-by-' + ((scope.sort.reverse) ? 'attributes-alt' : 'attributes'));
        }
        else{            
            return'glyphicon glyphicon-sort' 
        } 
    };      
  }// end link
}
});