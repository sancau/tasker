
const Collection = ($http, BASE_API_URL) => {
  return (endpoint) => {
    let service = {};
    service.getAll = () => $http.get(`${BASE_API_URL}/${endpoint}`);
    service.getOne = (id) => $http.get(`${BASE_API_URL}/${endpoint}/${id}`);
    service.save = (data) => {
      if (data._id) {
        return $http.put(`${BASE_API_URL}/${endpoint}/${data._id}`, data);
      }
      else {
        return $http.post(`${BASE_API_URL}/${endpoint}`, data);
      }
    };
    service.remove = (data) => {
      return $http({
        method: 'DELETE',
        url: `${BASE_API_URL}/${endpoint}/${data._id}`,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      });
    };
    return service;  
  }
};

angular.module('app')
.service('Collection', ['$http', 'BASE_API_URL', Collection]);
