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

app.get('/vtex/installments/:orderFormId', async (req, res) => {
  const { orderFormId } = req.params;
  const { paymentSystem } = req.query;
  
  console.log('Request params:', { orderFormId, paymentSystem });
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (process.env.VTEX_ACCOUNT_NAME) {
    headers['X-VTEX-API-AccountName'] = process.env.VTEX_ACCOUNT_NAME;
  }
  if (process.env.VTEX_APP_KEY) {
    headers['X-VTEX-API-AppKey'] = process.env.VTEX_APP_KEY;
  }
  if (process.env.VTEX_APP_TOKEN) {
    headers['X-VTEX-API-AppToken'] = process.env.VTEX_APP_TOKEN;
  }

  try {
    // First, get the orderForm to extract paymentSystem if not provided
    let targetPaymentSystem = paymentSystem;
    
    if (!targetPaymentSystem) {
      console.log('No paymentSystem provided, fetching from orderForm...');
      const orderFormUrl = `https://${process.env.VTEX_ACCOUNT_NAME}.myvtex.com/api/checkout/pub/orderForm/${orderFormId}`;
      console.log('Fetching orderForm from:', orderFormUrl);
      
      const orderFormResponse = await fetch(orderFormUrl, {
        method: 'GET',
        headers: headers
      });
      
      if (!orderFormResponse.ok) {
        throw new Error(`Failed to fetch orderForm: ${orderFormResponse.status}`);
      }
      
      const orderFormData = await orderFormResponse.json();
      console.log('OrderForm paymentData:', orderFormData.paymentData);
      
      // Get the first paymentSystem from payments array
      if (orderFormData.paymentData && orderFormData.paymentData.payments && orderFormData.paymentData.payments.length > 0) {
        targetPaymentSystem = orderFormData.paymentData.payments[0].paymentSystem;
        console.log('Extracted paymentSystem from orderForm:', targetPaymentSystem);
      } else {
        return res.status(400).json({
          error: 'No paymentSystem found in orderForm and none provided'
        });
      }
    }
    
    // Now get the installments
    const url = `https://${process.env.VTEX_ACCOUNT_NAME}.myvtex.com/api/checkout/pub/orderForm/${orderFormId}/installments?paymentSystem=${targetPaymentSystem}`;
    console.log('Making request to VTEX URL:', url);
    console.log('With headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('VTEX response status:', response.status);
    console.log('VTEX response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('VTEX error response:', errorText);
      throw new Error(`VTEX API error: ${response.status} - ${errorText}`);
    }

    const vtexData = await response.json();
    
    const installments = vtexData.installments.map(installment => ({
      installments: installment.count,
      installment_amount: installment.value,
      total_amount: installment.total,
      installment_total_amount: installment.total,
      display_installment_total_amount: `$${(installment.total / 100).toFixed(2)}`,
      installment_rate: installment.interestRate,
      installment_type: installment.hasInterestRate ? "INTEREST" : "MSI",
      installment_plan_interest_amount: installment.hasInterestRate ? installment.total - installment.value * installment.count : 0,
      card_branch: "VISA",
      source: "MIDDLEWARE",
      iva: Math.round(installment.total * 0.16),
      iva_rate: 0.16,
      payment_fee_amount: Math.round(installment.total * 0.02)
    }));

    res.json({
      installments: installments,
      source: "MIDDLEWARE"
    });

  } catch (error) {
    console.error('Error fetching VTEX installments:', error);
    res.status(500).json({
      error: 'Failed to fetch installments from VTEX',
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
