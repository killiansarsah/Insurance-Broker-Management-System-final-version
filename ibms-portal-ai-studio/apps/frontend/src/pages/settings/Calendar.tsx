import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Stack, Typography, Box } from '@mui/material';
import Iconify from '../../components/ui/Iconify';
import { apiget } from '../../services/api';
import GoogleCalendarConnect from '../../components/calendar/GoogleCalendarConnect';
import GoogleCalendarDialog from '../../components/calendar/GoogleCalendarDialog';

const Calendar: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [openQuickCreate, setOpenQuickCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editEventData, setEditEventData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  const handleDateSelect = (selectInfo: any) => {
    // Store the selected date
    setSelectedDate(selectInfo.startStr);
    // Reset edit mode for new creation
    setIsEditMode(false);
    setEditEventData(null);
    setActiveTab(0); // Default to Event tab when clicking on date
    // Open quick create dialog
    setOpenQuickCreate(true);
  };

  const handleEventClick = (clickInfo: any) => {
    // Get the event data
    const eventData = {
      _id: clickInfo.event._def.extendedProps._id,
      subject: clickInfo.event.title,
      title: clickInfo.event.title,
      startDate: clickInfo.event.start,
      endDate: clickInfo.event.end,
      description: clickInfo.event._def.extendedProps.description || clickInfo.event._def.extendedProps.note || '',
      note: clickInfo.event._def.extendedProps.note || '',
      location: clickInfo.event._def.extendedProps.location || '',
      backgroundColor: clickInfo.event.backgroundColor,
      ...clickInfo.event._def.extendedProps
    };
    
    // Set edit data and open dialog in edit mode
    setEditEventData(eventData);
    setSelectedDate(clickInfo.event.startStr.split('T')[0]);
    setIsEditMode(true);
    setOpenQuickCreate(true);
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const isAllDay = !event.start.getHours && !event.end.getHours;
    
    return (
      <div style={{
        padding: '2px 4px',
        fontSize: '12px',
        fontWeight: '500',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        {!isAllDay && eventInfo.timeText && (
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '400',
            opacity: 0.9,
            marginBottom: '1px'
          }}>
            {eventInfo.timeText}
          </div>
        )}
        <div style={{ 
          fontWeight: '500',
          lineHeight: '1.2'
        }}>
          {event.title}
        </div>
        {event.extendedProps.location && (
          <div style={{ 
            fontSize: '10px', 
            opacity: 0.8,
            marginTop: '1px'
          }}>
            📍 {event.extendedProps.location}
          </div>
        )}
      </div>
    );
  };

  const fetchApiTask = async () => {
    try {
      const result = await apiget('task/list');
      if (result?.data?.result && Array.isArray(result.data.result)) {
        return result.data.result.filter((item: any) => item && item.subject).map((item: any) => ({
          id: item._id || item.id || `task-${Date.now()}-${Math.random()}`,
          title: item.subject || 'Untitled Task',
          start: item.startDate,
          end: item.endDate,
          backgroundColor: item.backgroundColor || '#ff9800',
          borderColor: item.backgroundColor || '#ff9800',
          textColor: item.textColor || '#ffffff',
          extendedProps: {
            _id: item._id || item.id,
            description: item.note || item.description || '',
            note: item.note || '',
            location: item.location || '',
            type: 'task',
            status: item.status || 'Not Started',
            priority: item.priority || 'Medium'
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    return [];
  };

  const fetchApiMeeting = async () => {
    try {
      const result = await apiget('meeting/list');
      if (result?.data?.result && Array.isArray(result.data.result)) {
        return result.data.result.filter((item: any) => item && item.subject).map((item: any) => ({
          id: item._id || item.id || `meeting-${Date.now()}-${Math.random()}`,
          title: item.subject || 'Untitled Meeting',
          start: item.startDate,
          end: item.endDate,
          backgroundColor: item.backgroundColor || '#4caf50',
          borderColor: item.backgroundColor || '#4caf50',
          textColor: item.textColor || '#ffffff',
          extendedProps: {
            _id: item._id || item.id,
            description: item.note || item.description || '',
            note: item.note || '',
            location: item.location || '',
            duration: item.duration || '1 hour',
            type: 'meeting',
            status: item.status || 'Planned'
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
    return [];
  };

  const fetchGoogleEvents = async () => {
    try {
      const response = await apiget('calendar/google/events');
      
      if (response.status === 200 && response.data.success && response.data.connected) {
        const events = response.data.events || [];
        return events.filter((event: any) => event && event.title).map((event: any) => ({
          id: event.id || `google-${Date.now()}-${Math.random()}`,
          title: event.title || 'Google Event',
          start: event.start,
          end: event.end,
          backgroundColor: event.backgroundColor || '#4285f4',
          borderColor: event.backgroundColor || '#4285f4',
          textColor: event.textColor || '#ffffff',
          extendedProps: {
            _id: event.id,
            description: event.description || '',
            note: event.description || '',
            location: event.location || '',
            type: 'google',
            source: 'google',
            htmlLink: event.htmlLink,
            attendees: event.attendees || []
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    }
    return [];
  };

  const fetchData = async () => {
    console.log('Fetching calendar data...');
    
    try {
      // Fetch all data sources in parallel
      const [taskApiData, meetingApiData, googleApiData] = await Promise.all([
        fetchApiTask(),
        fetchApiMeeting(),
        fetchGoogleEvents()
      ]);
      
      console.log('Data fetched:', {
        tasks: taskApiData.length,
        meetings: meetingApiData.length,
        googleEvents: googleApiData.length
      });
      
      // Combine all data and ensure unique IDs
      const combinedData = [...taskApiData, ...meetingApiData, ...googleApiData];
      
      // Remove any duplicate events (by ID)
      const uniqueData = combinedData.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      
      console.log('Total calendar events:', uniqueData.length);
      setData(uniqueData);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [googleConnected]);

  // Listen for calendar refresh events
  useEffect(() => {
    const handleCalendarRefresh = () => {
      console.log('Calendar refresh triggered');
      fetchData();
    };

    window.addEventListener('calendarRefresh', handleCalendarRefresh);
    return () => window.removeEventListener('calendarRefresh', handleCalendarRefresh);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Quick Create Dialog */}
      <GoogleCalendarDialog 
        open={openQuickCreate} 
        onClose={() => {
          setOpenQuickCreate(false);
          setIsEditMode(false);
          setEditEventData(null);
        }}
        selectedDate={selectedDate}
        editData={editEventData}
        isEditMode={isEditMode}
        initialTab={activeTab}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Calendar
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Google Calendar Integration */}
          <GoogleCalendarConnect onConnectionChange={setGoogleConnected} />
          
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<Iconify icon="eva:refresh-fill" />} 
            onClick={fetchData}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />} 
            onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0]);
              setActiveTab(1); // Set to Task tab
              setIsEditMode(false);
              setEditEventData(null);
              setOpenQuickCreate(true);
            }}
            sx={{ textTransform: 'none' }}
          >
            New Task
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />} 
            onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0]);
              setActiveTab(0); // Set to Event tab
              setIsEditMode(false);
              setEditEventData(null);
              setOpenQuickCreate(true);
            }}
            sx={{ textTransform: 'none' }}
          >
            New Event
          </Button>
        </Stack>
      </Box>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          aspectRatio={1.8}
          selectable
          selectMirror
          dayMaxEvents={5}
          moreLinkClick="popover"
          weekends
          events={data}
          eventDisplay="block"
          eventOrder="start,-duration,allDay,title"
          displayEventTime
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventContent={renderEventContent}
          views={{
            dayGridMonth: {
              dayMaxEvents: 5,
              moreLinkClick: 'popover',
              eventOrder: 'start,-duration,allDay,title'
            },
            timeGridWeek: {
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              allDaySlot: true,
              eventOrder: 'start,-duration,allDay,title'
            },
            timeGridDay: {
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              allDaySlot: true,
              eventOrder: 'start,-duration,allDay,title'
            }
          }}
          buttonText={{
            today: 'Today',
            dayGridMonth: 'Month',
            timeGridWeek: 'Week',
            timeGridDay: 'Day',
          }}
          dayHeaderFormat={{ weekday: 'short' }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          nowIndicator
          scrollTime="08:00:00"
          slotDuration="00:30:00"
          snapDuration="00:15:00"
          eventOverlap={false}
          selectOverlap={false}
          eventResizableFromStart
          eventDurationEditable
          eventStartEditable
        />
      </div>
    </div>
  );
};

export default Calendar;
