//AWS INFO
    const S3_BUCKET = 'fusionwebredesign-assets';

// MENU ACTIVE CLICKER
$(document).ready(function () {
    $('.toggle').click(function(e) {

        $('.nav a.active').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
});

$(document).ready(function(){
    
    $('#packSubmit').click(function(){
        createPack();
    })

    $('#sampleSubmit').click(function(){
        createSample();
    })

    $('#showprofile').click(function(){
        $.getJSON("/api/users");
    })

    $('#createCollection').click(function(e){
        createCollection();
        $('#exampleModal').modal('hide');
    });
    $(function () {
        $('[data-toggle="popover"]').popover()
      })
});


// FUNCTIONS
function createPack(){

    // grab file from page - image file
    var fileInput = $('#imagefile')[0].files[0];
    var formData = new FormData();

    formData.append('file', fileInput);
    formData.append('name', $('#name').val());
    formData.append('description', $('#description').val());

    // AJAX CALL
    $.ajax({
        type: "POST",
        url: "/api/packs",
        data: formData,
        processData: false,
        contentType: false
    })
    .then(function(alert){
        $('#alert').append(
            '<div class="alert alert-success alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + alert + '</div>'
        );
    })
    .catch(function(err){
        console.log(err);
    })
}

function createSample(){
    // grab file from page - sample file
    var fileInput = $('#samplefile')[0].files[0];
    var formData = new FormData();

    // Build FormData Object
    formData.append('file', fileInput);
    formData.append('name', $('#samplename').val());
    formData.append('category', $('#category').val());
    formData.append('instrument', $('#instrument').val());
    formData.append('tag', $('#tag').val());
    formData.append('genre', $('#tag').val());
    formData.append('key', $('#key').val());
    formData.append('packName', $('#packname').val());

    for (var entry of formData.entries()) {
        console.log(entry); 
     }

    // AJAX call with FormData
    $.ajax({
        type: "POST",
        url: "/api/samples",
        data: formData,
        processData: false,
        contentType: false
    })
    .then(function(alert){
        $('#alert').append(
            '<div class="alert alert-success alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + alert + '</div>'
        );
    })
    .catch(function(err){
        console.log(err);
    })

}

function createCollection(){

    var formData = new FormData();

    // Build FormData Object
    formData.append('name', $('#collectionname').val());

    $.ajax({
        type: "POST",
        url: "/api/users/collections",
        data: formData,
        processData: false,
        contentType: false
    })
}
