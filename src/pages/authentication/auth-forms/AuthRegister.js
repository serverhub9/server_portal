import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

import { Link as RouterLink } from "react-router-dom";

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
  Typography,
} from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import FirebaseSocial from "./FirebaseSocial";
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { post, WEBSITE_URL } from "Urls/api";
import { useNavigate } from "react-router-dom";
import toastAlert from "components/ToastAlert/index";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };
  // Sign Up with google
 const [plan_id_return,setPlan_Id_Return]=useState(null)

  const ResponseGoogle = async (response, accessToken) => {
    console.log("response");

    console.log(response);
    const user_name = response.name;
    const email = response.email;
    let Email_Address = response.email;
    // api
    const postData = {
      user_name: user_name,
      email: email,
      // password: values.password,
      signup_google: true,
      access_token: accessToken,
    };
    try {
      const apiData = await post("user/register", postData); // Specify the endpoint you want to call
      console.log(apiData);
      if (apiData.error) {
        toastAlert("error", apiData.message);
        // setNextloader(false)
        // setStatus({ success: false });
        // setSubmitting(false);
      } else {
        if (hashed === true) {
          console.log("hashed url true");
          console.log(hashedUrl);
          // decryot url
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
          // const bytes = CryptoJS.AES.decrypt(hashedUrl, saltKey);
          // const decryptedURL = bytes.toString(CryptoJS.enc.Utf8);
          // console.log("bytes")
          // console.log(decryptedURL)

          // // hash email and redirect to url
          // const hashedEmail = CryptoJS.AES.encrypt(Email_Address, saltKey).toString();

          // const redirectUrl = `${decryptedURL}/#id=${hashedEmail}`;
          // // const hashedURL = SHA256(redirectUrl + salt).toString();
          // window.open(`${redirectUrl}`, "_self")
          // localStorage.setItem("@UserSession", JSON.stringify({ user: apiData.data }));
        } else {
          localStorage.setItem(
            "@UserSession",
            JSON.stringify({ user: apiData.data })
          );
          navigate("/");
          // setStatus({ success: false });
          // setSubmitting(false);
        }
        setIsSubmittingFirebase(false);
      }
    } catch (error) {
      toastAlert("error", "Something Went Wrong");
      setIsSubmittingFirebase(false);

      // setNextloader(false)
      // setStatus({ success: false });
      // setSubmitting(false);
      // console.error('Error fetching data:', error);
      // setNextloader(false)
    }
    // setProfile(response)
    // setAccessToken(response.access_token)
  };

  const [hashed, setHashed] = useState(false);
  const [hashedUrl, setHashedUrl] = useState(false);
  useEffect(() => {
    // changePassword('');
    const params = new URLSearchParams(window.location.search); // Access query parameters
    const returnRoute = params.get("return_route");
    console.log("returnRoute:", returnRoute);
    const returnRouteId = params.get("id");

    if (returnRoute) {
      setHashed(true);
      const hashValue = window.location.hash.split("=")[1];
      setHashedUrl(hashValue);
      if(returnRouteId){
        setPlan_Id_Return(returnRouteId)
      }
      // Do something if the hash contains "web"
    } else {
      setHashed(false);
      const userSession = JSON.parse(localStorage.getItem("@UserSession"));
      if (userSession === null || userSession === undefined) {
      } else {
        navigate("/");
      }
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
          user_name: "",
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          user_name: Yup.string().max(255).required("User Name is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values);
            // Api Call
            const postData = {
              user_name: values.user_name,
              email: values.email,
              password: values.password,
              signup_google: false,
              access_token: null,
            };
            try {
              const Email_Address = values.email;
              const apiData = await post("user/register", postData); // Specify the endpoint you want to call
              console.log(apiData);
              if (apiData.error) {
                toastAlert("error", apiData.message);
                // setNextloader(false)
                setStatus({ success: false });
                setSubmitting(false);
              } else {
                if (hashed === true) {
                  console.log("hashed url true");
                  console.log(hashedUrl);
                  // decryot url
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
                  // const bytes = CryptoJS.AES.decrypt(hashedUrl, saltKey);
                  // const decryptedURL = bytes.toString(CryptoJS.enc.Utf8);
                  // console.log("bytes")
                  // console.log(decryptedURL)

                  // // hash email and redirect to url
                  // const hashedEmail = CryptoJS.AES.encrypt(Email_Address, saltKey).toString();

                  // const redirectUrl = `${decryptedURL}/#id=${hashedEmail}`;
                  // // const hashedURL = SHA256(redirectUrl + salt).toString();
                  // window.open(`${redirectUrl}`, "_self")
                  // localStorage.setItem("@UserSession", JSON.stringify({ user: apiData.data }));
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
              toastAlert("error", "Something Went Wrong");
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
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user_name-signup">User Name*</InputLabel>
                  <OutlinedInput
                    id="user_name-login"
                    type="user_name"
                    value={values.user_name}
                    name="user_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.user_name && errors.user_name)}
                  />
                  {touched.user_name && errors.user_name && (
                    <FormHelperText error id="helper-text-user_name-signup">
                      {errors.user_name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        sx={{
                          bgcolor: level?.color,
                          width: 85,
                          height: 8,
                          borderRadius: "7px",
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
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
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption">OR</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <FirebaseSocial
                  loader={isSubmittingFirebase}
                  ResponseGoogle={ResponseGoogle}
                  onClick={handleFirebaseSocialClick}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
