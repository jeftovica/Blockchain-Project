import {useEffect, useState} from 'react'
import {Web3} from "web3";
import {
    Box,
    Button, FormControl, Grid, MenuItem, Modal, Select, SelectChangeEvent, TextField,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Add, Payments} from "@mui/icons-material";

export const HomePage = () => {
    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x1729cE4BF06678d919b6F7D9CDEd1bda3D291077";
    const navigate = useNavigate();
    const [tab, setTab] = useState("All Tracks");
    const [tracks, setTracks] = useState([]);
    const [role, setRole] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [open,setOpen] = useState(false);

    const [trackName,setTrackName]=useState("");
    const [trackCountry,setTrackCountry]=useState("");
    const [trackAddress,setTrackAddress]=useState("");
    const [trackPrice,setTrackPrice]=useState(0);


    const abi =[
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "AddedTrack",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_country",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_lifeguardAddress",
                    "type": "address"
                }
            ],
            "name": "addTrack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_accountAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_trackId",
                    "type": "uint256"
                }
            ],
            "name": "buyTicket",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "trackId",
                    "type": "uint256"
                }
            ],
            "name": "removeSkiTrackById",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllTracks",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "country",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "lifeguard",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct SkiPass.SkiTrack[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getLifeGuardTracks",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "country",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "lifeguard",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct SkiPass.SkiTrack[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyTracks",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "country",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "lifeguard",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct SkiPass.SkiTrack[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRole",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isOwner",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    const contract = new web3.eth.Contract(abi, contractAddress)
    const checkWalletIsConnected = async () => {
        const {ethereum} = window;
        if (!ethereum) {
            navigate("/login")
        } else {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            let role = await contract.methods.getRole().call({from: accounts[0]});
            setRole(role == "" ? "user" : role);


        }
    }

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius:"15px",
        boxShadow: 24,
        p: 4,
        display:"flex",
        flexDirection:"column"
    };

    useEffect(() => {
        checkWalletIsConnected();
        getOwnerInfo();

    }, [])
    useEffect(() => {
        getTracks()
    }, [tab,role])

    const handleChangeTab = (event: SelectChangeEvent) => {
        setTab(event.target.value as string);
    };

    async function getTracks() {
        let tracks;
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        if (role=="user") {
            if (tab == "All Tracks") {
                tracks = await contract.methods.getAllTracks().call({from: accounts[0]});
            } else {
                tracks = await contract.methods.getMyTracks().call({from: accounts[0]});
            }
        }
        else if(role=="lifeguard"){
            if (tab == "All Tracks") {
                tracks = await contract.methods.getAllTracks().call({from: accounts[0]});
            } else {
                tracks = await contract.methods.getLifeGuardTracks().call({from: accounts[0]});
            }
        }

        setTracks(tracks)
    }
    async function getOwnerInfo() {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        const isOwner = await contract.methods.isOwner().call({from: accounts[0]});
        setIsOwner(isOwner);
    }
    async function buyTrack(track) {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        await contract.methods.buyTicket(accounts[0],track[0].toString()).send({from: accounts[0],value:web3.utils.toWei(track[3].toString(), 'ether')});
        setTracks(tracks)
    }

    async function removeSkiTrack(track) {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        await contract.methods.removeSkiTrackById(track[0].toString()).send({from: accounts[0]});
        navigate(0)
    }
    async function addTrack() {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        await contract.methods.addTrack(trackName,trackCountry,trackPrice,trackAddress).send({from: accounts[0]});
        setTrackName("");
        setTrackPrice(0);
        setTrackCountry("");
        setTrackAddress("");
        setOpen(false);
        navigate(0);
    }

    return <Box display="flex" flexDirection="column" justifyContent="center" px={2}>
        <Modal
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{borderRadius:"12px"}}
        >
            <Box sx={modalStyle} >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Track
                </Typography>
                <TextField
                    sx={{margin:2}}
                    required
                    label="Track Name"
                    value={trackName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTrackName(event.target.value);
                    }}
                />
                <TextField
                    sx={{margin:2}}
                    required
                    label="Track Country"
                    value={trackCountry}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTrackCountry(event.target.value);
                    }}
                />
                <TextField
                    sx={{margin:2}}
                    required
                    type="number"
                    label="Track Price"
                    value={trackPrice}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTrackPrice(event.target.value as number);
                    }}
                />
                <TextField
                    sx={{margin:2}}
                    required
                    label="Lifeguard Address"
                    value={trackAddress}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTrackAddress(event.target.value);
                    }}
                />
                <Button type="submit" onClick={()=>addTrack()} sx={{backgroundColor: "#343f71",
                    ":hover": {backgroundColor: "#4e5da1"},
                    color: "white",
                    marginTop:2}}>Add Track</Button>
            </Box>
        </Modal>


        <Typography fontSize="40px" color="white" textAlign="center" fontWeight="600">Tracks</Typography>
        <Box display="flex" justifyContent="end">
            {role == "user" && <FormControl sx={{m: 2, minWidth: 200}}>
                <Select
                    variant="outlined"
                    value={tab}
                    onChange={handleChangeTab}
                >
                    <MenuItem value={"All Tracks"}>All Tracks</MenuItem>
                    <MenuItem value={"My Tracks"}>My Tracks</MenuItem>
                </Select>
            </FormControl>}
            {role == "lifeguard" && <FormControl sx={{m: 2, minWidth: 200}}>
                <Select
                    variant="outlined"
                    value={tab}
                    onChange={handleChangeTab}
                >
                    <MenuItem value={"All Tracks"}>All Tracks</MenuItem>
                    <MenuItem value={"Lifeguard Tracks"}>Lifeguard Tracks</MenuItem>
                </Select>
            </FormControl>}
            {isOwner &&<Button onClick={()=>setOpen(true)} sx={{
                m: 2, minWidth: 150, backgroundColor: "white",
                ":hover": {backgroundColor: "#e0e0e0"}, color: "#343f71"
            }} height="100px" startIcon={<Add/>}>
                Add Track
            </Button>}
        </Box>
        <Grid container spacing={2}>
            {tracks!=undefined && tracks.map((track) => <Box m={2} key={track[0]} p="10px" display="flex" flexDirection="column" width="300px"
                                        height="200px" borderRadius="12px"
                                        sx={{backgroundColor: "white", justifyContent: 'space-between'}}>
                <Box>
                    <Typography mb={0} fontSize="35px" color="black" textAlign="left"
                                fontWeight="600">{track[1]}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <LocationOnIcon/>
                        <Typography fontSize="25px" color="black" textAlign="left"
                                    fontWeight="40">{track[2]}</Typography>

                    </Box>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <Payments/>
                        <Typography fontSize="25px" color="black" textAlign="left"
                                    fontWeight="40">{track[3].toString()}</Typography><Typography fontSize="20px" color="black" textAlign="left"fontWeight="40"><sub> ETH</sub></Typography>

                    </Box>
                </Box>
                <Box justifyContent="end" display="flex" flexDirection="row">
                    {tab=="All Tracks" && role=="user" &&<Button onClick={()=>buyTrack(track)} sx={{
                        backgroundColor: "#343f71",
                        ":hover": {backgroundColor: "#4e5da1"},
                        color: "white",
                        padding: "5px 10px"
                    }}>Buy Now</Button>}
                    {tab=="My Tracks" && role=="user" &&<Button onClick={()=>removeSkiTrack(track)} sx={{
                        backgroundColor: "#d30808",
                        ":hover": {backgroundColor: "#a40707"},
                        color: "white",
                        padding: "5px 10px"
                    }}>Exit Track</Button>}
                </Box>
            </Box>)}
        </Grid>
    </Box>

}

