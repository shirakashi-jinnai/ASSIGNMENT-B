import './App.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { useState } from 'react';
import { useCallback } from 'react';
import { Table } from '@material-ui/core';
import { TableContainer } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

const App = () => {
    const [imgURL, setImgURL] = useState(''),
        [scores, setScores] = useState('')


    const inputImgURL = useCallback((e) => {
        setImgURL(e.target.value)
    }, [setImgURL]);


    const analyze = (url) => {
        if (!url) { return false }
        const request = new XMLHttpRequest();

        request.open('GET', `https://lf-exam-v2.web.app/api/analyze?imageUrl=${url}`, true)
        request.responseType = 'json'

        request.onload = function () {
            const data = this.response;
            setScores(data)
        };

        request.send()
    }


    return (
        <div className='section-wrapin'>
            <h1>test</h1>
            <TextField onChange={inputImgURL} value={imgURL} label='image URL' required variant='outlined' size='small' />
            <Button color='primary' variant="contained" onClick={() => { analyze(imgURL) }} ><FindInPageIcon /> ANALYZE</Button>
            <div className="result-area">
                {scores.length ? (
                    <TableContainer>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Label</TableCell>
                                    <TableCell>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores.map((score, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{score.description}</TableCell>
                                        <TableCell>{(score.score * 100).toFixed(4)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : ''}
            </div>
        </div>
    )
}

export default App;
