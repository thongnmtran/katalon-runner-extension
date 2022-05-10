import { hot } from 'react-hot-loader/root';
import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import SimpleLoader from '../loader/SimpleLoader';
import TestCaseEditor from '../editors/TestCaseEditor';
import DefaultLayout from '../layout/DefaultLayout';


function App() {
  return (
    <Suspense fallback={<SimpleLoader />}>
      <ErrorBoundary>
        <DefaultLayout>
          <TestCaseEditor />
        </DefaultLayout>
      </ErrorBoundary>
    </Suspense>
  );
}

export default hot(App);
