import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  Stack,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { getEmailTemplate, deleteEmailTemplate, addEmailTemplate } from '../../services/emailTemplateApi';
import DeleteModal from '../../components/ui/DeleteModal';
import { EmailTemplate } from '../../types';

const ViewEmailTemplate: React.FC = () => {
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchTemplate = async () => {
    if (!id) return;
    try {
      const result = await getEmailTemplate(id);
      if (result && result.status === 200) {
        setTemplate(result.data.emailtemplate);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const result = await deleteEmailTemplate(id);
      if (result && result.status === 200) {
        toast.success(result.data.message);
        navigate('/email-templates');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleDuplicate = async () => {
    if (!template) return;
    try {
      const result = await addEmailTemplate({
        name: `${template.name} (Copy)`,
        subject: template.subject,
        html: template.html,
        design: template.design,
        createdBy: 'user1'
      });
      if (result && result.status === 201) {
        toast.success('Template duplicated successfully');
        navigate('/email-templates');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const handleExport = () => {
    if (!template) return;
    const blob = new Blob([template.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template exported successfully');
  };

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  if (!template) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading template...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDelete}
        itemCount={1}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Email Template Details</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleDuplicate}
          >
            Duplicate
          </Button>
          <Button
            variant="outlined"
            onClick={handleExport}
          >
            Export HTML
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/email-templates/edit/${id}`)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              }
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/email-templates')}
          >
            Back
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Template Name
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {template.name}
            </Typography>
          </Box>

          {template.subject && (
            <>
              <Divider />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Subject Line
                </Typography>
                <Typography variant="body1">
                  {template.subject}
                </Typography>
              </Box>
            </>
          )}

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary" mb={2} display="block">
              Email Preview
            </Typography>
            <Card sx={{ p: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
              <Box dangerouslySetInnerHTML={{ __html: template.html }} />
            </Card>
          </Box>

          <Divider />

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Created On
              </Typography>
              <Typography variant="body2">
                {new Date(template.createdOn).toLocaleString()}
              </Typography>
            </Box>
            {template.modifiedOn && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last Modified
                </Typography>
                <Typography variant="body2">
                  {new Date(template.modifiedOn).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ViewEmailTemplate;
