// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';

// assets
import Google from 'assets/images/icons/google.svg';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //
import {  useGoogleLogin } from '@react-oauth/google';
import axios from "axios"
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
const FirebaseSocial = ({ResponseGoogle,loader,onClick}) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [ user, setUser ] = useState([]);

  // const googleHandler = async () => {
  //   // login || singup
  // };
  const googleHandler = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log(error)
});


  useEffect(
    () => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {

                    ResponseGoogle(res.data,user.access_token);
                    // console.log(res)
                })
                .catch((err) => console.log(err));
        }
    },
    [user]
);

  return (
    <Stack onClick={onClick}
      direction="row"
      spacing={matchDownSM ? 1 : 2}
      justifyContent={matchDownSM ? 'space-around' : 'space-between'}
      sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
    >
      <Button 
        variant="outlined"
        color="secondary"
        fullWidth={!matchDownSM}
        startIcon={loader?<>
        <ClipLoader color="gray" loading={loader} size={20} />
        </>:<img src={Google} alt="Google" />}
        onClick={googleHandler}
      >
        {!matchDownSM && 'Login with Google'}
      </Button>
  
    </Stack>
  );
};

export default FirebaseSocial;
