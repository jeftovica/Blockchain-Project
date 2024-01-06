import {useEffect, useState} from 'react'
import {Alert, Box, Button, Snackbar, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [showErr,setShowErr]=useState(false);
    const checkWalletIsConnected = async () => {
        const {ethereum} = window;
        if (!ethereum) {
            setShowErr(true)
        } else {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log(accounts[0])
            navigate("/home")

        }
    }
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowErr(false);
    };
    return <Box sx={{paddingTop:"250px",display:"flex",justifyContent:"center",alignItems:"center", width:"100%", height:"100%"}}><Box sx={{
        width: "60%",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#DBDDEB",
        boxShadow: "0px 15px 30px 15px rgba(0, 0, 0, 0.25)",
        borderRadius: "52px",
        overflow: "hidden",
        justifyContent:"center",
        alignItems:"center",
    }}>
        <Typography px={5} mb={1} color="black" fontSize="30px" fontWeight="600"> Welcome to SkiPass!</Typography>
        <Typography px={5} mb={3} color="black" fontSize="20px" fontWeight="400"> In order to continue login via MetaMask</Typography>
        <Button onClick={() => checkWalletIsConnected()} sx={{backgroundColor:"#343f71",":hover":{backgroundColor:"#4e5da1"},color:"white", padding:"10px 20px"}}>Login via Metamask</Button>
        <Snackbar
            anchorOrigin={{ vertical:"top", horizontal:"center" }}
            open={showErr}
            autoHideDuration={6000}
            onClose={handleClose}
            key={"metamaskErr"}
        >
            <Alert severity="error">Please install MetaMask!</Alert>
        </Snackbar>
    </Box>
    </Box>

}

