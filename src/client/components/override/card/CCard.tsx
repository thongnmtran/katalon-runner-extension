import { Card, CardContent, CardProps } from '@mui/material';
import React from 'react';


type CCardProps = CardProps & {
  level?: number
};

CCard.defaultProps = {
  level: 1
};

const ColorByLevel = [
  'transparent',
  '#fff',
  '#456'
];

export default function CCard(props: CCardProps) {
  const {
    children,
    level,
    ...restProps
  } = props;

  return (
    <Card
      sx={{
        backgroundColor: ColorByLevel[level - 1] || ColorByLevel[0]
      }}
      elevation={1}
      {...restProps}
    >
      {level === 1 ? (
        <CardContent>
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
}
