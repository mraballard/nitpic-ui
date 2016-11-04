(function() {
  angular.module('nitpic', ['ui.router', 'ngFileUpload'])
    .config(AuthRouter);


    AuthRouter.$inject = ['$stateProvider', '$urlRouterProvider']

    function AuthRouter($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('welcome', {
          url: '/',
          templateUrl: '../partials/_welcome.html'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: '../partials/_signup.html'
        })
        .state('login', {
          url: '/login',
          templateUrl: '../partials/_login.html'
        })
         .state('home', {
          url: '/user-home',
          templateUrl: '../partials/_user-home.html'
        })
        .state('gallery', {
          url: '/gallery',
          templateUrl: '../partials/_gallery.html'
        })
        .state('album-show', {
          url: '/album-show',
          templateUrl: '../partials/_album-show.html',
          // controller: 'mainController',
          // controllerAs: 'album'
        })
        .state('new-album', {
         url: '/new-album',
         templateUrl: '../partials/_create-album.html'
       })
        .state('photo-show', {
          url: '/photo-show',
          templateUrl: '../partials/_photo-show.html'
        })
        .state('contact', {
          url: '/contact',
          templateUrl: '../partials/_contact.html'
        })


        $urlRouterProvider.otherwise('/');

      }

})()


console.log("app.js");
