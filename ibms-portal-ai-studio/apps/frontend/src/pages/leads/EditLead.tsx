import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  IconButton,
  Rating,
  InputAdornment,
  OutlinedInput
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { apiget, apiput } from '../../services/api';
import { LeadStatus, LeadPriority, LeadSource } from '../../types';

interface EditLeadProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  onSuccess: () => void;
}

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phoneNumber: yup
    .string()
    .matches(/^[+]?[0-9\s-]{9,15}$/, 'Phone number is invalid')
    .required('Phone number is required'),
  emailAddress: yup.string().email('Invalid email').required('Email is required'),
  typeOfInsurance: yup.string().required('Insurance type is required'),
  assignedAgent: yup.string().required('Assigned Agent is required')
});

const EditLead: React.FC<EditLeadProps> = ({ open, onClose, leadId, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      address: '',
      leadSource: '',
      leadStatus: LeadStatus.New,
      leadScore: 0,
      typeOfInsurance: '',
      desiredCoverageAmount: '',
      leadPriority: LeadPriority.Medium,
      assignedAgent: 'user1'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await apiput(`lead/edit/${leadId}`, values);
        if (result && result.status === 200) {
          toast.success(result.data.message);
          onClose();
          onSuccess();
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        toast.error('Failed to update lead');
      }
    }
  });

  useEffect(() => {
    const fetchLead = async () => {
      if (open && leadId) {
        try {
          const result = await apiget(`lead/view/${leadId}`);
          if (result && result.status === 200) {
            const lead = result.data.lead;
            formik.setValues({
              firstName: lead.firstName || '',
              lastName: lead.lastName || '',
              phoneNumber: lead.phoneNumber || '',
              emailAddress: lead.emailAddress || '',
              address: lead.address || '',
              leadSource: lead.leadSource || '',
              leadStatus: lead.leadStatus || LeadStatus.New,
              leadScore: lead.leadScore || 0,
              typeOfInsurance: lead.typeOfInsurance || '',
              desiredCoverageAmount: lead.desiredCoverageAmount || '',
              leadPriority: lead.leadPriority || LeadPriority.Medium,
              assignedAgent: lead.assignedAgent || 'user1'
            });
          }
        } catch (error) {
          console.error('Error fetching lead:', error);
          toast.error('Failed to load lead data');
        }
      }
    };
    fetchLead();
  }, [open, leadId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Edit Lead</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Lead Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>First Name *</FormLabel>
              <TextField
                id="firstName"
                name="firstName"
                size="small"
                fullWidth
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Last Name *</FormLabel>
              <TextField
                id="lastName"
                name="lastName"
                size="small"
                fullWidth
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Phone Number *</FormLabel>
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                size="small"
                fullWidth
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email Address *</FormLabel>
              <TextField
                id="emailAddress"
                name="emailAddress"
                size="small"
                fullWidth
                value={formik.values.emailAddress}
                onChange={formik.handleChange}
                error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                helperText={formik.touched.emailAddress && formik.errors.emailAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Address</FormLabel>
              <TextField
                id="address"
                name="address"
                size="small"
                multiline
                rows={2}
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Insurance Requirements
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Insurance Type *</FormLabel>
                <Select
                  id="typeOfInsurance"
                  name="typeOfInsurance"
                  size="small"
                  value={formik.values.typeOfInsurance}
                  onChange={formik.handleChange}
                  error={formik.touched.typeOfInsurance && Boolean(formik.errors.typeOfInsurance)}
                >
                  <MenuItem value="Motor">Motor Insurance</MenuItem>
                  <MenuItem value="Life">Life Insurance</MenuItem>
                  <MenuItem value="Health">Health Insurance</MenuItem>
                  <MenuItem value="Property">Property Insurance</MenuItem>
                  <MenuItem value="Travel">Travel Insurance</MenuItem>
                  <MenuItem value="Business">Business Insurance</MenuItem>
                </Select>
                <FormHelperText error>
                  {formik.touched.typeOfInsurance && formik.errors.typeOfInsurance}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Desired Coverage Amount</FormLabel>
                <OutlinedInput
                  id="desiredCoverageAmount"
                  name="desiredCoverageAmount"
                  startAdornment={<InputAdornment position="start">GHS</InputAdornment>}
                  type="number"
                  size="small"
                  value={formik.values.desiredCoverageAmount}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Lead Source</FormLabel>
                <Select
                  id="leadSource"
                  name="leadSource"
                  size="small"
                  value={formik.values.leadSource}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={LeadSource.Website}>Website</MenuItem>
                  <MenuItem value={LeadSource.Referral}>Referral</MenuItem>
                  <MenuItem value={LeadSource.SocialMedia}>Social Media</MenuItem>
                  <MenuItem value={LeadSource.PhoneCall}>Phone Call</MenuItem>
                  <MenuItem value={LeadSource.WalkIn}>Walk-in</MenuItem>
                  <MenuItem value={LeadSource.Advertisement}>Advertisement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Lead Priority</FormLabel>
                <Select
                  id="leadPriority"
                  name="leadPriority"
                  size="small"
                  value={formik.values.leadPriority}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={LeadPriority.High}>High</MenuItem>
                  <MenuItem value={LeadPriority.Medium}>Medium</MenuItem>
                  <MenuItem value={LeadPriority.Low}>Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Assignment & Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Assigned Agent *</FormLabel>
                <Select
                  id="assignedAgent"
                  name="assignedAgent"
                  size="small"
                  value={formik.values.assignedAgent}
                  onChange={formik.handleChange}
                  error={formik.touched.assignedAgent && Boolean(formik.errors.assignedAgent)}
                >
                  <MenuItem value="user1">James Miller</MenuItem>
                </Select>
                <FormHelperText error>
                  {formik.touched.assignedAgent && formik.errors.assignedAgent}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Lead Status</FormLabel>
                <Select
                  id="leadStatus"
                  name="leadStatus"
                  size="small"
                  value={formik.values.leadStatus}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={LeadStatus.New}>New</MenuItem>
                  <MenuItem value={LeadStatus.Contacted}>Contacted</MenuItem>
                  <MenuItem value={LeadStatus.Qualified}>Qualified</MenuItem>
                  <MenuItem value={LeadStatus.InProgress}>In Progress</MenuItem>
                  <MenuItem value={LeadStatus.ClosedWon}>Closed/Won</MenuItem>
                  <MenuItem value={LeadStatus.ClosedLost}>Closed/Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Lead Rating</FormLabel>
                <Rating
                  name="leadScore"
                  precision={0.5}
                  value={formik.values.leadScore}
                  onChange={(event, newValue) => formik.setFieldValue('leadScore', newValue)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => formik.handleSubmit()} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLead;
