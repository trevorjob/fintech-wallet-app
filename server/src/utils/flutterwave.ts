import flutterwavedoc from "@api/flutterwavedoc";

flutterwavedoc
  .chargeViaBankTransfer(
    {
      amount: 100,
      email: "user@flw.com",
      currency: "NGN",
      tx_ref: "MC-MC-1585230ew9v5050e8",
      fullname: "Yemi Desola",
      phone_number: "07033002245",
      client_ip: "154.123.220.1",
      device_fingerprint: "62wd23423rq324323qew1",
      meta: {
        flightID: "123949494DC",
        sideNote: "This is a side note to track this call",
      },
      is_permanent: false,
    },
    {
      type: "bank_transfer",
      Authorization: "Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X",
    }
  )
  .then(({ data }) => console.log(data))
  .catch((err) => console.error(err));
