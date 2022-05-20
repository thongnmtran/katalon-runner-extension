/* eslint-disable max-len */
import React from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid';
import {
  Box, Button, Grid
} from '@mui/material';
import EventName from 'main/utils/EventName';
import { thenPostEvent } from 'client/utils/CodeUtils';
import CTooltip from 'client/components/override/tooltip/CTooltip';
import { styled } from '@mui/material/styles';
import CTable from 'client/components/override/table/CTable';
import { CloseRounded, OpenInNewRounded } from '@mui/icons-material';


const TagBase = styled(Box)({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'pre',
  position: 'relative',
  maxWidth: '100%'
});

const flexFill = '1 1';

const Tag = React.forwardRef(
  ({ color, flex, ...restProps }, ref) => <TagBase ref={ref} {...restProps} flex={flex} style={{ color }} />
);

const Palette = {
  string: '#782f18',
  number: '#227dbd',
  property: '#0b3d60',
  class: '#357dc7',
  function: '#487887',
  parentheses: '#305f6e', // ()
  brackets: '#d77853', // []
  await: '#8634d1',
  varType: '#0657a7',
  varName: '#6e86ab'
};

const joinElements = (elements = [], joiner = <>,&nbsp;</>) => (
  <>
    {elements.map(
      (paramI, index) => (index < elements.length - 1 ? (
        <React.Fragment key={Math.random()}>
          {paramI}{joiner}
        </React.Fragment>
      ) : (
        <React.Fragment key={Math.random()}>
          {paramI}
        </React.Fragment>
      ))
    )}
  </>
);

export default function StepsTable({ steps = [], scriptOpened }) {
  const stepsWithIndex = React.useMemo(() => steps.map((stepI, index) => {
    stepI.id = index + 1;
    return stepI;
  }), [steps]);

  const renderString = React.useCallback((string) => (
    <Tag color={Palette.string} flex={flexFill}>
      <Tag>&quot;</Tag>
      <Tag flex={flexFill} sx={{ display: 'block !important' }}>{`${string.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t')}`}</Tag>
      <Tag>&quot;</Tag>
    </Tag>
  ), []);

  const renderValue = React.useCallback((value) => (
    typeof value === 'string' ? (
      renderString(value)
    ) : (
      <Tag color={Palette.number}>{value}</Tag>
    )), []);

  const renderMemberExpression = React.useCallback((member) => {
    const object = member?.object;
    const property = member?.property?.name;
    return (
      <Tag>
        <Tag>{renderArgument(object)}</Tag>
        <Tag>.</Tag>
        <Tag color={Palette.property}>{property}</Tag>
      </Tag>
    );
  }, []);

  const renderTemplateElement = React.useCallback((quasisI) => {
    const type = quasisI?.type;
    const raw = quasisI?.value?.raw;
    const cooked = quasisI?.value?.cooked;

    switch (type) {
    case 'TemplateElement':
      return renderString(raw);
    default:
      break;
    }
    return raw;
  }, []);

  const renderTemplateLiteral = React.useCallback((param) => {
    const quasis = param?.quasis;
    const parts = quasis.map((quasisI) => renderTemplateElement(quasisI));
    return (
      <Tag color={Palette.string} flex={flexFill}>
        {joinElements(parts)}
      </Tag>
    );
  }, []);

  const renderArgument = React.useCallback((param) => {
    const type = param?.type;
    const value = param?.value;
    const name = param?.name;

    switch (type) {
    case 'Identifier':
      return <Tag color={Palette.varName}>{name}</Tag>;
    case 'Literal':
      return renderValue(value);
    case 'MemberExpression':
      return renderMemberExpression(param);
    case 'TemplateLiteral':
      return renderTemplateLiteral(param);
    default:
      break;
    }
    return value;
  }, []);

  const renderCallExpression = React.useCallback((expression) => {
    const callee = expression?.callee;
    let calleeName = callee?.name || callee?.object?.name;
    let calleeProperty = callee?.property?.name;

    if (!calleeProperty) {
      calleeProperty = calleeName;
      calleeName = null;
    }

    const args = expression?.arguments || [];
    const params = args.map((paramI) => renderArgument(paramI));
    return (
      <>
        {calleeName ? (
          <Tag color={Palette.class}>{calleeName}</Tag>
        ) : null}
        {calleeProperty ? (
          <>
            {calleeName ? (
              <Tag>.</Tag>
            ) : null}
            <Tag color={Palette.function}>{calleeProperty}</Tag>
          </>
        ) : null}
        <Tag>(</Tag>
        {joinElements(params)}
        <Tag>)</Tag>
      </>
    );
  }, []);

  const renderDeclarator = React.useCallback((declaratorI) => {
    const variableName = declaratorI?.id?.name;
    return (
      <>
        <Tag color={Palette.varName}>{variableName}</Tag>&nbsp;=&nbsp;{renderExpression(declaratorI?.init)}
      </>
    );
  }, []);

  const renderDeclarations = React.useCallback((kind, declarations) => {
    const declarationStrings = declarations.map((declaratorI) => renderDeclarator(declaratorI));
    return (
      <>
        <Tag color={Palette.varType}>{kind}</Tag>&nbsp;{joinElements(declarationStrings)}
      </>
    );
  }, []);

  const renderExpression = React.useCallback((expression) => {
    const type = expression?.type;

    switch (type) {
    case 'CallExpression':
      return renderCallExpression(expression);
    case 'AwaitExpression':
      return (
        <>
          <Tag color={Palette.await}>await</Tag>&nbsp;{renderExpression(expression?.argument)}
        </>
      );
    default:
      return null;
    }
  }, []);

  const renderStep = React.useCallback((step) => {
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

  const renderStepName = React.useCallback(({ row: step }) => {
    const name = renderStep(step);
    const content = (
      <Tag>
        {name}
      </Tag>
    );
    return (
      <CTooltip title={content} light>
        {content}
      </CTooltip>
    );
  }, []);

  const Toolbar = React.useCallback(() => (
    <GridToolbarContainer>
      <Grid container spacing={1}>
        <Grid item>
          {scriptOpened ? (
            <Button
              size="small"
              variant="outlined"
              onClick={thenPostEvent(EventName.closeScript)}
            // disabled={!!instances?.length}
            >
              <CloseRounded fontSize="inherit" /> Close script
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={thenPostEvent(EventName.openScript)}
            // disabled={!!instances?.length}
            >
              <OpenInNewRounded fontSize="inherit" /> Open script
            </Button>
          )}
        </Grid>
      </Grid>
    </GridToolbarContainer>
  ), [scriptOpened]);

  return (
    <div style={{ width: '100%' }}>
      <CTable
        sx={{
          width: '100%'
        }}
        autoHeight
        rows={stepsWithIndex}
        getRowId={(instanceI) => instanceI.id}
        pageSize={5}
        density="compact"
        components={{
          Toolbar
        }}
        columns={[
          {
            field: 'id',
            headerName: 'Id',
            width: 50
          },
          {
            field: 'name',
            headerName: 'Name',
            // width: '400px',
            flex: 1,
            renderCell: renderStepName
          }
        ]}
      />
    </div>
  );
}
