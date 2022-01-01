function Ispassword(password)
{ var paswd =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  if(password.match(paswd))  return true;
  else return false;
}

function update()
{
    var passkey = String(document.getElementsByClassName("passkey")[0].value);
    var newpassword = String(document.getElementsByClassName("newpswrd")[0].value);
    var conformpassword = String(document.getElementsByClassName("cnfrmpswrd")[0].value);
    var c=2;
    if (newpassword == "") {
        
        document.getElementById("alert").innerHTML = `<div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>Please Enter the password
      </div>`;
        c--;
    } 
    else if (passkey == "") {
        document.getElementById("alert").innerHTML = `<div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>Please Enter the Passkey
      </div>`;
        c--;
    } 
    if(c==2)
    {
      if(newpassword!=conformpassword)
     {
        var x = document.getElementById("alert");
        x.innerHTML = ` <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>Passwords doesnot match
      </div>`
      c--;
     }
     else if (!Ispassword(newpassword)) {
        //alert("Hello");
        var x = document.getElementById("alert");
        x.innerHTML = ` <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>password should contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
      </div>`
        c--;
    } 
}

     if(c==2)
     {
        $.ajax({
        type: "POST",
        url: "/api/user/resetpass",
        data: {
            resetKey:passkey,
           newPassword:newpassword
        },
        success: function(resultData) {
            console.log(resultData);
            swal({
                title: "Password changed",
                text: "Your password has been Updated Sucessfully",
                type: "success",
                timer: 2000
                });
                setTimeout(function () {
                    window.location.href = '/access';
                 }, 2000);
                },
        error: function(error) {
            console.log(error);
                
                    var x = document.getElementById("alert");
                    x.innerHTML = ` <div class="alert alert-danger alert-dismissible">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Sorry!</strong> ${error.responseJSON.message}
                  </div>`
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
            } //error
    });
}
}
function sendkey()
{
    var emailid = String(document.getElementsByClassName("email")[0].value);
  
    $.ajax({
        type: "POST",
        url: "/api/user/forgot",
        data: {
            email: emailid,

        },
        success: function(resultData) {
            console.log(resultData);
            swal({
                title: "✉",
                text: "Please check your Mail for VerificationKey",
                type: "success",
               
                timer: 2000
                });
                setTimeout(function () {
                    toggleForm();
                 }, 2000);
        }, //sucess
        error: function(error) {
            console.log(error);
                
                    var x = document.getElementById("alertmsg");
                    x.innerHTML = ` <div class="alert alert-danger alert-dismissible">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Sorry!</strong>You are not registered  ${error.responseJSON.message}
                  </div>`
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
            } //error
    });
}


const toggleForm = () => {
    const container = document.querySelector('.container');
    container.classList.toggle('active');
  };

  
