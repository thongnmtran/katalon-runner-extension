import Grid from '@mui/material/Grid';
import CCard from 'client/components/override/card/CCard';
import InstancesTable from 'client/editors/InstancesTable';
import React from 'react';


export default function ExplorerView() {
  const [instances, setInstances] = React.useState([]);
  const [isOnline, setOnline] = React.useState(false);

  return (
    <Grid container spacing={1}>
      <Grid item>
        <CCard level={2}>
          <InstancesTable
            instances={instances}
            // onRun={handleRunTestCase}
            // onStop={handleStopServer}
            // onStartNewInstance={handleStartNewInstance}
            isOnline={isOnline}
            useTest={false}
          />
        </CCard>
      </Grid>
    </Grid>
  );
}
