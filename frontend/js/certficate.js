$(document).ready(()=>{

    
    $.ajax({
        url: '/api/participant/getCertificate',
        type: 'GET',
        success: (result)=>{
            var select = localStorage.templateModel
            // console.log(result[select])

            $('#style').html(result[select].style)
            $('#main').html(result[select].main)

        }
    })
    console.log(localStorage.currentParticipantID)

    $.ajax({
        url: `/api/participant/${localStorage.currentParticipantID}`,
        type: 'GET',
        success: (data)=>{
            console.log(data)
            var detail = {
                passkey: data.result[0].passkey,
                ContestId: data.result[0].ContestId,
                name: data.result[0].name
            }
            localStorage.certifyData = JSON.stringify(detail)

            $("#org").html(data.result[0].contestName);$("#head").html("Certificate of Appreciation");
            var date = new Date();
            var issuedOn = date.getUTCDate() +" "+ date.getUTCMonth() +" "+ date.getUTCFullYear();
            $("#issued").html(issuedOn);$("#name").html(data.result[0].name);
            $("#remarks").html("And appreciating his/her efforts in the Contest.");$("#issuer").html("Get-Certified");
            $("#host").html(data.result[0].contestName);$("#sponsor").html("CMR")
        }
    })

    $("#download-pdf").click(()=>{

        var certifiedData = JSON.parse(localStorage.certifyData)
        console.log(certifiedData)
        

        $.ajax({
            url: '/api/participant/makecertified',
            data: certifiedData,
            type: 'PATCH',
            success: (result)=>{
                console.log(result)
            }
        })

        // var element = document.getElementById("main");
        //     html2pdf()
        //     .from(element)
        //     .save();
        $("#download-pdf").hide()
        window.print()
        $("#download-pdf").show()
    })


})