import { alpha, createTheme, PaletteMode } from "@mui/material/styles";

export const brandColors = {
  action: "#D45768",
  navigation: "#416CE4",
  slate: "#8E9AB0",
  gold: "#D45768",
  violet: "#416CE4",
};

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: brandColors.action,
        light: "#EE7B8A",
        dark: "#AA3A4D",
        contrastText: "#FFF9FB",
      },
      secondary: {
        main: brandColors.navigation,
        light: "#7092FF",
        dark: "#274DB8",
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDark ? "#09101C" : "#F3F7FC",
        paper: isDark ? "#0F1929" : "#FCFDFF",
      },
      text: {
        primary: isDark ? "#F4F7FD" : "#162032",
        secondary: isDark ? "#99A7BE" : "#607086",
      },
      divider: isDark
        ? "rgba(244, 247, 253, 0.08)"
        : "rgba(22, 32, 50, 0.08)",
      success: {
        main: "#18B56A",
      },
      warning: {
        main: "#F29D52",
      },
      error: {
        main: "#D45768",
      },
      info: {
        main: brandColors.navigation,
      },
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 4,
    typography: {
      fontFamily:
        'var(--font-manrope), "SF Pro Display", "Avenir Next", "Segoe UI", sans-serif',
      h1: {
        fontSize: "3rem",
        lineHeight: 1.04,
        fontWeight: 800,
        letterSpacing: "-0.06em",
      },
      h2: {
        fontSize: "2.15rem",
        lineHeight: 1.08,
        fontWeight: 800,
        letterSpacing: "-0.05em",
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: 1.15,
        fontWeight: 700,
        letterSpacing: "-0.03em",
      },
      h4: {
        fontSize: "1rem",
        lineHeight: 1.2,
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      body1: {
        lineHeight: 1.65,
      },
      body2: {
        lineHeight: 1.55,
      },
      button: {
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      overline: {
        fontWeight: 700,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDark
              ? "radial-gradient(circle at top, rgba(65, 108, 228, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(212, 87, 104, 0.10), transparent 25%), #09101C"
              : "radial-gradient(circle at top, rgba(65, 108, 228, 0.08), transparent 26%), radial-gradient(circle at bottom right, rgba(212, 87, 104, 0.10), transparent 22%), #F3F7FC",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 24,
            border: `1px solid ${
              isDark ? "rgba(244, 247, 253, 0.08)" : "rgba(22, 32, 50, 0.07)"
            }`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0, 0, 0, 0.32)"
              : "0 24px 60px rgba(22, 32, 50, 0.08)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? alpha("#132036", 0.88)
              : alpha("#FCFDFF", 0.92),
            backdropFilter: "blur(22px)",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 18,
            paddingInline: 18,
            minHeight: 42,
          },
          containedPrimary: {
            boxShadow: isDark
              ? "0 14px 30px rgba(212, 87, 104, 0.26)"
              : "0 14px 30px rgba(212, 87, 104, 0.18)",
          },
          outlined: {
            borderColor: isDark
              ? "rgba(244,247,253,0.12)"
              : "rgba(22,32,50,0.10)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: brandColors.navigation,
            height: 3,
            borderRadius: 999,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 42,
            paddingInline: 10,
            fontWeight: 700,
            color: isDark ? "#99A7BE" : "#607086",
            "&.Mui-selected": {
              color: brandColors.navigation,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${
              isDark ? "rgba(244,247,253,0.08)" : "rgba(22,32,50,0.08)"
            }`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: isDark
              ? alpha("#FFFFFF", 0.03)
              : alpha("#FFFFFF", 0.86),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            width: "min(520px, 100vw)",
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
            backgroundColor: isDark ? "#0E1727" : "#FCFDFF",
          },
        },
      },
      MuiSkeleton: {
        defaultProps: {
          animation: "wave",
        },
      },
    },
  });
}
