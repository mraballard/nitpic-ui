(function(){
  angular.module('nitpic')
    .controller('albumsController', albumsController);


  albumsController.$inject = ['$scope', '$http', 'Upload', '$timeout'];

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

    $scope.uploadPhoto = function(image){
      console.log("Uploading...");
      image.upload = Upload.upload({
        url: rootUrl + '/photos',
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
    // this.getAlbums();
  }
})()
