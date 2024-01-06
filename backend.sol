// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract SkiPass {
  struct SkiTrack {
        uint id;
        string name;
        string country;
        uint price;
        address lifeguard;
    }
    struct SkiPassAccount {
        address accountAddress;
        SkiTrack[] currentSkiTracks;
    }
    address payAccount; //account of company
    address owner; //owner
    mapping(uint => SkiTrack) skiTracks; //all available ski tracks
    mapping(address => SkiPassAccount) accounts; // all accounts
    mapping(address => string) roles; // account roles
    uint256 trackSize = 0; // number of tracks
    uint256 autoTrackId; //autoincremendId for tracks
    event AddedTrack(uint _id);

    modifier autoIncrementTrackId() {
        _;
        autoTrackId += 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not an owner.");
        _;
    }

    constructor(){
        owner=msg.sender;
        payAccount=0xF57f7eBD6D9aF4D1BF25a6a10cd6392E47708AF5;
    }

    function addTrack(
        string memory _name,
        string memory _country,
        uint _price,
        address _lifeguardAddress
    ) public autoIncrementTrackId onlyOwner {
        skiTracks[autoTrackId] = SkiTrack({
            id:autoTrackId,
            name:_name,
            country:_country,
            price:_price,
            lifeguard:_lifeguardAddress}
        );
        roles[_lifeguardAddress] = "lifeguard";
        trackSize++;
        emit AddedTrack(autoTrackId);
    }

    function getRole() public view returns (string memory) {
        if (keccak256(abi.encodePacked((roles[msg.sender]))) == keccak256(abi.encodePacked(("")))){
           return "user";
        }
        else{
           return roles[msg.sender];
        }
    }

    function isOwner() public view returns (bool) {
        return msg.sender==owner;
    }

    function getAllTracks()
        external
        view
        returns (SkiTrack[] memory)
    {
        
        SkiTrack[] memory allTracks = new SkiTrack[](trackSize);
        for (uint i = 0; i < trackSize; i++) {
            allTracks[i]=skiTracks[i];
        }
        return allTracks;
    }

    function buyTicket(address _accountAddress, uint _trackId) public payable {
        require(skiTracks[_trackId].id == _trackId, "Ski track does not exist");
        require(msg.value == skiTracks[_trackId].price, "Not enough money");
        SkiTrack[] storage currentSkiTracks = accounts[_accountAddress]
            .currentSkiTracks;
        currentSkiTracks.push(skiTracks[_trackId]);
        accounts[_accountAddress].currentSkiTracks = currentSkiTracks;
        roles[_accountAddress] = "user";
    }

    function getMyTracks() public view returns (SkiTrack[] memory) {
        return accounts[msg.sender].currentSkiTracks;
    }

    function removeSkiTrackById(uint256 trackId) public {
        uint index = 0;
        bool found = false;
        SkiTrack[] memory myTracks = accounts[msg.sender].currentSkiTracks;
        for(uint i=0; i<= myTracks.length; i++){
            if (myTracks[i].id == trackId){
                found = true;
                index = i;
                break;
            }
        }
        require(found == true, "SkiTrack not found");
        accounts[msg.sender].currentSkiTracks[index] = accounts[msg.sender].currentSkiTracks[accounts[msg.sender].currentSkiTracks.length - 1];
        accounts[msg.sender].currentSkiTracks.pop();
    }

    function getLifeGuardTracks() public view returns (SkiTrack[] memory) {
        uint count = 0;

        for (uint i = 0; i < trackSize; i++) {
            if (skiTracks[i].lifeguard == msg.sender) {
                count++;
            }
        }
        SkiTrack[] memory lifeguardTracks = new SkiTrack[](count);

        for (uint i = 0; i < trackSize; i++) {
            if (skiTracks[i].lifeguard == msg.sender) {
                lifeguardTracks[i] = skiTracks[i];
            }
        }
        return lifeguardTracks;
    }

}
