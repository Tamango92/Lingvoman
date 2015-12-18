"use strict";!function(){function e(e,o,t){e.interceptors.push("TokenInterceptor"),t.otherwise("/"),t.when("","/"),o.state("default",{url:"/",templateUrl:"/views/default.html"}).state("login",{url:"/login",templateUrl:"/views/login.html"}).state("uitranslates",{url:"/uitranslates",templateUrl:"/views/uitranslates.html"}).state("users",{url:"/users",templateUrl:"/views/users.html"})}function o(e,o,t){e.$on("$stateChangeStart",function(e,n,r,s,a){console.log("Going: "+n.name),t.isLogged||"login"==n.name||(e.preventDefault(),o.go("login")),t.isLogged&&"login"==n.name&&(e.preventDefault(),o.go("default"))})}angular.module("app",["ngResource","ui.bootstrap","ui.router"]),angular.module("app").config(e),angular.module("app").run(o),e.$inject=["$httpProvider","$stateProvider","$urlRouterProvider"],o.$inject=["$rootScope","$state","Auth"]}(),function(){function e(e){var o=this;o.role=e.sessionStorage.role?e.sessionStorage.role:"",o.name=e.sessionStorage.name?e.sessionStorage.name:""}angular.module("app").controller("ApplicationCtrl",e),e.$inject=["$window"]}(),function(){function e(e){var o={isLogged:function(){return!!e.sessionStorage.token}()};return console.log(o),o}function o(e,o,t){return{login:function(e,t){var n=o("/login");return n.save({username:e,password:t})},logout:function(){t.isLogged&&delete e.sessionStorage.token}}}angular.module("app").factory("Auth",e),e.$inject=["$window"],angular.module("app").factory("UserAuthFactory",o),o.$inject=["$window","$resource","Auth"]}(),function(){function e(e){var o=this;o.growls=[],o.closeGrowl=function(e){o.growls.splice(e,1)},e.$on("growl",function(e,t){o.growls.push(t)})}angular.module("app").controller("GrowlCtrl",e),e.$inject=["$rootScope"]}(),function(){function e(e,o){return{request:function(o){return e.sessionStorage.token&&(o.headers["x-access-token"]=e.sessionStorage.token),o},responseError:function(e){return-1!==[400,401].indexOf(e.status)&&e.data.message?o.$broadcast("growl",{type:"danger",msg:e.data.message}):o.$broadcast("growl",{type:"danger",msg:"Непредвиденная ошибка"}),e}}}angular.module("app").factory("TokenInterceptor",e),e.$inject=["$window","$rootScope"]}(),function(){function e(e,o,t,n){var r=this;r.user={},r.login=function(){var n=r.user.username,s=r.user.password;void 0!==n&&void 0!==s?t.login(n,s).$promise.then(function(t){t.token&&(e.sessionStorage.token=t.token,e.sessionStorage.role=t.user.role,e.sessionStorage.name=t.user.name,o.isLogged=!0,console.log("logged in",t.token),e.location.reload())}):console.log("EMPTY FIELD!")}}angular.module("app").controller("LoginCtrl",e),e.$inject=["$window","Auth","UserAuthFactory","$rootScope"]}(),function(){function e(e,o){var t=this;t.newUser={username:"",password:"",userObj:{name:"",role:""}},t.usersList=[],t.rolesList=["admin","translater"];var n=e("/api/users",{},{put:{method:"PUT"}});t.getUsers=function(){n.query().$promise.then(function(e){console.log(e),t.usersList=e})},t.createUser=function(){t.creationForm.$valid?n.put(t.newUser).$promise.then(function(e){t.getUsers(),console.log(e),400!=e.status&&o.$broadcast("growl",{type:"success",msg:"Пользователь создан"})}):o.$broadcast("growl",{type:"danger",msg:"Форма заполнена не корректно"})},t.chooseRole=function(e){t.newUser.userObj.role=e},t.deleteUser=function(e,r){confirm("Вы уверены, что хотите удалить пользователя "+r+" ?")&&n["delete"]({username:r}).$promise.then(function(n){if(console.log(n),n.ok){var r=t.usersList.indexOf(e);t.usersList.splice(r,1),o.$broadcast("growl",{type:"success",msg:"Пользователь удален"})}else o.$broadcast({type:"danger",msg:"Не удалось удалить пользователя."})})},t.getUsers()}angular.module("app").controller("UsersCtrl",e),e.$inject=["$resource","$rootScope"]}(),function(){function e(e,o,t){var n=this;n.id="",n.locale="",n.data=[],n.copiesList=[];var r=e("/api/uitranslate/list"),s=e("/api/uitranslate/item",{},{put:{method:"PUT"}}),a=e("/api/uitranslate/backup");n.init=function(){r.query().$promise.then(function(e){console.log(e),n.initList=e})},n.chooseProject=function(e){n.id=e.projectID,n.chosen=e},n.getTrans=function(){n.gettingForm.$valid&&(s.query({projectID:n.id,locale:n.locale}).$promise.then(function(e){console.log(e),n.data=e;for(var t=0;t<n.data.length;t++)n.data[t].translations||(n.data[t].translations={});n.data.length?o.$broadcast("growl",{type:"success",msg:"Переводы получены!"}):o.$broadcast("growl",{type:"danger",msg:"Подходящих файлов не найдено. Проверьте данные."})}),n.copiesList=[])},n.changeTranslation=function(e){confirm("Вы уверены, что хотите сохранить?")&&(delete e._id,console.log(e),s.save(e).$promise.then(function(t){console.log(t),t.ok&&(o.$broadcast("growl",{type:"success",msg:"Документ "+e.projectAlphaId+" "+e.locale+" сохранен!"}),n.copiesList=[])}))},n.makeNew=function(){if(n.gettingForm.$valid){var e=prompt("Буквенное название проекта","project");n.id&&n.locale&&e&&s.put({projectID:n.id,locale:n.locale,projectAlphaId:e}).$promise.then(function(e){400==e.status?o.$broadcast("growl",{type:"danger",msg:"Этот проект уже имеет как минимум 1 файл переводов!"}):(o.$broadcast("growl",{type:"success",msg:"Документ создан"}),n.getTrans())})}},n.deleteField=function(e,o,t){delete e[o][t]},n.addField=function(e,o,t){e[o][t.toUpperCase()]?console.error("field already exists!"):e[o][t.toUpperCase()]=""},n.deleteGroup=function(e,o){console.log("deleted"),delete e[o]},n.addGroup=function(e,o){e[o.toLowerCase()]?console.error("field already exists!"):e[o.toLowerCase()]={}},n.makeCopy=function(e){var t=prompt("На какой язык переводим?: "),r=JSON.parse(JSON.stringify(e));t&&s.query({projectID:r.projectID,locale:t}).$promise.then(function(e){e.length?o.$broadcast("growl",{type:"danger",msg:"Такой документ уже существует."}):(r.locale=t,n.data.push(r),o.$broadcast("growl",{type:"warning",msg:"Документ создан локально. Не забудьте сохранить изменения!"}))})},n.removeDoc=function(e){confirm("Вы собираетесь ПОЛНОСТЬЮ удалить файл переводов "+e.locale+" для проекта "+e.projectID+"-"+e.projectAlphaId)&&s["delete"](e).$promise.then(function(t){if(console.log(t),t.ok){var r=n.data.indexOf(e);n.data.splice(r,1),o.$broadcast("growl",{type:"success",msg:"Документ успешно удален."})}else o.$broadcast("growl",{type:"danger",msg:"Произошла непредвиденная ошибка."})})},n.checkCopies=function(){a.query({}).$promise.then(function(e){console.log(e),n.copiesList=e,n.data=[]})},n.restore=function(e,t){confirm("Вы хотите восстановить/заменить основной документ резервной копией?")&&a.save({projectID:e,locale:t}).$promise.then(function(r){console.log(r),r.ok?(o.$broadcast("growl",{type:"success",msg:"Документ успешно восстановлен!"}),n.copiesList=[],n.id=e,n.locale=t,n.init()):o.$broadcast("growl",{type:"danger",msg:"Произошла непредвиденная ошибка."})})},n.init()}angular.module("app").controller("UiTranslatesCtrl",e),e.$inject=["$resource","$rootScope","$window"]}();