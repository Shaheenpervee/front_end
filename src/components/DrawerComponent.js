// import { Drawer, List, ListItem, ListItemText } from "@mui/material";

// import { Link } from "react-router-dom";

// Link
// export function Blog() {
//     return (
//         <div style={{ display: 'flex' }}>
//             <Drawer variant="permanent" open={true}>
//                 <List>
//                     <ListItem button component={Link} to="/">
//                         <ListItemText primary="Login" />
//                     </ListItem>
//                     <ListItem button component={Link} to="/drag-and-drop">
//                         <ListItemText primary="Drag and Drop" />
//                     </ListItem>
//                     <ListItem button component={Link} to="/view-list">
//                         <ListItemText primary="View List" />
//                     </ListItem>
//                 </List>
//             </Drawer>
//             <main style={{ flexGrow: 1, padding: '20px' }}>
//                 {children}
//             </main>
//         </div>)
// }

import * as React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const DrawerComponent = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Drawer variant="permanent" open={true}>
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem button component={Link} to="/drag-and-drop">
                        <ListItemText primary="Drag and Drop" />
                    </ListItem>
                    <ListItem button component={Link} to="/view-list">
                        <ListItemText primary="View List" />
                    </ListItem>
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: '20px' }}>
                {children}
            </main>
        </div>
    );
};

export default DrawerComponent;
