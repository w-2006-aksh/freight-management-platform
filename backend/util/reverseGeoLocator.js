async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    {
      headers: { "User-Agent": "gps-locator-project" },
    }
  );

  const data = await res.json();

  return (
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.county ||
    "Unknown"
  );
}

module.exports = reverseGeocode ;
