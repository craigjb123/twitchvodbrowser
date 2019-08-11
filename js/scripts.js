$(document).ready(function() {  

    var videos = [];
    var cursor = "";

    // Add userid here
    var userid = '105918024&';
    var clientid = 'wyf7fkavkuhwmmdq5xyfq2zyarejxs';

    function getVideos(cursor) {

        if (cursor) {
            url = 'https://api.twitch.tv/helix/videos?user_id='+ userid +'&first=100&sort=time&after='+cursor
        } else {
            url = 'https://api.twitch.tv/helix/videos?user_id='+ userid +'&first=100&sort=time';
        }
        

        $.ajax({
            url: url,
            headers: {
            'Client-ID':clientid       
            },                    
            success:function(data){
               
                for (var i=0; i< data.data.length; i++) {

                    var playdate = data.data[i].created_at;
                    playdate = moment(playdate).format('MM/DD/YYYY');

                    var gametitle = data.data[i].title;
                    var gametitle = gametitle.replace("ARCHIVE - ", "");
                    var gametitle = gametitle.replace("ARCHIVE: ", "");
                    var gametitle = gametitle.replace("Archive: ", "");
                    var gametitle = gametitle.replace("ARCVIE: ", "");
                    var gametitle = gametitle.replace("ARCHVIE: ", "");
                    var gametitle = gametitle.replace("ARCHIVe - ", "");

                    
                    // these are some custom filters to deal with RGToms videos, customize or remove as needed
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

                if(data.pagination.cursor){
                    getVideos(data.pagination.cursor);
                } 
            }
        });
    }
    getVideos();
   
    setTimeout(

    function()   {
        var groupColumn = 0;
        // optionally use twitch-flat if you dont want grouping
        var table = $('#twitch-grouped').DataTable({
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
            "drawCallback": function ( settings ) {
                var api = this.api();
                var rows = api.rows( {page:'current'} ).nodes();
                var last=null;
    
                api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                    if ( last !== group ) {
                        $(rows).eq( i ).before(
                            '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                        );
    
                        last = group;
                    }
                } );
            }
        } );
    
        // Order by the grouping
        $('#example tbody').on( 'click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
                table.order( [ groupColumn, 'desc' ] ).draw();
            }
            else {
                table.order( [ groupColumn, 'asc' ] ).draw();
            }
        });


        $('.loading').hide();
        // needs to be improved, this is not a good way to do this!
      }, 5000); 

});       