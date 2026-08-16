fetch(`http://api.open-notify.org/iss-now.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });