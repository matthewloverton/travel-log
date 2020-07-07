import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 38.911283,
    longitude: -99.649928,
    zoom: 3,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  }

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
      const [longitude, latitude] = event.lngLat;
      setAddEntryLocation({
        latitude,
        longitude,
      })
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/thehoncho/ckcc6lng86t9z1iqmssxfsuib'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <div key={entry._id}>
            <Marker
              latitude={entry.latitude}
              longitude={entry.longitude}>
              <div
                onClick={() => setShowPopup({
                  // ...showPopup,
                  [entry._id]: true,
                })}
              >
                <svg
                  className="marker"
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top">
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                  {entry.image ? <img src={entry.image} alt={entry.title}/> : null}
                </div>
              </Popup>
              ) : null
            }
          </div>
        ))
      }
      {
        addEntryLocation ? (
          <div>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}>
              <div>
                <svg
                  className="addMarker"
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </Marker>
            <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setAddEntryLocation(null)}
                anchor="top">
                <div className="popup">
                  <LogEntryForm onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}location={addEntryLocation} />
                </div>
              </Popup>
          </div>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;