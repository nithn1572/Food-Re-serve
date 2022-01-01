
var thead = "<tr><th>Hotel Name</th><th>Food</th><th>Created On</th><th>Quantity</th><th>Contact</th><th>Address</th><th></th></tr>"


function fillTable(){
   // console.log(localStorage.userid);
    $.ajax({
        url : `api/contest/user/`+localStorage.userid,
        type : 'GET',
        success : (data)=>{
            console.log(data)
            data = data.result;
            var t= thead;
            for(let i=0;i<data.length;i++){
                var date = new Date(data[i].creationtime);
                date=date.toLocaleDateString();
                t += "<tr id="+data[i].contestname+"><td>"+data[i].contestname+"</td><td>"+data[i].description+"</td><td>"+date+"</td><td>"+data[i].organisation+"</td><td>"+data[i].contact+"</td><td>"+data[i].address+"</td><td><button id="+data[i]._id+" onclick=shower("+data[i].contact+") class='btn btn-primary'>Order</button></td></tr>";
            }
            if(data.length)
                $("#contestTable").html(t);
        }
    })
}

function shower(contactnumber){
    alert("Your order is placed.\nPlease contact :"+contactnumber);
}

$(document).ready(()=>{

    $("#userID").html("Welcome "+localStorage.username)

    fillTable();

    $("#addContest").click(()=>{
        
        $("#myModal").modal("show")
        
    })

    $("#formSubmit").click(()=>{
        var contestData = {
            contestname : $("#contestname").val(),
            username : localStorage.username,
            description : $("#descp").val(),
            organisation : $("#organisation").val(),
            contact : $("#contact").val(),
            address : $("#address").val(),
        }
        
        console.log(contestData)
        $.ajax({
            url : `/api/contest/add/`+localStorage.userid,
            type : 'POST',
            data : contestData,
            success : (result)=>{
                console.log(result)
                fillTable();
            }
        })


        $("#myModal").modal("hide");

    })

    // $(this).click((e)=>{
    //     var btn = $(e.target).attr('id')
    //     var btnClass = $(e.target).attr('class')
        
    //     if(btnClass == "btn btn-primary"){
    //         console.log(btn)
    //         var contestName = $(e.target).parent().parent().find('td:first-child').text();
    //         localStorage.contestname = contestName
    //         localStorage.contestID = btn
    //         window.location.href = `/contest/${btn}`
    //     }

    // })
    function logout(){
        localStorage.clear();
    }

})