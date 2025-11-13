// material-ui
import {
  Typography, Grid, Button, Box, IconButton,
  FormHelperText,
  Divider,
  InputLabel,
  OutlinedInput,
  Avatar,
  Stack
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
// project import
import OrdersTable from './OrdersTable';

import toastAlert from 'components/ToastAlert/index';
import { useNavigate } from 'react-router-dom';
import { post, postFormData } from 'Urls/api';



import * as Yup from 'yup';
import { Formik } from 'formik';
// ==============================|| SAMPLE PAGE ||============================== //
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const SubscribedProducts = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //  Select Image 
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ImageFile, setImageFile] = useState(null);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file)
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const navigate = useNavigate();
  // Use effect 
  const [monthly_subscription, setMonthly_subscription] = useState(0)
  const [monthly_subscription_percent, setMonthly_subscription_percent] = useState(0)

  const [yearly_subscription, setYearly_subscription] = useState(0)
  const [yearly_subscription_percent, setYearly_subscription_percent] = useState(0)

  const [total_subscription, setTotal_subscription] = useState(0)
  const fetchAllproducts = async () => {

    try {
      // get Subscription Data Count 
      const user = JSON.parse(localStorage.getItem("@UserSession"))
      if (user === null || user === undefined) {

      } else {
        const postData = {
          user_id: user?.user?.user_id,
        }
        const apiData = await post('user/cardsCountGetDashboard', postData); // Specify the endpoint you want to call
        console.log("ALL Subscription Count")

        console.log(apiData)

        if (apiData.error) {
        } else {
          setMonthly_subscription(apiData.monthly_subscription)
          setYearly_subscription(apiData.yearly_subscription)
          setTotal_subscription(apiData.total_subscriptions)
          // calculate percentage for monthly and yearly subscriptions 
          const monthly_percentage = (apiData.monthly_subscription / apiData.total_subscriptions) * 100
          setMonthly_subscription_percent(monthly_percentage)

          setYearly_subscription_percent(100 - monthly_percentage)
        }
      }

    } catch (error) {

    }
  }
  useEffect(() => {
    fetchAllproducts()
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h3" style={{ fontWeight: 700 }}>My Subscriptions</Typography>

        </Grid>
       


        <Grid item xs={12} md={12}>
          <OrdersTable />
        </Grid>
    
      </Grid>

    </>
  )
};

export default SubscribedProducts;
