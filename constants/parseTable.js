const PARSE_TABLE =
  [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,80,1,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,1,1,80,80,80,80,80,80,80,80,80,80,80,79],
    [0,3,80,2,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,3,3,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,80,5,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,4,4,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,7,80,80,80,79,6,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,7,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,9,80,80,80,8,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,11,80,80,80,80,10,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,12,12,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,80,80,14,80,80,80,13,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,16,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,15,15,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,80,17,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,19,80,80,80,80,80,80,80,19,19,80,80,19,19,19,80,80,80,80,80,80,80,18,18,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,26,80,25,80,26,80,80,80,80,80,20,21,80,26,22,23,24,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,27,80,80,80,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,29,28,80,80,80,80,80,80,29,29,80,29,29,29,29,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,30,80,80,30,79,80,79,80,80,80,80,80,80,80,80,30,30,30,30,30,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,32,80,80,80,80,80,32,80,32,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,31,31,31,31,31,31,80,80,80,80,80],
    [0,80,79,80,80,80,80,80,79,80,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,33,33,33,33,33,33,80,80,80,80,80],
    [0,80,79,80,34,80,80,34,79,80,79,80,80,80,80,80,80,80,80,34,34,34,34,34,80,79,80,80,80,79,79,79,79,79,79,80,80,80,80,80],
    [0,80,36,80,80,80,80,80,36,80,36,80,80,80,80,80,80,80,80,35,35,80,80,80,80,36,80,80,80,36,36,36,36,36,36,35,80,80,80,80],
    [0,80,80,80,79,80,80,79,80,80,80,80,80,80,80,80,80,80,80,37,38,79,79,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,39,80,80,39,79,80,79,80,80,80,80,80,80,80,80,39,39,39,39,39,80,79,80,80,80,79,79,79,79,79,79,79,80,80,80,80],
    [0,80,41,80,80,80,80,80,41,80,41,80,80,80,80,80,80,80,80,41,41,80,80,80,80,41,80,80,80,41,41,41,41,41,41,41,40,40,40,80],
    [0,80,79,80,44,80,80,42,79,80,79,80,80,80,80,80,80,80,80,47,47,43,45,46,80,79,80,80,80,79,79,79,79,79,79,79,79,79,79,80],
    [0,80,79,80,80,80,80,48,49,80,79,80,80,80,80,80,80,80,80,79,79,80,80,80,49,79,80,80,80,79,79,79,79,79,79,79,79,79,79,80],
    [0,80,80,80,50,80,80,80,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,79,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,79,80,80,80,80,51,79,80,79,80,80,80,80,80,80,80,80,79,79,80,80,80,80,79,80,80,80,79,79,79,79,79,79,79,79,79,79,80],
    [0,80,53,80,80,80,80,80,53,80,53,80,80,80,80,80,80,80,80,53,53,80,80,80,52,53,80,80,53,53,53,53,53,53,53,53,53,53,53,80],
    [0,80,55,80,80,80,80,80,55,80,55,80,80,80,80,80,80,80,80,80,80,80,80,80,54,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,79,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,56,57,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,80,80,80,59,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,58,58,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,60,80,80,60,61,80,80,80,80,80,80,80,80,80,80,60,60,60,60,60,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,80,80,80,63,80,62,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,80,80,80,80,65,80,64,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,79,80,80,79,80,80,80,80,80,80,80,80,80,80,80,79,79,79,79,79,80,80,80,80,66,80,80,80,80,80,80,80,80,80,80,80],
    [0,80,80,80,79,80,80,79,80,80,80,80,80,80,80,80,80,80,80,79,79,79,79,79,80,80,80,80,80,67,68,69,70,71,72,80,80,80,80,80],
    [0,80,80,80,79,80,80,79,80,80,80,80,80,80,80,80,80,80,80,73,74,79,79,79,80,80,80,80,80,80,80,80,80,80,80,75,80,80,80,80],
    [0,80,80,80,79,80,80,79,80,80,80,80,80,80,80,80,80,80,80,79,79,79,79,79,80,80,80,80,80,80,80,80,80,80,80,80,76,77,78,80]];

const PUSH_MAP_TABLE =
  {"1":[-2,10,-1,9,2],"2":[2,-2,-6,3,-5,5,-4,-3],"4":[4,-4,29],"6":[3,-2,-8,30,-7],"7":[3,-2,28],"8":[6,-4,-9],"10":[6,-4,-10],"12":[-8,30,-7,8,-4,29],"13":[-4,-11],"15":[9,-2,10,7],"17":[-6,12,11,-5],"18":[11,-2,28,-4,29],"20":[12,-2,14,-8,13,-2,17,-2,15,34,-4,29,-7,-12],"21":[12,-2,14,-15,14,-14,-8,15,-7,-13],"22":[12,-2,-8,15,-7,-16],"23":[12,-2,-8,25,-7,-17],"24":[12,-2,-8,15,-7,-18],"25":[12,-2,13],"27":[15,34,25],"28":[-6,12,-5],"29":[12],"30":[16,18],"31":[17],"33":[18,35],"34":[19,21],"35":[19,21,36],"37":[-19],"38":[-20],"39":[22,23],"40":[22,23,37],"42":[-8,18,-7],"43":[-21],"44":[24,-4],"45":[-22],"46":[23,-23],"47":[23,20],"48":[26],"49":[27],"50":[27,-4],"51":[-8,31,-7],"52":[27,-25,18,-24],"54":[28,-25,-22,-24],"56":[-26],"57":[-27],"58":[32,28,-4,29],"60":[33,15],"62":[32,28,-4,29,-10],"64":[33,15,-10],"66":[-28],"67":[-29],"68":[-30],"69":[-31],"70":[-32],"71":[-33],"72":[-34],"73":[-19],"74":[-20],"75":[-35],"76":[-36],"77":[-37],"78":[-38]};

module.exports = {
  PARSE_TABLE,
  PUSH_MAP_TABLE
};