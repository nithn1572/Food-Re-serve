function generatePDF() {
    const element  =document.getElementById("test");
    html2pdf()
    .from(element)
    .save();
   }