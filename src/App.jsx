import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { useState } from 'react';
import { useCallback } from 'react';
import { Paper, Table } from '@material-ui/core';
import { TableContainer } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import _ from 'lodash';
import { db } from './firebase/firebase';
import { useEffect } from 'react';

const App = () => {
  const [imgURL, setImgURL] = useState(''),
    [scores, setScores] = useState(''),
    [status, setStatus] = useState(false);

  const inputImgURL = useCallback(
    (e) => {
      setImgURL(e.target.value);
    },
    [setImgURL]
  );

  const analyze = useCallback(
    (url) => {
      setStatus(true);
      const URL = `https://lf-exam-v2.web.app/api/analyze?imageUrl=${url}`;
      fetch(URL)
        .then((response) => {
          console.log(response.status);
          response.json().then((data) => {
            setScores(data);
            db.collection('analyze')
              .doc('data')
              .set({ response: data })
              .then(() => {
                console.log('success');
              });
          });
          setStatus(false);
        })
        .catch((error) => {
          console.log(error);
          setStatus(false);
        });
    },
    [imgURL]
  );

  useEffect(() => {
    db.collection('analyze')
      .doc('data')
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        setScores(data.response);
      });
  }, []);

  return (
    <div className='section-wrapin'>
      <h2>Example App</h2>
      <TextField
        onChange={inputImgURL}
        value={imgURL}
        label='image URL'
        required
        variant='outlined'
        size='small'
      />
      {status ? (
        <Button variant='contained'>
          <FindInPageIcon />
          ANALYZING...
        </Button>
      ) : (
        <Button
          color='primary'
          variant='contained'
          onClick={() => analyze(imgURL)}>
          <FindInPageIcon />
          ANALYZE
        </Button>
      )}
      <div className='result-area'>
        {scores ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className='row'>
                  <TableCell>Label</TableCell>
                  <TableCell align='right'>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map((score, index) => (
                  <TableRow key={index}>
                    <TableCell>{score.description}</TableCell>
                    <TableCell align='right'>
                      {(score.score * 100).toFixed(4)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default App;
