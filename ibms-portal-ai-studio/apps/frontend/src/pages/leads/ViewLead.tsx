import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Typography,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import Iconify from '../../components/ui/Iconify';
import { apiget, apidelete, apipost } from '../../services/api';
import DeleteModal from '../../components/ui/DeleteModal';
import EditLead from './EditLead';
import { Lead } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ViewLead: React.FC = () => {
  const [leadData, setLeadData] = useState<Lead | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const params = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const result = await apiget(`lead/view/${params.id}`);
      if (result && result.status === 200) {
        setLeadData(result.data.lead);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to load lead data');
    }
  };

  const handleDelete = async () => {
    try {
      await apidelete(`lead/delete/${params.id}`);
      toast.success('Lead deleted successfully');
      navigate('/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleConvert = async () => {
    try {
      const result = await apipost(`lead/convert/${params.id}`, {});
      if (result && result.status === 200) {
        toast.success(result.data.message);
        navigate('/clients');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      toast.error('Failed to convert lead');
    }
  };

  const handleExport = () => {
    if (!leadData) return;
    const csvData = [{
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      phoneNumber: leadData.phoneNumber,
      emailAddress: leadData.emailAddress,
      address: leadData.address,
      leadSource: leadData.leadSource,
      leadStatus: leadData.leadStatus,
      typeOfInsurance: leadData.typeOfInsurance,
      desiredCoverageAmount: leadData.desiredCoverageAmount,
      leadPriority: leadData.leadPriority,
      leadScore: leadData.leadScore,
      createdAt: leadData.createdAt
    }];
    const csvString = Papa.unparse(csvData);
    const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.setAttribute('download', `Lead_${leadData.firstName}_${leadData.lastName}.csv`);
    downloadLink.click();
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (!leadData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <EditLead open={openEdit} onClose={() => setOpenEdit(false)} leadId={params.id || ''} onSuccess={fetchData} />
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />

      <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
        <Box>
          <Typography variant="h4">
            {leadData.firstName} {leadData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lead Details
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {leadData.leadStatus !== 'Closed/Won' && (
            <Button variant="contained" color="success" onClick={handleConvert}>
              Convert to Client
            </Button>
          )}
          <Button variant="outlined" startIcon={<Iconify icon="eva:edit-fill" />} onClick={() => setOpenEdit(true)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Iconify icon="eva:trash-2-fill" />} onClick={() => setOpenDelete(true)}>
            Delete
          </Button>
          <Button variant="outlined" startIcon={<Iconify icon="eva:download-fill" />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={() => navigate('/leads')}>
            Back
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="OVERVIEW" />
            <Tab label="MORE INFORMATION" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {leadData.firstName} {leadData.lastName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{leadData.emailAddress}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{leadData.phoneNumber}</Typography>
                  </Box>
                  {leadData.address && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">{leadData.address}</Typography>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lead Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box>
                      <Chip label={leadData.leadStatus} color="primary" size="small" />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Priority
                    </Typography>
                    <Box>
                      <Chip label={leadData.leadPriority} color="warning" size="small" />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Insurance Type
                    </Typography>
                    <Typography variant="body1">{leadData.typeOfInsurance}</Typography>
                  </Box>
                  {leadData.leadSource && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Lead Source
                      </Typography>
                      <Typography variant="body1">{leadData.leadSource}</Typography>
                    </Box>
                  )}
                  {leadData.desiredCoverageAmount && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Desired Coverage
                      </Typography>
                      <Typography variant="body1">GHS {leadData.desiredCoverageAmount.toLocaleString()}</Typography>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Lead Score
                </Typography>
                <Typography variant="body1">{leadData.leadScore || 'Not rated'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(leadData.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              {leadData.modifiedAt && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Last Modified
                  </Typography>
                  <Typography variant="body1">
                    {new Date(leadData.modifiedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>
        </TabPanel>
      </Box>
    </>
  );
};

export default ViewLead;
