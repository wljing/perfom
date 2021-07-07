document.querySelector('#DIY').addEventListener('click', () => {
  JsBarcode("#barcode", "A-010003", {
    format: "CODE128",
    text:"A-010003",
    textAlign:"center",
    textPosition:"foot",
  });
})