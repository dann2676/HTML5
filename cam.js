$(document).ready(function(){
var videoObj    = { "video": true },
    errBack        = function(error){
        // alert("Error Capturando el video: ", error.code);
    };

// Pedir permisos al Navegador para usar la Webcam
if(navigator.getUserMedia){                    // Standard
    navigator.getUserMedia(videoObj, iniciarWebcam, errBack);
}else if(navigator.webkitGetUserMedia){        // WebKit
    navigator.webkitGetUserMedia(videoObj, iniciarWebcam, errBack);
}else if(navigator.mozGetUserMedia){        // Firefox
    navigator.mozGetUserMedia(videoObj, iniciarWebcam, errBack);
};


function iniciarWebcam(stream){
    var video            = document.getElementById("v"),
        canvas            = document.getElementById("c");
    video.width = video.offsetWidth;
    if(navigator.getUserMedia){                    // Standard
        video.srcObject = stream;
        video.play();
    }else if(navigator.webkitGetUserMedia){        // WebKit
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }else if(navigator.mozGetUserMedia){        // Firefox
        video.src = window.URL.createObjectURL(stream);
        video.play();
    };
	
	$('#env').click(function(){
		var datos = canvas.toDataURL('image/png');
		
		$.ajax({
			type:'POST',
			url: 'http://www.sisobox.net/WNaoService.asmx/UpdateFOTO',
			data: "{'PEmployId':'874563', 'foto':'"+datos+"', 'cs': '79710254'}",
			contentType: 'application/json; utf-8',
            dataType: 'json',
            success: function (data) {
                if (data.d != null) {
                    alert(data.d);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {    
				alert(textStatus)
            }
		});
	});

    // Click para hacer la foto
    $('#b').click(function(){
        // Copiando la imagen a un canvas temporal
        var temp = document.createElement('canvas');
        temp.width  = video.offsetWidth;
        temp.height = video.offsetHeight;
        var tempcontext = temp.getContext('2d'),
            tempScale = (temp.height/temp.width);
        tempcontext.drawImage(
            video,
            0, 0,
            video.offsetWidth, video.offsetHeight
        );

        // Redimensionar al tamaño de nuestro cavas
        canvas.style.height    = parseInt( canvas.offsetWidth * tempScale );		
        canvas.width        = canvas.offsetWidth;
        canvas.height        = canvas.offsetHeight;
        var context        = canvas.getContext("2d"),
            scale        = canvas.width/temp.width;
        context.scale(scale, scale);
        context.drawImage(temp, 0, 0);
    });
};
});
