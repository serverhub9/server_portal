import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText,
Dialog,
DialogTitle,
DialogContent,
DialogContentText,
Grid,
Divider,
OutlinedInput,
Typography,
Stack,
Button,
 } from '@mui/material';
 import toastAlert from 'components/ToastAlert/index';
 

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { post } from 'Urls/api';
import { useNavigate } from 'react-router-dom';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const navigate = useNavigate()
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const [opendelSubs, setOpendelSubs] = useState(false);
  const handleClosedelSubs = () => setOpendelSubs(false);
  const [user_name, setUser_name] = useState('');
  const [loading, setLoading] = useState(false);
  const [user_Id, setUser_Id] = useState('');
  const DeleteProduct = async () => {
    setLoading(true);
    const data = {
      user_id: user_Id,
      user_name:user_name
    };
    const response = await post('user/updateUsername', data);
    console.log(response)
    if (response.error===true) {
       toastAlert('error', response.message);
      setLoading(false); 
    } else {
    // set Local storage Item 
    localStorage.setItem("@UserSession", JSON.stringify({ user: response.data[0] }));

      toastAlert('success', response.message);
      setLoading(false);
      setOpendelSubs(false);
    }
  };
  useEffect(() => {
    // get localstorage user 
    const user = JSON.parse(localStorage.getItem('@UserSession'));
    if (user===undefined||user===null) {
    }else{
      setUser_name(user?.user?.user_name)
      setUser_Id(user?.user?.user_id)

    }
  }
    , []);

  return (
    <>
   
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
     
      {/* <ListItemButton selected={selectedIndex === 1}  onClick={()=>{

        setOpendelSubs(true)}}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Update Profile" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 3} 
      onClick={()=>navigate('/verify_account')}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Update Password" />
      </ListItemButton> */}
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
    {/* Dialog  */}
    <Dialog
          open={opendelSubs}
          onClose={handleClosedelSubs}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 700 }} id="customized-dialog-title">
           Update Profile
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {/* <Grid item xs={12}>
                <DialogContentText id="alert-dialog-description" style={{ fontSize: '15px', color: 'black' }}>
                  Are you sure you want to delete?
                </DialogContentText>
              </Grid> */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="h5">Name</Typography>

                  <Stack spacing={1} display="flex" direction="row">
                    <OutlinedInput
                      id="user_name"
                      type="text"
                      value={user_name}
                      name="user_name"
                      // onBlur={handleBlur}
                      onChange={(e) => setUser_name(e.target.value)}
                      fullWidth

                    // error={Boolean(touched.product_id_stripe && errors.product_id_stripe)}
                    />

                    {/* <Button disableElevation variant="outlined" onClick={() => window.open('https://dashboard.stripe.com/', '_blank')} startIcon={<PaperClipOutlined />} size="medium" style={{ color: 'rgb(76 91 104)', fontWeight: 700, backgroundColor: 'white', border: '1px solid lightGray', boxShadow: ' 0px 2px 30px -15px rgba(94,94,107,0.67)' }} color="secondary">
                            Stripe
                          </Button> */}
                  </Stack>

                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} align="right">
                <Button disableElevation onClick={handleClosedelSubs} variant="outlined" size="medium" style={{ marginRight: '12px', fontWeight: 700, color: 'gray', boxShadow: ' 0px 2px 30px -15px rgba(94,94,107,0.67)' }} color="secondary">
                  Cancel
                </Button>
                <Button disabled={loading} onClick={() => DeleteProduct()} disableElevation variant="contained" size="medium" style={{ fontWeight: 700, color: 'white', boxShadow: ' 0px 2px 30px -15px rgba(94,94,107,0.67)' }} color="primary">
                  Update
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

     </>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
