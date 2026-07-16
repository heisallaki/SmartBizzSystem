export default function buildComponents(
  density = "comfortable"
) {
  const compact = density === "compact";

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition:
            "background-color .2s ease, color .2s ease",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          minHeight: compact ? 32 : 44,
          padding: compact
            ? "4px 12px"
            : "10px 20px",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: compact ? 6 : 10,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: compact ? 12 : 24,

          "&:last-child": {
            paddingBottom: compact
              ? 12
              : 24,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          margin: compact ? 8 : 24,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: compact
            ? "12px 16px"
            : "24px 28px",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: compact
            ? "12px 16px"
            : "20px 28px",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: compact
            ? "10px 16px"
            : "18px 28px",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        margin: compact
          ? "dense"
          : "normal",
        size: compact
          ? "small"
          : "medium",
      },
    },

    MuiFormControl: {
      defaultProps: {
        margin: compact
          ? "dense"
          : "normal",
        size: compact
          ? "small"
          : "medium",
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: compact
            ? "6px 10px"
            : "16px",
        },

        head: {
          fontWeight: 700,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: compact ? 34 : 48,
          paddingTop: compact ? 2 : 8,
          paddingBottom: compact ? 2 : 8,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: compact ? 36 : 46,
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: compact
            ? "48px !important"
            : "64px !important",
        },
      },
    },
  };
}