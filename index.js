const express = require('express');
const app = express();

app.get('/installments', (req, res) => {
  res.json({
    installments: [
      { installments: 3 },
      { installments: 6 },
      { installments: 12 }
    ],
    source: "psp"
  });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
