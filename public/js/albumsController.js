(function(){
  angular.module('nitpic')
<<<<<<< HEAD
    .controller('albumsController', albumsController);


  albumsController.$inject = ['$scope', '$http', 'Upload', '$timeout', '$state', '$stateParams'];

  function albumsController($scope, $http, Upload, $timeout, $state, $stateParams){
    var rootUrl = 'http://localhost:3000';


    // self.getAlbums = function(){

      $http.get(`${rootUrl}/albums`)
      .then(function(response){
        if(response.data){
          self.albums = response.data.albums;
        } else {
          self.albums = {};
        }
      })
      .catch(function(err){
        console.error(err);
      })


    // }


    self.getUserAlbums = function(){
      $http.get(`${rootUrl}/user/${localStorage.getItem('user_id')}`)
=======
    .controller('mainController', mainController);


  mainController.$inject = ['$scope', '$http', 'Upload', '$timeout', '$state', '$stateParams'];

  function mainController($scope, $http, Upload, $timeout, $state, $stateParams){
    var rootUrl = 'http://localhost:3000';
    var self = this;

    // Get all albums
    self.getAllAlbums = function(){
      $http.get(`${rootUrl}/user/${localStorage.getItem('user_id')}/albums`)
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.allAlbums = response.data.albums
        console.log(self.allAlbums);
      })
    }
    // Get all albums associated with user
    self.getUserAlbums = function(){
      $http.get(`${rootUrl}/albums/${localStorage.getItem('user_id')}`)
>>>>>>> c7f70a164bfec245af664196e2903ce7f7c2bf4e
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.userAlbums = response.data.albums
        console.log(self.userAlbums);
      })
    }

    self.createAlbum = function(album) {
      var token = JSON.stringify(localStorage.getItem('token')).replace(/"/g,"");
      console.log(token);
      $http({
        method: 'POST',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums`,
        data: {
          album:
            {
              user_id : JSON.parse(localStorage.getItem('user_id')),
              title: album.title,
              description: album.description
            }
        }
      })
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        console.log(response);
        $state.go('home', {url: '/user-home'});
      })
    }

    self.showAlbum = function(albumId) {
      $http.get(`${rootUrl}/users/${localStorage.getItem('user_id')}/albums/${albumId}`)
      .then(function(response){
        album = response.data.album;
        console.log(album);
      })
      .catch(function(err){
        console.error(err);
      })
    }
<<<<<<< HEAD
    $scope.uploadPhoto = function(image){
      console.log("Uploading...");
      image.upload = Upload.upload({
        url: rootUrl + '/photos',
=======

    // Upload photo method
    $scope.uploadPhoto = function(image){
      console.log("Uploading...");
      image.upload = Upload.upload({
        url: url + '/photos',
>>>>>>> c7f70a164bfec245af664196e2903ce7f7c2bf4e
        data: {photo: {title: $scope.title, image: image}}
      })
      .then(function(response){
          console.log(response);
      })
      .catch(function(err){
        console.log(err);
      });

    }

    // Call methods on load
<<<<<<< HEAD
    // this.getAlbums();

  }
})()
=======
    // this.getAllAlbums();
  }
})()
console.log("mainController.js");
>>>>>>> c7f70a164bfec245af664196e2903ce7f7c2bf4e
