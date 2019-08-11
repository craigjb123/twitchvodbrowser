$(document).ready(function() {  

    var videos = [];
    var cursor = "";

     userid = '105918024&'
    // harringstone var userid = 96588234;

    function getVideos(cursor) {

        if (cursor) {
            url = 'https://api.twitch.tv/helix/videos?user_id='+ userid +'&first=100&sort=time&after='+cursor
        } else {
            url = 'https://api.twitch.tv/helix/videos?user_id='+ userid +'&first=100&sort=time';
        }
        
        $.ajax({
            url: url,
            headers: {
            'Client-ID':'wyf7fkavkuhwmmdq5xyfq2zyarejxs'         
            },                    
            success:function(data){
               
                for (var i=0; i< data.data.length; i++) {

                    var playdate = data.data[i].created_at;
                    playdate = moment(playdate).format('MM/DD/YYYY');

                    // clean up these titels a bit 
                    var gametitle = data.data[i].title;
                    var gametitle = gametitle.replace("ARCHIVE - ", "");
                    var gametitle = gametitle.replace("ARCHIVE: ", "");
                    var gametitle = gametitle.replace("Archive: ", "");
                    var gametitle = gametitle.replace("ARCVIE: ", "");
                    var gametitle = gametitle.replace("ARCHVIE: ", "");
                    var gametitle = gametitle.replace("ARCHIVe - ", "");

                    

                    if (gametitle.indexOf("(Pt.2") >= 0) {
                         var game = gametitle.substr(0, gametitle.indexOf('(')); 
                    } else if (gametitle.indexOf("(Pt.3") >= 0) {
                         var game = gametitle.substr(0, gametitle.indexOf('('));                                          
                    } else if (gametitle.indexOf("(Pt.") >= 0) {
                         var game = gametitle.substr(0, gametitle.indexOf(' (Pt'));
                    } else if (gametitle.indexOf("(Full Game)") >= 0) {  
                        var game = gametitle.substr(0, gametitle.indexOf('('));    
                    } else if (gametitle.indexOf(" - Part ") >= 0) {  
                        var game = gametitle.substr(0, gametitle.indexOf('-'));    
                    } else if (gametitle.indexOf("(Pt ") >= 0) {  
                        var game = gametitle.substr(0, gametitle.indexOf('('));       
                    } else if (gametitle.indexOf("Pt ") >= 0) {  
                        var game = gametitle.substr(0, gametitle.indexOf('Pt '));   
                    } else if (gametitle.indexOf("(PT.") >= 0) {  
                        var game = gametitle.substr(0, gametitle.indexOf(' (PT'));  
                                                                                                                                                                          
                    } else {
                        var game = gametitle;
                    }

                    var gametitle = '<a target="_blank" href="https://www.twitch.tv/videos/' + data.data[i].id + '">'+gametitle+'</a>';

                    videos.push({ 
                        id: '<a target="_blank" href="https://www.twitch.tv/videos/' + data.data[i].id + '">Link</a>', 
                        title: gametitle, 
                        game: game,
                        view_count: data.data[i].view_count,
                        duration: data.data[i].duration,                                        
                        created_at: playdate,                                        

                    });
                }

               // videos.push(data);

                if(data.pagination.cursor){
                    getVideos(data.pagination.cursor);
                } 
            }
        });
    }
    getVideos();

    console.log(videos);
    
    setTimeout(

    function()   {
        var groupColumn = 0;
        var table = $('#example').DataTable({
            data: videos,                       
            columns: [
                {'data': 'game', 'sType': 'html', "bVisible": false, "bSearchable": false},
                {'data': 'title', 'sType': 'html', "bVisible": true, "bSearchable": true},
                {'data': 'created_at', 'sType': 'string', 'bVisible': true, "bSearchable": false},
                {'data': 'view_count', 'sType': 'int', 'bVisible': true, "bSearchable": false},
                {'data': 'duration', 'sType': 'string', 'bVisible': true, "bSearchable": false}
            ],
            "order": [[ groupColumn, 'asc'], [1, 'asc' ]],
            "paging": false,
      
        } );
    
       

        $('.loading').hide();

      }, 3000); 

});       