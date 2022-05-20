import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import 'react-hot-loader/root';
// import { hot } from 'react-hot-loader/root';
import React, { Suspense } from 'react';
import { render as renderReactDom } from 'react-dom';
import DefaultLayout from 'client/layout/DefaultLayout';
import SimpleLoader from 'client/loader/SimpleLoader';
import ViewLayout from 'client/layout/ViewLayout';
import EditorLayout from 'client/layout/EditorLayout';
import ErrorBoundary from './ErrorBoundary';


export default function render({ app, Layout = DefaultLayout, id = 'root' }) {
  renderReactDom(
    <Suspense fallback={<SimpleLoader />}>
      <ErrorBoundary>
        <Layout>
          {app}
        </Layout>
      </ErrorBoundary>
    </Suspense>,
    document.getElementById(id)
  );
}

export function renderEditor(editor) {
  return render({ app: editor, Layout: EditorLayout });
}

export function renderView(view) {
  return render({ app: view, Layout: ViewLayout });
}

// export default hot(App);
