import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import vscode from 'client/utils/vscode';
import EventName from 'main/utils/EventName';
import InstancesTable from './InstancesTable';
import StepsTable from './StepsTable';


export default function TestCaseEditor() {
  const [testCase, setTestCase] = React.useState(null);
  const [instances, setInstances] = React.useState([]);
  const [steps, setSteps] = React.useState([]);

  React.useEffect(() => {
    const state = vscode.getState();
    if (state) {
      setTestCase(parseTestCase(state.text));
      setInstances(state.instances || []);
      setSteps(state.steps || []);
    }
  }, []);

  const postEvent = React.useCallback((type, data) => {
    vscode.postMessage({
      type,
      data
    });
  }, []);

  const handleRunTestCase = React.useCallback((instance) => {
    postEvent(EventName.run, { instance });
  }, []);

  const handleStopServer = React.useCallback((instance) => {
    postEvent(EventName.stop, { instance });
  }, []);

  const handleStartNewInstance = React.useCallback(() => {
    postEvent(EventName.startNewInstance);
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
      case EventName.update: {
        const { text } = message;
        vscode.setState({ text });
        setTestCase(parseTestCase(text));
        break;
      }
      case EventName.setInstances: {
        const { instances: newInstances } = message;
        setInstances(newInstances);
        const state = vscode.getState();
        vscode.setState({ ...state, instances: newInstances });
        break;
      }
      case EventName.setSteps: {
        const { steps: newSteps } = message;
        setSteps(newSteps);
        const state = vscode.getState();
        console.log(newSteps);
        vscode.setState({ ...state, steps: newSteps });
        break;
      }
      default:
        break;
      }
    }
    window.addEventListener(EventName.message, onMessage);

    postEvent(EventName.loaded);
    return () => {
      window.removeEventListener(EventName.message, onMessage);
    };
  }, []);

  return (
    <Grid container spacing={2} sx={{ height: 'auto' }} mt={1}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">{testCase?.name}</Typography>
            {/* <Typography>Description: {testCase?.description}</Typography>
            <Typography>Tags: {testCase?.tag}</Typography>
            <Typography>Comment: {testCase?.comment}</Typography> */}
            {/* <Typography>Id: {testCase.testCaseGuid}</Typography> */}
          </Grid>
          <Grid item xs={12}>
            <StepsTable steps={steps} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">Online Instances</Typography>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: '300px' }}>
            <InstancesTable
              instances={instances}
              onRun={handleRunTestCase}
              onStop={handleStopServer}
              onStartNewInstance={handleStartNewInstance}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
