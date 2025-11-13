import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import VerificationInput from "react-verification-input";
import './Sendemail.css'


// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { post } from 'Urls/api';
import { useNavigate } from 'react-router-dom';
import toastAlert from 'components/ToastAlert/index';


// ============================|| FIREBASE - REGISTER ||============================ //

const AuthSendEmail = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [Otp, setOtp] = useState('')
  const [Email, setEmail] = useState('')

  const [UserEnteredotpValue,setUserEnteredOtpValue]=useState('')
  const [EmailScreen, setEmailScreen] = useState(true)

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  // Verify OTP 
  const verifyOTP=()=>{
    if(parseInt(Otp)===parseInt(UserEnteredotpValue)){
      toastAlert("success","Account Verified .Reset Password Now !")
      localStorage.setItem("@Reset", JSON.stringify({ email: Email }));

      navigate('/reset_password')

    }else{
      toastAlert("error","Invalid OTP")
    }
  }


  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      {EmailScreen ? <>
        <Formik
          initialValues={{
            email: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              console.log(values)
              // Api Call 
              const postData = {
                email: values.email,
              };
              try {
                const apiData = await post('user/verifyEmail', postData); // Specify the endpoint you want to call
                console.log(apiData)
                if (apiData.error===true||apiData.error==="true") {
                  toastAlert("error", apiData.message)
                  // setNextloader(false)
                  setStatus({ success: false });
                  setSubmitting(false);
                } else {
                  // localStorage.setItem("@UserSession", JSON.stringify({ user: apiData.data }));
                  // navigate('/')
                  setOtp(apiData.otp)
                  toastAlert("success", "Otp send on your email for verification")
                  setEmail(values.email)


                  setStatus({ success: false });
                  setSubmitting(false);
                  setEmailScreen(false)


                }
              } catch (error) {
                toastAlert("error", "Something Went Wrong")
                // setNextloader(false)
                setStatus({ success: false });
                setSubmitting(false);
                // console.error('Error fetching data:', error);
                // setNextloader(false)

              }


            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-signup">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Verify Email
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </> :
        <>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Enter OTP to verify your Email*</InputLabel>
               <Box  style={{
                                          display:'flex',
                                          justifyContent:'center',
                                          alignItems:'center',

                                        }}>

                <VerificationInput
                                        placeholder=''
                                       
                                        value={UserEnteredotpValue}
                                        onChange={(e) => setUserEnteredOtpValue(e)}
                                        classNames={{
                                            container: "container",
                                            character: "character",
                                            characterInactive: "character--inactive",
                                            characterSelected: "character--selected",
                                        }}
                                        autoFocus
                                    />
                                    </Box>
              </Stack>
            </Grid>


            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" onClick={()=>verifyOTP()} variant="contained" color="primary">
                  Verify OTP
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </>}

    </>
  );
};

export default AuthSendEmail;
