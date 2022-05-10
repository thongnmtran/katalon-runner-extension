import {
  PlayArrow, PlayCircleRounded, Stop, StopCircleRounded
} from '@mui/icons-material';
import {
  Button, Grid, Toolbar, Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';

const vscode = window.acquireVsCodeApi();

export default function TestCaseEditor() {
  const [testCase, setTestCase] = React.useState(null);
  const [agents, setAgents] = React.useState([]);

  React.useEffect(() => {
    const state = vscode.getState();
    if (state) {
      setTestCase(parseTestCase(state.text));
      setAgents(state.agents || []);
    }
  }, []);

  const handleRunTestCase = React.useCallback(() => {
    vscode.postMessage({
      type: 'run'
    });
  }, []);

  const handleStopServer = React.useCallback(() => {
    vscode.postMessage({
      type: 'stop'
    });
  }, []);

  const parseTestCase = React.useCallback((rawTestCase) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rawTestCase, 'text/xml');

    const getText = (tag) => xmlDoc.getElementsByTagName(tag)?.[0]?.childNodes?.[0]?.nodeValue;
    const parsedTestCase = {
      name: getText('name'),
      description: getText('description'),
      tag: getText('tag'),
      comment: getText('comment'),
      testCaseGuid: getText('testCaseGuid')
    };
    return parsedTestCase;
  }, []);

  React.useEffect(() => {
    function onMessage(event) {
      const message = event.data;
      switch (message.type) {
      case 'update': {
        const { text } = message;
        vscode.setState({ text });
        setTestCase(parseTestCase(text));
        break;
      }
      case 'set-agents': {
        const { agents: newAgents } = message;
        console.log(newAgents);
        setAgents(newAgents);
        const state = vscode.getState();
        vscode.setState({ ...state, agents: newAgents });
        break;
      }
      default:
        break;
      }
    }
    window.addEventListener('message', onMessage);

    vscode.postMessage({
      type: 'loaded'
    });
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const actions = React.useMemo(() => [
    <GridActionsCellItem
      icon={<PlayCircleRounded />}
      onClick={handleRunTestCase}
      label="Run on this instance"
    />,
    <GridActionsCellItem
      icon={<StopCircleRounded />}
      onClick={handleStopServer}
      label="Stop this instance"
      showInMenu
    />
  ], []);

  return (
    <Box p={3}>
      <Grid container spacing={1} sx={{ height: 'auto' }}>
        <Grid item xs={12}>
          <Typography variant="h5">{testCase?.name}</Typography>
          <Typography component="i">{testCase?.description}</Typography>
          <Typography>Tags: {testCase?.tag}</Typography>
          <Typography>Comment: {testCase?.comment}</Typography>
          {/* <Typography>Id: {testCase.testCaseGuid}</Typography> */}
        </Grid>

        <Grid item xs={12}>
          <hr />
        </Grid>

        <Grid item xs={12} sx={{ minWidth: '300px' }}>
          <Typography variant="h6" mb={1}>Online Instances</Typography>
          {!agents?.length && (
            <Box mb={1}>
              <Button size="small" variant="outlined" onClick={handleRunTestCase} disabled={agents?.length}>
                <PlayArrow /> Start with a new instance
              </Button>
            </Box>
          )}
          <DataGrid
            autoHeight
            rows={agents}
            getRowId={(agent) => agent.id}
            pageSize={5}
            density="compact"
            columns={[
              {
                field: 'id',
                headerName: 'Id'
              },
              {
                field: 'status',
                headerName: 'status',
                flex: 1
              },
              {
                field: 'actions',
                headerName: 'Actions',
                type: 'actions',
                getActions: () => actions
              }
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
