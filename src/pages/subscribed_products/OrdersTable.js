import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Paper,
  Skeleton,
  Button,
  ListItem,
  InputLabel,
  Badge,
  OutlinedInput,
  MenuItem,
  Menu,
  TablePagination,
  InputAdornment,
  Pagination,
  TextField,
  Divider,
  ListItemText,
  Popper,
  ListItemIcon,
  ListItemButton,
  List,
  Tooltip,
  Grid,
  Avatar,
  Stack,
  CardContent,
  ClickAwayListener,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import MainCard from "components/MainCard";
import Transitions from "components/@extended/Transitions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// project import
import Dot from "components/@extended/Dot";
import { BASE_URL, get, post } from "Urls/api";
import emptyImage from "../../assets/images/icons8-empty-64.png";
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import toastAlert from "components/ToastAlert/index";
import { formatDate, calculateSubscriptionEndDate } from "utils/formatDate";
import AnimateButton from "components/@extended/AnimateButton";
import ClipLoader from "../../../node_modules/react-spinners/ClipLoader";
import ExportCSV from "utils/ExportCSV";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: "trackingNo",
    align: "left",
    disablePadding: false,
    label: "Tracking No.",
  },
  {
    id: "name",
    align: "left",
    disablePadding: true,
    label: "Product Name",
  },
  {
    id: "fat",
    align: "right",
    disablePadding: false,
    label: "Total Order",
  },
  {
    id: "carbs",
    align: "left",
    disablePadding: false,

    label: "Status",
  },
  {
    id: "protein",
    align: "right",
    disablePadding: false,
    label: "Total Amount",
  },
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = "warning";
      title = "Pending";
      break;
    case 1:
      color = "success";
      title = "Approved";
      break;
    case 2:
      color = "error";
      title = "Rejected";
      break;
    default:
      color = "primary";
      title = "None";
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number,
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [order] = useState("asc");
  const [orderBy] = useState("trackingNo");
  const [selected] = useState([]);
  const [products, setProducts] = useState([]);
  const [Allproducts, setAllProducts] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  const [productsLength, setProductsLength] = useState(0);
  const [selected_name, setSelectedName] = useState("");
  const [selected_Id, setSelected_Id] = useState("");
  const onEditName = async (name, subscrtipion_id) => {
    setSelectedName(name);
    setSelected_Id(subscrtipion_id);
    setOpendelSubs(true);
  };
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  // get all products

  const anchorRef = useRef(null);
  // const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleClose = (event) => {
  //   if (anchorRef.current && anchorRef.current.contains(event.target)) {
  //     return;
  //   }
  //   setOpen(false);
  // };
  // delete
  // Del
  const [opendel, setOpendel] = useState(false);

  const handleClickOpendel = () => {
    setOpendel(true);
  };

  const handleClosedel = () => {
    setOpendel(false);
  };
  // modal cancel reason
  const [opendelSubs, setOpendelSubs] = useState(false);
  const [opendelSubs1, setOpendelSubs1] = useState(false);

  const handleClickOpendelSubs = () => {
    setOpendelSubs(true);
  };

  const handleClosedelSubs = () => {
    setOpendelSubs(false);
  };
  const handleClosedelSubs1 = () => {
    setOpendelSubs1(false);
  };
  // List

  const [selectedIndex, setSelectedIndex] = useState(0);
  // const handleDelete = () => {
  //   setOpen(false)
  //   setOpendel(true)
  // }
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  // Delete Product
  const [loading, setLoading] = useState(false);
  const DeleteProduct = async () => {
    setLoading(true);
    console.log(selectedIndex);
    if (selected_name === "" || selected_name === null) {
      toastAlert("error", "Please Enter Server Name");
    } else {
      console.log("sadhgajhgaf");
      const data = {
        subscription_id: selected_Id,
        new_name: selected_name,
      };
      const response = await post("user/updateServerName", data);
      console.log(response);
      if (response.error === true) {
        toastAlert("error", response.message);
        setLoading(false);
      } else {
        // set Local storage Item

        toastAlert("success", response.message);
        setLoading(false);
        fetchAllproducts();
        setOpendelSubs(false);
      }
    }
  };
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const handleChangePage = async (newPage) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(newPage);
  //   console.log(newPage)
  //   // const postData = {
  //   //   rowsPerPage: rowsPerPage,
  //   //   page: newPage
  //   // }
  //   // const apiData = await post('product/getAllProductsPagination', postData); // Specify the endpoint you want to call
  //   // console.log("ALL PRODUCTS")

  //   // console.log(apiData)

  //   // if (apiData.error) {
  //   // } else {
  //   //   setProducts(apiData.result)
  //   // }
  // };
  const [loader, setLoader] = useState(true);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Use effect
  const [loadingData, setLoadingData] = useState(false);
  const [loaderExport, setLoaderExport] = useState(false);
  const fetchAllproducts = async () => {
    try {
      // get Local Storage User
      const user = JSON.parse(localStorage.getItem("@UserSession"));
      if (user === null || user === undefined) {
      } else {
        console.log(user);
        // get Subscription
        const postData = {
          user_id: user?.user?.user_id,
          // rowsPerPage: rowsPerPage,
          // page: page
        };
        const apiData = await post("user/getUserSubscriptions", postData); // Specify the endpoint you want to call
        console.log("ALL PRODUCTS");

        console.log(apiData);

        if (apiData.error) {
          // toastAlert("error", apiData.message)
          setLoader(false);

          // setNextloader(false)
        } else {
          setProductsLength(apiData.count);
          setProducts(apiData.data.reverse());
          setAllProducts(apiData.data.reverse());
          setLoadingData(false);

          // localStorage.setItem("@UserSession", JSON.stringify({ user: apiData.data }));
          // navigate('/')
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);

      // toastAlert("error", "Something Went Wrong")
      // setNextloader(false)
      // console.error('Error fetching data:', error);
      // setNextloader(false)
    }
  };
  useEffect(() => {
    fetchAllproducts();
  }, [page, rowsPerPage]);
  return (
    <Box>
      {loader ? (
        <>
          <Grid container spacing={2} pt={10}>
            {/* For variant="text", adjust the height via font-size */}

            <Grid item xs={12} md={12}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={12} md={12}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={12} md={12}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={12}
              align="right"
              style={{ display: "flex", justifyContent: "right" }}
            >
              {/* Search bar to search from table by name
               */}

              <TextField
                autoComplete="off"
                id="outlined-basic"
                label="Search By Name"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setLoadingData(true);
                  if (e.target.value === "" || e.target.value === null) {
                    setProducts(Allproducts);
                    setLoadingData(false);
                  } else {
                    const filterData = products.filter((item) => {
                      return item.plan_name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });
                    console.log(filterData);
                    setProducts(filterData);
                    setLoadingData(false);
                  }
                }}
                style={{ width: "300px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingData ? (
                        <>
                          <ClipLoader
                            color="#1890ff"
                            loading={loadingData}
                            size={25}
                          />
                        </>
                      ) : (
                        <SearchOutlined />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            
            </Grid>
            <Grid item xs={12} md={12} align="right">
              <TableContainer
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  position: "relative",
                  display: "block",
                  maxWidth: "100%",
                  "& td, & th": { whiteSpace: "nowrap" },
                }}
              >
                <Table
                  aria-labelledby="tableTitle"
                  sx={{
                    "& .MuiTableCell-root:first-of-type": {
                      pl: 2,
                    },
                    "& .MuiTableCell-root:last-of-type": {
                      pr: 3,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Product Name</TableCell>
                      <TableCell align="center">Status </TableCell>

                      <TableCell align="center">
                        Subscription Starting Date
                      </TableCell>
                      <TableCell align="center">
                        Subscription Ending Date
                      </TableCell>

                      {/* <TableCell align="center">Updated</TableCell> */}
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Avatar
                                variant="square"
                                src={emptyImage}
                                alt="No Data"
                                style={{
                                  width: "64px",
                                  height: "auto",
                                  marginBlock: "2%",
                                }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        {products
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => (
                            <TableRow
                              key={row.product_id}
                              sx={{
                                cursor:"pointer",
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              onClick={(e) => {
                                setSelectedIndex(row?.subscription_id);
                                setPlanDetails(row);
                                setOpendelSubs1(true);

                                // handleClick(e);
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                style={{ cursor: "pointer" }}
                                // onClick={() => navigate(`/subscribed_product_detail/${row?.subscription_id}`)}
                              >
                                {/* <Grid container spacing={2}>
                             
                              <Grid item xs={12} md={12}>
                                <Typography variant="h5" style={{ fontWeight: 200 }}>{row?.name}</Typography>
                                <Typography variant="h6" style={{ fontWeight: 200, color: 'gray' }}>US {row?.plan_price} $ /per month</Typography>
                              </Grid>
                            </Grid> */}
                                <Grid container spacing={2}>
                                  <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="h5"
                                      style={{
                                        fontWeight: 200,
                                        marginRight: "8px",
                                      }}
                                    >
                                      {row?.name}
                                    </Typography>
                                    <Tooltip title="Edit" arrow>
                                      <EditOutlined
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "1.2rem",
                                          color: "gray",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent the row's onClick from firing
                                          onEditName(row?.name, row.subscription_id);
                                        }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={12} md={12}>
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: 200, color: "gray" }}
                                    >
                                      US {row?.plan_price} $ /per month
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </TableCell>

                              <TableCell align="center">
                                {/* check if subscription is active or not */}
                                {row?.subscription_status === "active" ? (
                                  <Badge
                                    badgeContent="Active"
                                    color="success"
                                  />
                                ) : (
                                  <Badge
                                    badgeContent="Inactive"
                                    color="error"
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {formatDate(row?.start_date)}
                              </TableCell>
                              {/* get subscription ending date by today date + package duration */}

                              <TableCell align="center">
                                {formatDate(row?.end_date)}
                              </TableCell>

                              <TableCell align="center">
                                <Tooltip title="Server Details">
                                  <EyeOutlined
                                    //  ref={anchorRef}
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                      setSelectedIndex(row?.subscription_id);
                                      setPlanDetails(row);
                                      setOpendelSubs1(true);

                                      // handleClick(e);
                                    }}
                                  />
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={12} align="right">
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>

         
        
        

          <Dialog
            open={opendelSubs}
            onClose={handleClosedelSubs}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              sx={{ m: 0, p: 2, fontSize: "20px", fontWeight: 700 }}
              id="customized-dialog-title"
            >
              Update 
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
                    <Typography variant="h5">Server Name</Typography>

                    <Stack spacing={1} display="flex" direction="row">
                      <OutlinedInput
                        id="cancellation_reason"
                        type="text"
                        value={selected_name}
                        name="cancellation_reason"
                        // onBlur={handleBlur}
                        // multiline
                        // rows={4}
                        onChange={(e) => setSelectedName(e.target.value)}
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
                  <Button
                    disableElevation
                    onClick={handleClosedelSubs}
                    variant="outlined"
                    size="medium"
                    style={{
                      marginRight: "12px",
                      fontWeight: 700,
                      color: "gray",
                      boxShadow: " 0px 2px 30px -15px rgba(94,94,107,0.67)",
                    }}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    startIcon={
                      loading ? (
                        <ClipLoader color="gray" loading={loading} size={20} />
                      ) : null
                    }
                    disabled={loading}
                    onClick={() => DeleteProduct()}
                    disableElevation
                    variant="contained"
                    size="medium"
                    style={{
                      fontWeight: 700,
                      color: "white",
                      boxShadow: " 0px 2px 30px -15px rgba(94,94,107,0.67)",
                    }}
                    color="primary"
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>

          {/* modal view  */}
          <Dialog
            open={opendelSubs1}
            onClose={handleClosedelSubs1}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm" 
            fullWidth
          >
            <DialogTitle
              sx={{ m: 0, p: 2, fontSize: "20px", fontWeight: 700 }}
              id="customized-dialog-title"
            >
              {planDetails?.name}
              <IconButton
                aria-label="close"
                onClick={handleClosedelSubs1}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseOutlined />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="h5">Server Details</Typography>

                    <Stack spacing={1} display="flex" direction="row">
                      <Typography variant="h6">Username:</Typography>
                      <Typography variant="h6">
                        {planDetails?.user_name}
                      </Typography>
                    </Stack>
                    <Stack spacing={1} display="flex" direction="row">
                      <Typography variant="h6">IP Address:</Typography>
                      <Typography variant="h6">
                        {planDetails?.ip_address}
                      </Typography>
                    </Stack>

                    <Stack spacing={1} display="flex" direction="row">
                      <Typography variant="h6">Password:</Typography>
                      <Typography variant="h6">
                        {planDetails?.password}
                      </Typography>

                      {/* <Button disableElevation variant="outlined" onClick={() => window.open('https://dashboard.stripe.com/', '_blank')} startIcon={<PaperClipOutlined />} size="medium" style={{ color: 'rgb(76 91 104)', fontWeight: 700, backgroundColor: 'white', border: '1px solid lightGray', boxShadow: ' 0px 2px 30px -15px rgba(94,94,107,0.67)' }} color="secondary">
                            Stripe
                          </Button> */}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography variant="h5">Server Specifications</Typography>

                    <Stack spacing={1} display="flex" direction="row">
                      <List>
                        {planDetails?.features?.map((feature, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemIcon>
                              <CheckCircleOutlined />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature.feature_name}
                              secondary={feature.details}
                              primaryTypographyProps={{ fontWeight: "bold" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}
