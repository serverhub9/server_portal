import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// import axios from "axios"
// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toastAlert from 'components/ToastAlert/index';
import { post } from 'Urls/api';
const AuthLogin = () => {
  const navigate = useNavigate()
  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showCPassword, setShowCPassword] = React.useState(false);
  const handleClickShowCPassword = () => {
    setShowCPassword(!showCPassword);
  };

  const handleMouseDownCPassword = (event) => {
    event.preventDefault();
  };
  // log out function to log the user out of google and set the profile array to null
const [emailUser,setEmailUser]=useState('')

  useEffect(() => {

    const userSession = JSON.parse(localStorage.getItem("@Reset"));
    if (userSession === null || userSession === undefined) {


    } else {
    setEmailUser(userSession.email)

      
    }

  }, []);
  return (
    <>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required('Password is required'),
          confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values)
            const postData = {
              email: emailUser,
              password: values.password,
            };
            try {
              const apiData = await post('user/updatePassword', postData); // Specify the endpoint you want to call
              console.log(apiData)
              if (apiData.error) {
              console.log("error true")
              toastAlert("error",apiData.message)
              
              } else {
                localStorage.removeItem('@Reset');
                localStorage.setItem("@UserSession", JSON.stringify({ user: apiData.data[0] }));
                navigate('/')
                setStatus({ success: false });
                setSubmitting(false);
              }
            } catch (error) {
              toastAlert("error", "Something Went Wrong")
              // setNextloader(false)
              setStatus({ success: false });
              setSubmitting(false);
              // console.error('Error fetching data:', error);
              // setNextloader(false)

            }
            // setStatus({ success: false });
            // setSubmitting(false);
          } catch (err) {
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
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  {/* on hover on input field i want to show text u cant update email 
                   */}
                   <Tooltip title="Can't update email because subscriptions active on that email" >
                  <OutlinedInput
                  disabled
                    id="email-login"
                    type="email"
                    value={emailUser}
                    name="email"
                    placeholder="Enter email address"
                    fullWidth
                  />
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Confirm Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="-password-login"
                    type={showCPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCPassword}
                          onMouseDown={handleMouseDownCPassword}
                          edge="end"
                          size="large"
                        >
                          {showCPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.confirmPassword}
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
                    Reset Password
                  </Button>
                </AnimateButton>
              </Grid>
              
             
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
