
(function(){
  angular.module('nitpic')
     .controller('mainController', mainController);


  mainController.$inject = ['$scope', '$http', 'Upload', '$timeout', '$state', '$stateParams'];

  function mainController($scope, $http, Upload, $timeout, $state, $stateParams){
    var rootUrl = 'http://localhost:3000';
    var self = this;
    self.thisAlbum = $stateParams.album
    console.log('self', self)
  // ======================================================== //
                  // USERS CONTROLLER //
  // ======================================================== //

  // Get all users from backend
  self.getUsers = function(){
    $http.get(`${rootUrl}/users`)
    .catch(function(err){
      console.error(err);
    })
    .then(function(response){
      self.allUsers = response.data;
    });
  }

///////// AUTHORIZATION BEGIN //////////
  // User login
  self.login = function(userPass){
    $http.post(`${rootUrl}/users/login`, {user: {username: userPass.username, password: userPass.password}})
    .then(function(response){
      self.user = response.data.user
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('token', response.data.token);
      self.getUserAlbums();
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err){
      console.error(err);
    })
  }
  // Signup
  self.signup = function(userPass){
    $http.post(`${rootUrl}/users`, {user: {username: userPass.username, password: userPass.password }})
    .then(function(response) {
      self.user = response.data.user
      console.log(self.user);
      localStorage.setItem('user_id', JSON.stringify(response.data.user.id));
      localStorage.setItem('token', JSON.stringify(response.data.token));
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  // Logout
  self.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    $state.go('welcome', {url: '/'});
  }
///////// AUTHORIZATION END //////////

///////// CREATE ALBUMS  BEGIN //////////

  // ======================================================== //
                    // ALBUMS CONTROLLER //
  // ======================================================== //

    // self.getAllAlbums = function(){
    //   $http.get(`${rootUrl}/albums`)
    //   .catch(function(err){
    //     console.error(err);
    //   })
    //   .then(function(response){
    //     self.allAlbums = response.data.albums
    //     console.log(self.allAlbums);
    //   })
    // }

    self.getUserAlbums = function(){
      var token = JSON.stringify(localStorage.getItem('token')).replace(/"/g,"");
      $http({
        method: 'GET',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}`
      })
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.userAlbums = response.data.albums
      })
    }

    self.createAlbum = function(album) {
      var token = JSON.stringify(localStorage.getItem('token')).replace(/"/g,"");
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
      .then(function(response){
        // debugger;
        // self.thisAlbum = response.data.album;
        // $state.go('album-show', {album: album});
        self.showAlbum(response.data.album);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.updateAlbum = function(album, albumId) {
      $http({
        method: 'PATCH',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums/${albumId}`,
        data: {
          album:
            {
              title: album.title,
              description: album.description
            }
        }
      })
      .then(function(response){
        self.showAlbum(response.data.album);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.showAlbum = function(album) {
      $http.get(`${rootUrl}/albums/${album.id}`)
      .then(function(response){
        self.getAlbumOwner(album.user_id);
        self.thisAlbum = response.data.album;
      })
      .then(function(response){
        $state.go('album-show');
      })
      .catch(function(err){
        console.error(err);
      })
    }
    // Gets user that owns selected album
    self.getAlbumOwner = function(userId) {
      $http({
        method: 'GET',
        headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${userId}`,
      })
      .then(function(response){
        console.log("Getting album owner");
        console.log(response);
        self.thisAlbumOwner = response.data.user;
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.deleteAlbum = function(album){
      $http({
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums/${album.id}`
      })
      .then(function(response){
        console.log(response);
        self.getUserAlbums();
        $state.go('home');
      });
    }











    $scope.uploadPhoto = function(image){
      image.upload = Upload.upload({
        url: url + '/photos',
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

  // ======================================================== //
                  // PHOTOS CONTROLLER //
  // ======================================================== //

  }

})()
