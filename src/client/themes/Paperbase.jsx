import createTheme from '@mui/material/styles/createTheme';

// https://github.com/mui/material-ui/tree/master/docs/src/pages/premium-themes/paperbase

const themeV5 = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e1e1e',
      paper: '#252526'
    },
    text: {
      primary: '#c8d0db',
      secondary: '#939dac',
      disabled: '#9c9c9c'
    },
    primary: {
      light: '#e9e9e9',
      main: '#e0e0e0',
      dark: '#d5d5d5'
    }
    // primary: {
    //   light: '#63ccff',
    //   main: '#009be5',
    //   dark: '#006db3'
    // }
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    toolbar: {
      minHeight: 48
    }
  }
});
// const themeV6 = createTheme({
//   components: {
//     // MuiButton: {
//     //   styleOverrides: {
//     //     disabled: {
//     //       color: '#7e7e7e',
//     // borderColor: '#515151',
//     // background: 'rgba(255,255,255,.05)'
//     //     }
//     //   }
//     // }
//   }
// });

const PaperThemeDataV5 = {
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#10161d'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&.Mui-disabled': {
            color: '#7e7e7e',
            borderColor: '#515151',
            background: 'rgba(255,255,255,.05)'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: themeV5.spacing(1)
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: themeV5.palette.common.white
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [themeV5.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: themeV5.spacing(1)
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7'
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: themeV5.typography.fontWeightMedium
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          // marginRight: themeV5.spacing(2),
          marginRight: '8px',
          '& svg': {
            fontSize: 20
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: '#18202c'
        }
      }
    }
  },
  props: {
    MuiTablePagination: {
      labelRowsPerPage: 'Page size'
    }
  }
};

const PaperbaseThemeV5 = {
  ...themeV5,
  ...PaperThemeDataV5
};

export default PaperbaseThemeV5;
