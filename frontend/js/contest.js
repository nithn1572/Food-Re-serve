
var thead = "<tr><th>SNo.</th><th>Email</th><th>Contest Rank</th><th>State</th></tr>"
var contestid = location.href.split('/').slice(-1)[0];

function displayTable(){
    
    $.ajax({
        url:`/api/participant/contest/${contestid}`,
        type:'GET',
        success : (data)=>{
            console.log(data)
            data = data.result;
            var t= thead;
            var t2 = thead;
            var pCount = data.length, certifiedCount = 0;
            var ti = 1, t2i = 1 ;
            for(let i=0;i<data.length;i++){
                var certifyClass = "btn btn-danger", certifyState = "Certificate";
                if(data[i].certified === true){
                    certifyClass = "btn btn-success"; certifiedCount+=1
                    t2 += "<tr><td>"+(t2i)+"</td><td>"+data[i].email+"</td><td>"+data[i].rank+"</td><td><button id="+data[i]._id+" class='"+certifyClass+"'>"+certifyState+"</button></td></tr>";
                    t2i = t2i+1;
                }
                else{
                    t += "<tr><td>"+(ti)+"</td><td>"+data[i].email+"</td><td>"+data[i].rank+"</td><td><button id="+data[i]._id+" class='"+certifyClass+"'>"+certifyState+"</button></td></tr>";
                    ti = ti+1
                }
            }
            console.log(localStorage.contestname)
            $("#contestName").html("Contest: "+localStorage.contestname)
            // $("#contestID").html("C-ID: "+(data[0].ContestId))
            $("#excellence").html("Range of Excellence: 70%")
            $("#pCount").html("Total Participants: "+pCount); $("#certifiedCount").html("Certified Praticipants: "+certifiedCount);
            $("#participantsTable").html(t);
            $("#certifiedParticipantsTable").html(t2);
            if(data.length){
                $("#stats").show()
                $("#note").hide()
            }
            if(ti>1){
                $("#participantsTable").show();
                $("#nonCertifiedListHead").show();
                $("#sendmail-btn").show()
            }
            if(t2i>1){
                $("#certifiedParticipantsTable").show();
                $("#CertifiedListHead").show()
            }
        }
    })

}

$(document).ready(()=>{

    $("#stats").hide();
    $("#sendmail-btn").hide()
    $("#participantsTable").hide();
    $("#certifiedParticipantsTable").hide();
    $("#nonCertifiedListHead").hide();
    $("#CertifiedListHead").hide()
    $("#sendmail-btn").hide();
    $("#userID").html("Welcome "+localStorage.username)

    displayTable();

    $(this).click((e)=>{
        var btn = $(e.target).attr('id')
        var btnClass = $(e.target).attr('class')
        
        if(btnClass == "btn btn-success" || btnClass == "btn btn-danger"){
            // console.log(btn)
            localStorage.currentParticipantID = btn;

            if(localStorage.templateModel == null){
                toastr.options.closeButton = true;
                toastr.error("Please Choose a template")
            }
            else
                window.location.href = `/${contestid}/${btn}`
        }

    })


    $(this).click((e)=>{
        var tID = $(e.target).attr('id')
        var tClass = $(e.target).attr('class')
        if(tClass == "templateModel"){
            localStorage.templateModel = tID;
            toastr.options.closeButton = true;
            toastr.success(tID+" Template selected")
            // toastr.clear()
        }
    })


    $("#upload-btn").click(()=>{
        $("#myModal").modal("show")
    })

    $("#formSubmit").click(()=>{
        
        var file = document.getElementById('file').files[0];           
        var reader = new FileReader();
        reader.onload = function(event) {
            var st = {
                data : event.target.result
            }
            console.log(st);
            $.ajax({
                url: `/api/participant/uploadCSV`,
                type: 'POST',
                data: st,
                success: (result)=>{
                    // console.log(result.length)
                    for(var i=0;i<result.length;i++){
                        console.log(result[i])
                        $.ajax({
                            url: `/api/participant/add/${localStorage.contestname}/${contestid}`,
                            type: 'POST',
                            data: result[i],
                            success: (result) => {
                                console.log(result)
                            }
                        })
                    }
                    displayTable();
                }
            })
        }
        reader.readAsText(file)

        $("#myModal").modal("hide");

    });


    $("#sendmail-btn").click(()=>{

        $.ajax({
            url:`/api/participant/sendmail/${contestid}`,
            type:'GET',
            success : (data)=>{
                console.log(data)
            }
        })

    })



})
