// RequestUtils.js
/* global fetch */
const getStationArray=(...api) =>{
  return fetch(...api);
}
const RequestUtils= {
  API_STATION:'http://127.0.0.1/subway/subway/subwayList.php',
  API_END_STATION:'http://localhost/subway/subway/subwayList.php',
  api:'["row":"1","row":"2"]',
  getStation(){
    // return getStationArray(this.API_STATION).then(response=>response.json());
    return api.then(response=>response.json());
  },
}

module.exports=RequestUtils
// RequestUtils.getStationArray()