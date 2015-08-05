var crudApp = angular.module('crudApp', ['ngResource', 'ui.bootstrap']);

// сервис для работы с rest-сервисом пользователей
crudApp.factory('UserService', ['$resource',
    function ($resource) {
        return $resource('user/:id', {},
            {
                'update': {method: 'PUT', params: {id: '@id'}}
            }
        );
    }
]);

// контроллер для управления списком пользователей
crudApp.controller('UserListCtrl', ['$scope', 'UserService',
    function ($scope, UserService, $filter) {


        $scope.sort = {
            sortingOrder: 'id',
            order: "asc",
            reverse: false
        };


        $scope.$watch('currentPage + sort.sortingOrder + sort.reverse + users', function () {

            // получаем пользователей
            UserService.get({
                size: 10,
                page: $scope.currentPage - 1,
                sort: ($scope.sort.sortingOrder + "," + $scope.sort.order)
            }, function (data) {
                if (data && data._embedded) {
                    $scope.users = data._embedded.users;

                    $scope.totalItems = data.page.totalElements;
                    $scope.numPages = data.page.totalPages;
                    $scope.numPerPage = data.page.size;

                }
            });


        });


        // добавляет пользователя
        $scope.addUser = function () {
            if ($scope.user.name && $scope.user.age) {
                UserService.save(
                    {
                        name: $scope.user.name,
                        age: $scope.user.age,
                        admin: !!$scope.user.admin === true ? true : false,
                        createdOn: new Date()
                    }, function () {
                        // очищаем форму
                        $scope.user = null;

                        // обновляем список пользователей
                        UserService.get(function (data) {
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
        $scope.deleteUsers = function () {
            $scope.selectedUsers.forEach(function (user, idx) {
                UserService.remove({id: user.id}, function () {
                    // удаляем пользователя из выбранных пользователей
                    $scope.selectedUsers.splice(idx, 1);

                    // удаляем из списка пользователей
                    $scope.users.forEach(function (origUser, idx) {
                        if (origUser.id === user.id) {
                            $scope.users.splice(idx, 1);
                        }
                    });
                });
            });
        };

        // выбирает всех пользователей в списке
        $scope.checkAll = function () {
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
            $scope.selectedUsers = $scope.users.filter(function (user) {
                return user.isSelected === true;
            });
        };

        // отмечает пользователя в списке
        $scope.check = function () {
            // получаем текущего пользователя
            var currentUser = this.user;
            // если выбрали - добавляем в список выбранных пользователей
            if (currentUser.isSelected) {
                $scope.selectedUsers.push(currentUser);
            } else {
                // иначе - удаляем из списка
                $scope.selectedUsers.forEach(function (user, idx) {
                    if (user.id === currentUser.id) {
                        $scope.selectedUsers.splice(idx, 1);
                    }
                });
            }
        };

        // отображает окно редактирования пользователя
        $scope.showEditUserWindow = function () {
            // устанавливаем в модальное окно выбранного пользователя
            $scope.editableUser = this.user;

            // показываем модальное окно
            $('#editUserModal').modal('toggle');
        };

        // редактирует пользователя
        $scope.editUser = function () {
            UserService.update(
                {
                    id: $scope.editableUser.id
                },
                {
                    name: $scope.editableUser.name,
                    age: $scope.editableUser.age,
                    admin: !!$scope.editableUser.admin === true ? true : false,
                    createdOn: $scope.editableUser.createdOn
                }, function () {
                    // обнуляем пользователя для редактирования
                    $scope.editableUser = null;

                    // закрываем модальное окно
                    $('#editUserModal').modal('toggle');
                });
        };
    }]);

crudApp.$inject = ['$scope', '$filter'];

crudApp.directive("customSort", function () {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            order: '=',
            sort: '='
        },
        template: ' <a ng-click="sort_by(order)" style="color: black;cursor: pointer;text-decoration:none;">' +
        '    <span ng-transclude></span>' +
        '    <i ng-class="selectedCls(order)"></i>' +
        '</a>',
        link: function (scope) {

            // change sorting order
            scope.sort_by = function (newSortingOrder) {
                var sort = scope.sort;

                if (sort.sortingOrder == newSortingOrder) {
                    sort.reverse = !sort.reverse;
                    if (sort.reverse) {
                        sort.order = "desc";
                    }
                    else {
                        sort.order = "asc";
                    }
                }

                sort.sortingOrder = newSortingOrder;
            };


            scope.selectedCls = function (column) {
                if (column == scope.sort.sortingOrder) {
                    return ('glyphicon glyphicon-sort-by-' + ((scope.sort.reverse) ? 'attributes-alt' : 'attributes'));
                }
                else {
                    return 'glyphicon glyphicon-sort'
                }
            };
        }// end link
    }
});