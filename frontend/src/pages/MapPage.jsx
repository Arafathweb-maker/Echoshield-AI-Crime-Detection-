function MapPage() {
  return (
    <div className="panel">
      <h2>Patrol map</h2>
      <p>GPS tracking and geofence monitoring are active for the patrol route.</p>
      <div className="map-box">
        <p>Current zone: Downtown Safety Corridor</p>
        <p>Radius: 500m</p>
        <p>Vehicle speed: 36 km/h</p>
      </div>
    </div>
  );
}

export default MapPage;
