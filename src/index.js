import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircle from "@material-ui/icons/CheckCircle"
import uploadIcon from "./img/upload.svg"
import { Button } from "@material-ui/core";


const statuses = {
    UPLOADING: "UPLOADING",
    COMPLETE: "COMPLETE",
    NONE: "NONE"
}

const buttonRef = React.createRef();
const formRef = React.createRef();

const FileUploadComponent = ({ template, service }) => {
    const [uploadStatus, setUploadStatus] = useState(statuses.NONE);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { smallFont, secondaryColor, fontFamily, backgroundColor, primaryColor } = template;

    useEffect(() => {
        let div = formRef.current
        div.addEventListener('dragenter', handleDragIn)
        div.addEventListener('dragleave', handleDragOut)
        div.addEventListener('dragover', handleDrag)
        div.addEventListener('drop', handleDrop)
    }, [])
    const style = {
        backgroundColor: backgroundColor,
        width: "100%",
        color: primaryColor,
        textAlign: "center",
        fontFamily: fontFamily,
    }
    const statusStyle = {
        width: "50%",
        margin: "auto",
        padding: "10%",
        borderRadius: "10px",
    }
    const checkStyle = { color: secondaryColor, fontSize: "10vh" }
    const uploadButton = {
        display: "none"
    }
    const uploadFieldStyle = {
        width: "50%",
        margin: "auto",
        padding: "10%",
        border: `solid 4px ${secondaryColor}`,
        borderRadius: "10px",
    }
    const fileObjectStyle = {
        color: primaryColor,
        fontSize: smallFont,
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            buttonRef.current.files = e.dataTransfer.files//.concat(buttonRef.current.files)
            e.dataTransfer.clearData();
            updateFiles();
        }
    }
    const onClick = (event) => {
        buttonRef.current.click(event);
    }
    const updateFiles = () => {
        const files = [];
        for (let i = 0; i < buttonRef.current.files.length; i++) {
            files.push({ name: buttonRef.current.files[i].name })
        }

        setUploadedFiles(files)
    }
    const FileObject = ({ name }) => {
        return <Grid item sm={uploadedFiles.length == 1 ? 12 : 6} ><p style={fileObjectStyle}>{name}</p></Grid >
    }
    const StatusObject = ({ status }) => {
        if (status == statuses.UPLOADING) {
            return <LinearProgress />
        }
        if (status === statuses.NONE) {
            return <span />
        }
        if (status === statuses.COMPLETE) {
            return <span>
                <CheckCircle style={checkStyle}></CheckCircle>
            </span>
        }
    }
    const uploadFiles = async () => {
        setUploadStatus(statuses.UPLOADING)
        for (let i = 0; i < buttonRef.current.files.length; i++) {
            const res = await fetch(service.post.url, {
                method: "post",
                body: service.post.body(buttonRef.current.files[i].name, "put")
            });
            const link = await res.json();
            const uploadRes = await fetch(link, {
                method: "put",
                body: buttonRef.current.files[i]
            });

            if (uploadRes.status == 200) {
                setUploadStatus(statuses.COMPLETE)
                setTimeout(() => {
                    setUploadStatus(statuses.NONE)
                }, 8000)
            }

        }


    }

    return <div style={style}>

        <h1>click here to upload file</h1>
        <form enctype="multipart/form-data" ref={formRef} style={uploadFieldStyle} >
            <div style={{ cursor: "pointer" }} onClick={onClick}>
                <input name="file" ref={buttonRef} onChange={updateFiles} type="file" style={uploadButton} multiple></input>
                <img src={uploadIcon}></img>
                {uploadedFiles.length > 0 &&
                    <Grid spacing={3} container>
                        {uploadedFiles.map(FileObject)}
                    </Grid>
                }
            </div>
            <Button onClick={uploadFiles} color="primary" variant="contained" >upload</Button>
        </form>
        <div style={statusStyle}>
            <StatusObject status={uploadStatus}></StatusObject>
        </div>


    </div >
}

export default FileUploadComponent;