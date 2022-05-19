import React from 'react';
import {
  DataGrid, GridActionsCellItem, GridToolbarContainer
} from '@mui/x-data-grid';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import { Button, Grid, Box } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import vscode from 'client/utils/vscode';
import moment from 'moment';


function OnLineIcon({ isOnline }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
      <Box sx={{
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        background: isOnline ? 'radial-gradient(at 20% 10%, #2be77f, #0e6234)' : 'grey'
      }}
      />
    </Box>
  );
}

export default function InstancesTable({
  instances, onRun, onStop, onStartNewInstance, isOnline
}) {
  const dispatchEvent = React.useCallback((type, data) => () => {
    vscode.postMessage({
      type,
      data
    });
  }, []);

  const renderActions = React.useCallback((instance) => [
    <GridActionsCellItem
      icon={<PlayCircleRounded />}
      onClick={() => onRun(instance)}
      label="Run on this instance"
      title="Run on this instance"
    />,
    <GridActionsCellItem
      icon={<StopCircleRounded />}
      onClick={() => onStop(instance)}
      label="Stop this instance"
      title="Stop this instance"
      showInMenu
    />
  ], []);

  const Toolbar = React.useCallback(() => (
    <GridToolbarContainer>
      <Grid container spacing={1}>
        <Grid item>
          <OnLineIcon isOnline={isOnline} />
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={dispatchEvent('test')}
            // disabled={!!instances?.length}
          >
            <PlayArrow fontSize="inherit" /> Test
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onStartNewInstance()}
            // disabled={!!instances?.length}
          >
            <PlayArrow fontSize="inherit" /> Start a new instance
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  ), [isOnline]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <DataGrid
          autoHeight
          rows={instances}
          getRowId={(instanceI) => instanceI.id || Math.random()}
          pageSize={5}
          density="compact"
          components={{
            Toolbar
          }}
          columns={[
            {
              field: 'id',
              headerName: 'Id',
              flex: 1,
              renderCell: ({ value }) => value || '-----'
            },
            {
              field: 'status',
              headerName: 'Status',
              renderCell: ({ row }) => (row?.id ? 'Online' : 'Starting...')
            },
            {
              field: 'startedTime',
              headerName: 'Started Time',
              renderCell: ({ value }) => (value ? moment(value).fromNow() : '')
            },
            {
              field: 'actions',
              headerName: 'Actions',
              type: 'actions',
              getActions: ({ row }) => renderActions(row)
            }
          ]}
        />
      </Grid>
    </Grid>
  );
}
