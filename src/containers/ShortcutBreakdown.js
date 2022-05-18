import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LapBreakdown from "../components/LapBreakdown";
import {
  setLapShortcut,
  setShortcutBreakdown,
} from "../redux/actions/track-actions";

const ShortcutBreakdown = ({ trackId }) => {
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const dispatch = useDispatch();
  const laps = [1, 2, 3];

  useEffect(() => {
    getShortcuts();
  }, []);

  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.track_id === trackId)
    );
  }, [trackId, shortcuts]);

  useEffect(() => {
    const shortcutBreakdownState = [];
    laps.forEach((lap) => {
      filteredShortcuts?.forEach((shortcut) => {
        shortcutBreakdownState.push({
          lap,
          shortcutId: shortcut.shortcut_id,
          isChecked: false,
        });
      });
    });
    dispatch(setShortcutBreakdown(shortcutBreakdownState));
  }, [filteredShortcuts]);

  const getShortcuts = async () => {
    const response = await axios
      .get("http://127.0.0.1:5500/mock_data/shortcuts.json")
      .catch((err) => console.log(err));
    setShortcuts(response.data);
  };

  const updateLapShortcut = (shortcutId, lapCount, isChecked) => {
    const payload = { shortcutId, lapCount, isChecked };
    dispatch(setLapShortcut(payload));
  };

  return (
    <>
      <h1>Shortcut breakdown</h1>
      {laps.map((lap) => (
        <React.Fragment key={lap}>
          <LapBreakdown
            shortcuts={filteredShortcuts}
            lapCount={lap}
            updateLapShortcut={updateLapShortcut}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default ShortcutBreakdown;
