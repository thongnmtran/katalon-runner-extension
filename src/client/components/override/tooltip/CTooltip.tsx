import { styled } from '@mui/material/styles';
import React from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


type CTooltipProps = TooltipProps & {
  light?: boolean
};

CTooltip.defaultProps = {
  light: false
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11
  },
  [`& .${tooltipClasses.arrow}`]: {
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,
    filter: 'drop-shadow(0 2px 1px rgba(0,0,0,.5))',
    zIndex: 0
  }
}));


export default function CTooltip(props: CTooltipProps) {
  const {
    light, ...restProps
  } = props;
  const TooltipComponent = light ? LightTooltip : Tooltip;
  return (
    <TooltipComponent
      arrow
      placement="top"
      disableInteractive
      {...restProps}
    />
  );
}
