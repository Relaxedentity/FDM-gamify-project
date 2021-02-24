// JavaScript code for the results page

$(document).ready(function(){

    $("#upload-scores").submit(function(event){
        event.preventDefault(); //prevent default form submission action

        //delete the error div on next submission so that they don't pile up
        $(".alert-danger").remove();

        //get the csrf token form django and pass it to ajax
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        //get the username given by user:
        let uname = $("#upload-user").val();

        // prepare the form data
        let formData = {
            'player_username' : uname,
            'csrfmiddlewaretoken': csrftoken,
        };

        // process the form
        $.post("", formData)
            .done(function( data ){
                // if the form got submitted
                if (data['result'] === 'Submitted'){
                    // display success message to the user
                    $("#success").addClass("alert alert-success").empty().append(data.message);
                    // hide the upload score form
                    $("#upload-scores").addClass("d-none");
                    // show the leader board
                    $("#leaderboard").removeClass("d-none");
                    //get the entries for the leader board from the view
                    const leaderboard = data['leaderboard'];

                    /* for each score in the leaderboard, add the username and score to the leaderboard, along with the
                    ranking of the player */
                    for (let i = 0; i < leaderboard.length; i++){
                        $('#leader-table').append('<tr class="table-row"> ' +
                            '<th class="row-index">' + (i+1) + '</th>' +
                            '<td>' + leaderboard[i].player_username +  '</td> <td>' + leaderboard[i].score + '</td></tr>');
                    }
                }
                else{ // if the form didn't get submitted properly - show an error message to the user
                    $("#form-title-div").append('<div class="alert alert-danger">' + data.message + '</div>');
                }

            })
            // if something else happened that prevented the form from being submitted
            .fail(function(){
                //Server failed to respond - Show an error message
                $("#form-title-div").append('<div class="alert alert-danger">Could not reach server, please try again later.</div>');
        });
    });
});