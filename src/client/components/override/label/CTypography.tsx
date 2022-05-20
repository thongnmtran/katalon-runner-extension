import React from 'react';
import { Typography, TypographyProps } from '@mui/material';


type CTypographyProps = TypographyProps;

CTypography.defaultProps = {
};

export default function CTypography(props: CTypographyProps) {
  const {
    children, ...restProps
  } = props;
  return (
    <Typography
      {...restProps}
      color="secondary"
    >{children}
    </Typography>
  );
}
