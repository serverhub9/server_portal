import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import CryptoJS from "crypto-js";
// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import FirebaseSocial from "./FirebaseSocial";
import AnimateButton from "components/@extended/AnimateButton";
import ClipLoader from "react-spinners/ClipLoader";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

// ============================|| FIREBASE - LOGIN ||============================ //
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toastAlert from "components/ToastAlert/index";
import { post, WEBSITE_URL } from "Urls/api";
const AuthLogin = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const ResponseGoogle = async (response, accessToken) => {
    console.log("Login");

    console.log(response);
    let Email_Address = response.email;

    const postData = {
      email: response.email,
      signup_google_user: true,
      access_token: accessToken,
    };
    try {
      const apiData = await post("user/login", postData); // Specify the endpoint you want to call
      console.log(apiData);
      console.log(apiData.signedupgoogle);

      if (apiData.error) {
        toastAlert("error", apiData.message);
      } else {
        if (hashed === true) {
          // console.log("hashed url true");
          // console.log(hashedUrl);
          // // decryot url
          // const bytes = CryptoJS.AES.decrypt(hashedUrl, saltKey);
          // const decryptedURL = bytes.toString(CryptoJS.enc.Utf8);
          // console.log("bytes");
          // console.log(decryptedURL);

          // // hash email and redirect to url
          // const hashedEmail = CryptoJS.AES.encrypt(
          //   Email_Address,
          //   saltKey
          // ).toString();
          // console.log("43435345");
          let redirectUrl;
          if(plan_id_return){
          redirectUrl = `${WEBSITE_URL}website?user_id=${apiData?.data?.user_id}&plan_id=${plan_id_return}`;

          }else{
            redirectUrl = `${WEBSITE_URL}website?user_id=${apiData?.data?.user_id}`;

          }

          // const redirectUrl = `${decryptedURL}/#id=${hashedEmail}`;
          // const hashedURL = SHA256(redirectUrl + salt).toString();
          window.open(`${redirectUrl}`, "_self");
          localStorage.setItem(
            "@UserSession",
            JSON.stringify({ user: apiData.data })
          );
        } else {
          console.log("sdfhgsdghfshgjfd");
          localStorage.setItem(
            "@UserSession",
            JSON.stringify({ user: apiData.data })
          );
          navigate("/");
        }
      }
      setIsSubmittingFirebase(false);
    } catch (error) {
      toastAlert("error", "Something Went Wrong");

      setIsSubmittingFirebase(false);
    }
  };

  const [hashed, setHashed] = useState(false);
  const [hashedUrl, setHashedUrl] = useState(false);
 const [plan_id_return,setPlan_Id_Return]=useState(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Access query parameters
    const returnRoute = params.get("return_route");
    const returnRouteId = params.get("id");

    console.log("returnRoute:", returnRoute);

    if (returnRoute) {
      setHashed(true);
      setHashedUrl(returnRoute);
     if(returnRouteId){
      setPlan_Id_Return(returnRouteId)
    }
  }
   

    // const hasWebHash = window.location.hash.includes("return_route");
    // console.log("hasWebHash",hasWebHash)
    // if (hasWebHash) {
    //   setHashed(true)

    //   const hashValue = window.location.hash.split("=")[1];
    // console.log("hashValue",hashValue)

    //   setHashedUrl(hashValue);
    //   // Do something if the hash contains "web"
    else {
      setHashed(false);
      const userSession = JSON.parse(localStorage.getItem("@UserSession"));
      if (userSession === null || userSession === undefined) {
      } else {
        navigate("/");
      }
      // Do something else if the hash doesn't contain "web"
    }
  }, []);
  const [isSubmittingFirebase, setIsSubmittingFirebase] = useState(false);

  const handleFirebaseSocialClick = () => {
    setIsSubmittingFirebase(true);
  };
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values);
            let Email_Address = values.email;
            const postData = {
              email: values.email,
              password: values.password,
              signup_google: false,
              access_token: null,
            };
            try {
              const apiData = await post("user/login", postData); // Specify the endpoint you want to call
              console.log(apiData);
              if (apiData.error) {
                console.log("error true");
                toastAlert("error", apiData.message);
              
              } else {
                if (hashed === true) {
                  console.log("hashed url true");
                  console.log(hashedUrl);
                  
                  let redirectUrl;
                  if(plan_id_return){
                  redirectUrl = `${WEBSITE_URL}website?user_id=${apiData?.data?.user_id}&plan_id=${plan_id_return}`;

                  }else{
                    redirectUrl = `${WEBSITE_URL}website?user_id=${apiData?.data?.user_id}`;

                  }
                  
                  // const hashedURL = SHA256(redirectUrl + salt).toString();
                  window.open(`${redirectUrl}`, "_self");
                  localStorage.setItem(
                    "@UserSession",
                    JSON.stringify({ user: apiData.data })
                  );
                } else {
                  localStorage.setItem(
                    "@UserSession",
                    JSON.stringify({ user: apiData.data })
                  );
                  navigate("/");
                  setStatus({ success: false });
                  setSubmitting(false);
                }
              }
            } catch (error) {
              console.log(error);
              toastAlert("error", "Something Went Wrong");
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
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? "text" : "password"}
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
                          {showPassword ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    // placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-password-login"
                    >
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  /> */}
                  <span></span>
                  <Link
                    variant="h6"
                    component={RouterLink}
                    to="/verify_account"
                    color="text.primary"
                  >
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    startIcon={
                      isSubmitting ? (
                        <ClipLoader
                          color="gray"
                          loading={isSubmitting}
                          size={20}
                        />
                      ) : null
                    }
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption"> OR</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <FirebaseSocial
                  loader={isSubmittingFirebase}
                  ResponseGoogle={ResponseGoogle}
                  onClick={handleFirebaseSocialClick}
                />
              </Grid>

              {/* <Grid item xs={12} md={12}>
              <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
              </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
