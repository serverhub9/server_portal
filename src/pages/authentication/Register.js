import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import FirebaseRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';
import { useNavigate } from 'react-router-dom';

// ================================|| REGISTER ||================================ //

const Register = () => {
  const navigate=useNavigate();
  return(
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Sign up</Typography>
          <Typography onClick={() => {
 const params = new URLSearchParams(window.location.search); // Access query parameters
 const returnRoute = params.get("return_route");
 console.log("returnRoute:", returnRoute);
 const returnRouteId = params.get("id");
 console.log(
   "returnRouteId",returnRouteId
 )

            if (returnRoute) {
                  // const hashValue = window.location.hash.split("=")[1];
                  // console.log(hashValue)
if(returnRouteId){
  navigate(`/login?return_route=website&id=${returnRouteId}`)

}else{
  navigate('/login?return_route=website')

}

                } else {
                  navigate('/login')
                }
          }}
            // component={Link} to="/login"
            variant="body1" sx={{ textDecoration: 'none',cursor:'pointer' }} color="primary">
            Already have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <FirebaseRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
)};

export default Register;
