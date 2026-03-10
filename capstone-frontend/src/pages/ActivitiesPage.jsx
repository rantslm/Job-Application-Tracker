import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';

/* Activity icons */
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VideocamIcon from '@mui/icons-material/Videocam';
import HandshakeIcon from '@mui/icons-material/Handshake';

/* UI icons */
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* Layout wrapper used across pages */
import AppLayout from '../components/AppLayout';

function ActivitiesPage() {
  // Used to redirect user back to auth page if no token exists
  const navigate = useNavigate();

  // Stores all fetched activities
  const [activities, setActivities] = useState([]);

  // Stores the currently selected activity for the right-side detail panel
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Stores applications for dropdown filtering and create dialog
  const [applications, setApplications] = useState([]);

  // UI state for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search + filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationFilter, setApplicationFilter] = useState('All');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state for adding a new activity
  const [formData, setFormData] = useState({
    application_id: '',
    type: 'Email',
    occurred_at: '',
    summary: '',
    details: '',
  });

  /**
   * Fetch all activities for the authenticated user across all applications.
   * Activities are sorted newest first, and the first activity is selected by default.
   */
  async function fetchActivities() {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const response = await fetch('http://localhost:3001/activities', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend did not return JSON for activities.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch activities');
      }

      // Sort newest first
      const sortedActivities = [...data].sort(
        (a, b) => new Date(b.occurred_at) - new Date(a.occurred_at)
      );

      setActivities(sortedActivities);

      // Select the top activity by default on page load
      if (sortedActivities.length > 0) {
        setSelectedActivity(sortedActivities[0]);
      } else {
        setSelectedActivity(null);
      }
    } catch (error) {
      setError(error.message);
      setActivities([]);
      setSelectedActivity(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch applications for filters and the Add Activity dialog.
   */
  async function fetchApplications() {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend did not return JSON for applications.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }

      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }

  /**
   * Load page data on first render.
   */
  useEffect(() => {
    fetchActivities();
    fetchApplications();
  }, []);

  /**
   * Opens the Add Activity dialog and resets form state.
   */
  function handleOpenDialog() {
    setSubmitError('');
    setFormData({
      application_id: '',
      type: 'Email',
      occurred_at: '',
      summary: '',
      details: '',
    });
    setOpenDialog(true);
  }

  /**
   * Closes the Add Activity dialog.
   */
  function handleCloseDialog() {
    setOpenDialog(false);
    setSubmitError('');
  }

  /**
   * Updates form field state as the user types/selects values.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Creates a new activity for the selected application.
   */
  async function handleSubmitActivity(event) {
    event.preventDefault();
    setSubmitError('');

    const token = localStorage.getItem('token');

    if (!formData.application_id) {
      setSubmitError('Please select an application for this activity.');
      return;
    }

    const payload = {
      type: formData.type,
      occurred_at: formData.occurred_at,
      summary: formData.summary,
      details: formData.details,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/activities/application/${formData.application_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend did not return JSON when creating activity.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create activity');
      }

      await fetchActivities();
      handleCloseDialog();
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  /**
   * Creates application filter options from fetched activities.
   */
  const applicationOptions = useMemo(() => {
    const names = activities
      .map((activity) => activity.application?.company_name || 'General')
      .filter((value, index, array) => array.indexOf(value) === index);

    return ['All', ...names];
  }, [activities]);

  /**
   * Filters activities by search term, application, and type.
   * Search checks type, application company name, summary, and details.
   */
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const type = activity.type || '';
      const company = activity.application?.company_name || 'General';
      const summary = activity.summary || '';
      const details = activity.details || '';

      const matchesSearch =
        type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesApplication =
        applicationFilter === 'All' || company === applicationFilter;

      const matchesType = activityTypeFilter === 'All' || type === activityTypeFilter;

      return matchesSearch && matchesApplication && matchesType;
    });
  }, [activities, searchTerm, applicationFilter, activityTypeFilter]);

  /**
   * If the currently selected activity disappears after filtering,
   * automatically select the first visible activity.
   */
  useEffect(() => {
    if (filteredActivities.length === 0) {
      setSelectedActivity(null);
      return;
    }

    const selectedStillVisible = filteredActivities.some(
      (activity) => activity.id === selectedActivity?.id
    );

    if (!selectedStillVisible) {
      setSelectedActivity(filteredActivities[0]);
    }
  }, [filteredActivities, selectedActivity]);

  /**
   * Formats date for the left activity list.
   */
  function formatActivityDate(dateString) {
    if (!dateString) return 'No date';

    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Formats date and time for the detail panel.
   */
  function formatActivityDateTime(dateString) {
    if (!dateString) return 'Not provided';

    return new Date(dateString).toLocaleString();
  }

  /**
   * Creates a short snippet for activity row preview.
   */
  function getSummarySnippet(text) {
    if (!text) return 'No summary';
    return text.length > 80 ? `${text.slice(0, 80)}...` : text;
  }
}
