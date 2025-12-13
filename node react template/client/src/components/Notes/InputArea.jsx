import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import Zoom from "@mui/material/Zoom";

const InputArea = (props) => {
  const [note, setNote] = useState({ title: "", content: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  function handleNoteChange(event) {
    const { name, value } = event.target;
    setNote((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function expand() {
    setIsExpanded(true);
  }

  function close(){
    setIsExpanded(false);
  }

  return (
    <Box
      sx={{
        padding: "1em",
        position: "relative"
      }}
    >
      <Typography variant="h6">Notes</Typography>
      <TextField
        name="title"
        label="Title"
        variant="filled"
        value={note.title}
        onChange={handleNoteChange}
        onClick={expand}
        onTouchStart={expand}
        fullWidth
      />

      <TextField
        name="content"
        placeholder="Write your note here"
        variant="filled"
        multiline
        rows={3}
        value={note.content}
        onChange={handleNoteChange}
        fullWidth
        sx={{
          display: isExpanded ? "block" : "none",
        }}
      />
      <Zoom in={isExpanded ? true : false} 
      sx={{
        position: "absolute",
        right: "1em",
        top: "2em"
      }}>
        <Fab size="small" color="error" onClick={close}>
          <CloseIcon/>
        </Fab>
      </Zoom>
      <Zoom in={isExpanded ? true : false} 
      sx={{
        position: "absolute",
        right: "1em",
        bottom: "0.5em"
      }}>
        <Fab size="small" color="primary">
          <AddIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default InputArea;
