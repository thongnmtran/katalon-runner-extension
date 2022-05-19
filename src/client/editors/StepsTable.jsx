import React from 'react';
import { DataGrid } from '@mui/x-data-grid';


export default function StepsTable({ steps = [] }) {
  const stepsWithIndex = React.useMemo(() => steps.map((stepI, index) => {
    stepI.id = index + 1;
    return stepI;
  }), [steps]);

  const renderValue = React.useCallback((value) => (typeof value === 'string' ? `"${value}"` : value), []);

  const renderMemberExpression = React.useCallback((param) => {
    const type = param?.type;
    const value = param?.value;
    if (value !== undefined) {
      return renderValue(value);
    }
    const objectValue = param?.object?.value;
    const objectProperty = param?.property?.name;
    if (objectValue && objectProperty) {
      return `${renderValue(objectValue)}.${objectProperty}`;
    }
    return value;
  }, []);

  const renderCallExpression = React.useCallback((expression) => {
    const calleeName = expression?.callee?.object?.name;
    const calleeProperty = expression?.callee?.property?.name;
    const params = expression?.arguments || [];
    const argumentNames = params.map((paramI) => renderMemberExpression(paramI));
    return `${calleeName}.${calleeProperty}(${argumentNames.join(', ')})`;
  }, []);

  const renderDeclaration = React.useCallback((declaration) => {
    const name = declaration?.id?.name;
    return `${name} = ${renderExpression(declaration?.init)}`;
  }, []);

  const renderDeclarations = React.useCallback((kind, declarations) => {
    const declarationStrings = declarations.map((declarationI) => renderDeclaration(declarationI));
    return `${kind} ${declarationStrings.join(', ')}`;
  }, []);

  const renderExpression = React.useCallback((expression) => {
    const type = expression?.type;

    switch (type) {
    case 'CallExpression':
      return renderCallExpression(expression);
    case 'AwaitExpression':
      return `await ${renderExpression(expression?.argument)}`;
    default:
      return null;
    }
  }, []);

  const renderStepName = React.useCallback(({ row: step }) => {
    const type = step?.type;

    switch (type) {
    case 'ExpressionStatement':
      return renderExpression(step?.expression);
    case 'VariableDeclaration':
      return renderDeclarations(step?.kind, step?.declarations);
    default:
      break;
    }

    return null;
  }, []);

  return (
    <DataGrid
      autoHeight
      rows={stepsWithIndex}
      getRowId={(instanceI) => instanceI.id}
      pageSize={5}
      density="compact"
      columns={[
        {
          field: 'id',
          headerName: 'Id'
        },
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          renderCell: renderStepName
        }
      ]}
    />
  );
}
