import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTimeForm from '../components/AddTimeForm';
import { setSelectedTrack } from '../redux/actions/track-actions';
import { getDateTimeToday, getTracks } from '../utils';

const AddTime = () => {
  const tracks = useSelector((state) => state.allTracks.tracks).map((track) => ({
    key: track.id,
    value: track.name,
    text: track.name,
    has_shortcut: track.has_shortcut,
  }));
  const shortcutBreakdown = useSelector((state) => state.shortcutBreakdown.data);
  const [track, setTrack] = useState('');
  const [time, setTime] = useState('');
  const [format, setFormat] = useState('non_shortcut');
  const [toggleSuccessMessage, setToggleSuccessMessage] = useState(false);
  const [toggleErrorMessage, setToggleErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  const handleTrackChange = ({ target }) => {
    const selectedTrack = tracks.find((t) => t.value === target.innerText);
    if (selectedTrack) {
      setTrack(selectedTrack);
      dispatch(setSelectedTrack(selectedTrack));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validTimeRegExp = /0[0-2]:[0-5][0-9].[0-9][0-9][0-9]/g;
    if (time !== '' && !validTimeRegExp.test(time)) {
      toggleError(true);
      setErrorMessage('Invalid time entered!');
    } else if (time === '' || track === '' || format === '') {
      toggleError(true);
      setErrorMessage('Forgot to enter data in one or more fields!');
    } else {
      const dateAchieved = getDateTimeToday();
      const formData = {
        track_id: track.key,
        time: time,
        format: format,
        date_achieved: dateAchieved,
        deleted: false,
        breakdown: shortcutBreakdown?.map((shortcut) => ({
          shortcut_id: shortcut.shortcutId,
          lap_count: shortcut.lap,
          shortcut_achieved: shortcut.isChecked,
        })),
      };
      console.log(formData);
      axios.post('http://localhost:3000/times/add', formData).then(
        (response) => {
          toggleError(false);
          toggleSuccess();
        },
        (error) => {
          toggleError(true);
        }
      );
    }
  };

  const handleInputChange = ({ target }) => {
    const lettersRegExp = /[a-zA-Z]/g;
    if (!lettersRegExp.test(target.value)) {
      setTime(target.value);
    }
  };

  const handleFormat = ({ target }) => {
    const format = target.innerText.replace(' ', '_').toLowerCase();
    setFormat(format);
  };

  useEffect(() => {
    getTracks(dispatch);
  }, []);

  const toggleSuccess = () => {
    setToggleSuccessMessage((prev) => !prev);
  };

  const toggleError = (newState) => {
    setToggleErrorMessage(newState);
  };

  return (
    <div>
      <h1>Add Time</h1>
      {toggleErrorMessage && (
        <div className="ui negative message">
          <i className="close icon" onClick={() => toggleError(false)}></i>
          <div className="header" data-cy="time-upload-error-message">
            {errorMessage}
          </div>
        </div>
      )}
      {toggleSuccessMessage && (
        <div className="ui success message">
          <i className="close icon" onClick={toggleSuccess}></i>
          <div className="header" data-cy="time-upload-success-message">
            Your time of {time} was successfully uploaded for track {track.value}
          </div>
        </div>
      )}
      <div data-cy="add-time-form">
        <AddTimeForm
          tracks={tracks}
          track={track}
          time={time}
          format={format}
          handleFormat={handleFormat}
          handleTrackChange={handleTrackChange}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}></AddTimeForm>
      </div>
    </div>
  );
};

export default AddTime;
