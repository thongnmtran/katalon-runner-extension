import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import vscode from 'client/utils/vscode';
import EventName from 'main/utils/EventName';
import { postEvent } from 'client/utils/CodeUtils';
import CCard from 'client/components/override/card/CCard';
import CTypography from 'client/components/override/label/CTypography';
import InstancesTable from './InstancesTable';
import StepsTable from './StepsTable';
import LogViewer from './LogViewer';


export default function TestCaseEditor() {
  const [testCase, setTestCase] = React.useState(null);
  const [instances, setInstances] = React.useState([]);
  const [steps, setSteps] = React.useState([]);
  const [isOnline, setOnline] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [scriptOpened, setScriptOpened] = React.useState(false);

  React.useEffect(() => {
    const state = vscode.getState();
    if (state) {
      setTestCase(parseTestCase(state.text));
      setInstances(state.instances || []);
      setSteps(state.steps || []);
      setOnline(state.online || false);
      setScriptOpened(state.scriptOpened || false);
    }
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

      const setState = (data = {}) => {
        const state = vscode.getState();
        vscode.setState({ ...state, ...data });
      };

      switch (message.type) {
      case EventName.update: {
        const { text } = message;
        setState({ text });
        setTestCase(parseTestCase(text));
        break;
      }
      case EventName.setInstances: {
        const { instances: newInstances } = message;
        setState({ instances: newInstances });
        setInstances(newInstances);
        break;
      }
      case EventName.setSteps: {
        const { steps: newSteps } = message;
        setState({ steps: newSteps });
        setSteps(newSteps);
        console.log(newSteps);
        break;
      }
      case EventName.setLogs: {
        const { logs: newLogs } = message;
        setState({ logs: newLogs });
        setLogs(newLogs);
        break;
      }
      case EventName.setOnline: {
        const { online: newOnline } = message;
        setState({ online: newOnline });
        setOnline(newOnline);
        break;
      }
      case EventName.setScriptOpened: {
        const { scriptOpened: newScriptOpened } = message;
        setState({ scriptOpened: newScriptOpened });
        setScriptOpened(newScriptOpened);
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
    <Grid container spacing={2} sx={{ height: 'auto' }} mt={-1}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CTypography variant="h5" color="secondary">{testCase?.name}</CTypography>
            {/* <Typography>Description: {testCase?.description}</Typography>
              <Typography>Tags: {testCase?.tag}</Typography>
              <Typography>Comment: {testCase?.comment}</Typography> */}
            {/* <Typography>Id: {testCase.testCaseGuid}</Typography> */}
          </Grid>
          <Grid item xs={12}>
            <CCard level={2}>
              <StepsTable steps={steps} scriptOpened={scriptOpened} />
            </CCard>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CTypography variant="h5" color="secondary">Online Instances</CTypography>
          </Grid>
          <Grid item xs={12} sx={{ minWidth: '300px' }}>
            <CCard level={2}>
              <InstancesTable
                instances={instances}
                onRun={handleRunTestCase}
                onStop={handleStopServer}
                onStartNewInstance={handleStartNewInstance}
                isOnline={isOnline}
                useTest
              />
            </CCard>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <CCard level={2}>
          <LogViewer logs={logs} />
        </CCard>
      </Grid>
    </Grid>
  );
}
