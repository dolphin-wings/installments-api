const express = require('express');
const app = express();

app.get('/installments', (req, res) => {
  res.json({
    installments: [
      {
        installments: 3,
        installment_amount: 34000,
        total_amount: 102000,
        installment_total_amount: 102000,
        display_installment_total_amount: "$1,020.00",
        installment_rate: 0,
        installment_type: "MSI",
        installment_plan_interest_amount: 0,
        card_branch: "VISA",
        source: "MIDDLEWARE",
        iva: 1632,
        iva_rate: 0.16,
        payment_fee_amount: 2040
      },
      {
        installments: 6,
        installment_amount: 17000,
        total_amount: 102000,
        installment_total_amount: 102000,
        display_installment_total_amount: "$1,020.00",
        installment_rate: 0,
        installment_type: "MSI",
        installment_plan_interest_amount: 0,
        card_branch: "VISA",
        source: "MIDDLEWARE",
        iva: 1632,
        iva_rate: 0.16,
        payment_fee_amount: 2040
      },
      {
        installments: 12,
        installment_amount: 8500,
        total_amount: 102000,
        installment_total_amount: 102000,
        display_installment_total_amount: "$1,020.00",
        installment_rate: 0,
        installment_type: "MSI",
        installment_plan_interest_amount: 0,
        card_branch: "VISA",
        source: "MIDDLEWARE",
        iva: 1632,
        iva_rate: 0.16,
        payment_fee_amount: 2040
      }
    ],
    source: "MIDDLEWARE"
  });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
