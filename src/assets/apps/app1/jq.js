console.log('asd');
document.querySelector('#DIY').addEventListener('click', () => {
  console.log('diy click', document);
  console.log('app1', window.JsBarcode);
  // JsBarcode("#barcode", "A-010003", {
  //   format: "CODE128",
  //   text:"A-010003",
  //   textAlign:"center",
  //   textPosition:"foot",
  // });
  JsBarcode("#barcode", "DEO00000010", {
    format: "CODE128",
  });

})
// $('#DIY').click(function () {

// });


// $('#pdf').click(function () {

//   var a = $('#barcode')[0]; //取得canvas元素
//   var cxt = a.getContext('2d');//取得绘制对象 （多余）

//   //控制条形码大小
//   var pdfWidth = a.width;
//   var pdfHeight = a.height;

//   //商品条形码标准尺寸 37.29mmx26.26mm（1055.307pt*743.158pt）
//   var barcodeWidth = 1055;
//   var barcodeHeight = 743;

//   //调用jspdf库   landscape横向，默认纵向
//   var pdf = new jspdf('landscape', 'pt', 'c5'); //[barcodeWidth,barcodeHeight]

//   var pageData = a.toDataURL('image/jpeg', 1.0); //把canvas转化为Base64编码
//   pdf.addImage(pageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);//（base64编码，格式，x轴，y轴，图宽，图高）

//   pdf.addPage() //手动分页

//   var b = $('#testcanvas2')[0]; //取得canvas元素

//   var pageData2 = b.toDataURL('image/jpeg', 1.0); //把canvas转化为Base64编码
//   pdf.addImage(pageData2, 'JPEG', 0, 0, pdfWidth, pdfHeight);//（base64编码，格式，x轴，y轴，图宽，图高）



//   var datauri = pdf.output('dataurlstring'); //将生成的Pdf转码成Base64格式（带数据头）
//   var base64 = datauri.substring(28) //去除数据头 (data:application/pdf;base64,)


//   pdf.save("test3.pdf");
//   document.getElementById('pdfbase64').value = base64;
//   alert(base64);

//   var api = new PrintNode.HTTP(
//     new PrintNode.HTTP.ApiKey('79b5564a735d7ed3c95e3a079a724ebfa40128f0'),
//     options
//   );

//   var printPDF = api;

//   //打印事件定义
//   var printJobPayload2 = {
//     "printerId": 449527,
//     "title": "test printjob",
//     "contentType": "pdf_base64",
//     "content": base64,
//     "source": "javascript api client"
//   }
//   // `contentType`. Allowed values are pdf_base64, pdf_uri, raw_base64, raw_uri."

//   //pdf_uri形式 A-010002 code128格式，带字
//   //   var printJobPayload2 = {
//   // 	 "printerId": 449527,
//   // 	 "title": "test printjob",
//   // 	 "contentType": "pdf_uri",
//   // 	 "content": "http://zgomart-test.oss-cn-qingdao.aliyuncs.com/opt/pdf/test3.pdf",
//   // 	 "source": "javascript api client"
//   // }

//   // pdf_base64形式 A-010002 code128格式，带字
//   //     var printJobPayload2 = {
//   //  		 "printerId": 449527,
//   //  		 "title": "test printjob",
//   //  		 "contentType": "pdf_base64",
//   //  		 "content": base64,
//   //  		 "source": "javascript api client"
//   // 		}

//   //返回打印机信息
//   printPDF.printers(options).then(
//     function success(response, info) {
//       console.log(response, info);
//     },
//     function error(err) {
//       console.error(err);
//     }
//   );

//   //createPrintjob打印事件响应
//   printPDF.createPrintjob(options, printJobPayload2).then(
//     function success(response, info) {
//       console.log(response, info);
//     },
//     function error(err) {
//       console.error(err);
//     }
//   );

//   // pdf.addPage();  //如果出现不分页或者断图的情况，每张PDF打印后执行此句

// });

// JsBarcode("#testcanvas2", "A-010003", {
//   format: "CODE128",
//   text:"A-010003",
//   textAlign:"center",
//   textPosition:"foot",
// });

// JsBarcode("#testcanvas", "A-010002", {
//   format: "CODE128",
//   text:"A-010002",
//   textAlign:"center",
//   textPosition:"foot",
// });

//一次多个条形码
// JsBarcode("#testbarcode")
//   .options({font: "OCR-B"}) // Will affect all barcodes
//   .EAN13("1234567890128", {fontSize: 18, textMargin: 0})
//   .blank(20) // Create space between the barcodes
//   .EAN5("12345", {height: 85, textPosition: "top", fontSize: 16, marginTop: 15})
//   .blank(20)
//   .EAN8("1234567",{text:"匹村小铺",textAlign:"center",textPosition:"foot"})
//   .render();


// JsBarcode("#testcanvas")
//   .CODE128("A-01-0002",{text:"A-01-0002",textAlign:"center",textPosition:"foot"})
//   .render();
