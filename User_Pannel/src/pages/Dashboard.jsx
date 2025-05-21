import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getCampaigns, getUsers } from '../services/api';

const Dashboard = () => {
  const { userRole, isAdmin, isAuditor, isReporter } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsResponse, usersResponse] = await Promise.all([
          getCampaigns(),
          getUsers()
        ]);

        const campaigns = campaignsResponse.data;
        const users = usersResponse.data;

        setStats({
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter(c => c.status === 'Active').length,
          totalUsers: users.length,
          totalReports: campaigns.reduce((acc, c) => acc + c.reports.length, 0),
          pendingReports: campaigns.reduce((acc, c) => 
            acc + c.reports.filter(r => !r.reviewed).length, 0
          )
        });

        setRecentCampaigns(campaigns.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome to the Corruption Avoidance Platform
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={<CampaignIcon color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<CampaignIcon color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon color="info" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon={<AssessmentIcon color="secondary" />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={<WarningIcon color="warning" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Campaigns
            </Typography>
            <List>
              {recentCampaigns.map((campaign, index) => (
                <React.Fragment key={campaign._id}>
                  <ListItem>
                    <ListItemText
                      primary={campaign.title}
                      secondary={`Status: ${campaign.status} - Reports: ${campaign.reports.length}`}
                    />
                  </ListItem>
                  {index < recentCampaigns.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Role
            </Typography>
            <Typography variant="body1" paragraph>
              You are logged in as a {userRole}. Based on your role, you have access to:
            </Typography>
            <List>
              {isAdmin && (
                <ListItem>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <ListItemText primary="Manage users and their roles" />
                </ListItem>
              )}
              {(isAdmin || isAuditor) && (
                <ListItem>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <ListItemText primary="View and manage all campaigns" />
                </ListItem>
              )}
              {(isAdmin || isAuditor || isReporter) && (
                <ListItem>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <ListItemText primary="Submit and review reports" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 