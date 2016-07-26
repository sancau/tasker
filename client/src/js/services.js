
const Collection = ($http, BASE_API_URL) => {
  return (endpoint) => {
    let service = {};
    service.getAll = () => $http.get(`${BASE_API_URL}/${endpoint}`);
    return service;  
  }
};

angular.module('app')
.service('Collection', ['$http', 'BASE_API_URL', Collection]);
