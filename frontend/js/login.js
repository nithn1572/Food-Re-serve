function login() {
    console.log("Hello");
    //Email verification
    function IsEmail(email) {
        var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!regex.test(email)) return false;
        else return true;
    }

    var emailid = String(document.getElementsByClassName("email")[0].value);
    var password = String(document.getElementsByClassName("password")[0].value);
    var c = 2;
    if (emailid == "") {
        document.getElementById("alertmsg").innerHTML = ` <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>Enter the Email
      </div>`;
        c--;
    }


   else if (password == "") {
        document.getElementById("alertmsg").innerHTML = ` <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Sorry!</strong>Enter the password
      </div>`;
        c--;
    } else document.getElementById("alertmsg").innerHTML = ``;

    if (c == 2) {
        if (!IsEmail(emailid)) {
            document.getElementById("alertmsg").innerHTML = ` <div class="alert alert-danger alert-dismissible">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            <strong>Sorry!</strong>invalid Email
          </div>`;
            c--;
        }
    }
console.log(c);
    //ajax call to create an instance to the user in database
    //alert("sidfoisd");
    if (c == 2) {
        //alert("Ajax");
        $.ajax({
            type: "POST",
            url: "/api/user/login",
            data: {
                email: emailid,
                password: password
            },
            success: function(resultData) {
                console.log(resultData);
                if (resultData.message == "Auth successful") {
                    localStorage.token = resultData.token;
                    localStorage.userid = resultData.userDetails.userId
                    localStorage.username = resultData.userDetails.name
                    localStorage.usertype = resultData.userDetails.userType
                    window.location.href = '/dashboard';
                }
            }, //sucess
            error: function(error) {
                console.log(error);
                    if (error.responseJSON.message == "Unauthorized access") {
                        location.href = "/"
                    } else {
                        var x = document.getElementById("alertmsg");
                        x.innerHTML = ` <div class="alert alert-danger alert-dismissible">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Sorry!</strong>You are not registered  ${error.responseJSON.message}
                      </div>`
                        x.className = "show";
                        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                    }
                } //error
        });
    }

} //End of login function