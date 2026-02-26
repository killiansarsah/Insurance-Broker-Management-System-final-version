import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Stack, Chip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../components/ui/Iconify';
import Avatar from '../../components/ui/Avatar';
import { Lead } from '../../types';

const StyledKanbanColumn = styled(Card)(({ theme }) => ({
  minHeight: 500,
  maxWidth: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
  borderRadius: 16
}));

const StyledLeadCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  cursor: 'grab',
  borderRadius: 12,
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

interface LeadKanbanProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const LeadKanban: React.FC<LeadKanbanProps> = ({ leads = [], onStatusChange }) => {
  const columns = [
    { id: 'new', title: 'New', color: 'info' as const, icon: 'mdi:new-box' },
    { id: 'contacted', title: 'Contacted', color: 'warning' as const, icon: 'mdi:phone-in-talk' },
    { id: 'quoted', title: 'Quoted', color: 'primary' as const, icon: 'mdi:file-document-edit' },
    { id: 'won', title: 'Won', color: 'success' as const, icon: 'mdi:trophy' },
    { id: 'lost', title: 'Lost', color: 'error' as const, icon: 'mdi:close-circle' }
  ];

  const getLeadsForColumn = (columnId: string) => {
    const statusMap: Record<string, string[]> = {
      new: ['New'],
      contacted: ['Contacted', 'Qualified', 'In Progress'],
      quoted: ['Quoted'],
      won: ['Closed/Won'],
      lost: ['Closed/Lost']
    };

    return leads.filter((lead) => {
      const mappedStatuses = statusMap[columnId] || [];
      return mappedStatuses.includes(lead.leadStatus);
    });
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer.setData('leadId', lead._id);
    e.dataTransfer.setData('currentStatus', lead.leadStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newColumnId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const currentStatus = e.dataTransfer.getData('currentStatus');

    const statusMap: Record<string, string> = {
      new: 'New',
      contacted: 'Contacted',
      quoted: 'Quoted',
      won: 'Closed/Won',
      lost: 'Closed/Lost'
    };

    const newStatus = statusMap[newColumnId];
    if (newStatus && currentStatus !== newStatus && onStatusChange) {
      onStatusChange(leadId, newStatus);
    }
  };

  return (
    <Grid container spacing={1.5} sx={{ flexWrap: 'nowrap', overflowX: 'auto', pb: 2 }}>
      {columns.map((column) => {
        const columnLeads = getLeadsForColumn(column.id);

        return (
          <Grid item xs="auto" key={column.id} sx={{ minWidth: 240, maxWidth: 280, flex: '1 1 0' }}>
            <StyledKanbanColumn onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)}>
              <CardHeader
                avatar={<Iconify icon={column.icon} width={20} />}
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      {column.title}
                    </Typography>
                    <Chip label={columnLeads.length} size="small" color={column.color} />
                  </Stack>
                }
                sx={{ pb: 1, px: 2, pt: 2 }}
              />
              <CardContent sx={{ px: 2 }}>
                <Stack spacing={1.5}>
                  {columnLeads.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
                      <Typography variant="caption">No leads</Typography>
                    </Box>
                  ) : (
                    columnLeads.map((lead) => (
                      <StyledLeadCard key={lead._id} draggable onDragStart={(e) => handleDragStart(e, lead)}>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar
                              name={`${lead.firstName} ${lead.lastName}`}
                              size="sm"
                            />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.8125rem' }}>
                                {lead.firstName} {lead.lastName}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                noWrap
                                sx={{ 
                                  display: 'block',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {lead.emailAddress}
                              </Typography>
                            </Box>
                          </Stack>
                          {lead.phoneNumber && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Iconify icon="mdi:phone" width={14} />
                              <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem' }}>
                                {lead.phoneNumber}
                              </Typography>
                            </Stack>
                          )}
                          {lead.leadSource && (
                            <Chip label={lead.leadSource} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                          )}
                        </Stack>
                      </StyledLeadCard>
                    ))
                  )}
                </Stack>
              </CardContent>
            </StyledKanbanColumn>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LeadKanban;
