import { Card, Typography, CardContent } from "@mui/material";

const NoteCard = ({title, describe})=>{
    return(
        <Card>
            <CardContent>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body2">{describe}</Typography>
            </CardContent>
        </Card>
    )
}

export default NoteCard