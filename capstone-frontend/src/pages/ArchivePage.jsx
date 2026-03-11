import { useMemo, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import AppLayout from '../components/AppLayout';

function ArchivePage() {
  /**
   * Temporary mock archive data used to build the UI layout.
   * This will be replaced with backend data in the next step.
   */
  const [archivedApplications] = useState([
    {
      id: 1,
      archived_at: '2026-03-18',
      company_name: 'Riverbend Publishing',
      position_title: 'Senior Editorial Director',
      archive_reason: 'Rejected',
    },
    {
      id: 2,
      archived_at: '2026-03-16',
      company_name: 'PixelForge Studios',
      position_title: 'UX Engineer',
      archive_reason: 'Offer Declined',
    },
    {
      id: 3,
      archived_at: '2026-03-12',
      company_name: 'HarborTech Systems',
      position_title: 'Backend Developer',
      archive_reason: 'Withdrawn',
    },
    {
      id: 4,
      archived_at: '2026-03-10',
      company_name: 'Granite & Finch Media',
      position_title: 'Copywriter',
      archive_reason: 'Position Closed',
    },
    {
      id: 5,
      archived_at: '2026-03-08',
      company_name: 'CodeWave Labs',
      position_title: 'Back-end Developer',
      archive_reason: 'Rejected',
    },
    {
      id: 6,
      archived_at: '2026-03-06',
      company_name: 'Twain & Co.',
      position_title: 'Research Analyst',
      archive_reason: 'Rejected',
    },
    {
      id: 7,
      archived_at: '2026-03-05',
      company_name: 'Mississippi River Ventures',
      position_title: 'Product Designer',
      archive_reason: 'Rejected',
    },
    {
      id: 8,
      archived_at: '2026-03-05',
      company_name: 'Anchor',
      position_title: 'UX Engineer',
      archive_reason: 'Position Closed',
    },
  ]);

  /**
   * Formats archive date into a readable UI label.
   */
  function formatArchiveDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * Placeholder restore action.
   * Backend wiring will be added in the next step.
   */
  function handleRestore(applicationId) {
    console.log('Restore archived application:', applicationId);
  }

  /**
   * Placeholder permanent delete action.
   * Backend wiring will be added in the next step.
   */
  function handleDelete(applicationId) {
    console.log('Delete archived application permanently:', applicationId);
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

        {/* Archive table */}
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
          {sortedArchivedApplications.map((application) => (
            <Box
              key={application.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '180px 1.6fr 160px 240px',
                borderBottom: '1px solid #E3E6EB',
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
                  {application.archive_reason}
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
      </Stack>
    </AppLayout>
  );
}

export default ArchivePage;
