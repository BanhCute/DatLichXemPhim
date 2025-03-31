import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";

const ShowTimeList = ({ movieId }) => {
  return (
    <List>
      <ListItem>
        <ListItemText
          primary="18:00 - 20:30"
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2">
                Phòng: A1
              </Typography>
              <br />
              <Typography component="span" variant="body2">
                Giá: 100.000đ
              </Typography>
            </React.Fragment>
          }
        />
        <Button variant="contained" color="primary">
          Chọn ghế
        </Button>
      </ListItem>
    </List>
  );
};

export default ShowTimeList;
