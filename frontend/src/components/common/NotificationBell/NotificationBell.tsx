import React, { useState, useEffect } from 'react';
import { 
  Badge, IconButton, Menu, MenuItem, Typography, 
  Box, Divider, CircularProgress, Tooltip 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // In a real app, this would be the actual logged in user ID from auth context
  // For demo, we are using the hardcoded admin ID that we seeded in the DB
  const userId = '00000000-0000-0000-0000-000000000001';

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/notifications/user/${userId}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up SSE for real-time updates
    const eventSource = new EventSource(`/api/v1/notifications/stream/${userId}`);
    
    eventSource.addEventListener('notification', (e) => {
      const newNotif = JSON.parse(e.data);
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      eventSource.close();
    };
  }, [userId]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (id: string, read: boolean) => {
    if (read) return;
    try {
      await axios.put(`/api/v1/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <SuccessIcon color="success" />;
      case 'WARNING': return <WarningIcon color="warning" />;
      case 'ERROR': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: 360, maxHeight: 500, borderRadius: 2, mt: 1.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }} onClick={() => {/* mark all read handler */}}>
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />
        
        {loading && notifications.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">No notifications yet</Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <MenuItem 
              key={notif.id} 
              onClick={() => markAsRead(notif.id, notif.read)}
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'flex-start',
                bgcolor: notif.read ? 'transparent' : 'action.hover',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ mr: 2, mt: 0.5 }}>
                {getIcon(notif.type)}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 400 : 600 }}>
                  {notif.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, whiteSpace: 'normal' }}>
                  {notif.body}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {dayjs(notif.createdAt).fromNow()}
                </Typography>
              </Box>
              {!notif.read && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 1 }} />
              )}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};
