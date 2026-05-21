import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2563eb",
            dark: "#1d4ed8"
        },
        secondary: {
            main: "#0f766e"
        },
        background: {
            default: "#f6f7fb",
            paper: "#ffffff"
        },
        text: {
            primary: "#111827",
            secondary: "#6b7280"
        },
        divider: "#e5e7eb"
    },
    typography: {
        fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h4: {
            fontWeight: 700,
            letterSpacing: 0
        },
        h5: {
            fontWeight: 700,
            letterSpacing: 0
        },
        h6: {
            fontWeight: 700,
            letterSpacing: 0
        },
        button: {
            textTransform: "none",
            fontWeight: 700
        }
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    minHeight: 40
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined"
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: "#ffffff"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 700
                }
            }
        }
    }
});

export default theme;
