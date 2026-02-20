/** @format */

import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { PanelLeft, PanelRight } from "lucide-react";
import { useState } from "react";
import { Layout, Menu } from "react-admin";
// const { Layout } = require("react-admin");

// ─── Global CSS ───────────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("ra-layout-fix")) {
    const s = document.createElement("style");
    s.id = "ra-layout-fix";
    s.textContent = `
        html, body, #root { height: 100%; overflow: hidden !important; }

        /* Hide react-admin's built-in sidebar completely */
        .RaSidebar-root,
        .RaLayout-contentWithSidebar > aside { display: none !important; }

        /* Layout fills height, content area scrolls */
        .RaLayout-root,
        .RaLayout-appFrame { height: 100vh !important; overflow: hidden !important; }
        .RaLayout-contentWithSidebar { height: 100% !important; overflow: hidden !important; }
        .RaLayout-content {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: 100% !important;
            padding: 0 !important;
        }

        /* Full-width edit/create */
        .RaEdit-main, .RaCreate-main, .RaShow-main,
        .RaEdit-main > *, .RaCreate-main > *, .RaShow-main > *,
        .RaEdit-main > * > *, .RaCreate-main > * > * {
            width: 100% !important; max-width: 100% !important;
        }
        .RaEdit-main .MuiCard-root, .RaCreate-main .MuiCard-root {
            width: 100% !important; max-width: 100% !important;
            box-shadow: none !important; background: transparent !important;
            border-radius: 0 !important;
        }
        .RaEdit-main .MuiCardContent-root,
        .RaCreate-main .MuiCardContent-root { padding: 0 !important; }
        .RaEdit-main .RaSimpleForm-form,
        .RaCreate-main .RaSimpleForm-form {
            width: 100% !important; padding: 0 !important;
            background: transparent !important; box-shadow: none !important;
        }

        /* Scrollbar hide utility */
        .sh { scrollbar-width: none; -ms-overflow-style: none; }
        .sh::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(s);
}

const EXPANDED = 256;
const COLLAPSED = 72;

// ─── Custom Sidebar Drawer ────────────────────────────────────────────────────
const CustomSidebar = ({ isExpanded, setIsExpanded }) => (
    <Drawer
        variant="permanent"
        PaperProps={{
            sx: {
                width: isExpanded ? EXPANDED : COLLAPSED,
                transition: "width 0.3s ease-in-out",
                backgroundColor: "#1D4ED8",
                borderRight: "none",
                overflowX: "hidden",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                height: "100vh",
                top: 0,
                left: 0,
                zIndex: 1300,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            },
        }}
    >
        {/* Header */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isExpanded ? "space-between" : "center",
                px: isExpanded ? 2 : 0,
                py: 1.5,
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                minHeight: 64,
                flexShrink: 0,
            }}
        >
            {isExpanded ? (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "0.85rem",
                                color: "#fff",
                            }}
                        >
                            {"</>"}
                        </Box>
                        <Box>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.2 }}>
                                Portfolio
                            </Typography>
                            <Typography sx={{ color: "#BFDBFE", fontSize: "0.68rem" }}>Admin Panel</Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => setIsExpanded(false)}
                        sx={{ color: "#93C5FD", "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "#fff" } }}
                    >
                        <PanelLeft size={18} />
                    </IconButton>
                </>
            ) : (
                <IconButton
                    onClick={() => setIsExpanded(true)}
                    sx={{ color: "#93C5FD", "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "#fff" } }}
                >
                    <PanelRight size={18} />
                </IconButton>
            )}
        </Box>

        {/* Menu */}
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                p: 1,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            }}
        >
            <Menu
                sx={{
                    "& .RaMenuItemLink-root": {
                        color: "#BFDBFE",
                        padding: isExpanded ? "10px 14px" : "10px",
                        borderRadius: "8px",
                        marginBottom: "2px",
                        justifyContent: isExpanded ? "flex-start" : "center",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "#fff" },
                        "& .MuiListItemIcon-root": {
                            color: "#93C5FD",
                            minWidth: isExpanded ? "38px" : "auto",
                            justifyContent: "center",
                        },
                        "&.RaMenuItemLink-active": {
                            bgcolor: "rgba(255,255,255,0.2)",
                            borderLeft: "4px solid #fff",
                            color: "#fff",
                            fontWeight: 700,
                            "& .MuiListItemIcon-root": { color: "#fff" },
                        },
                    },
                    "& .RaMenuItemLink-root .MuiListItemText-root": {
                        display: isExpanded ? "block" : "none",
                    },
                }}
            />
        </Box>
    </Drawer>
);

// ─── CustomLayout — replaces react-admin Layout completely ────────────────────
// We keep react-admin's Layout but forcefully hide its sidebar via CSS above.
// The Drawer sits outside Layout with position:fixed and never participates in scroll.
export const CustomLayout = (props) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const w = isExpanded ? EXPANDED : COLLAPSED;

    // Import Layout here so it still handles AppBar + routing
    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Our sidebar — fixed, never scrolls */}
            <CustomSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

            {/* Content shifts right of sidebar */}
            <Box
                sx={{
                    ml: `${w}px`,
                    transition: "margin-left 0.3s ease-in-out",
                    flex: 1,
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                }}
            >
                <Layout
                    {...props}
                    sx={{
                        "& .RaLayout-content": {
                            overflowY: "auto",
                            overflowX: "hidden",
                            height: "100%",
                            padding: 0,
                        },
                    }}
                />
            </Box>
        </Box>
    );
};
