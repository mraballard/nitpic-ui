
(function(){
  angular.module('nitpic')
     .controller('mainController', mainController);


  mainController.$inject = ['$scope', '$http', 'Upload', '$timeout', '$state', '$stateParams'];

  function mainController($scope, $http, Upload, $timeout, $state, $stateParams){
    var rootUrl = 'http://localhost:3000';
    var self = this;
  // ======================================================== //
                  // USERS CONTROLLER //
  // ======================================================== //

  self.currentUserCheck = function(userId) {
    if (localStorage.user_id == userId.toString()) {
      self.isUser = true;
    }
    else {
      self.isUser = false;
    }
  }
  // Get all users from backend
  self.getUsers = function(){
    $http.get(`${rootUrl}/users`)
    .catch(function(err){
      console.error(err);
    })
    .then(function(response){
      self.allUsers = response.data.users;
    });
  }
  // ======================================================== //
                        // LOGIN //
  // ======================================================== //
  self.login = function(userPass){
    $http.post(`${rootUrl}/users/login`, {user: {username: userPass.username, password: userPass.password}})
    .then(function(response){
      self.user = response.data.user
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('token', response.data.token);
      self.getUserAlbums(self.user.id);
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err){
      console.error(err);
    })
  }
  // ======================================================== //
                    // SIGNUP //
  // ======================================================== //
  self.signup = function(userPass){
    $http.post(`${rootUrl}/users`, {user: {username: userPass.username, password: userPass.password }})
    .then(function(response) {
      self.user = response.data.user
      localStorage.setItem('user_id', JSON.stringify(response.data.user.id));
      localStorage.setItem('token', JSON.stringify(response.data.token));
      self.getUserAlbums(self.user.id);
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  // ======================================================== //
                    // LOGOUT //
  // ======================================================== //
  self.logout = function() {
    self.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    $state.go('welcome', {url: '/'});
  }

  // ======================================================== //
                    // ALBUMS CONTROLLER //
  // ======================================================== //

    // self.getAllAlbums = function(){
    //   $http.get(`${rootUrl}/albums`)
    //   .then(function(response){
    //     self.allAlbums = response.data.albums
    //     console.log(self.allAlbums);
    //     $state.go('gallery');
    //   })
    //   .catch(function(err){
    //     console.error(err);
    //   })
    // }

    self.getUserAlbums = function(userId){
      self.currentUserCheck(userId);
      $http({
        method: 'GET',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${userId}`
      })
      .then(function(response){
        self.userAlbums = response.data.albums
        $state.go('home');
      })
      .catch(function(err){
        console.error(err);
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
      self.currentUserCheck(album.user_id);
      $http.get(`${rootUrl}/albums/${album.id}`)
      .then(function(response){
        self.getAlbumOwner(album.user_id);
        self.thisAlbum = response.data.album;
        self.getAlbumPhotos(self.thisAlbum.id);
      })
      .then(function(response){
        $state.go('album-show');
      })
      .catch(function(err){
        console.error(err);
      })
    }
    // Gets owner (user) of selected album
    self.getAlbumOwner = function(userId) {
      $http({
        method: 'GET',
        headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${userId}`,
      })
      .then(function(response){
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
        self.getUserAlbums(self.user.id);
        $state.go('home');
      });
    }

    self.getAlbumPhotos = function(albumId) {
      $http({
        method: 'GET',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/albums/${albumId}/photos`
      })
      .then(function(response){
        console.log(response);
        self.thisAlbum.photos = response.data.photos;
        console.log("photos:");
        console.log(self.thisAlbum.photos);
        $state.go('album-show');
      })
      .catch(function(err){
        console.error(err);
      })
    }

  // ======================================================== //
                  // PHOTOS CONTROLLER //
  // ======================================================== //

  self.showPhoto = function(index){
    self.thisPhoto = self.thisAlbum.photos[index];
    self.getPhotoComments(self.thisPhoto.id);
      //link to the large 600x60 image src url
      //add mainCtrl.imageSource to the ng-src
      // all other photo data like title found mainCtrl.photo
    $state.go('photo-show');
  }
  self.getPhotoComments = function(photoId){
    $http({
      method: 'GET',
      url: `${rootUrl}/photos/${photoId}/comments`
    })
    .then(function(response){
      console.log("getPhotoComments");
      console.log(response);
      self.thisPhoto.comments = response.data.comments;
    })
    .catch(function(err){
      console.error(err);
    })
  }
  self.uploadPhoto = function(image, albumId){
    console.log(albumId);
    image.upload = Upload.upload({
      url: `${rootUrl}/albums/${albumId}/photos`,
      data: {photo: {title: $scope.title, image: image}}
    })
    .then(function(response){
        console.log(response);
        self.getAlbumPhotos(albumId);
        $state.go('album-show');
    })
    .catch(function(err){
      console.log(err);
    });
  }
  self.deletePhoto = function(photo){
    $http({
      method: 'DELETE',
      headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
      url: `${rootUrl}/photos/${photo.id}`
    })
    .then(function(response){
      console.log(response);
      self.showAlbum(self.thisAlbum);
      $state.go('album-show');
    })
    .catch(function(err){
      console.log(error);
    })
  }


  // ======================================================== //
                  // COMMENTS CONTROLLER //
  // ======================================================== //


  self.createComment = function(newComment, photoId) {
    $http({
      method: 'POST',
      headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
      url: `${rootUrl}/photos/${photoId}/comments`,
      data: {
        comment: newComment
      }
    })
    .then(function(response){
    self.thisPhoto.comments = response.data.comments;
    newComment.body = "";
    })
    .catch(function(err){
      console.error(err);
    })
  }

  self.deleteComment = function(commentId){
    $http({
      method: 'DELETE',
      url: `${rootUrl}/photos/${photo_id}/comments/${commentId}`
    })
    .then(function(response){
      console.log(response);
      self.photoComments = response.data.comments;
    });
  }

} // Close mainController function

})()
