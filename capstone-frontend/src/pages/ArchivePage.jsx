import { useMemo, useState, useEffect } from 'react';
import { Box, Button, Paper, Stack, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

function ArchivePage() {
  /**
   * Temporary mock archive data used to build the UI layout.
   * This will be replaced with backend data in the next step.
   */
  const navigate = useNavigate();

  // Stores archived applications returned from the backend
  const [archivedApplications, setArchivedApplications] = useState([]);

  // UI feedback state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch archived applications for the authenticated user.
   */
  async function fetchArchivedApplications() {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const response = await fetch('http://localhost:3001/applications/archive', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch archived applications');
      }

      setArchivedApplications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  /**
   * Load archived applications when the page first renders.
   */
  useEffect(() => {
    fetchArchivedApplications();
  }, []);

  /**
   * Formats archive date into a readable UI label.
   */
  function formatArchiveDate(dateString) {
    if (!dateString) return '—';

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * Restore an archived application back to the active list
   */
  async function handleRestore(applicationId) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:3001/applications/${applicationId}/restore`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore application');
      }

      await fetchArchivedApplications();
    } catch (error) {
      setError(error.message);
    }
  }
  /**
   * Permanently delete an archived application after confirmation.
   */
  async function handleDelete(applicationId) {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this archived application?'
    );

    if (!confirmed) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:3001/applications/${applicationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete application');
      }

      await fetchArchivedApplications();
    } catch (error) {
      setError(error.message);
    }
  }
  /**
   * Sort mock archive rows newest first.
   */
  const sortedArchivedApplications = useMemo(() => {
    return [...archivedApplications].sort(
      (a, b) => new Date(b.archived_at) - new Date(a.archived_at)
    );
  }, [archivedApplications]);

  return (
    <AppLayout title="Archive">
      <Stack spacing={3}>
        {/* Page description */}
        <Typography color="text.secondary">
          Applications removed from your active dashboard. You can restore them or
          permanently delete them.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Main content state:
            - show loading text while archived applications are being fetched
            - show empty state if no archived applications exist
            - otherwise render the archive table
        */}

        {loading ? (
          <Typography>Loading archived applications...</Typography>
        ) : sortedArchivedApplications.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              No archived applications
            </Typography>
            <Typography color="text.secondary">
              Archived applications will appear here once you move them out of your
              active applications list.
            </Typography>
          </Paper>
        ) : (
          <Paper
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #E3E6EB',
              boxShadow: 'none',
            }}
          >
            {/* Column headers */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '180px 1.6fr 160px 240px',
                borderBottom: '1px solid #E3E6EB',
                bgcolor: '#F8F9FB',
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderRight: '1px solid #E3E6EB' }}>
                <Typography fontWeight={500}>Date</Typography>
              </Box>

              <Box sx={{ px: 2, py: 1.5, borderRight: '1px solid #E3E6EB' }}>
                <Typography fontWeight={500}>Application</Typography>
              </Box>

              <Box sx={{ px: 2, py: 1.5, borderRight: '1px solid #E3E6EB' }}>
                <Typography fontWeight={500}>Reason</Typography>
              </Box>

              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography fontWeight={500}>Actions</Typography>
              </Box>
            </Box>

            {/* Archive rows */}
            {sortedArchivedApplications.map((application, index) => (
              <Box
                key={application.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1.6fr 160px 240px',
                  borderBottom:
                    index === sortedArchivedApplications.length - 1
                      ? 'none'
                      : '1px solid #E3E6EB',
                  minHeight: 68,
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 2,
                    borderRight: '1px solid #E3E6EB',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography>{formatArchiveDate(application.archived_at)}</Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 2,
                    borderRight: '1px solid #E3E6EB',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '1.05rem' }}>
                    {application.company_name} — {application.position_title}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 2,
                    borderRight: '1px solid #E3E6EB',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography color="text.secondary">
                    {application.archive_reason || '—'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleRestore(application.id)}
                    sx={{
                      minWidth: 106,
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Restore
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(application.id)}
                    sx={{
                      minWidth: 106,
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </Stack>
    </AppLayout>
  );
}

export default ArchivePage;
