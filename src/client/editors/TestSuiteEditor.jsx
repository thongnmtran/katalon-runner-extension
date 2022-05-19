import PlayArrow from '@mui/icons-material/PlayArrow';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';

const vscode = window.acquireVsCodeApi();

export default function TestSuiteEditor() {
  const [testCase, setTestCase] = React.useState(null);
  const [agents, setAgents] = React.useState([]);

  React.useEffect(() => {
    const state = vscode.getState();
    if (state) {
      setTestCase(parseTestCase(state.text));
      setAgents(state.agents || []);
    }
  }, []);

  const dispatchEvent = React.useCallback((type, data) => () => {
    vscode.postMessage({
      type,
      data
    });
  }, []);

  const postEvent = React.useCallback((type, data) => {
    vscode.postMessage({
      type,
      data
    });
  }, []);

  const handleRunTestCase = React.useCallback(() => {
    postEvent('run');
  }, []);

  const handleStopServer = React.useCallback(() => {
    postEvent('stop');
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

    postEvent('loaded');
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const actions = React.useMemo(() => [
    <GridActionsCellItem
      icon={<PlayCircleRounded />}
      onClick={handleRunTestCase}
      label="Run on this instance"
      title="Run on this instance"
    />,
    <GridActionsCellItem
      icon={<StopCircleRounded />}
      onClick={handleStopServer}
      label="Stop this instance"
      title="Stop this instance"
      showInMenu
    />
  ], []);

  return (
    <Box p={3}>
      <Grid container spacing={1} sx={{ height: 'auto' }}>
        <Grid item xs={12}>
          <Typography variant="h5">{testCase?.name}</Typography>
          <Typography>Description: {testCase?.description}</Typography>
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
                <PlayArrow /> Start a new instance
              </Button>
            </Box>
          )}
          <Box mb={1}>
            <Button size="small" variant="outlined" onClick={dispatchEvent('test')}>
              <PlayArrow /> Test Git
            </Button>
          </Box>
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
