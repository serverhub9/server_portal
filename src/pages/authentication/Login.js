import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import { useNavigate } from 'react-router-dom';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const navigate = useNavigate()
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography
              onClick={() => {
                const params = new URLSearchParams(window.location.search); // Access query parameters
                const returnRoute = params.get("return_route");
                console.log("returnRoute:", returnRoute);
                const returnRouteId = params.get("id");
                console.log(
                  "returnRouteId",returnRouteId
                )
            
                // const hasWebHash = window.location.hash.includes("return_route");
                // console.log(hasWebHash)
                if (returnRoute) {
                  // const hashValue = window.location.hash.split("=")[1];
                  // console.log(hashValue)
if(returnRouteId){
  navigate(`/register?return_route=website&id=${returnRouteId}`)

}else{
  navigate('/register?return_route=website')

}

                } else {
                  navigate('/register')
                }
              }}
              // component={Link} to="/register"
              variant="body1" sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary">
              Don't have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  )
};

export default Login;
